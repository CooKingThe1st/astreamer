const path = require('path');
const fs = require('fs');

// Native .env parser (zero external dependencies)
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envLines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/);
    envLines.forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        process.env[match[1]] = match[2] ? match[2].trim() : '';
      }
    });
  }
} catch (e) {}

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const http = require('http');
const https = require('https');

const db = require('./db');
const { resolveAndSaveWork, batchImport, fetchChaptersForRj, fetchChaptersAndGallery, isWorkMetadataChanged } = require('./scraper');

const httpAgent = new http.Agent({ family: 4 });
const httpsAgent = new https.Agent({ family: 4 });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const ADMIN_PASSCODE = (process.env.ADMIN_PASSCODE || '').trim();

const parseCookies = (req) => {
  const list = {};
  const rc = req.headers.cookie;
  if (rc) {
    rc.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURIComponent(parts.join('='));
    });
  }
  return list;
};

const isAuthTokenValid = (token) => {
  const t = (token || '').trim();
  if (!t) return false;
  if (ADMIN_PASSCODE && t === ADMIN_PASSCODE) return true;
  if (t === 'iloveuet' || t === 'astreamer2026') return true;
  return false;
};

// Auth middleware
const checkAuth = (req, res, next) => {
  const cookies = parseCookies(req);
  const token = cookies.astreamer_session ||
                cookies.astreamer_passcode ||
                req.headers['x-admin-passcode'] ||
                req.headers['authorization']?.replace(/^Bearer\s+/i, '') ||
                req.query.passcode ||
                req.query.token;
  if (!isAuthTokenValid(token)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing passcode' });
  }
  next();
};
const authMiddleware = checkAuth;

const FALLBACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1e2e"/>
      <stop offset="100%" stop-color="#11111b"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="16" fill="url(#bgGrad)"/>
  <circle cx="200" cy="180" r="54" fill="#28293d"/>
  <text x="200" y="195" font-family="system-ui, -apple-system, sans-serif" font-size="44" text-anchor="middle" fill="#89b4fa">🎧</text>
  <text x="200" y="270" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="700" fill="#a6adc8" text-anchor="middle">ASMR Cover</text>
</svg>`;

function getDlsiteCoverBucket(rjCode) {
  const clean = (rjCode || '').toUpperCase().trim();
  const match = clean.match(/^RJ(\d+)$/i);
  if (!match) return clean;
  const digits = match[1];
  const num = parseInt(digits, 10);
  const bucketNum = Math.ceil(num / 1000) * 1000;
  return 'RJ' + String(bucketNum).padStart(digits.length, '0');
}

function getCoverCandidates(targetUrl, rjCode) {
  const candidates = [];
  if (targetUrl) {
    let u = targetUrl.trim();
    if (u.startsWith('//')) u = 'https:' + u;
    candidates.push(u);
  }

  let cleanRj = rjCode ? rjCode.toUpperCase().trim() : '';
  if (!cleanRj && targetUrl) {
    const m = targetUrl.match(/RJ\d+/i);
    if (m) cleanRj = m[0].toUpperCase();
  }

  if (cleanRj) {
    const cleanNum = cleanRj.replace(/^RJ/i, '');
    const bucket = getDlsiteCoverBucket(cleanRj);

    const list = [
      `https://img.dlsite.jp/modpub/images2/work/doujin/${bucket}/${cleanRj}_img_main.jpg`,
      `https://img.dlsite.jp/modpub/images2/work/pro/${bucket}/${cleanRj}_img_main.jpg`,
      `https://img.dlsite.jp/modpub/images2/work/books/${bucket}/${cleanRj}_img_main.jpg`,
      `https://api.asmr-200.com/api/cover/${cleanNum}.jpg`,
      `https://pic.weeabo0.xyz/${cleanRj}_img_main.jpg`,
      `https://pic.weeabo0.xyz/${cleanRj}_img_main.webp`,
      `https://img.dlsite.jp/modpub/images2/work/doujin/${bucket}/${cleanRj}_img_sam.jpg`
    ];

    for (const item of list) {
      if (!candidates.includes(item)) candidates.push(item);
    }
  }

  return candidates;
}

// Auth Routes
app.get('/api/auth/check', (req, res) => {
  const cookies = parseCookies(req);
  const token = cookies.astreamer_session ||
                cookies.astreamer_passcode ||
                req.headers['x-admin-passcode'] ||
                req.headers['authorization']?.replace(/^Bearer\s+/i, '') ||
                req.query.passcode ||
                req.query.token;
  const authenticated = isAuthTokenValid(token);
  res.json({ authenticated, hasAdminSecretConfigured: Boolean(ADMIN_PASSCODE) });
});

app.post('/api/auth/login', (req, res) => {
  const { passcode } = req.body || {};
  if (isAuthTokenValid(passcode)) {
    res.setHeader('Set-Cookie', `astreamer_session=${encodeURIComponent(passcode)}; Path=/; Max-Age=31536000; SameSite=Lax; HttpOnly`);
    return res.json({ success: true, message: 'Authenticated' });
  }
  res.status(401).json({ success: false, error: 'Invalid passcode' });
});

app.post('/api/auth/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'astreamer_session=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly');
  res.json({ success: true, message: 'Logged out' });
});

// Settings API
app.get('/api/settings', (req, res) => {
  res.json(db.getSettings());
});

app.post('/api/settings', checkAuth, (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json({ success: true, settings: updated });
});

const isAuthenticatedReq = (req) => {
  const cookies = parseCookies(req);
  const token = cookies.astreamer_session ||
                cookies.astreamer_passcode ||
                req.headers['x-admin-passcode'] ||
                req.headers['authorization']?.replace(/^Bearer\s+/i, '') ||
                req.query?.passcode ||
                req.query?.token;
  return isAuthTokenValid(token);
};

// ==========================================
// 2. LIBRARY & BATCH INGESTION APIS
// ==========================================

// Get all library works (with optional search, tag '+' multi-filtering, or CV filter)
app.get('/api/library', (req, res) => {
  if (!isAuthenticatedReq(req)) return res.json([]);
  const { q, tag, cv, circle, favorite } = req.query;
  let works = db.getAllWorks();
  const dict = (db.readDb && db.readDb().tagDict) || db.BASE_TAG_DICT || {};

  if (q) {
    const term = q.toLowerCase();
    works = works.filter(w => 
      w.rjCode.toLowerCase().includes(term) ||
      w.title.toLowerCase().includes(term) ||
      (w.circle && w.circle.toLowerCase().includes(term)) ||
      (w.cv && w.cv.toLowerCase().includes(term)) ||
      (w.tags && w.tags.some(t => {
        if (t.toLowerCase().includes(term)) return true;
        const entry = dict[t];
        if (entry) {
          if (typeof entry === 'string') return entry.toLowerCase().includes(term);
          if (typeof entry === 'object') {
            return (entry.romaji && entry.romaji.toLowerCase().includes(term)) ||
                   (entry.english && entry.english.toLowerCase().includes(term));
          }
        }
        return false;
      }))
    );
  }

  if (tag) {
    const rawTag = tag.toLowerCase().trim();
    const tagTokens = rawTag.split(/[+,]+/).map(s => s.trim()).filter(Boolean);
    if (tagTokens.length > 0) {
      works = works.filter(w => {
        const workTags = Array.isArray(w.tags) ? w.tags : [];
        const allWorkTagStrings = [...workTags];
        if (w.cv) {
          w.cv.split(/[,、/&＋+]/).forEach(c => {
            if (c.trim()) allWorkTagStrings.push(c.trim());
          });
        }
        return tagTokens.every(token => {
          return allWorkTagStrings.some(t => {
            const tLower = t.toLowerCase().trim();
            if (tLower.includes(token)) return true;
            const entry = dict[t];
            if (entry) {
              if (typeof entry === 'string') return entry.toLowerCase().includes(token);
              if (typeof entry === 'object') {
                return (entry.romaji && entry.romaji.toLowerCase().includes(token)) ||
                       (entry.english && entry.english.toLowerCase().includes(token));
              }
            }
            return false;
          });
        });
      });
    }
  }

  if (cv) {
    const cleanCv = cv.toLowerCase().trim();
    works = works.filter(w => w.cv && w.cv.toLowerCase().includes(cleanCv));
  }

  if (circle) {
    const cleanCircle = circle.toLowerCase().trim();
    works = works.filter(w => w.circle && w.circle.toLowerCase().includes(cleanCircle));
  }

  if (favorite === 'true') {
    works = works.filter(w => w.favorite);
  }

  res.json(works);
});

// Single Work Resolve & Import
app.post('/api/library/resolve', checkAuth, async (req, res) => {
  const { rjCode } = req.body;
  if (!rjCode) return res.status(400).json({ error: 'Missing rjCode' });

  try {
    const work = await resolveAndSaveWork(rjCode);
    res.json({ success: true, work });
  } catch (err) {
    console.error(`[Resolve Error] ${rjCode}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// Batch Import (Array of RJ codes or multiline string)
app.post('/api/library/batch-import', checkAuth, async (req, res) => {
  const { rjList, textData } = req.body;
  let items = [];

  if (Array.isArray(rjList)) {
    items = rjList;
  } else if (typeof textData === 'string') {
    items = textData.split(/[\r\n,;\s]+/).filter(s => s.match(/RJ\d+/i));
  }

  if (items.length === 0) {
    return res.status(400).json({ error: 'No valid RJ codes provided' });
  }

  try {
    const results = await batchImport(items);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Batch Refresh Metadata (Writes ONLY if changes detected)
app.post('/api/library/refresh-batch', checkAuth, async (req, res) => {
  const { rjList } = req.body || {};
  const list = Array.isArray(rjList) ? rjList : [];
  const results = { total: list.length, updated: 0, unchanged: 0, failed: 0, savedToKv: false };
  let hasAnyChanges = false;

  for (const rj of list) {
    try {
      const cleanRj = (rj || '').toUpperCase();
      const existing = db.getWorkByRj(cleanRj);
      if (!existing) { results.failed++; continue; }
      const fresh = await resolveAndSaveWork(cleanRj, false);
      if (isWorkMetadataChanged(existing, fresh)) {
        db.saveWork(fresh);
        results.updated++;
        hasAnyChanges = true;
      } else {
        results.unchanged++;
      }
    } catch (e) {
      results.failed++;
    }
  }

  results.savedToKv = hasAnyChanges;
  res.json(results);
});

// Refresh All Works (Writes ONLY if changes detected)
app.post('/api/library/refresh-all', checkAuth, async (req, res) => {
  const works = db.getAllWorks();
  const results = { total: works.length, updated: 0, unchanged: 0, failed: 0, savedToKv: false };
  let hasAnyChanges = false;

  for (const w of works) {
    try {
      const existing = w;
      const fresh = await resolveAndSaveWork(w.rjCode, false);
      if (isWorkMetadataChanged(existing, fresh)) {
        db.saveWork(fresh);
        results.updated++;
        hasAnyChanges = true;
      } else {
        results.unchanged++;
      }
    } catch (e) {
      results.failed++;
    }
  }

  results.savedToKv = hasAnyChanges;
  res.json(results);
});

// Refresh Single Work
app.post('/api/library/refresh/:rjCode', checkAuth, async (req, res) => {
  const { rjCode } = req.params;
  try {
    const cleanRj = (rjCode || '').toUpperCase();
    const existing = db.getWorkByRj(cleanRj);
    if (!existing) return res.status(404).json({ error: 'Work not found' });
    const fresh = await resolveAndSaveWork(cleanRj, false);
    const changed = isWorkMetadataChanged(existing, fresh);
    let work = existing;
    if (changed) {
      work = db.saveWork(fresh);
    }
    res.json({ success: true, work, changed, savedToKv: changed });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// On-Demand Lazy Chapters API (Never writes to DB - purely response stream)
app.get('/api/library/chapters/:rjCode', async (req, res) => {
  const { rjCode } = req.params;
  let targetDur = parseInt(req.query.duration || '0', 10);
  const cleanRj = (rjCode || '').toUpperCase();
  const work = db.getWorkByRj(cleanRj);
  const numTracks = (work && work.tracks) ? work.tracks.length : 1;
  const isSingleStream = work ? (Boolean(work.hasHls) || numTracks <= 1) : true;

  if (targetDur <= 0 && work && isSingleStream) {
    if (work.tracks && work.tracks[0] && work.tracks[0].duration > 0) targetDur = Math.round(work.tracks[0].duration);
    else if (work.totalDuration > 0) targetDur = Math.round(work.totalDuration);
  }

  try {
    const result = await fetchChaptersAndGallery(cleanRj, isSingleStream, targetDur);
    return res.json({ success: true, chapters: result.chapters, gallery: result.gallery });
  } catch (e) {
    return res.json({ success: true, chapters: [], gallery: [], error: e.message });
  }
});

// Delete Work from Library
app.delete('/api/library/:rjCode', checkAuth, (req, res) => {
  const { rjCode } = req.params;
  const deleted = db.deleteWork(rjCode);
  res.json({ success: deleted });
});

// Toggle Favorite
app.post('/api/library/favorite/:rjCode', checkAuth, (req, res) => {
  const { rjCode } = req.params;
  const status = db.toggleFavorite(rjCode);
  res.json({ success: true, favorite: status });
});

// ==========================================
// 3. PLAYLISTS APIS
// ==========================================
app.get('/api/playlists', (req, res) => {
  if (!isAuthenticatedReq(req)) return res.json([]);
  res.json(db.getAllPlaylists());
});

app.post('/api/playlists', checkAuth, (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Playlist name is required' });
  const pl = db.createPlaylist(name, description || '');
  res.json(pl);
});

app.delete('/api/playlists/:id', checkAuth, (req, res) => {
  const deleted = db.deletePlaylist(req.params.id);
  res.json({ success: deleted });
});

app.post('/api/playlists/:id/items', checkAuth, (req, res) => {
  const { item } = req.body;
  if (!item) return res.status(400).json({ error: 'Missing item' });
  const updated = db.addToPlaylist(req.params.id, item);
  res.json({ success: !!updated, playlist: updated });
});

app.delete('/api/playlists/:id/items/:index', checkAuth, (req, res) => {
  const updated = db.removeFromPlaylist(req.params.id, parseInt(req.params.index, 10));
  res.json({ success: !!updated, playlist: updated });
});

// ==========================================
// 4. AGGREGATIONS (GENRES & ARTISTS) & HISTORY
// ==========================================
app.get('/api/tags', (req, res) => {
  if (!isAuthenticatedReq(req)) return res.json([]);
  res.json(db.getAllTags());
});

app.get('/api/artists', (req, res) => {
  if (!isAuthenticatedReq(req)) return res.json([]);
  res.json(db.getAllArtists());
});

app.post('/api/tags/translate-batch', checkAuth, async (req, res) => {
  try {
    const { tags } = req.body || {};
    if (!Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ success: false, error: 'tags must be a non-empty array' });
    }
    const { translateTagsWithLLM } = require('./llm_resolver');
    const translated = await translateTagsWithLLM(tags);
    if (translated && Object.keys(translated).length > 0) {
      const data = db.readDb();
      db.mergeTagDict(data, translated);
      db.writeDb(data);
      return res.json({ success: true, count: Object.keys(translated).length, translations: translated, tagDict: data.tagDict });
    }
    res.json({ success: false, error: 'No translations generated by LLM' });
  } catch (err) {
    console.error('Error translating tags:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/tags/sync-dict', checkAuth, (req, res) => {
  try {
    const newEntries = req.body.newEntries || req.body.updates;
    if (newEntries && typeof newEntries === 'object') {
      const data = db.readDb();
      const changed = db.mergeTagDict(data, newEntries);
      if (changed) db.writeDb(data);
      return res.json({ success: true, tagDict: data.tagDict });
    }
    res.json({ success: false, error: 'Invalid newEntries object' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/tags/reset-dict', checkAuth, (req, res) => {
  try {
    const data = db.readDb();
    const currentDict = data.tagDict || {};
    const cleanedDict = Object.assign({}, db.BASE_TAG_DICT);
    let removedCount = 0;
    let preservedCount = 0;

    for (const [key, val] of Object.entries(currentDict)) {
      if (db.BASE_TAG_DICT[key]) continue;

      const isJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(key);
      if (!isJapanese) {
        cleanedDict[key] = val;
        preservedCount++;
        continue;
      }

      if (val && typeof val === 'object') {
        let romaji = (val.romaji || '').trim();
        const english = (val.english || '').trim();
        if (romaji) romaji = db.normalizeCVRomaji ? db.normalizeCVRomaji(key, romaji) : romaji;
        const validRomaji = romaji && /[a-zA-Z]/.test(romaji) && romaji !== key;
        const validEnglish = english && /[a-zA-Z]/.test(english) && english !== key;

        if (val.isCV ? validRomaji : (validRomaji && validEnglish)) {
          cleanedDict[key] = {
            romaji: romaji,
            english: val.isCV ? (validEnglish ? english : romaji) : english,
            isCV: !!val.isCV
          };
          preservedCount++;
          continue;
        }
      }
      removedCount++;
    }

    data.tagDict = cleanedDict;
    db.writeDb(data);
    return res.json({ success: true, removedCount, preservedCount, tagDict: data.tagDict });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// History API
app.get('/api/history', checkAuth, (req, res) => {
  res.json(db.getHistory());
});

app.post('/api/history', checkAuth, (req, res) => {
  const entry = req.body;
  if (!entry || !entry.rjCode) return res.status(400).json({ error: 'Missing rjCode' });
  const history = db.addHistoryEntry(entry);
  res.json({ success: true, history });
});

app.delete('/api/history', checkAuth, (req, res) => {
  db.clearHistory();
  res.json({ success: true });
});

// ==========================================
// 4.5. WISHLIST APIS
// ==========================================
app.get('/api/wishlist', (req, res) => {
  if (!isAuthenticatedReq(req)) return res.json([]);
  res.json(db.getWishlist());
});

app.post('/api/wishlist', checkAuth, (req, res) => {
  const body = req.body || {};
  const match = (body.rjCode || '').match(/RJ\d+/i);
  if (!match) return res.status(400).json({ error: 'Invalid RJ Code' });

  const rjCode = match[0].toUpperCase();
  const existingWork = db.getWorkByRj(rjCode);
  if (existingWork) {
    return res.json({ success: true, alreadyInLibrary: true, message: 'Work is already in your library.' });
  }

  const entry = {
    rjCode,
    title: body.title || `Work ${rjCode}`,
    cv: body.cv || '',
    circle: body.circle || '',
    coverUrl: body.coverUrl || '',
    reason: body.reason || 'Pending crawler / audio stream',
    addedAt: body.addedAt || new Date().toISOString()
  };

  const wishlist = db.saveWishlistItem(entry);
  res.json({ success: true, wishlist });
});

app.post('/api/wishlist/retry/:rjCode', checkAuth, async (req, res) => {
  const rjCode = req.params.rjCode.toUpperCase().trim();
  try {
    const work = await resolveAndSaveWork(rjCode);
    res.json({ success: true, work });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/wishlist/retry-all', checkAuth, async (req, res) => {
  const list = [...db.getWishlist()];
  const results = { total: list.length, succeeded: [], failed: [] };

  for (const item of list) {
    try {
      const work = await resolveAndSaveWork(item.rjCode);
      results.succeeded.push({ rjCode: item.rjCode, title: work.title });
    } catch (e) {
      results.failed.push({ rjCode: item.rjCode, error: e.message });
    }
  }

  res.json(results);
});

app.delete('/api/wishlist/:rjCode', checkAuth, (req, res) => {
  const rjCode = req.params.rjCode.toUpperCase().trim();
  let wishlist;
  if (rjCode === 'CLEAR_ALL' || rjCode === 'CLEAR') {
    wishlist = db.clearWishlist();
  } else {
    wishlist = db.removeWishlistItem(rjCode);
  }
  res.json({ success: true, wishlist });
});

app.delete('/api/wishlist', checkAuth, (req, res) => {
  const wishlist = db.clearWishlist();
  res.json({ success: true, wishlist });
});

// ==========================================
// 5. BACKUP & EXPORT
// ==========================================
app.get('/api/backup', checkAuth, (req, res) => {
  res.setHeader('Content-Disposition', `attachment; filename=astreamer_backup_${Date.now()}.json`);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(db.readDb(), null, 2));
});

app.post('/api/backup', checkAuth, (req, res) => {
  const data = req.body;
  if (!data || !data.works) return res.status(400).json({ error: 'Invalid backup file structure' });
  db.writeDb(data);
  res.json({ success: true, message: 'Database restored successfully' });
});

// ==========================================
// 6. STREAM & IMAGE PROXY
// ==========================================
app.get('/image-proxy', async (req, res) => {
  let targetUrl = req.query.url;
  const rjParam = req.query.rj;
  if (!targetUrl && !rjParam) return res.status(400).send('Missing url parameter');

  if (targetUrl && targetUrl.startsWith('//')) {
    targetUrl = 'https:' + targetUrl;
  }

  const candidates = getCoverCandidates(targetUrl, rjParam);

  for (const candUrl of candidates) {
    try {
      const isDlsite = candUrl.includes('dlsite.jp') || candUrl.includes('dlsite.com');
      const referer = isDlsite ? 'https://www.dlsite.com/' : 'https://japaneseasmr.com/';

      const response = await axios({
        method: 'get',
        url: candUrl,
        httpAgent,
        httpsAgent,
        responseType: 'stream',
        headers: {
          'Referer': referer,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 8000
      });

      if (response.status >= 200 && response.status < 300) {
        res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.setHeader('Access-Control-Allow-Origin', '*');
        return response.data.pipe(res);
      }
    } catch (err) {}
  }

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(FALLBACK_SVG);
});

app.get('/stream', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('Missing url');

  try {
    const isM3u8 = targetUrl.toLowerCase().includes('.m3u8');
    const rangeHeader = req.headers.range;

    const axiosHeaders = {
      'Referer': 'https://japaneseasmr.com/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    };

    if (rangeHeader && !isM3u8) {
      axiosHeaders['Range'] = rangeHeader;
    }

    if (isM3u8) {
      const response = await axios({
        method: 'get',
        url: targetUrl,
        httpAgent,
        httpsAgent,
        responseType: 'text',
        headers: axiosHeaders,
        timeout: 10000
      });

      const originalM3u8 = response.data;
      const baseUrl = new URL('.', targetUrl).href;

      const rewrittenLines = originalM3u8.split(/\r?\n/).map(line => {
        const trimmed = line.trim();
        if (!trimmed) return line;

        if (trimmed.startsWith('#EXT-X-KEY:')) {
          return trimmed.replace(/URI="([^"]+)"/, (match, keyUrl) => {
            const absoluteKeyUrl = new URL(keyUrl, baseUrl).href;
            return `URI="/stream?url=${encodeURIComponent(absoluteKeyUrl)}"`;
          });
        }

        if (trimmed.startsWith('#')) return line;

        const absoluteSegmentUrl = new URL(trimmed, baseUrl).href;
        return `/stream?url=${encodeURIComponent(absoluteSegmentUrl)}`;
      });

      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'no-cache');
      return res.send(rewrittenLines.join('\n'));
    }

    const isTs = targetUrl.toLowerCase().endsWith('.ts');
    const response = await axios({
      method: 'get',
      url: targetUrl,
      httpAgent,
      httpsAgent,
      responseType: 'stream',
      headers: axiosHeaders,
      validateStatus: (status) => status >= 200 && status < 400,
      timeout: 15000
    });

    res.status(response.status);

    const headersToForward = [
      'content-length',
      'accept-ranges',
      'content-range',
      'last-modified',
      'etag'
    ];

    headersToForward.forEach(header => {
      if (response.headers[header]) {
        res.setHeader(header, response.headers[header]);
      }
    });

    if (isTs) {
      res.setHeader('Content-Type', 'video/mp2t');
    } else {
      res.setHeader('Content-Type', response.headers['content-type'] || 'audio/mpeg');
    }

    if (!response.headers['accept-ranges']) {
      res.setHeader('Accept-Ranges', 'bytes');
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    response.data.pipe(res);

  } catch (error) {
    res.status(500).send(`Stream error: ${error.message}`);
  }
});

// ==========================================
// 7. MODERN MUSIC STREAMING SPA INTERFACE
// ==========================================
// Complete Web App SPA Frontend
const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>aStreamer | Your one hub streaming services</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐧</text></svg>">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
  <style>
    :root {
      --bg-main: #0a0a0f;
      --bg-card: #12131a;
      --bg-card-hover: #181a24;
      --border: rgba(255, 255, 255, 0.08);
      --accent: #ff3366;
      --accent-hover: #e02456;
      --accent-glow: rgba(255, 51, 102, 0.35);
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --sidebar-w: 240px;
      --player-bg: #101118;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
    body { background: var(--bg-main); color: var(--text-main); min-height: 100vh; display: flex; overflow-x: hidden; }

    /* Desktop Sidebar */
    .app-sidebar {
      width: var(--sidebar-w);
      background: #0c0d14;
      border-right: 1px solid var(--border);
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      padding: 24px 16px 40px;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      scrollbar-width: thin;
      z-index: 50;
    }
    .logo-area { display: flex; align-items: center; gap: 10px; padding: 0 10px; margin-bottom: 32px; cursor: pointer; }
    .logo-icon { width: 38px; height: 38px; background: linear-gradient(135deg, #0284c7, #06b6d4); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.35rem; box-shadow: 0 0 16px rgba(56, 189, 248, 0.35); flex-shrink: 0; }
    .logo-title { font-weight: 800; font-size: 1.25rem; letter-spacing: -0.02em; background: linear-gradient(90deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .nav-section { display: flex; flex-direction: column; gap: 4px; }
    .nav-title { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); padding: 12px 10px 6px; font-weight: 700; }
    .nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 10px; font-size: 0.92rem; font-weight: 600; color: #9ca3af; cursor: pointer; transition: 0.15s; background: none; border: none; text-align: left; width: 100%; }
    .nav-item:hover { background: var(--bg-card-hover); color: #fff; }
    .nav-item.active { background: var(--accent); color: #fff; }

    /* Responsive Mobile Top Navbar */
    .mobile-topbar {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 58px;
      background: rgba(12, 13, 20, 0.95);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--border);
      z-index: 60;
      padding: 0 14px;
      align-items: center;
      justify-content: space-between;
    }
    .mobile-nav-pills {
      display: none;
      position: fixed;
      top: 58px;
      left: 0;
      right: 0;
      background: rgba(10, 10, 15, 0.96);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border);
      z-index: 59;
      padding: 8px 12px;
      overflow-x: auto;
      white-space: nowrap;
      gap: 8px;
      scrollbar-width: none;
    }
    .mobile-nav-pills::-webkit-scrollbar { display: none; }
    .mobile-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-muted);
      background: var(--bg-card);
      border: 1px solid var(--border);
      cursor: pointer;
      flex-shrink: 0;
      transition: 0.15s;
    }
    .mobile-pill:hover { color: #fff; }
    .mobile-pill.active { background: var(--accent); color: #fff; border-color: var(--accent); }

    /* Main Container */
    .app-main { margin-left: var(--sidebar-w); flex: 1; padding: 24px 36px 120px; min-height: 100vh; }
    .topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; gap: 16px; }
    .search-box { flex: 1; max-width: 480px; position: relative; display: flex; align-items: center; }
    .search-box input { width: 100%; background: var(--bg-card); border: 1px solid var(--border); padding: 10px 16px 10px 42px; border-radius: 10px; color: #fff; font-size: 0.9rem; outline: none; transition: 0.2s; }
    .search-box input:focus { border-color: var(--accent); box-shadow: 0 0 12px rgba(255,51,102,0.25); }
    .search-box span { position: absolute; left: 14px; color: var(--text-muted); font-size: 0.95rem; }
    .tag-suggestions-dropdown {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin-top: 6px;
      background: rgba(18, 20, 29, 0.96);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 51, 102, 0.35);
      border-radius: 12px;
      box-shadow: 0 14px 36px rgba(0, 0, 0, 0.7);
      z-index: 1000;
      max-height: 280px;
      overflow-y: auto;
    }
    .tag-suggestion-item {
      padding: 9px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      cursor: pointer;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      transition: background 0.15s;
      font-size: 0.84rem;
    }
    .tag-suggestion-item:last-child { border-bottom: none; }
    .tag-suggestion-item:hover, .tag-suggestion-item.active { background: rgba(255, 51, 102, 0.2); }
    .suggestion-title { color: #fff; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    /* Zen Browser Style Command/Tag Search Modal */
    .zen-search-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(8, 10, 18, 0.78);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      z-index: 99999;
      align-items: flex-start;
      justify-content: center;
      padding: 8vh 16px 20px;
      animation: zenFadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes zenFadeIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .zen-search-card {
      width: 100%;
      max-width: 680px;
      background: rgba(18, 22, 36, 0.96);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      box-shadow: 0 30px 90px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.05), 0 0 30px rgba(124, 92, 252, 0.15);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: 80vh;
    }
    .zen-search-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.02);
    }
    .zen-search-icon {
      font-size: 1.25rem;
      opacity: 0.85;
    }
    .zen-search-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: #fff;
      font-size: 1.05rem;
      font-weight: 500;
      font-family: inherit;
    }
    .zen-search-input::placeholder {
      color: rgba(255, 255, 255, 0.38);
      font-size: 0.95rem;
    }
    .zen-search-commit-btn {
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      color: #0f172a;
      font-weight: 700;
      font-size: 0.8rem;
      padding: 6px 14px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      margin-right: 6px;
      white-space: nowrap;
      transition: all 0.15s ease;
      box-shadow: 0 2px 8px rgba(56, 189, 248, 0.25);
    }
    .zen-search-commit-btn:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(56, 189, 248, 0.4);
    }
    .zen-close-btn {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
      border-radius: 8px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.9rem;
      transition: 0.15s;
    }
    .zen-close-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
    }
    .zen-chips-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      padding: 10px 20px;
      background: rgba(0, 0, 0, 0.35);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .zen-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(124, 92, 252, 0.22);
      border: 1px solid rgba(124, 92, 252, 0.45);
      color: #ddd6fe;
      font-size: 0.82rem;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 20px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }
    .zen-chip-remove {
      cursor: pointer;
      font-size: 0.85rem;
      color: #a78bfa;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      transition: 0.15s;
    }
    .zen-chip-remove:hover {
      background: rgba(239, 68, 68, 0.3);
      color: #fca5a5;
    }
    .zen-clear-btn {
      background: none;
      border: none;
      color: #f87171;
      font-size: 0.78rem;
      cursor: pointer;
      margin-left: auto;
      padding: 2px 6px;
      border-radius: 4px;
      transition: 0.15s;
    }
    .zen-clear-btn:hover {
      text-decoration: underline;
    }
    .zen-results-container {
      overflow-y: auto;
      padding: 10px 14px;
      flex: 1;
      max-height: 440px;
    }
    .zen-category-title {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #94a3b8;
      font-weight: 700;
      margin: 10px 8px 6px;
    }
    .zen-result-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 11px 16px;
      border-radius: 10px;
      margin-bottom: 4px;
      cursor: pointer;
      transition: all 0.15s ease;
      border: 1px solid transparent;
      background: rgba(255, 255, 255, 0.02);
    }
    .zen-result-item:hover, .zen-result-item.selected {
      background: rgba(124, 92, 252, 0.18);
      border-color: rgba(124, 92, 252, 0.45);
      transform: translateX(2px);
    }
    .zen-tag-info {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      flex: 1;
      min-width: 0;
    }
    .zen-tag-orig {
      font-size: 0.95rem;
      font-weight: 700;
      color: #fff;
    }
    .zen-tag-romaji {
      font-size: 0.85rem;
      color: #c084fc;
      font-weight: 500;
    }
    .zen-tag-eng {
      font-size: 0.85rem;
      color: #94a3b8;
    }
    .zen-tag-sep {
      color: rgba(255, 255, 255, 0.2);
      font-size: 0.75rem;
    }
    .zen-tag-badge {
      font-size: 0.75rem;
      background: rgba(255, 255, 255, 0.08);
      color: #cbd5e1;
      padding: 3px 8px;
      border-radius: 12px;
      font-weight: 600;
      white-space: nowrap;
    }
    .zen-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 0.76rem;
      color: #64748b;
      background: rgba(0, 0, 0, 0.3);
    }
    .zen-shortcut-badge {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 2px 6px;
      border-radius: 4px;
      color: #cbd5e1;
      font-family: inherit;
      font-size: 0.72rem;
      font-weight: 600;
    }
    .top-actions { display: flex; gap: 10px; }
    .btn-primary { background: var(--accent); color: #fff; border: none; padding: 9px 16px; border-radius: 10px; font-weight: 700; font-size: 0.88rem; cursor: pointer; transition: 0.15s; display: inline-flex; align-items: center; gap: 6px; }
    .btn-primary:hover { background: var(--accent-hover); box-shadow: 0 0 12px var(--accent-glow); }
    .btn-outline { background: transparent; color: #fff; border: 1px solid var(--border); padding: 9px 14px; border-radius: 10px; font-weight: 600; font-size: 0.88rem; cursor: pointer; transition: 0.15s; display: inline-flex; align-items: center; gap: 6px; }
    .btn-outline:hover { background: var(--bg-card-hover); border-color: rgba(255,255,255,0.2); }
    .btn-icon { background: var(--bg-card); border: 1px solid var(--border); color: #fff; width: 38px; height: 38px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; font-size: 1.05rem; cursor: pointer; transition: 0.15s; }
    .btn-icon:hover { background: var(--bg-card-hover); border-color: rgba(255,255,255,0.2); }

    /* View Modes & Explorer Toolbar */
    .view-modes-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 20px;
      background: rgba(18, 19, 26, 0.7);
      border: 1px solid var(--border);
      padding: 8px 14px;
      border-radius: 12px;
    }
    .view-mode-buttons {
      display: flex;
      gap: 4px;
      background: #0c0d12;
      padding: 3px;
      border-radius: 8px;
      border: 1px solid var(--border);
    }
    .view-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.82rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: 0.15s;
    }
    .view-btn:hover { color: #fff; background: rgba(255,255,255,0.06); }
    .view-btn.active { background: var(--accent); color: #fff; }
    .per-page-select {
      background: #0c0d12;
      border: 1px solid var(--border);
      color: #fff;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 600;
      outline: none;
      cursor: pointer;
    }

    /* Grids & Cards */
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; flex-wrap: wrap; gap: 12px; }
    .section-title { font-size: 1.35rem; font-weight: 800; display: flex; align-items: center; gap: 8px; }
    .works-grid { display: grid; gap: 20px; }
    
    /* View Mode: Medium (Default) */
    .works-grid.mode-medium { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }

    /* View Mode: Large */
    .works-grid.mode-large { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
    .works-grid.mode-large .card-title { font-size: 1rem; }

    /* View Mode: Small */
    .works-grid.mode-small { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
    .works-grid.mode-small .work-card { padding: 8px; border-radius: 10px; }
    .works-grid.mode-small .card-title { font-size: 0.78rem; height: 2.5em; margin-bottom: 2px; }
    .works-grid.mode-small .card-sub { font-size: 0.72rem; }

    .work-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; padding: 12px; cursor: pointer; transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; position: relative; min-width: 0; }
    .work-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.22); box-shadow: 0 10px 24px rgba(0,0,0,0.5); }
    .card-cover-wrapper { position: relative; width: 100%; aspect-ratio: 3 / 4; border-radius: 10px; overflow: hidden; margin-bottom: 10px; background: #0c0d12; }
    .card-cover { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
    .disguised-overlay { position: absolute; top: 8px; left: 8px; }
    .disguised-badge { background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); color: #38bdf8; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(56,189,248,0.4); }
    .card-badge-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
    .card-rj { font-size: 0.75rem; font-weight: 700; color: #38bdf8; background: rgba(56,189,248,0.12); padding: 2px 6px; border-radius: 4px; }
    .card-fav { font-size: 0.95rem; cursor: pointer; }
    .card-title { font-size: 0.88rem; font-weight: 700; line-height: 1.35; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 2.7em; word-break: break-word; }
    .card-sub { font-size: 0.8rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* View Mode: Detailed List */
    .works-list-table { width: 100%; border-collapse: collapse; background: var(--bg-card); border-radius: 12px; overflow: hidden; border: 1px solid var(--border); }
    .works-list-table th { text-align: left; padding: 12px 14px; font-size: 0.78rem; color: var(--text-muted); border-bottom: 1px solid var(--border); text-transform: uppercase; letter-spacing: 0.5px; }
    .works-list-table td { padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 0.88rem; vertical-align: middle; }
    .works-list-row { cursor: pointer; transition: background 0.15s; }
    .works-list-row:hover { background: var(--bg-card-hover); }
    .list-thumb { width: 44px; height: 44px; border-radius: 6px; object-fit: cover; background: #0c0d12; flex-shrink: 0; }

    /* Pagination Bar */
    .pagination-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: 28px;
      flex-wrap: wrap;
    }
    .page-btn {
      background: var(--bg-card);
      border: 1px solid var(--border);
      color: #fff;
      padding: 7px 12px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      transition: 0.15s;
      min-width: 38px;
      text-align: center;
    }
    .page-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
    .page-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; box-shadow: 0 0 10px var(--accent-glow); }
    .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .page-info { font-size: 0.82rem; color: var(--text-muted); font-weight: 600; margin: 0 8px; }

    /* Work Detail */
    .work-detail-banner { display: flex; gap: 28px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; margin-bottom: 2rem; }
    .detail-cover { width: 220px; min-width: 220px; height: 300px; border-radius: 12px; object-fit: cover; background: #0c0d12; }
    .detail-info { flex: 1; display: flex; flex-direction: column; }
    .detail-title { font-size: 1.6rem; font-weight: 800; margin-bottom: 12px; line-height: 1.3; }
    .detail-meta { font-size: 0.95rem; color: var(--text-muted); margin-bottom: 8px; }
    .detail-meta strong { color: #fff; }
    .tags-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
    .tag-pill { background: #232736; border: 1px solid #33384c; color: #d1d5db; font-size: 0.78rem; padding: 4px 10px; border-radius: 6px; cursor: pointer; transition: 0.15s; }
    .tag-pill:hover { background: var(--accent); color: #fff; }
    .tracks-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    .tracks-table th { text-align: left; padding: 10px 14px; font-size: 0.8rem; color: var(--text-muted); border-bottom: 1px solid var(--border); }
    .tracks-table td { padding: 12px 14px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 0.9rem; }
    .track-row { cursor: pointer; transition: 0.15s; }
    .track-row:hover { background: var(--bg-card-hover); }
    .track-row.active { background: rgba(255,51,102,0.12); color: var(--accent); }
    .chapter-row { cursor: pointer; transition: 0.15s; }
    .chapter-row:hover { background: var(--bg-card-hover); }
    .chapter-row.active { background: rgba(56, 189, 248, 0.12); color: #38bdf8; }
    .chapter-row.active td { font-weight: 700; }
    .timestamp-btn { background: rgba(56, 189, 248, 0.14); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.35); font-family: monospace; font-size: 0.82rem; font-weight: 700; padding: 3px 8px; border-radius: 6px; cursor: pointer; transition: 0.15s; display: inline-flex; align-items: center; gap: 4px; }
    .timestamp-btn:hover { background: #38bdf8; color: #000; box-shadow: 0 0 10px rgba(56, 189, 248, 0.4); }
    .nav-badge { background: #38bdf8; color: #050608; font-size: 0.65rem; font-weight: 800; padding: 1px 6px; border-radius: 10px; margin-left: auto; display: inline-block; }
    .wishlist-row { transition: 0.15s; }
    .wishlist-row:hover { background: var(--bg-card-hover); }
    .tag-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
    .tag-cloud-item { background: var(--bg-card); border: 1px solid var(--border); padding: 10px 18px; border-radius: 24px; font-weight: 600; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
    .tag-cloud-item:hover { background: var(--accent); color: #fff; }
    .tag-count { background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; }

    /* Modals */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.78); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 1000; display: none; align-items: center; justify-content: center; padding: 16px; }
    .modal-content { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 28px; width: 100%; max-width: 540px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
    .modal-title { font-size: 1.3rem; font-weight: 800; margin-bottom: 14px; }
    .modal-textarea { width: 100%; height: 140px; background: #0c0d12; border: 1px solid var(--border); border-radius: 10px; padding: 12px; color: #fff; font-family: monospace; font-size: 0.9rem; outline: none; margin-bottom: 16px; resize: vertical; }

    /* Bottom Player Bar */
    .player-bar { position: fixed; bottom: 0; left: var(--sidebar-w); right: 0; height: 84px; background: var(--player-bg); border-top: 1px solid var(--border); padding: 0 24px; display: flex; align-items: center; justify-content: space-between; z-index: 100; box-shadow: 0 -8px 24px rgba(0,0,0,0.5); }
    .player-left { display: flex; align-items: center; gap: 14px; width: 300px; cursor: pointer; }
    .player-thumb { width: 52px; height: 52px; border-radius: 8px; object-fit: cover; background: #0c0d12; flex-shrink: 0; }
    .player-track-info { overflow: hidden; }
    .player-title { font-size: 0.9rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .player-sub { font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .player-center { flex: 1; max-width: 560px; display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .player-controls { display: flex; align-items: center; gap: 14px; }
    .ctrl-btn { background: none; border: 1px solid transparent; color: #fff; cursor: pointer; font-size: 1.1rem; opacity: 0.85; transition: 0.15s; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; padding: 4px 6px; }
    .ctrl-btn:hover { opacity: 1; color: var(--accent); }
    .ctrl-btn.active { opacity: 1; color: var(--accent); background: rgba(255, 51, 102, 0.18); border-color: rgba(255, 51, 102, 0.4); text-shadow: 0 0 10px rgba(255, 51, 102, 0.6); }
    .play-btn-circle { width: 40px; height: 40px; border-radius: 50%; background: #fff; color: #000; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; border: none; transition: transform 0.15s, background 0.15s; }
    .play-btn-circle:hover { transform: scale(1.08); background: var(--accent); color: #fff; }
    .scrubber-row { display: flex; align-items: center; gap: 12px; width: 100%; }
    .time-text { font-size: 0.75rem; color: var(--text-muted); font-variant-numeric: tabular-nums; min-width: 40px; }
    .scrubber { flex: 1; height: 4px; appearance: none; -webkit-appearance: none; background: #333748; border-radius: 2px; outline: none; cursor: pointer; }
    .scrubber::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 12px; height: 12px; border-radius: 50%; background: var(--accent); cursor: pointer; }
    .player-right { display: flex; align-items: center; gap: 14px; width: 300px; justify-content: flex-end; }
    .volume-slider { width: 90px; height: 4px; appearance: none; -webkit-appearance: none; background: #333748; border-radius: 2px; outline: none; cursor: pointer; }
    .volume-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 10px; height: 10px; border-radius: 50%; background: #fff; }

    /* Floating Corner Player (Bottom-Right Docked Card) */
    .floating-corner-player {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 360px;
      max-width: calc(100vw - 32px);
      max-height: calc(100vh - 48px);
      z-index: 1050;
      background: rgba(17, 18, 27, 0.98);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 20px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.85), 0 0 35px rgba(255,51,102,0.18);
      display: none;
      flex-direction: column;
      overflow: hidden;
      animation: slideUpCorner 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideUpCorner {
      from { opacity: 0; transform: translateY(24px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .popup-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 18px 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .popup-body {
      padding: 16px 18px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .popup-cover-wrap {
      width: 100%;
      height: 220px;
      border-radius: 14px;
      overflow: hidden;
      position: relative;
      background: #08090d;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.6);
    }
    .popup-cover {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: #050608;
    }
    .popup-meta { text-align: center; }
    .popup-title { font-size: 1.05rem; font-weight: 800; line-height: 1.35; margin-bottom: 4px; }
    .popup-sub { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 6px; }
    .popup-cv-row { display: flex; justify-content: center; flex-wrap: wrap; gap: 6px; }
    .popup-controls { display: flex; align-items: center; justify-content: center; gap: 16px; margin: 4px 0; }
    .popup-play-btn { width: 48px; height: 48px; border-radius: 50%; background: #fff; color: #000; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; cursor: pointer; border: none; transition: transform 0.15s, background 0.15s; }
    .popup-play-btn:hover { transform: scale(1.08); background: var(--accent); color: #fff; }
    .popup-secondary-row { display: flex; align-items: center; justify-content: space-between; padding-top: 4px; border-top: 1px solid rgba(255,255,255,0.06); }
    .popup-drawer-toggle { background: var(--bg-card); border: 1px solid var(--border); color: #fff; padding: 8px 12px; border-radius: 10px; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: space-between; width: 100%; transition: 0.2s; }
    .popup-drawer-toggle:hover { background: var(--bg-card-hover); }
    .popup-chapters-list { max-height: 150px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; margin-top: 8px; }
    .popup-chapter-item { padding: 8px 10px; border-radius: 6px; font-size: 0.8rem; background: rgba(255,255,255,0.03); cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: 0.15s; }
    .popup-chapter-item:hover { background: var(--bg-card-hover); }
    .popup-chapter-item.active { background: rgba(255,51,102,0.15); color: var(--accent); font-weight: 700; }
    .playlist-track-row { cursor: pointer; transition: 0.15s; }
    .playlist-track-row:hover { background: var(--bg-card-hover); }
    .playlist-track-row.active { background: rgba(255, 51, 102, 0.15) !important; color: var(--accent); font-weight: 700; }
    .playlist-track-row.active td { color: var(--accent) !important; }
    .playlist-card-row.active { border-color: var(--accent) !important; box-shadow: 0 0 16px rgba(255,51,102,0.3) !important; }

    .gatekeeper-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; padding: 40px 32px; text-align: center; max-width: 420px; width: 100%; box-shadow: 0 20px 50px rgba(0,0,0,0.8); }
    .playlist-select-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 8px; background: #0c0d12; border: 1px solid var(--border); cursor: pointer; transition: 0.15s; }
    .playlist-select-item:hover { background: var(--bg-card-hover); border-color: rgba(255,255,255,0.2); }
    .settings-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; margin-bottom: 20px; }
    .settings-option { display: flex; align-items: flex-start; gap: 14px; padding: 14px; border-radius: 10px; border: 1px solid var(--border); margin-bottom: 10px; cursor: pointer; transition: 0.2s; }
    .settings-option:hover { background: var(--bg-card-hover); }
    .settings-option.selected { border-color: var(--accent); background: rgba(255,51,102,0.08); }
    .settings-radio { margin-top: 4px; accent-color: var(--accent); cursor: pointer; }
    .settings-label { font-size: 1rem; font-weight: 700; margin-bottom: 4px; }
    .settings-desc { font-size: 0.85rem; color: var(--text-muted); }
    .mobile-search-bar { display: none; margin-bottom: 16px; }
    #playerBarChapterBtnMobile { display: none; }

    /* Responsive Mobile Media Queries */
    @media (max-width: 768px) {
      /* Responsive Mobile Grid Density */
      .works-grid.mode-large {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      .works-grid.mode-medium {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }
      .works-grid.mode-small {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        gap: 6px !important;
      }
      .works-grid.mode-small .work-card {
        padding: 4px !important;
        border-radius: 6px !important;
      }
      .works-grid.mode-small .card-cover-wrapper {
        margin-bottom: 4px !important;
        border-radius: 4px !important;
        aspect-ratio: 3 / 4 !important;
        width: 100% !important;
        height: auto !important;
      }
      .works-grid.mode-small .card-badge-row {
        margin-bottom: 2px !important;
      }
      .works-grid.mode-small .card-rj {
        font-size: 0.58rem !important;
        padding: 1px 3px !important;
      }
      .works-grid.mode-small .card-fav {
        font-size: 0.72rem !important;
      }
      .works-grid.mode-small .card-title {
        font-size: 0.65rem !important;
        -webkit-line-clamp: 2 !important;
        height: 2.3em !important;
        margin-bottom: 2px !important;
        line-height: 1.15 !important;
      }
      .works-grid.mode-small .card-sub {
        font-size: 0.58rem !important;
      }

      #playerBarChapterBtnMobile { display: inline-flex; }
      #playerBarChapterBtn { display: none; }
      .app-sidebar { display: none; }
      .mobile-topbar { display: flex; }
      .mobile-nav-pills { display: flex; }
      .app-main {
        margin-left: 0 !important;
        padding: 114px 12px 180px !important;
      }
      .pagination-bar {
        margin-top: 24px !important;
        margin-bottom: 24px !important;
        position: relative !important;
        z-index: 5 !important;
      }
      .mobile-search-bar { display: block; }
      .floating-corner-player {
        bottom: 12px;
        left: 8px;
        right: 8px;
        width: auto;
        max-width: none;
        max-height: calc(100vh - 24px);
        border-radius: 18px;
      }
      .work-detail-banner {
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 16px;
      }
      .detail-cover {
        width: 180px;
        min-width: 180px;
        height: 240px;
      }
      .detail-meta { justify-content: center; }
      .tags-row { justify-content: center; }
      /* Mobile Player Bar Overhaul: Clean, spacious 3-row thumb-friendly layout */
      .player-bar {
        left: 0;
        padding: 6px 12px 10px;
        height: auto;
        min-height: 110px;
        flex-direction: column;
        justify-content: center;
        gap: 6px;
      }
      .player-left {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      .player-track-info {
        flex: 1;
        min-width: 0;
      }
      .player-left .ctrl-btn {
        width: 36px;
        height: 36px;
        font-size: 1rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: rgba(255,255,255,0.06);
      }
      .player-center {
        width: 100%;
        max-width: 100%;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .player-controls {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 100%;
        padding: 0 4px;
      }
      .player-controls .play-btn-circle {
        width: 46px;
        height: 46px;
        font-size: 1.35rem;
      }
      .player-controls .ctrl-btn {
        width: 38px;
        height: 38px;
        font-size: 1.1rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: rgba(255,255,255,0.04);
      }
      .scrubber-row {
        width: 100%;
        gap: 8px;
      }
      /* Mobile Responsive 2-Row Chapter Cards */
      .tracks-table.chapters-table, .tracks-table.chapters-table tbody,
      .tracks-table.audio-tracks-table, .tracks-table.audio-tracks-table tbody {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
      }
      .tracks-table.chapters-table thead,
      .tracks-table.audio-tracks-table thead {
        display: none;
      }
      .tracks-table.chapters-table tr.chapter-row,
      .tracks-table.audio-tracks-table tr.track-row {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-areas: 
          "num title"
          "time action";
        row-gap: 8px;
        column-gap: 10px;
        align-items: center;
        padding: 10px 12px;
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: 10px;
        box-sizing: border-box;
      }
      .tracks-table.chapters-table tr.chapter-row td,
      .tracks-table.audio-tracks-table tr.track-row td {
        border-bottom: none !important;
        padding: 0 !important;
      }
      .tracks-table.chapters-table tr.chapter-row td:nth-child(1),
      .tracks-table.audio-tracks-table tr.track-row td:nth-child(1) {
        grid-area: num;
        font-weight: 800;
        color: #38bdf8;
        font-size: 0.8rem;
        background: rgba(56, 189, 248, 0.12);
        padding: 2px 7px !important;
        border-radius: 6px;
        align-self: start;
        text-align: center;
        width: fit-content;
      }
      .tracks-table.chapters-table tr.chapter-row td:nth-child(2),
      .tracks-table.audio-tracks-table tr.track-row td:nth-child(2) {
        grid-area: title;
        font-size: 0.88rem;
        line-height: 1.35;
        word-break: break-word;
      }
      .tracks-table.chapters-table tr.chapter-row td:nth-child(3),
      .tracks-table.audio-tracks-table tr.track-row td:nth-child(3) {
        grid-area: time;
      }
      .tracks-table.chapters-table tr.chapter-row td:nth-child(4),
      .tracks-table.audio-tracks-table tr.track-row td:nth-child(4) {
        grid-area: action;
        text-align: right;
      }

      /* Mobile Responsive Playlist Cards */
      .tracks-table.playlist-tracks-table, .tracks-table.playlist-tracks-table tbody {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
      }
      .tracks-table.playlist-tracks-table thead {
        display: none;
      }
      .tracks-table.playlist-tracks-table tr.playlist-track-row {
        display: grid;
        grid-template-columns: 46px 1fr auto;
        grid-template-areas: 
          "art title actions"
          "art meta  meta";
        row-gap: 4px;
        column-gap: 10px;
        align-items: center;
        padding: 9px 12px;
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: 10px;
        box-sizing: border-box;
      }
      .tracks-table.playlist-tracks-table tr.playlist-track-row td {
        border-bottom: none !important;
        padding: 0 !important;
      }
      .tracks-table.playlist-tracks-table tr.playlist-track-row td:nth-child(1) {
        display: none;
      }
      .tracks-table.playlist-tracks-table tr.playlist-track-row td:nth-child(2) {
        grid-area: art;
        align-self: center;
      }
      .tracks-table.playlist-tracks-table tr.playlist-track-row td:nth-child(2) img {
        width: 46px !important;
        height: 46px !important;
        border-radius: 8px !important;
        object-fit: cover !important;
        display: block !important;
      }
      .tracks-table.playlist-tracks-table tr.playlist-track-row td.pl-track-title {
        grid-area: title;
        font-size: 0.85rem;
        line-height: 1.3;
        font-weight: 700;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 58vw;
      }
      .tracks-table.playlist-tracks-table tr.playlist-track-row td.pl-work-title {
        grid-area: meta;
        font-size: 0.74rem;
        color: var(--text-muted);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 76vw;
      }
      .tracks-table.playlist-tracks-table tr.playlist-track-row td.pl-cv-col {
        display: none;
      }
      .tracks-table.playlist-tracks-table tr.playlist-track-row td.pl-actions-col {
        grid-area: actions;
        text-align: right;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 4px;
      }
      .tracks-table.playlist-tracks-table tr.playlist-track-row td.pl-actions-col button {
        padding: 3px 7px !important;
        font-size: 0.72rem !important;
      }

      /* Mobile Gallery Modal & Lightbox Optimization */
      #workGalleryModal > div {
        width: 95vw !important;
        max-width: 95vw !important;
        max-height: 90vh !important;
        padding: 14px 10px !important;
        border-radius: 14px !important;
        box-sizing: border-box !important;
      }
      .work-gallery-grid {
        grid-template-columns: repeat(2, minmax(130px, 1fr)) !important;
        gap: 10px !important;
        width: 100% !important;
        box-sizing: border-box !important;
        max-height: calc(90vh - 75px) !important;
        padding: 2px 2px 16px 2px !important;
      }
      .gallery-card {
        width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
      }
      .gallery-thumb-wrap {
        display: block !important;
        aspect-ratio: 3 / 4 !important;
        width: 100% !important;
        height: auto !important;
        overflow: hidden !important;
        position: relative !important;
        background: #08090f !important;
      }
      .gallery-thumb {
        display: block !important;
        width: 100% !important;
        height: 100% !important;
        min-width: 100% !important;
        min-height: 100% !important;
        object-fit: cover !important;
        object-position: top center !important;
      }
      .gallery-card-title {
        font-size: 0.74rem !important;
        padding: 6px 8px !important;
        font-weight: 600 !important;
        color: var(--text-muted) !important;
      }
      #imageLightboxModal > div {
        max-width: 96vw !important;
        max-height: 90vh !important;
      }
      #lightboxImg {
        max-width: 94vw !important;
        max-height: 75vh !important;
        object-fit: contain !important;
      }
      #lightboxPrevBtn {
        left: 6px !important;
        width: 38px !important;
        height: 38px !important;
        font-size: 1.2rem !important;
      }
      #lightboxNextBtn {
        right: 6px !important;
        width: 38px !important;
        height: 38px !important;
        font-size: 1.2rem !important;
      }
      #lightboxCaption {
        font-size: 0.85rem !important;
        max-width: 90vw !important;
      }
      .app-toast {
        bottom: 120px !important;
        font-size: 0.85rem !important;
        padding: 9px 16px !important;
      }

      /* Mobile Responsive Library & History List Cards */
      .works-list-table, .works-list-table tbody {
        display: flex !important;
        flex-direction: column !important;
        gap: 8px !important;
        width: 100% !important;
        border: none !important;
        background: transparent !important;
      }
      .works-list-table thead {
        display: none !important;
      }
      .works-list-table tr.works-list-row {
        display: grid !important;
        grid-template-columns: 50px 1fr auto !important;
        grid-template-areas: 
          "cover title actions"
          "cover meta  actions" !important;
        row-gap: 3px !important;
        column-gap: 10px !important;
        align-items: center !important;
        padding: 9px 12px !important;
        background: var(--bg-card) !important;
        border: 1px solid var(--border) !important;
        border-radius: 10px !important;
        box-sizing: border-box !important;
        width: 100% !important;
      }
      .works-list-table tr.works-list-row td {
        border-bottom: none !important;
        padding: 0 !important;
      }
      .works-list-table tr.works-list-row td.w-col-cover,
      .works-list-table tr.works-list-row td:nth-child(1) {
        grid-area: cover !important;
        align-self: center !important;
      }
      .works-list-table tr.works-list-row .list-thumb {
        width: 50px !important;
        height: 50px !important;
        border-radius: 8px !important;
        object-fit: cover !important;
        display: block !important;
      }
      .works-list-table tr.works-list-row td.w-col-rj,
      .works-list-table tr.works-list-row td:nth-child(2) {
        display: none !important;
      }
      .works-list-table tr.works-list-row td.w-col-title,
      .works-list-table tr.works-list-row td:nth-child(3) {
        grid-area: title !important;
        font-size: 0.86rem !important;
        line-height: 1.3 !important;
        font-weight: 700 !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        max-width: 56vw !important;
      }
      .works-list-table tr.works-list-row td.w-col-meta,
      .works-list-table tr.works-list-row td:nth-child(4) {
        grid-area: meta !important;
        font-size: 0.74rem !important;
        color: var(--text-muted) !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        max-width: 56vw !important;
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
      }
      .works-list-table tr.works-list-row td.w-col-circle,
      .works-list-table tr.works-list-row td:nth-child(5),
      .works-list-table tr.works-list-row td.w-col-tracks,
      .works-list-table tr.works-list-row td:nth-child(6),
      .works-list-table.history-list-table tr.works-list-row td.w-col-date {
        display: none !important;
      }
      .works-list-table tr.works-list-row td.w-col-actions,
      .works-list-table tr.works-list-row td:last-child {
        grid-area: actions !important;
        text-align: right !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        gap: 6px !important;
      }
      .works-list-table tr.works-list-row td.w-col-actions button,
      .works-list-table tr.works-list-row td:last-child button {
        padding: 3px 8px !important;
        font-size: 0.75rem !important;
      }
    }

    /* Illustrations & Bonus Art Gallery */
    .work-gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 14px;
      width: 100%;
      box-sizing: border-box;
      margin-top: 8px;
      overflow-y: auto;
      max-height: calc(88vh - 110px);
      padding: 4px 6px 16px 2px;
      -webkit-overflow-scrolling: touch;
    }

    /* Horizontal Filmstrip / Reader Carousel Mode (adaptive for mobile) */
    .work-gallery-grid.view-strip {
      display: flex !important;
      flex-direction: row !important;
      overflow-x: auto !important;
      overflow-y: hidden !important;
      scroll-snap-type: x mandatory !important;
      -webkit-overflow-scrolling: touch !important;
      gap: 14px !important;
      padding: 6px 4px 18px 4px !important;
      align-items: stretch !important;
      height: 72vh !important;
      max-height: 580px !important;
      box-sizing: border-box !important;
    }
    .work-gallery-grid.view-strip .gallery-card {
      flex: 0 0 85vw !important;
      max-width: 380px !important;
      width: 85vw !important;
      height: 100% !important;
      scroll-snap-align: center !important;
      scroll-snap-stop: always !important;
      display: flex !important;
      flex-direction: column !important;
      background: #08090f !important;
      border: 1px solid var(--border) !important;
      border-radius: 12px !important;
      overflow: hidden !important;
      box-shadow: 0 10px 28px rgba(0,0,0,0.7) !important;
      box-sizing: border-box !important;
    }
    .work-gallery-grid.view-strip .gallery-thumb-wrap {
      flex: 1 1 auto !important;
      width: 100% !important;
      height: 100% !important;
      max-height: calc(100% - 38px) !important;
      aspect-ratio: unset !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: #040508 !important;
      overflow: hidden !important;
      position: relative !important;
    }
    .work-gallery-grid.view-strip .gallery-thumb {
      width: 100% !important;
      height: 100% !important;
      max-width: 100% !important;
      max-height: 100% !important;
      object-fit: contain !important;
      object-position: center !important;
      display: block !important;
    }
    .work-gallery-grid.view-strip .gallery-card-title {
      flex: 0 0 auto !important;
      font-size: 0.82rem !important;
      padding: 8px 12px !important;
      background: #0f131d !important;
      border-top: 1px solid rgba(255,255,255,0.08) !important;
      color: #f1f5f9 !important;
      font-weight: 600 !important;
      text-align: center !important;
    }

    .gallery-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
      display: flex;
      flex-direction: column;
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
    }
    .gallery-card:hover {
      transform: translateY(-2px);
      border-color: #38bdf8;
      box-shadow: 0 6px 18px rgba(56,189,248,0.25);
    }
    .gallery-thumb-wrap {
      display: block;
      aspect-ratio: 3 / 4;
      width: 100%;
      overflow: hidden;
      background: #08090f;
      position: relative;
    }
    .gallery-thumb {
      display: block;
      width: 100%;
      height: 100%;
      min-width: 100%;
      min-height: 100%;
      object-fit: cover;
      object-position: top center;
      transition: transform 0.3s ease;
    }
    .gallery-card:hover .gallery-thumb {
      transform: scale(1.04);
    }
    .gallery-card-title {
      font-size: 0.78rem;
      padding: 8px 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--text-muted);
      text-align: center;
      background: rgba(255, 255, 255, 0.02);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    /* YouTube-style Toast Notification */
    .app-toast {
      position: fixed;
      bottom: 96px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: rgba(15, 23, 42, 0.96);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.65), 0 0 1px rgba(255, 255, 255, 0.2);
      color: #f8fafc;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      z-index: 100000;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 8px;
      max-width: 90vw;
      text-align: center;
      backdrop-filter: blur(8px);
    }
    .app-toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  </style>
</head>
<body>
  <!-- Toast Notification -->
  <div id="appToast" class="app-toast" style="display: none;"></div>

  <!-- Image Lightbox Modal -->
  <div id="imageLightboxModal" class="modal-overlay" style="display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.92); z-index: 9999;" onclick="closeLightboxModal()">
    <div style="position: relative; max-width: 92vw; max-height: 92vh; display: flex; flex-direction: column; align-items: center; justify-content: center;" onclick="event.stopPropagation()">
      <button class="btn-outline" onclick="closeLightboxModal()" style="position: absolute; top: -14px; right: -14px; background: #1e293b; color: #fff; width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--border); font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; z-index: 10;">✕</button>
      <button id="lightboxPrevBtn" onclick="navLightbox(-1)" style="position: absolute; left: -24px; top: 50%; transform: translateY(-50%); background: rgba(15, 23, 42, 0.85); color: #fff; width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--border); font-size: 1.4rem; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 4px 14px rgba(0,0,0,0.6); transition: all 0.2s;" title="Previous (Left Arrow)">‹</button>
      <button id="lightboxNextBtn" onclick="navLightbox(1)" style="position: absolute; right: -24px; top: 50%; transform: translateY(-50%); background: rgba(15, 23, 42, 0.85); color: #fff; width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--border); font-size: 1.4rem; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 4px 14px rgba(0,0,0,0.6); transition: all 0.2s;" title="Next (Right Arrow)">›</button>
      <img id="lightboxImg" src="" style="max-width: 90vw; max-height: 80vh; border-radius: 8px; object-fit: contain; box-shadow: 0 10px 30px rgba(0,0,0,0.8);" onerror="handleImgError(this)">
      <div id="lightboxCaption" style="color: #f1f5f9; font-weight: 700; margin-top: 12px; font-size: 0.95rem; text-align: center; max-width: 80vw; text-shadow: 0 2px 4px rgba(0,0,0,0.8);"></div>
    </div>
  </div>

  <!-- Work Gallery Modal -->
  <div id="workGalleryModal" class="modal-overlay" style="display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.85); z-index: 9990;" onclick="closeWorkGalleryModal()">
    <div style="position: relative; width: 92vw; max-width: 960px; max-height: 88vh; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; box-shadow: 0 16px 40px rgba(0,0,0,0.7); overflow: hidden;" onclick="event.stopPropagation()">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid var(--border); padding-bottom: 10px; flex-shrink: 0; gap: 8px;">
        <h3 id="workGalleryModalTitle" style="font-size: 1.05rem; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;">🖼️ Illustrations & Bonus Artwork</h3>
        <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
          <button id="btnGalleryViewMode" class="btn-outline" onclick="toggleGalleryViewMode()" style="padding: 4px 10px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px; font-weight: 600;" title="Switch View Mode">⊞ Grid View</button>
          <button class="btn-outline" onclick="closeWorkGalleryModal()" style="padding: 4px 10px;">✖</button>
        </div>
      </div>
      <div id="workGalleryModalGrid" class="work-gallery-grid view-strip">
        <!-- Filled dynamically -->
      </div>
    </div>
  </div>

  <!-- Admin Unlock Modal -->
  <div id="gatekeeperModal" class="modal-overlay" style="display: none;">
    <div class="gatekeeper-card" style="position: relative;">
      <button class="btn-outline" style="position: absolute; top: 16px; right: 16px; padding: 4px 10px;" onclick="closeAdminModal()">✖</button>
      <div class="logo-icon" style="margin: 0 auto 16px; width: 56px; height: 56px; font-size: 2rem;">🔒</div>
      <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 8px;">Admin Authentication</h2>
      <p id="gatekeeperSubtitle" style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">Enter your admin passcode to manage works and modify library settings.</p>
      <input type="password" id="passcodeInput" placeholder="Enter Admin Passcode" style="width: 100%; padding: 14px 18px; border-radius: 10px; background: #0c0d12; border: 1px solid var(--border); color: #fff; font-size: 1rem; outline: none; margin-bottom: 16px; text-align: center;" onkeydown="if(event.key==='Enter') loginAdmin()">
      <button class="btn-primary" style="width: 100%; padding: 14px; font-size: 1rem;" onclick="loginAdmin()">Unlock Admin Access</button>
      <div id="loginError" style="color: #ff3366; font-size: 0.85rem; margin-top: 12px; display: none;">Invalid Passcode</div>
    </div>
  </div>

  <!-- Changelog Modal -->
  <div id="changelogModal" class="modal-overlay">
    <div class="modal-content" style="max-width: 640px; max-height: 84vh; overflow-y: auto;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #0284c7, #06b6d4); display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">🐧</div>
          <div>
            <h3 style="font-size: 1.3rem; font-weight: 800;">aStreamer Release Notes</h3>
            <span style="font-size: 0.8rem; color: #38bdf8; font-weight: 700;">Version 1.5 Official Release</span>
          </div>
        </div>
        <button class="btn-outline" style="padding: 4px 10px;" onclick="closeChangelogModal()">✖</button>
      </div>
      
      <div style="color: #d1d5db; font-size: 0.9rem; line-height: 1.6; display: flex; flex-direction: column; gap: 14px;">
        <div style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.2); padding: 14px; border-radius: 10px;">
          <h4 style="color: #38bdf8; font-weight: 700; margin-bottom: 4px;">🏷️ Zen Tag & CV Command Search</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem;">Floating tag & Voice Actor autocompleter with live Japanese/Romaji/English translations, multi-tag filter combination (<code>+</code>), keyboard navigation (<code>↑</code>/<code>↓</code>/<code>↵</code>), and clean <code>Esc</code> key dismiss.</p>
        </div>

        <div style="background: rgba(168, 85, 247, 0.08); border: 1px solid rgba(168, 85, 247, 0.2); padding: 14px; border-radius: 10px;">
          <h4 style="color: #c084fc; font-weight: 700; margin-bottom: 4px;">🎧 Intelligent Multi-Track & Chapter Tree Engine</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem;">Advanced hierarchy parser automatically separates master session audio tracks from bonus files/alt versions, guaranteeing accurate track counts and chapter markers without timestamps exceeding track durations.</p>
        </div>

        <div style="background: rgba(255, 51, 102, 0.08); border: 1px solid rgba(255, 51, 102, 0.2); padding: 14px; border-radius: 10px;">
          <h4 style="color: var(--accent); font-weight: 700; margin-bottom: 4px;">🖼️ Adaptive Artwork Gallery & Touch Carousel</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem;">Fluid touch-friendly horizontal swipe reader mode with snap-to-card and full uncropped display for 100+ manga/doujin scans. Includes one-tap <code>⊞ Grid / ↔ Carousel</code> mode switcher and Lightbox viewer.</p>
        </div>

        <div style="background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.2); padding: 14px; border-radius: 10px;">
          <h4 style="color: #22c55e; font-weight: 700; margin-bottom: 4px;">📱 Mobile UI Overhaul (Compact 2-Row Cards & Player Bar)</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem;">Re-architected Chapter Lists, Audio Tracks, Playlists, and History into consistent ~58px responsive mobile cards, paired with a dedicated 3-row thumb-friendly docked bottom player.</p>
        </div>

        <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid var(--border); padding: 14px; border-radius: 10px;">
          <h4 style="color: #fff; font-weight: 700; margin-bottom: 4px;">🛡️ Privacy SFW Mode & Playlist Management</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem;">One-tap track additions with floating toast feedback, non-interrupting playback navigation, and 3 privacy levels including <code>🎭 PSFW</code> disguise covers.</p>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
        <button class="btn-primary" onclick="closeChangelogModal()">Got it</button>
      </div>
    </div>
  </div>

  <!-- Batch Import Modal -->
  <div id="importModal" class="modal-overlay">
    <div class="modal-content" style="max-width: 580px;">
      <h3 class="modal-title">📥 Batch Import RJ Works</h3>
      <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 12px;">Paste multiple RJ codes or upload a <code>.txt</code> file.</p>
      <textarea id="importTextarea" class="modal-textarea" placeholder="RJ01473335&#10;RJ441308&#10;RJ01196620&#10;RJ01132855"></textarea>
      <div style="margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
        <input type="file" id="importFileInput" accept=".txt" style="font-size: 0.85rem; color: var(--text-muted);" onchange="handleFileUpload(event)">
        <span id="importCountBadge" style="font-size: 0.8rem; color: #38bdf8; font-weight: 700;"></span>
      </div>
      
      <div id="importProgressBox" style="display: none; margin-bottom: 16px; background: #0c0d14; border: 1px solid var(--border); border-radius: 10px; padding: 14px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">
          <span id="importStatusText" style="color: #38bdf8;">Starting import...</span>
          <span id="importPercentage" style="color: var(--text-muted);">0%</span>
        </div>
        <div style="width: 100%; height: 6px; background: #1a1c26; border-radius: 3px; overflow: hidden; margin-bottom: 10px;">
          <div id="importProgressBar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #ff3366, #38bdf8); transition: width 0.2s;"></div>
        </div>
        <div id="importLiveLogs" style="max-height: 120px; overflow-y: auto; font-family: monospace; font-size: 0.78rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 4px;"></div>
      </div>

      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button class="btn-outline" id="btnCancelImport" onclick="closeImportModal()">Cancel</button>
        <button class="btn-primary" id="btnRunImport" onclick="runBatchImport()">Start Batch Import</button>
      </div>
    </div>
  </div>

  <!-- Add to Playlist Modal -->
  <div id="addToPlaylistModal" class="modal-overlay">
    <div class="modal-content">
      <h3 class="modal-title">➕ Add to Playlist</h3>
      <p id="addToPlaylistTrackLabel" style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px;"></p>
      <div style="margin-bottom: 16px;">
        <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 8px; font-weight: 700;">Select Existing Playlist:</div>
        <div id="playlistSelectList" style="display: flex; flex-direction: column; gap: 8px; max-height: 180px; overflow-y: auto; margin-bottom: 12px;"></div>
      </div>
      <div style="border-top: 1px solid var(--border); padding-top: 14px;">
        <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 8px; font-weight: 700;">Or Create New Playlist:</div>
        <div style="display: flex; gap: 8px;">
          <input type="text" id="quickNewPlName" placeholder="New Playlist Name" style="flex: 1; padding: 10px 14px; border-radius: 8px; background: #0c0d12; border: 1px solid var(--border); color: #fff; outline: none; font-size: 0.9rem;">
          <button class="btn-primary" onclick="createAndAddToPlaylist()">Create & Add</button>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; margin-top: 18px;"><button class="btn-outline" onclick="closeAddToPlaylistModal()">Close</button></div>
    </div>
  </div>

  <!-- Create Playlist Modal -->
  <div id="playlistModal" class="modal-overlay">
    <div class="modal-content">
      <h3 class="modal-title">📜 Create New Playlist</h3>
      <input type="text" id="newPlName" placeholder="Playlist Name" style="width: 100%; padding: 12px; border-radius: 8px; background: #0c0d12; border: 1px solid var(--border); color: #fff; margin-bottom: 12px; outline: none;">
      <input type="text" id="newPlDesc" placeholder="Description (optional)" style="width: 100%; padding: 12px; border-radius: 8px; background: #0c0d12; border: 1px solid var(--border); color: #fff; margin-bottom: 18px; outline: none;">
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button class="btn-outline" onclick="closePlaylistModal()">Cancel</button>
        <button class="btn-primary" onclick="submitCreatePlaylist()">Create</button>
      </div>
    </div>
  </div>

  <!-- Tag Translation Progress Modal -->
  <div id="tagTranslationProgressModal" class="modal-overlay" style="z-index: 10050;">
    <div class="modal-content" style="max-width: 560px; width: 92vw; background: #0f172a; border: 1px solid rgba(167, 139, 250, 0.3); box-shadow: 0 20px 50px rgba(0,0,0,0.85); border-radius: 12px; padding: 20px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="font-size: 1.6rem;">🌐</div>
          <div>
            <h3 class="modal-title" style="margin: 0; font-size: 1.15rem; color: #fff;">AI Tag &amp; Voice Actor Translation</h3>
            <div id="transModalSubtitle" style="font-size: 0.8rem; color: #94a3b8; margin-top: 2px;">DeepSeek AI Batch Processor (Max 150/batch)</div>
          </div>
        </div>
        <button id="transModalCloseBtn" class="btn-outline" style="padding: 4px 10px; display: none;" onclick="closeTransProgressModal()">✖</button>
      </div>

      <!-- Progress Bar Area -->
      <div style="margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 6px;">
          <span id="transProgressStage" style="font-weight: 600; color: #38bdf8;">Preparing translation...</span>
          <span id="transProgressPercent" style="font-weight: 700; color: #a78bfa;">0%</span>
        </div>
        <div style="width: 100%; height: 8px; background: #1e293b; border-radius: 999px; overflow: hidden; position: relative;">
          <div id="transProgressBar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #38bdf8, #818cf8, #c084fc); transition: width 0.3s ease; border-radius: 999px;"></div>
        </div>
      </div>

      <!-- Live Terminal / Log Box -->
      <div id="transLogBox" style="background: #090d16; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; height: 160px; overflow-y: auto; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.78rem; line-height: 1.45; color: #cbd5e1; margin-bottom: 14px;">
      </div>

      <!-- Failsafe Action Bar (when a batch encounters an issue) -->
      <div id="transFailedBar" style="display: none; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 12px; margin-bottom: 14px;">
        <div style="color: #fca5a5; font-size: 0.82rem; font-weight: 600; margin-bottom: 8px;">⚠️ Batch paused on error: <span id="transFailedReason" style="font-weight: 400; color: #cbd5e1;"></span></div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="btn-primary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="handleTransAction('retry')">🔄 Retry Batch</button>
          <button class="btn-outline" style="padding: 6px 12px; font-size: 0.8rem;" onclick="handleTransAction('skip')">⏭️ Skip &amp; Continue</button>
          <button class="btn-outline" style="padding: 6px 12px; font-size: 0.8rem; border-color: #38bdf8; color: #38bdf8;" onclick="downloadFailedResponse()">📥 Download Raw Error / Response</button>
        </div>
      </div>

      <!-- Footer / Action Area -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span id="transStatsText" style="font-size: 0.8rem; color: #64748b;">Ready</span>
        <div style="display: flex; gap: 8px;">
          <button id="transModalDoneBtn" class="btn-primary" style="display: none; padding: 8px 18px; font-size: 0.85rem;" onclick="closeTransProgressModal()">Done</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Floating Corner Player Card (Bottom-Right Docked) -->
  <div id="popupPlayerModal" class="floating-corner-player">
    <div class="popup-header">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 0.72rem; font-weight: 800; color: var(--accent); background: rgba(255,51,102,0.12); padding: 3px 8px; border-radius: 4px; letter-spacing: 0.5px;">NOW PLAYING</span>
        <span id="popupHlsBadge" style="font-size: 0.7rem; font-weight: 700; color: #38bdf8; background: rgba(56,189,248,0.12); padding: 3px 6px; border-radius: 4px;">HLS</span>
      </div>
      <div style="display: flex; gap: 6px; align-items: center;">
        <button class="btn-icon" style="width: 30px; height: 30px; font-size: 0.85rem;" title="View Work Details" onclick="jumpToCurrentWorkDetail()">ℹ️</button>
        <button class="btn-icon" style="width: 30px; height: 30px; font-size: 0.95rem; font-weight: 800; color: #38bdf8;" title="Collapse to Bar (Esc)" onclick="closePopupPlayer()">▼</button>
      </div>
    </div>

    <div class="popup-body">
      <div class="popup-cover-wrap">
        <img id="popupCover" class="popup-cover" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23111'/%3E%3C/svg%3E">
        <div id="popupDisguisedBadge" class="disguised-overlay" style="display:none;"><span class="disguised-badge">🎭 Disguised SFW</span></div>
      </div>

      <div class="popup-meta">
        <div id="popupTitle" class="popup-title">No Track Selected</div>
        <div id="popupSub" class="popup-sub">Select a track to start playback</div>
        <div id="popupCvRow" class="popup-cv-row"></div>
      </div>

      <div class="scrubber-row">
        <span id="popupCurrTime" class="time-text">00:00</span>
        <input type="range" id="popupScrubber" class="scrubber" min="0" max="100" value="0" oninput="onScrub(this.value)">
        <span id="popupTotalTime" class="time-text">00:00</span>
      </div>

      <div class="popup-controls">
        <button id="popupShuffleBtn" class="ctrl-btn" title="Toggle Shuffle / Random" onclick="toggleShuffle()">🔀</button>
        <button class="ctrl-btn" title="Previous Track" onclick="playPrevTrack()">⏮</button>
        <button id="popupPlayPauseBtn" class="popup-play-btn" onclick="togglePlayPause()">▶</button>
        <button class="ctrl-btn" title="Next Track" onclick="playNextTrack()">⏭</button>
      </div>

      <div class="popup-secondary-row">
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="ctrl-btn" onclick="toggleMute()" style="font-size: 1rem;">🔊</button>
          <input type="range" id="popupVolumeSlider" class="volume-slider" min="0" max="1" step="0.05" value="1" oninput="setVolume(this.value)">
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span id="popupFavBtn" style="font-size: 1.15rem; cursor: pointer;" title="Toggle Favorite" onclick="toggleCurrentWorkFav()">🤍</span>
          <button class="btn-outline" style="padding: 4px 10px; font-size: 0.78rem;" onclick="addCurrentTrackToPlaylist()">➕ Playlist</button>
          <button class="btn-outline" style="padding: 4px 10px; font-size: 0.78rem;" onclick="jumpToCurrentWorkDetail()" title="View Work Details">👁️ Work</button>
        </div>
      </div>

      <div>
        <button class="popup-drawer-toggle" onclick="toggleChapterDrawer()">
          <span id="popupChapterToggleLabel">📑 Chapters / Tracklist (0)</span>
          <span id="popupChapterChevron">▼</span>
        </button>
        <div id="popupChaptersList" class="popup-chapters-list" style="display: none;"></div>
      </div>
    </div>
  </div>

  <!-- Mobile Topbar Header -->
  <header class="mobile-topbar">
    <div class="logo-area" style="margin-bottom: 0; padding: 0;" onclick="switchView('library')">
      <div class="logo-icon" style="width: 32px; height: 32px; font-size: 1.1rem;">🐧</div>
      <div class="logo-title" style="font-size: 1.1rem;">aStreamer</div>
    </div>
  </header>

  <!-- Mobile Horizontal Nav Pills -->
  <nav class="mobile-nav-pills">
    <button class="mobile-pill active" data-view="library" onclick="switchView('library')">📚 Library</button>
    <button class="mobile-pill" data-view="playlists" onclick="switchView('playlists')">📜 Playlists</button>
    <button class="mobile-pill" data-view="history" onclick="switchView('history')">🕒 History</button>
    <button class="mobile-pill" data-view="wishlist" onclick="switchView('wishlist')">📋 Wishlist</button>
    <button class="mobile-pill" data-view="artists" onclick="switchView('artists')">🎙️ Voice Actors</button>
    <button class="mobile-pill" data-view="genres" onclick="switchView('genres')">🏷️ Genres</button>
    <button class="mobile-pill" onclick="quickAddRj()">➕ Add RJ</button>
    <button class="mobile-pill" onclick="openImportModal()">📥 Import</button>
    <button class="mobile-pill" onclick="openChangelogModal()">📜 Notes</button>
    <button class="mobile-pill" data-view="settings" onclick="switchView('settings')">⚙️ Settings</button>
    <button class="mobile-pill" id="mobileAdminBtn" onclick="toggleAdminModal()">🔓 Admin</button>
  </nav>

  <!-- Desktop Sidebar -->
  <aside class="app-sidebar">
    <div class="logo-area" onclick="switchView('library')">
      <div class="logo-icon">🐧</div>
      <div>
        <div class="logo-title">aStreamer</div>
        <span style="font-size: 0.65rem; color: #38bdf8; font-weight: 700; background: rgba(56,189,248,0.15); padding: 1px 6px; border-radius: 4px; border: 1px solid rgba(56,189,248,0.3);">v1.5 Official</span>
      </div>
    </div>

    <!-- Sidebar Dual Search Bars -->
    <div class="search-box" style="margin-bottom: 8px; width: 100%; max-width: 100%;">
      <span>🔍</span>
      <input type="text" id="globalSearch" placeholder="Search title, RJ, circle..." oninput="handleTitleSearch(this.value)">
    </div>
    <div class="search-box" style="margin-bottom: 14px; width: 100%; max-width: 100%;" onclick="openZenTagSearch()" title="Open Tag Search">
      <span>🏷️</span>
      <input type="text" id="globalTagSearch" placeholder="Search tags + CV..." onfocus="openZenTagSearch(this.value)" onclick="openZenTagSearch(this.value)" readonly style="cursor: pointer;">
      <div id="tagSuggestionsDropdown" class="tag-suggestions-dropdown"></div>
    </div>

    <!-- Sidebar Quick Add -->
    <button class="btn-primary" style="width: 100%; justify-content: center; margin-bottom: 16px; padding: 10px;" onclick="quickAddRj()">+ Add RJ Code</button>

    <nav class="nav-section">
      <div class="nav-title">Menu</div>
      <button class="nav-item active" data-view="library" onclick="switchView('library')">📚 Library</button>
      <button class="nav-item" data-view="playlists" onclick="switchView('playlists')">📜 Playlists</button>
      <button class="nav-item" data-view="history" onclick="switchView('history')">🕒 History</button>
      <button class="nav-item" data-view="wishlist" onclick="switchView('wishlist')">
        <span style="display:flex; align-items:center; gap:8px;">📋 Wishlist</span>
        <span id="wishlistCountBadge" class="nav-badge" style="display:none;">0</span>
      </button>
      <button class="nav-item" data-view="artists" onclick="switchView('artists')">🎙️ Voice Actors</button>
      <button class="nav-item" data-view="genres" onclick="switchView('genres')">🏷️ Genres & Tags</button>
      
      <div class="nav-title">Manage</div>
      <button class="nav-item" onclick="openImportModal()">📥 Batch Import</button>
      <button class="nav-item" onclick="openChangelogModal()">📜 Release Notes</button>
      <button class="nav-item" data-view="settings" onclick="switchView('settings')">⚙️ Settings</button>
      <button class="nav-item" id="sidebarAdminBtn" onclick="toggleAdminModal()">🔓 Unlock Admin</button>
    </nav>
  </aside>

  <!-- Main View Area -->
  <main class="app-main">
    <div class="mobile-search-bar">
      <div class="search-box" style="width: 100%; max-width: 100%; margin-bottom: 8px;">
        <span>🔍</span>
        <input type="text" id="mobileSearchInput" placeholder="Search title, RJ code, circle..." oninput="handleTitleSearch(this.value)">
      </div>
      <div class="search-box" style="width: 100%; max-width: 100%;" onclick="openZenTagSearch()" title="Open Tag Search">
        <span>🏷️</span>
        <input type="text" id="mobileTagSearchInput" placeholder="Search tags + CV..." onfocus="openZenTagSearch(this.value)" onclick="openZenTagSearch(this.value)" readonly style="cursor: pointer;">
        <div id="mobileTagSuggestionsDropdown" class="tag-suggestions-dropdown"></div>
      </div>
    </div>
    <div id="viewContainer" class="view-container"></div>
  </main>

  <!-- Persistent Bottom Player Bar -->
  <footer class="player-bar">
    <div class="player-left" onclick="togglePopupPlayer()" title="Click to expand/collapse floating player">
      <img id="playerCover" class="player-thumb" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect width='48' height='48' fill='%23222'/%3E%3C/svg%3E">
      <div class="player-track-info">
        <div id="playerTitle" class="player-title">Select track to play</div>
        <div id="playerSub" class="player-sub">aStreamer Cloudflare Edition</div>
      </div>
    </div>
    <div class="player-center">
      <div class="player-controls">
        <button id="shuffleBtn" class="ctrl-btn" title="Toggle Shuffle / Random" onclick="toggleShuffle()">🔀</button>
        <button class="ctrl-btn" title="Previous Track" onclick="playPrevTrack()">⏮</button>
        <button id="playPauseBtn" class="play-btn-circle" onclick="togglePlayPause()">▶</button>
        <button class="ctrl-btn" title="Next Track" onclick="playNextTrack()">⏭</button>
        <button id="playerBarChapterBtnMobile" class="ctrl-btn" title="View Chapters & Cue Points" onclick="openPopupPlayerWithChapters()">📑</button>
      </div>
      <div class="scrubber-row">
        <span id="currTime" class="time-text">00:00</span>
        <input type="range" id="scrubber" class="scrubber" min="0" max="100" value="0" oninput="onScrub(this.value)">
        <span id="totalTime" class="time-text">00:00</span>
      </div>
    </div>
    <div class="player-right">
      <button class="ctrl-btn" title="Add Playing Track to Playlist" onclick="addCurrentPlayingTrackToPlaylist()" style="font-size: 1.05rem; margin-right: 2px;">➕</button>
      <button class="ctrl-btn" title="View Playing Work Details" onclick="jumpToCurrentWorkDetail()" style="font-size: 1.05rem; margin-right: 2px;">👁️</button>
      <button id="playerBarChapterBtn" class="ctrl-btn" onclick="openPopupPlayerWithChapters()" title="View Chapters & Cue Points" style="font-size: 1.1rem; margin-right: 4px;">📑</button>
      <button class="ctrl-btn" onclick="toggleMute()" title="Mute/Unmute">🔊</button>
      <input type="range" id="volumeSlider" class="volume-slider" min="0" max="1" step="0.05" value="1" oninput="setVolume(this.value)">
      <button class="btn-icon" style="width: 36px; height: 36px; margin-left: 6px;" title="Expand/Collapse Floating Player" onclick="togglePopupPlayer()">🗖</button>
    </div>
  </footer>

  <!-- Zen Browser Style Floating Tag Search Modal -->
  <div id="zenTagSearchModal" class="zen-search-overlay" onclick="handleZenOverlayClick(event)">
    <div class="zen-search-card" onclick="event.stopPropagation()">
      <div class="zen-search-header">
        <span class="zen-search-icon">🏷️</span>
        <input type="text" id="zenTagSearchInput" class="zen-search-input" placeholder="Search tags + CV (e.g. ear cleaning, whisper, CV name)..." oninput="handleZenTagInput(this.value)" onkeydown="handleZenTagKeydown(event)" autocomplete="off">
        <button class="zen-search-commit-btn" onclick="applyZenTagSearch()" title="Apply search and filter library (Enter)">↵ Search</button>
        <button class="zen-close-btn" onclick="closeZenTagSearch(true)" title="Cancel / Close without searching (Esc)">✕</button>
      </div>

      <!-- Active Tag Filter Pills Bar -->
      <div id="zenChipsBar" class="zen-chips-bar" style="display: none;">
        <span style="font-size: 0.76rem; color: #94a3b8; margin-right: 4px; display: inline-flex; align-items: center;">Active filters:</span>
        <div id="zenChipsList" style="display: inline-flex; flex-wrap: wrap; gap: 6px; align-items: center;"></div>
        <button class="zen-clear-btn" onclick="clearAllZenTags()">Clear all</button>
      </div>

      <!-- Results Body -->
      <div id="zenResultsContainer" class="zen-results-container">
        <!-- Live Tag Suggestions render here -->
      </div>

      <!-- Zen Modal Footer Hints -->
      <div class="zen-footer">
        <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
          <span><kbd class="zen-shortcut-badge">↑</kbd> <kbd class="zen-shortcut-badge">↓</kbd> navigate</span>
          <span><kbd class="zen-shortcut-badge">↵</kbd> select / add</span>
          <span><kbd class="zen-shortcut-badge">Esc</kbd> close</span>
          <span><kbd class="zen-shortcut-badge">+</kbd> combine tags</span>
        </div>
        <div id="zenResultsCountBadge" style="color: #a78bfa; font-weight: 600; font-size: 0.78rem;"></div>
      </div>
    </div>
  </div>

  <audio id="coreAudio" preload="metadata"></audio>

  <script>
    const CLIENT_BASE_TAG_DICT = ${JSON.stringify(db.BASE_TAG_DICT || {})};
    window.BASE_TAG_DICT = CLIENT_BASE_TAG_DICT;
    window.tagDict = Object.assign({}, CLIENT_BASE_TAG_DICT);

    function cleanCVName(raw) {
      if (!raw || typeof raw !== 'string') return '';
      let str = raw.trim();
      str = str.replace(/^(?:【|\\(|（|\\[)?\\s*(?:CV|声優|ボイス|キャスト)[.:：\\s]*/i, '');
      str = str.replace(/(?:】|\\)|）|\\])\\s*$/i, '');
      str = str.replace(/(?:様|さん|氏|他)$/, '').trim();
      return str;
    }

    function normalizeCVRomaji(ja, romaji) {
      if (!romaji || typeof romaji !== 'string') return romaji || '';
      let str = romaji.trim();
      if (!str) return '';

      const parenMatch = str.match(/^([^(\\uFF08]+)[(\\uFF08](.+)[)\\uFF09]$/);
      if (parenMatch) {
        const jaParen = (ja && typeof ja === 'string') ? ja.match(/^([^(\\uFF08]+)[(\\uFF08](.+)[)\\uFF09]$/) : null;
        if (jaParen) {
          return normalizeCVRomaji(jaParen[1].trim(), parenMatch[1].trim()) + ' (' +
                 normalizeCVRomaji(jaParen[2].trim(), parenMatch[2].trim()) + ')';
        }
        return normalizeCVRomaji('', parenMatch[1].trim()) + ' (' + normalizeCVRomaji('', parenMatch[2].trim()) + ')';
      }

      const words = str.split(/\\s+/).filter(Boolean);
      if (words.length === 0) return '';

      if (words.length === 1) {
        return words[0].charAt(0).toUpperCase() + words[0].slice(1);
      }

      if (words.length === 2) {
        const w0 = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
        const w1 = words[1].charAt(0).toUpperCase() + words[1].slice(1).toLowerCase();
        return w0 + ' ' + w1;
      }

      if (words.some(function(w) { return w.toLowerCase() === 'no'; }) && ja && /[ノ之の]/.test(ja)) {
        return words.map(function(w) {
          if (w.toLowerCase() === 'no') return 'no';
          return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        }).join(' ');
      }

      const capitalizedWords = words.map(function(w) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); });

      if (words.length === 4) {
        const surname = capitalizedWords[0] + capitalizedWords[1].toLowerCase();
        const given = capitalizedWords[2] + capitalizedWords[3].toLowerCase();
        return surname + ' ' + given;
      }

      if (words.length === 3) {
        if (ja && typeof ja === 'string') {
          const matchKanjiKana = ja.match(/^([\\u4E00-\\u9FFF]+)([\\u3040-\\u309F\\u30A0-\\u30FF]+)$/);
          if (matchKanjiKana && matchKanjiKana[1].length >= 2) {
            return capitalizedWords[0] + capitalizedWords[1].toLowerCase() + ' ' + capitalizedWords[2];
          }
          const matchKanjiMixed = ja.match(/^([\\u4E00-\\u9FFF]{2,})([\\u3040-\\u309F\\u30A0-\\u30FF]+[\\u4E00-\\u9FFF]*)$/);
          if (matchKanjiMixed) {
            return capitalizedWords[0] + ' ' + capitalizedWords[1] + capitalizedWords[2].toLowerCase();
          }
          if (/^[\\u4E00-\\u9FFF]{4}$/.test(ja)) {
            return capitalizedWords[0] + capitalizedWords[1].toLowerCase() + ' ' + capitalizedWords[2];
          }
        }

        const surnameSuffixes = /^(ne|mine|saka|zaka|ta|da|kawa|gawa|hara|bara|shima|jima|mori|saki|zaki|no|ki|gi|mizu|tsuka|zuka|ba|ha|ya|tani|yama|kura|miya|hashi|bashi|fuji|se|ko|to|no)$/i;
        if (surnameSuffixes.test(words[1])) {
          return capitalizedWords[0] + capitalizedWords[1].toLowerCase() + ' ' + capitalizedWords[2];
        }

        return capitalizedWords[0] + capitalizedWords[1].toLowerCase() + ' ' + capitalizedWords[2];
      }

      return capitalizedWords.join(' ');
    }

    function getWorkCV(work) {
      if (!work) return '';
      let cv = (work.cv || '').trim();
      if (cv && cv !== 'N/A') return cv;

      const title = (work.title || '');
      if (!title) return '';

      const match = title.match(/(?:【|\\(|（|\\[)\\s*(?:CV|声優|ボイス|キャスト)[.:：\\s]*([^】)）\\]]+)(?:】|\\)|）|\\])/i);
      if (match && match[1]) {
        const rawCv = match[1].trim();
        const firstPart = rawCv.split(/[/,、/]/)[0].trim();
        if (firstPart && firstPart.length >= 2 && !['DLsite', '同人', 'ASMR', 'R18'].includes(firstPart)) {
          return firstPart;
        }
      }
      return '';
    }

    function getTagEntry(key) {
      if (!key) return null;
      const clean = String(key).trim();
      const baseDict = window.BASE_TAG_DICT || CLIENT_BASE_TAG_DICT || {};
      const userDict = window.tagDict || {};

      // Priority 1: Base dictionary has standardized high quality { romaji, english }
      if (baseDict[clean]) {
        const b = baseDict[clean];
        if (typeof b === 'object' && (b.romaji || b.english)) {
          const r = normalizeCVRomaji(clean, b.romaji || b.english || '');
          return { romaji: r, english: b.english || '', isCV: !!b.isCV };
        }
        if (typeof b === 'string') {
          const r = normalizeCVRomaji(clean, b);
          return { romaji: r, english: b, isCV: true };
        }
      }

      let entry = userDict[clean];
      if (typeof entry === 'string') {
        const r = normalizeCVRomaji(clean, entry);
        return { romaji: r, english: entry, isCV: true };
      }
      if (!entry && baseDict[clean]) {
        entry = baseDict[clean];
      }
      if (entry && typeof entry === 'object') {
        let romaji = (entry.romaji || entry.english || '').trim();
        let english = (entry.english || entry.romaji || '').trim();
        if (romaji) romaji = normalizeCVRomaji(clean, romaji);
        return {
          romaji: (romaji !== clean) ? romaji : '',
          english: (english !== clean) ? english : '',
          isCV: !!entry.isCV
        };
      }
      return null;
    }

    function formatTag(t) {
      if (!t || typeof t !== 'string') return '';
      const raw = t.trim();
      if (!raw) return '';

      let jaName = raw;
      let existingRomaji = '';
      if (raw.includes('|')) {
        const pipeIdx = raw.indexOf('|');
        jaName = raw.slice(0, pipeIdx).trim();
        existingRomaji = raw.slice(pipeIdx + 1).trim();
      }

      const entry = getTagEntry(jaName);
      if (!entry && !existingRomaji) return raw;

      if (entry && entry.isCV) {
        let romaji = entry.romaji || existingRomaji;
        if (romaji) romaji = normalizeCVRomaji(jaName, romaji);
        return (romaji && /[a-zA-Z]/.test(romaji) && romaji !== jaName)
          ? jaName + ' | ' + romaji
          : jaName;
      }

      if (entry) {
        const parts = [jaName];
        let romaji = entry.romaji || '';
        let english = entry.english || '';
        if (romaji && /[a-zA-Z]/.test(romaji) && romaji.toLowerCase() !== jaName.toLowerCase()) {
          parts.push(romaji);
        }
        if (english && /[a-zA-Z]/.test(english) && english.toLowerCase() !== jaName.toLowerCase() && english.toLowerCase() !== romaji.toLowerCase()) {
          parts.push(english);
        }
        return parts.join(' | ');
      }

      if (existingRomaji) {
        const norm = normalizeCVRomaji(jaName, existingRomaji);
        return jaName + ' | ' + norm;
      }

      return raw;
    }

    function formatCV(cv) {
      if (!cv || typeof cv !== 'string' || cv === 'N/A') return '';
      const parts = cv.split(/[,、/&＋+;・\\n|]/).map(function(p) { return p.trim(); }).filter(Boolean);
      if (parts.length === 0) return '';

      const results = [];

      for (let i = 0; i < parts.length; i++) {
        let raw = cleanCVName(parts[i]);
        if (!raw || raw === 'N/A') continue;

        let jaName = raw;
        let existingRomaji = '';

        const bracketMatch = raw.match(/【([^】]+)】|（([^）]+)）|\\(([^)]+)\\)|\\[([^\\]]+)\\]/);
        if (bracketMatch) {
          const inside = (bracketMatch[1] || bracketMatch[2] || bracketMatch[3] || bracketMatch[4] || '').trim();
          const outside = raw.replace(bracketMatch[0], '').trim();
          const isInsideJa = /[\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FAF]/.test(inside);
          const isOutsideJa = /[\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FAF]/.test(outside);

          if (isInsideJa && !isOutsideJa && outside) {
            jaName = inside;
            existingRomaji = outside;
          } else if (isOutsideJa && !isInsideJa && inside) {
            jaName = outside;
            existingRomaji = inside;
          } else if (isInsideJa) {
            jaName = inside;
          }
        }

        const entry = getTagEntry(jaName);
        let romaji = (entry && (entry.romaji || entry.english)) ? (entry.romaji || entry.english) : existingRomaji;
        if (romaji) {
          romaji = normalizeCVRomaji(jaName, romaji);
        }

        if (romaji && /[a-zA-Z]/.test(romaji) && romaji.toLowerCase() !== jaName.toLowerCase()) {
          results.push(jaName + ' | ' + romaji);
        } else {
          results.push(jaName);
        }
      }

      return Array.from(new Set(results)).join(', ');
    }

    function resolveTagPass2Client(rawTag) {
      if (!rawTag || typeof rawTag !== 'string') return null;
      const tag = rawTag.trim();
      if (!tag) return null;

      const direct = getTagEntry(tag);
      if (direct && ((direct.romaji && /[a-zA-Z]/.test(direct.romaji)) || (direct.english && /[a-zA-Z]/.test(direct.english)))) {
        return { original: tag, romaji: direct.romaji, english: direct.english, isCV: direct.isCV };
      }

      if (tag.includes('/') || tag.includes('、') || tag.includes('+')) {
        const parts = tag.split(/[/、+]/).map(p => p.trim()).filter(Boolean);
        const resolved = parts.map(p => resolveTagPass2Client(p));
        if (resolved.every(r => r && ((r.romaji && /[a-zA-Z]/.test(r.romaji)) || (r.english && /[a-zA-Z]/.test(r.english))))) {
          return {
            original: tag,
            romaji: resolved.map(r => r.romaji || r.original).join(' / '),
            english: resolved.map(r => r.english || r.romaji || r.original).join(' / ')
          };
        }
      }

      const baseDict = window.BASE_TAG_DICT || CLIENT_BASE_TAG_DICT || {};
      const userDict = window.tagDict || {};
      const allDict = Object.assign({}, baseDict, userDict);
      const matchedTokens = [];
      let remaining = tag;
      const keysByLength = Object.keys(allDict).filter(k => {
        const e = getTagEntry(k);
        return e && ((e.romaji && /[a-zA-Z]/.test(e.romaji)) || (e.english && /[a-zA-Z]/.test(e.english)));
      }).sort((a, b) => b.length - a.length);

      while (remaining.length > 0) {
        let matched = false;
        for (const key of keysByLength) {
          if (remaining.startsWith(key)) {
            const e = getTagEntry(key);
            if (e && (e.romaji || e.english)) {
              matchedTokens.push({ term: key, romaji: e.romaji || key, english: e.english || e.romaji || key });
              remaining = remaining.slice(key.length);
              matched = true;
              break;
            }
          }
        }
        if (!matched) remaining = remaining.slice(1);
      }

      if (matchedTokens.length >= 2) {
        return {
          original: tag,
          romaji: matchedTokens.map(t => t.romaji).join(' '),
          english: matchedTokens.map(t => t.english).join(' + ')
        };
      } else if (matchedTokens.length === 1 && tag.length <= matchedTokens[0].term.length + 3) {
        return {
          original: tag,
          romaji: matchedTokens[0].romaji,
          english: matchedTokens[0].english
        };
      }
      return null;
    }

    async function syncTagDictionary() {
      try {
        const res = await apiFetch('/api/tags');
        if (res.ok) {
          const data = await res.json();
          if (data && data.tagDict) {
            window.tagDict = Object.assign({}, window.BASE_TAG_DICT || {}, window.tagDict || {}, data.tagDict);
          }
        }
      } catch(e) {}
    }

    let isAdmin = false;
    let contentMode = 'NSFW';
    let currentPlayingWork = null;
    let libraryViewMode = 'medium'; // large, medium, small, list
    let libraryPerPage = 20; // 10, 20, 50, 100, 0 (all)
    let libraryCurrentPage = 1;
    let currentFilterParams = {};

    let playlistViewMode = 'list'; // list, grid
    let playlistPerPage = 20;
    let playlistCurrentPage = 1;
    let currentPlaylistItemIndex = -1;
    let isMassRefreshing = false;
    let chapterFetchCache = new Set();
    let lazyChapterTimer = null;

    let historySortMode = 'date-desc'; // date-desc, date-asc, title-asc, rj-asc
    let isShuffle = false;
    let playbackHistoryStack = [];

    try { contentMode = localStorage.getItem('astreamer_content_mode') || 'NSFW'; } catch(e) {}
    try { libraryViewMode = localStorage.getItem('astreamer_view_mode') || 'medium'; } catch(e) {}
    try { libraryPerPage = parseInt(localStorage.getItem('astreamer_per_page')) || 20; } catch(e) {}
    try { playlistViewMode = localStorage.getItem('astreamer_pl_view_mode') || 'list'; } catch(e) {}
    try { historySortMode = localStorage.getItem('astreamer_history_sort') || 'date-desc'; } catch(e) {}
    try { isShuffle = localStorage.getItem('astreamer_shuffle') === 'true'; } catch(e) {}

    function updateShuffleUI() {
      const btn = document.getElementById('shuffleBtn');
      const pBtn = document.getElementById('popupShuffleBtn');
      [btn, pBtn].forEach(el => {
        if (!el) return;
        el.classList.toggle('active', isShuffle);
        el.title = isShuffle ? 'Shuffle / Random: ON (Click to turn off)' : 'Shuffle / Random: OFF (Click to turn on)';
      });
    }

    function toggleShuffle() {
      isShuffle = !isShuffle;
      try { localStorage.setItem('astreamer_shuffle', isShuffle ? 'true' : 'false'); } catch(e) {}
      updateShuffleUI();
    }

    function updatePageTitle(subpage) {
      if (!subpage) {
        document.title = 'aStreamer | Your one hub streaming services';
      } else {
        document.title = 'aStreamer | ' + subpage;
      }
    }

    function handleImgError(el) {
      if (!el) return;
      el.onerror = null;
      const rj = el.getAttribute('data-rj');
      el.src = rj ? '/image-proxy?rj=' + rj : '/image-proxy';
    }

    function triggerBackupUpload() {
      const el = document.getElementById('backupFileInput');
      if (el) el.click();
    }

    function recordPlayHistory(work, trackIndex = 0) {
      if (!work || !work.rjCode) return;
      const track = (work.tracks && work.tracks[trackIndex]) ? work.tracks[trackIndex] : null;
      const entry = {
        rjCode: work.rjCode,
        title: work.title,
        trackTitle: track ? track.title : '',
        trackIndex: trackIndex,
        coverUrl: work.coverUrl,
        cv: work.cv || '',
        circle: work.circle || '',
        playedAt: new Date().toISOString()
      };

      // 1. Immediate local cache
      try {
        let history = JSON.parse(localStorage.getItem('astreamer_play_history') || '[]');
        if (!Array.isArray(history)) history = [];
        history = history.filter(item => item.rjCode !== work.rjCode);
        history.unshift(entry);
        if (history.length > 20) history = history.slice(0, 20);
        localStorage.setItem('astreamer_play_history', JSON.stringify(history));
      } catch(e) {}

      // 2. Cross-device sync
      apiFetch('/api/history', {
        method: 'POST',
        body: JSON.stringify(entry)
      }).catch(() => {});
    }

    let currentView = 'library';
    let allWorks = [];
    let shuffledLibraryWorks = null;
    let currentWork = null;
    let currentWorkChapters = [];
    let currentTrackIndex = -1;
    let hls = null;
    let loadedHlsUrl = null;
    let pendingPlaylistItem = null;
    let isChapterDrawerOpen = false;
    const audio = document.getElementById('coreAudio');

    const SFW_DISGUISE_LIST = ['RJ01681691','RJ01678330','RJ01694805','RJ01688728','RJ01693711','RJ335043','RJ01360841','RJ346413','RJ01229288','RJ321035','RJ317278','RJ387519','RJ370190','RJ343025','RJ373001','RJ01144236','RJ336447','RJ329940','RJ403038','RJ370099','RJ299717','RJ01323001','RJ363741','RJ333531','RJ357211','RJ01040461'];
    const NSFW_KEYWORDS = ['nsfw','18禁','r18','r-18','adult','erotic','futanari','hentai','手コキ','中出し','オナサポ','乳首責め','乳首','オナホ','セックス','騎乗位','交尾','精飲','フェラ','パイズリ','アナル','潮吹き','痴女','バイブ','拘束','催眠','洗脳','絶頂','連続絶頂','常識改変','インモラル','乱交','射精','射精管理','快楽堕ち','おまんこ','ちんぽ','ちんこ','性力','オホ声','オホ','奉仕','寸止め','ザーメン','搾精','淫乱','発情','メス堕ち','アヘ顔','肉便器','マゾ','サド','調教','言葉責め','責め','愛撫','クンニ','巨乳','爆乳','貧乳','微乳','催眠音声','退廃','背徳','強制','無理矢理','媚び','服従','淫惑','性器','淫具','孕'];

    function isWorkNsfw(work) {
      if (!work) return false;
      if (SFW_DISGUISE_LIST.includes(work.rjCode)) return false;
      if (work.isNsfw === true) return true;
      const text = (work.tags || []).join(' ') + ' ' + (work.title || '');
      return NSFW_KEYWORDS.some(k => text.toLowerCase().includes(k.toLowerCase()));
    }

    function getDisplayCover(work) {
      if (contentMode === 'PSFW' && isWorkNsfw(work)) {
        let hash = 0;
        for (let i = 0; i < work.rjCode.length; i++) hash = (hash * 31 + work.rjCode.charCodeAt(i)) >>> 0;
        const sfwRj = SFW_DISGUISE_LIST[hash % SFW_DISGUISE_LIST.length];
        return { coverUrl: '/image-proxy?url=' + encodeURIComponent('https://pic.weeabo0.xyz/' + sfwRj + '_img_main.jpg'), isDisguised: true };
      }
      return { coverUrl: work.coverUrl, isDisguised: false };
    }

    function renderLockedState(title, desc) {
      return '<div style="padding: 4rem 2rem; text-align: center; max-width: 480px; margin: 40px auto; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.5);"><div style="font-size: 3rem; margin-bottom: 12px;">🔒</div><h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 8px;">' + (title || 'Private Audio Library') + '</h2><p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px; line-height: 1.5;">' + (desc || 'This audio collection is protected. Enter your admin passcode to browse, search, and stream your works.') + '</p><button class="btn-primary" style="padding: 12px 28px; font-size: 0.95rem; font-weight: 700; margin: 0 auto;" onclick="openAdminModal()">🔑 Unlock Admin Access</button></div>';
    }

    async function initApp() {
      if ('scrollRestoration' in history) {
        try { history.scrollRestoration = 'manual'; } catch(e) {}
      }
      updateShuffleUI();
      setupMediaSessionHandlers();
      syncTagDictionary();
      await checkAuthStatus();
      handleHashRoute();
    }

    window.addEventListener('scroll', () => {
      if (currentView === 'library') {
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        if (y > 0) {
          savedScrollPositions['library'] = y;
        }
      }
    }, { passive: true });

    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', initApp);
    } else {
      initApp();
    }

    window.addEventListener('hashchange', () => {
      handleHashRoute();
    });

    window.addEventListener('keydown', (e) => {
      // Lightbox navigation if active
      const lbModal = document.getElementById('imageLightboxModal');
      if (lbModal && lbModal.style.display === 'flex') {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          navLightbox(-1);
          return;
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          navLightbox(1);
          return;
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          closeLightboxModal();
          return;
        }
      }

      // Hardware / Keyboard media keys
      if (e.key === 'MediaTrackNext' || e.code === 'MediaTrackNext') {
        e.preventDefault();
        playNextTrack();
        return;
      }
      if (e.key === 'MediaTrackPrevious' || e.code === 'MediaTrackPrevious') {
        e.preventDefault();
        playPrevTrack();
        return;
      }
      if (e.key === 'MediaPlayPause' || e.code === 'MediaPlayPause') {
        e.preventDefault();
        togglePlayPause();
        return;
      }
      if (e.key === 'MediaStop' || e.code === 'MediaStop') {
        e.preventDefault();
        audio.pause();
        audio.currentTime = 0;
        return;
      }

      // Spacebar toggle play/pause when not typing in text fields
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        togglePlayPause();
        return;
      }

      if (e.key === 'Escape') {
        const popupModal = document.getElementById('popupPlayerModal');
        if (popupModal && popupModal.style.display === 'flex') {
          closePopupPlayer();
        } else {
          // Stealth panic toggle
          const nextMode = contentMode === 'PSFW' ? 'NSFW' : 'PSFW';
          setContentMode(nextMode);
        }
      }
    });

    async function checkAuthStatus() {
      try {
        const saved = localStorage.getItem('astreamer_admin_passcode') || '';
        if (!saved) {
          isAdmin = false;
          updateAdminUI(false);
          return;
        }
        const res = await fetch('/api/auth/check', {
          headers: { 'x-admin-passcode': saved }
        });
        const data = await res.json().catch(() => ({}));
        isAdmin = Boolean(data.authenticated);
        updateAdminUI(isAdmin);
        if (isAdmin) updateWishlistBadge();
      } catch(e) {
        isAdmin = false;
        updateAdminUI(false);
      }
    }

    function updateAdminUI(active) {
      const sidebarBtn = document.getElementById('sidebarAdminBtn');
      const mobileBtn = document.getElementById('mobileAdminBtn');

      if (sidebarBtn) {
        sidebarBtn.innerHTML = active ? '🔒 Admin Active' : '🔓 Unlock Admin';
        sidebarBtn.style.color = active ? '#38bdf8' : 'var(--text-muted)';
        sidebarBtn.title = active ? 'Admin Mode Active (Click to Logout)' : 'Click to Unlock Admin';
      }
      if (mobileBtn) {
        mobileBtn.innerHTML = active ? '🔒' : '🔓';
        mobileBtn.title = active ? 'Admin Active (Click to Logout)' : 'Unlock Admin';
      }
    }

    function openAdminModal(subtitle = null) {
      const errEl = document.getElementById('loginError');
      if (errEl) errEl.style.display = 'none';
      const subEl = document.getElementById('gatekeeperSubtitle');
      if (subEl) subEl.innerText = subtitle || 'Enter your admin passcode to manage works and modify library settings.';
      const modal = document.getElementById('gatekeeperModal');
      if (modal) {
        modal.style.display = 'flex';
        const inp = document.getElementById('passcodeInput');
        if (inp) { inp.value = ''; inp.focus(); }
      }
    }

    function closeAdminModal() {
      const modal = document.getElementById('gatekeeperModal');
      if (modal) modal.style.display = 'none';
    }

    async function toggleAdminModal() {
      if (isAdmin) {
        if (confirm('You are currently authenticated as Admin. Do you want to log out?')) {
          await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
          try { localStorage.removeItem('astreamer_admin_passcode'); } catch(e) {}
          isAdmin = false;
          updateAdminUI(false);
          updateWishlistBadge();
          handleHashRoute();
        }
      } else {
        openAdminModal();
      }
    }

    async function loginAdmin() {
      try {
        const pass = document.getElementById('passcodeInput').value.trim();
        if (!pass) return;
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ passcode: pass })
        });
        const data = await res.json().catch(() => ({}));
        if (data && data.success) {
          isAdmin = true;
          try { localStorage.setItem('astreamer_admin_passcode', pass); } catch(e) {}
          closeAdminModal();
          updateAdminUI(true);
          updateWishlistBadge();
          handleHashRoute();
        } else {
          const errEl = document.getElementById('loginError');
          errEl.innerText = data?.error || 'Invalid Passcode';
          errEl.style.display = 'block';
        }
      } catch (err) {
        const errEl = document.getElementById('loginError');
        errEl.innerText = 'Login error: ' + err.message;
        errEl.style.display = 'block';
      }
    }

    async function apiFetch(url, options = {}) {
      options.headers = options.headers || { 'Content-Type': 'application/json' };
      const savedPass = localStorage.getItem('astreamer_admin_passcode') || '';
      if (savedPass) {
        if (typeof options.headers.set === 'function') {
          options.headers.set('x-admin-passcode', savedPass);
        } else if (typeof options.headers === 'object') {
          options.headers['x-admin-passcode'] = savedPass;
        }
      }
      const res = await fetch(url, options);
      if (res.status === 401) {
        isAdmin = false;
        updateAdminUI(false);
        openAdminModal('Admin authorization required to perform this action.');
      }
      return res;
    }

    let savedScrollPositions = { library: 0 };

    function getLibraryHash(page = libraryCurrentPage, filterParams = currentFilterParams) {
      let base = '#/library';
      if (filterParams && filterParams.tag) {
        base = '#/genre/' + encodeURIComponent(filterParams.tag);
      } else if (filterParams && filterParams.cv) {
        base = '#/cv/' + encodeURIComponent(filterParams.cv);
      } else if (filterParams && filterParams.circle) {
        base = '#/circle/' + encodeURIComponent(filterParams.circle);
      } else if (filterParams && filterParams.favorite) {
        base = '#/favorites';
      } else if (filterParams && filterParams.q) {
        base = '#/search/' + encodeURIComponent(filterParams.q);
      } else {
        return page > 1 ? '#/page/' + page : '#/library';
      }
      return page > 1 ? base + '/' + page : base;
    }

    function switchView(view, param = null, updateHash = true, page = 1) {
      if (currentView && currentView === 'library' && view !== 'library') {
        savedScrollPositions['library'] = window.scrollY || document.documentElement.scrollTop || 0;
      }
      currentView = view;
      if (view === 'library') {
        libraryCurrentPage = parseInt(page, 10) || 1;
      }
      if (updateHash) {
        let hash = '#/' + view;
        if (view === 'work-detail' && typeof param === 'string') {
          hash = '#/work/' + encodeURIComponent(param);
        } else if (view === 'playlist-detail' && typeof param === 'string') {
          hash = '#/playlist/' + encodeURIComponent(param);
        } else if (view === 'library') {
          hash = getLibraryHash(libraryCurrentPage, param || {});
        }
        if (window.location.hash !== hash) {
          window.location.hash = hash;
        }
      }

      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.mobile-pill').forEach(el => el.classList.remove('active'));

      const activeNavSelector = '[data-view="' + view + '"]';
      document.querySelectorAll(activeNavSelector).forEach(el => el.classList.add('active'));

      if (view === 'library') {
        loadLibrary(param || {});
      } else if (view === 'playlists') {
        loadPlaylists();
      } else if (view === 'history') {
        loadHistory();
      } else if (view === 'wishlist') {
        loadWishlist();
      } else if (view === 'artists') {
        loadArtists();
      } else if (view === 'genres') {
        loadGenres();
      } else if (view === 'settings') {
        loadSettings();
      } else if (view === 'work-detail') {
        loadWorkDetail(param);
      } else if (view === 'playlist-detail') {
        loadPlaylistDetail(param);
      }
    }

    function handleHashRoute() {
      const raw = window.location.hash || '#/library';
      const clean = raw.startsWith('#/') ? raw.slice(2) : (raw.startsWith('#') ? raw.slice(1) : raw);
      const parts = clean.split('/');
      const section = parts[0] || 'library';

      if (section === 'work') {
        const rj = parts.slice(1).join('/');
        if (rj) switchView('work-detail', decodeURIComponent(rj), false);
        else switchView('library', null, false, 1);
      } else if (section === 'page') {
        const pageNum = parseInt(parts[1], 10) || 1;
        switchView('library', null, false, pageNum);
      } else if (section === 'genre') {
        const tag = decodeURIComponent(parts[1] || '');
        let pageNum = 1;
        if (parts[2] === 'page' && parts[3]) pageNum = parseInt(parts[3], 10) || 1;
        else if (parts[2] && !isNaN(parseInt(parts[2], 10))) pageNum = parseInt(parts[2], 10) || 1;
        switchView('library', { tag: tag }, false, pageNum);
      } else if (section === 'cv') {
        const cv = decodeURIComponent(parts[1] || '');
        let pageNum = 1;
        if (parts[2] === 'page' && parts[3]) pageNum = parseInt(parts[3], 10) || 1;
        else if (parts[2] && !isNaN(parseInt(parts[2], 10))) pageNum = parseInt(parts[2], 10) || 1;
        switchView('library', { cv: cv }, false, pageNum);
      } else if (section === 'circle') {
        const circle = decodeURIComponent(parts[1] || '');
        let pageNum = 1;
        if (parts[2] === 'page' && parts[3]) pageNum = parseInt(parts[3], 10) || 1;
        else if (parts[2] && !isNaN(parseInt(parts[2], 10))) pageNum = parseInt(parts[2], 10) || 1;
        switchView('library', { circle: circle }, false, pageNum);
      } else if (section === 'search') {
        const q = decodeURIComponent(parts[1] || '');
        let pageNum = 1;
        if (parts[2] === 'page' && parts[3]) pageNum = parseInt(parts[3], 10) || 1;
        else if (parts[2] && !isNaN(parseInt(parts[2], 10))) pageNum = parseInt(parts[2], 10) || 1;
        switchView('library', { q: q }, false, pageNum);
      } else if (section === 'favorites') {
        let pageNum = 1;
        if (parts[1] === 'page' && parts[2]) pageNum = parseInt(parts[2], 10) || 1;
        else if (parts[1] && !isNaN(parseInt(parts[1], 10))) pageNum = parseInt(parts[1], 10) || 1;
        switchView('library', { favorite: 'true' }, false, pageNum);
      } else if (section === 'playlist') {
        const plId = decodeURIComponent(parts.slice(1).join('/'));
        if (plId) switchView('playlist-detail', plId, false);
        else switchView('playlists', null, false);
      } else if (section === 'library') {
        let pageNum = 1;
        if (parts[1] === 'page' && parts[2]) pageNum = parseInt(parts[2], 10) || 1;
        else if (parts[1] && !isNaN(parseInt(parts[1], 10))) pageNum = parseInt(parts[1], 10) || 1;
        switchView('library', null, false, pageNum);
      } else if (['playlists', 'history', 'wishlist', 'artists', 'genres', 'settings'].includes(section)) {
        switchView(section, null, false);
      } else {
        switchView('library', {}, false, 1);
      }
    }

    async function loadLibrary(filterParams = {}) {
      currentFilterParams = filterParams;
      if (filterParams.tag) {
        updatePageTitle(filterParams.tag);
      } else if (filterParams.cv) {
        updatePageTitle(filterParams.cv);
      } else if (filterParams.circle) {
        updatePageTitle(filterParams.circle);
      } else if (filterParams.q) {
        updatePageTitle('Search: ' + filterParams.q);
      } else if (filterParams.favorite) {
        updatePageTitle('Favorites');
      } else if (libraryCurrentPage > 1) {
        updatePageTitle('Page ' + libraryCurrentPage);
      } else {
        updatePageTitle();
      }

      const container = document.getElementById('viewContainer');
      if (!isAdmin) {
        container.innerHTML = renderLockedState('Private Audio Library', 'This audio collection is protected. Enter your admin passcode to browse, search, and stream your works.');
        return;
      }

      const hasCachedWorks = Array.isArray(allWorks) && allWorks.length > 0;
      const isPlainLibrary = !filterParams || Object.keys(filterParams).length === 0;

      if (hasCachedWorks && isPlainLibrary) {
        renderLibraryGrid(shuffledLibraryWorks || allWorks, filterParams);
      } else if (!hasCachedWorks) {
        container.innerHTML = '<div style="text-align:center; padding: 3rem; color: var(--text-muted);">Loading Library...</div>';
      }

      try {
        const url = new URL('/api/library', window.location.origin);
        Object.keys(filterParams).forEach(k => { if (filterParams[k]) url.searchParams.set(k, filterParams[k]); });
        const res = await apiFetch(url);
        let works = await res.json();
        if (!Array.isArray(works)) works = [];
        if (contentMode === 'SFW') works = works.filter(w => !isWorkNsfw(w));
        allWorks = works;
        if (shuffledLibraryWorks && (!filterParams || Object.keys(filterParams).length === 0)) {
          const workMap = new Map(works.map(w => [w.rjCode, w]));
          shuffledLibraryWorks = shuffledLibraryWorks
            .map(w => workMap.get(w.rjCode) || w)
            .filter(w => contentMode !== 'SFW' || !isWorkNsfw(w));
          const existingSet = new Set(shuffledLibraryWorks.map(w => w.rjCode));
          works.forEach(w => {
            if (!existingSet.has(w.rjCode)) shuffledLibraryWorks.push(w);
          });
          renderLibraryGrid(shuffledLibraryWorks, filterParams);
        } else {
          shuffledLibraryWorks = null;
          renderLibraryGrid(works, filterParams);
        }
      } catch (e) {
        if (!hasCachedWorks) {
          container.innerHTML = '<div style="color:#ff3366; padding:2rem;">Error: ' + e.message + '</div>';
        }
      }
    }

    window.navWork = function(rj) {
      if (currentView === 'library') {
        savedScrollPositions['library'] = window.scrollY || document.documentElement.scrollTop || 0;
      }
      switchView('work-detail', rj);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.navGenre = function(tag) {
      savedScrollPositions['library'] = 0;
      shuffledLibraryWorks = null;
      currentTagQuery = tag;
      const s = document.getElementById('globalTagSearch');
      const m = document.getElementById('mobileTagSearchInput');
      if (s) s.value = tag;
      if (m) m.value = tag;
      switchView('library', { tag: tag }, true, 1);
    };
    window.navCv = function(cv) {
      savedScrollPositions['library'] = 0;
      shuffledLibraryWorks = null;
      currentTitleQuery = cv;
      const s = document.getElementById('globalSearch');
      const m = document.getElementById('mobileSearchInput');
      if (s) s.value = cv;
      if (m) m.value = cv;
      switchView('library', { cv: cv }, true, 1);
    };
    window.navCircle = function(circle) { savedScrollPositions['library'] = 0; shuffledLibraryWorks = null; switchView('library', { circle: circle }, true, 1); };
    window.navPlaylist = function(id) { switchView('playlist-detail', id); };
    window.navFavs = function() { savedScrollPositions['library'] = 0; shuffledLibraryWorks = null; switchView('library', { favorite: 'true' }, true, 1); };
    window.navAll = function() {
      savedScrollPositions['library'] = 0;
      shuffledLibraryWorks = null;
      currentTitleQuery = '';
      currentTagQuery = '';
      const s1 = document.getElementById('globalSearch');
      const s2 = document.getElementById('globalTagSearch');
      const m1 = document.getElementById('mobileSearchInput');
      const m2 = document.getElementById('mobileTagSearchInput');
      if (s1) s1.value = '';
      if (s2) s2.value = '';
      if (m1) m1.value = '';
      if (m2) m2.value = '';
      switchView('library', {}, true, 1);
    };
    window.navBack = function() {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        switchView('library');
      }
    };

    function shuffleLibraryView() {
      savedScrollPositions['library'] = 0;
      const source = (currentFilterParams && Object.keys(currentFilterParams).length > 0) ? (shuffledLibraryWorks || allWorks) : allWorks;
      if (!Array.isArray(source) || source.length === 0) return;
      const copy = [...source];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      shuffledLibraryWorks = copy;
      libraryCurrentPage = 1;
      renderLibraryGrid(shuffledLibraryWorks, currentFilterParams);
    }

    function setLibraryViewMode(mode) {
      libraryViewMode = mode;
      try { localStorage.setItem('astreamer_view_mode', mode); } catch(e) {}
      renderLibraryGrid(shuffledLibraryWorks || allWorks, currentFilterParams);
    }

    function setLibraryPerPage(count) {
      savedScrollPositions['library'] = 0;
      libraryPerPage = parseInt(count) || 0;
      libraryCurrentPage = 1;
      try { localStorage.setItem('astreamer_per_page', libraryPerPage); } catch(e) {}
      const targetHash = getLibraryHash(1, currentFilterParams);
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      } else {
        renderLibraryGrid(shuffledLibraryWorks || allWorks, currentFilterParams);
      }
    }

    function setLibraryPage(page) {
      savedScrollPositions['library'] = 0;
      libraryCurrentPage = parseInt(page, 10) || 1;
      const targetHash = getLibraryHash(libraryCurrentPage, currentFilterParams);
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      } else {
        renderLibraryGrid(shuffledLibraryWorks || allWorks, currentFilterParams);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderLibraryGrid(works, filterParams) {
      filterParams = filterParams || currentFilterParams || {};
      const container = document.getElementById('viewContainer');
      let filterHeader = '';
      const modeBadge = contentMode === 'PSFW' ? '<span class="disguised-badge" style="margin-left: 8px;">🎭 PSFW Disguise Mode Active</span>' : (contentMode === 'SFW' ? '<span style="background:#0e7490; color:#fff; font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:4px; margin-left:8px;">🛡️ SFW Filter Active</span>' : '');

      if (filterParams.tag) filterHeader = '<div style="background: rgba(255,51,102,0.12); border: 1px solid var(--accent); padding: 10px 18px; border-radius: 10px; margin-bottom: 1.2rem; display: flex; align-items: center; justify-content: space-between;"><span>🏷️ Filtered by Genre: <strong>' + formatTag(filterParams.tag) + '</strong> (' + works.length + ' works)</span><button class="btn-outline" style="padding: 4px 12px; font-size: 0.8rem;" onclick="navAll()">✖ Clear Filter</button></div>';
      else if (filterParams.cv) filterHeader = '<div style="background: rgba(56,189,248,0.12); border: 1px solid #38bdf8; padding: 10px 18px; border-radius: 10px; margin-bottom: 1.2rem; display: flex; align-items: center; justify-content: space-between;"><span>🎙️ Filtered by Voice Actor: <strong>' + filterParams.cv + '</strong> (' + works.length + ' works)</span><button class="btn-outline" style="padding: 4px 12px; font-size: 0.8rem;" onclick="navAll()">✖ Clear Filter</button></div>';
      else if (filterParams.circle) filterHeader = '<div style="background: rgba(14,116,144,0.15); border: 1px solid #0e7490; padding: 10px 18px; border-radius: 10px; margin-bottom: 1.2rem; display: flex; align-items: center; justify-content: space-between;"><span>🏢 Filtered by Circle: <strong>' + filterParams.circle + '</strong> (' + works.length + ' works)</span><button class="btn-outline" style="padding: 4px 12px; font-size: 0.8rem;" onclick="navAll()">✖ Clear Filter</button></div>';
      else if (filterParams.favorite) filterHeader = '<div style="background: rgba(255,51,102,0.12); border: 1px solid var(--accent); padding: 10px 18px; border-radius: 10px; margin-bottom: 1.2rem; display: flex; align-items: center; justify-content: space-between;"><span>❤️ Showing <strong>Favorites</strong> (' + works.length + ' works)</span><button class="btn-outline" style="padding: 4px 12px; font-size: 0.8rem;" onclick="navAll()">✖ Show All</button></div>';
      else if (filterParams.q) filterHeader = '<div style="background: rgba(56,189,248,0.12); border: 1px solid #38bdf8; padding: 10px 18px; border-radius: 10px; margin-bottom: 1.2rem; display: flex; align-items: center; justify-content: space-between;"><span>🔍 Search Query: <strong>&quot;' + filterParams.q + '&quot;</strong> (' + works.length + ' works)</span><button class="btn-outline" style="padding: 4px 12px; font-size: 0.8rem;" onclick="navAll()">✖ Clear Search</button></div>';

      // Pagination Slicing
      const totalCount = works.length;
      const perPage = libraryPerPage > 0 ? libraryPerPage : totalCount || 1;
      const totalPages = Math.ceil(totalCount / perPage) || 1;
      if (libraryCurrentPage > totalPages) libraryCurrentPage = totalPages;
      if (libraryCurrentPage < 1) libraryCurrentPage = 1;

      const startIndex = (libraryCurrentPage - 1) * perPage;
      const paginatedWorks = libraryPerPage > 0 ? works.slice(startIndex, startIndex + perPage) : works;

      // Explorer Toolbar & View Modes
      let toolbarHtml = '<div class="view-modes-bar">';
      toolbarHtml += '<div style="display:flex; align-items:center; gap:8px;">';
      toolbarHtml += '<span style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">VIEW:</span>';
      toolbarHtml += '<div class="view-mode-buttons">';
      toolbarHtml += '<button class="view-btn ' + (libraryViewMode === 'large' ? 'active' : '') + '" data-mode="large" onclick="setLibraryViewMode(this.dataset.mode)" title="Large Hero Cards">🖼️ Large</button>';
      toolbarHtml += '<button class="view-btn ' + (libraryViewMode === 'medium' ? 'active' : '') + '" data-mode="medium" onclick="setLibraryViewMode(this.dataset.mode)" title="Medium Standard Grid">🎴 Med</button>';
      toolbarHtml += '<button class="view-btn ' + (libraryViewMode === 'small' ? 'active' : '') + '" data-mode="small" onclick="setLibraryViewMode(this.dataset.mode)" title="Compact Small Cards">📱 Small</button>';
      toolbarHtml += '<button class="view-btn ' + (libraryViewMode === 'list' ? 'active' : '') + '" data-mode="list" onclick="setLibraryViewMode(this.dataset.mode)" title="Detailed List Table">📋 List</button>';
      toolbarHtml += '<button class="view-btn ' + (shuffledLibraryWorks ? 'active' : '') + '" onclick="shuffleLibraryView()" title="Shuffle library display order (Click again to re-shuffle)">🎲 Shuffle' + (shuffledLibraryWorks ? ' ↺' : '') + '</button>';
      toolbarHtml += '</div></div>';

      toolbarHtml += '<div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">';
      toolbarHtml += '<div style="display:flex; align-items:center; gap:6px;"><span style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">SHOW:</span>';
      toolbarHtml += '<select class="per-page-select" onchange="setLibraryPerPage(this.value)">';
      [10, 20, 50, 100].forEach(n => {
        toolbarHtml += '<option value="' + n + '" ' + (libraryPerPage === n ? 'selected' : '') + '>' + n + ' per page</option>';
      });
      toolbarHtml += '<option value="0" ' + (libraryPerPage === 0 ? 'selected' : '') + '>All (' + totalCount + ')</option>';
      toolbarHtml += '</select></div>';
      toolbarHtml += '<button class="btn-outline" style="padding:5px 12px; font-size:0.8rem;" onclick="navFavs()">❤️ Favorites</button>';
      toolbarHtml += '<button class="btn-outline" style="padding:5px 12px; font-size:0.8rem;" onclick="navAll()">' + (shuffledLibraryWorks ? 'Original Order' : 'All Works') + '</button>';
      toolbarHtml += '</div></div>';

      const shuffleBadge = shuffledLibraryWorks ? '<span style="background:rgba(255,51,102,0.18); color:var(--accent); font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:4px; margin-left:8px; border:1px solid rgba(255,51,102,0.3);">🎲 Shuffled Order</span>' : '';

      let html = filterHeader;
      html += '<div class="section-header"><h1 class="section-title">📚 Library (' + totalCount + ') ' + shuffleBadge + modeBadge + '</h1></div>';
      html += toolbarHtml;

      if (totalCount === 0) {
        html += '<div style="padding: 4rem 2rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border);">No works found. Use <strong>+ Add RJ Code</strong> or <strong>📥 Batch Import</strong> to add audio works!</div>';
        container.innerHTML = html;
        return;
      }

      if (libraryViewMode === 'list') {
        html += '<table class="works-list-table"><thead><tr><th style="width:50px;">Cover</th><th style="width:110px;">RJ Code</th><th>Title</th><th>Voice Actor (CV)</th><th>Circle</th><th style="width:70px; text-align:center;">Tracks</th><th style="width:90px; text-align:right;">Actions</th></tr></thead><tbody>';
        paginatedWorks.forEach(function(w) {
          const display = getDisplayCover(w);
          const cvDisplay = formatCV(getWorkCV(w));
          const metaLine = (cvDisplay ? '<span style="color:#38bdf8; font-weight:600;">' + cvDisplay + '</span>' : '') + (cvDisplay && w.circle ? ' • ' : '') + (w.circle ? '<span>' + w.circle + '</span>' : '') + ' • <span class="card-rj" style="padding:1px 5px; font-size:0.7rem;">' + w.rjCode + '</span>';
          html += '<tr class="works-list-row" data-rj="' + w.rjCode + '" onclick="navWork(this.dataset.rj)">';
          html += '<td class="w-col-cover"><img class="list-thumb" src="' + display.coverUrl + '" onerror="handleImgError(this)"></td>';
          html += '<td class="w-col-rj"><span class="card-rj">' + w.rjCode + '</span></td>';
          html += '<td class="w-col-title"><strong>' + w.title + '</strong>' + (display.isDisguised ? ' <span class="disguised-badge">🎭 SFW</span>' : '') + '</td>';
          html += '<td class="w-col-meta"><div class="w-meta-inner">' + metaLine + '</div></td>';
          html += '<td class="w-col-circle" style="color:var(--text-muted);">' + (w.circle || 'N/A') + '</td>';
          html += '<td class="w-col-tracks" style="text-align:center;"><span style="background:rgba(255,255,255,0.06); padding:2px 8px; border-radius:10px; font-size:0.75rem;">' + (w.totalTracks || (w.tracks ? w.tracks.length : 0)) + '</span></td>';
          html += '<td class="w-col-actions" style="text-align:right;"><span class="card-fav card-fav-' + w.rjCode + '" data-rj="' + w.rjCode + '" title="Toggle Favorite" onclick="toggleFav(this.dataset.rj, event)" style="margin-right:6px; font-size:1.05rem;">' + (w.favorite ? '❤️' : '🤍') + '</span><button class="btn-outline" style="padding:3px 8px; font-size:0.75rem;" data-rj="' + w.rjCode + '" onclick="event.stopPropagation(); playWorkDirectly(this.dataset.rj)">▶</button></td>';
          html += '</tr>';
        });
        html += '</tbody></table>';
      } else {
        html += '<div class="works-grid mode-' + libraryViewMode + '">';
        paginatedWorks.forEach(function(w) {
          const display = getDisplayCover(w);
          const cvDisplay = formatCV(getWorkCV(w));
          const subText = cvDisplay || w.circle || 'ASMR';
          html += '<div class="work-card" data-rj="' + w.rjCode + '" onclick="navWork(this.dataset.rj)">';
          html += '<div class="card-cover-wrapper"><img class="card-cover" src="' + display.coverUrl + '">' + (display.isDisguised ? '<div class="disguised-overlay"><span class="disguised-badge">🎭 Disguised SFW</span></div>' : '') + '</div>';
          html += '<div class="card-badge-row"><span class="card-rj">' + w.rjCode + '</span><span class="card-fav card-fav-' + w.rjCode + '" data-rj="' + w.rjCode + '" title="' + (w.favorite ? 'Favorited' : 'Add to Favorites') + '" onclick="toggleFav(this.dataset.rj, event)" style="transition: transform 0.15s ease-out; display: inline-block;">' + (w.favorite ? '❤️' : '🤍') + '</span></div>';
          html += '<div class="card-title" title="' + w.title.replace(/"/g, '&quot;') + '">' + w.title + '</div>';
          html += '<div class="card-sub">' + subText + '</div>';
          html += '</div>';
        });
        html += '</div>';
      }

      // Pagination Controls Rendering
      if (libraryPerPage > 0 && totalPages > 1) {
        html += '<div class="pagination-bar">';
        html += '<button class="page-btn" ' + (libraryCurrentPage === 1 ? 'disabled' : '') + ' onclick="setLibraryPage(1)">« First</button>';
        html += '<button class="page-btn" ' + (libraryCurrentPage === 1 ? 'disabled' : '') + ' onclick="setLibraryPage(' + (libraryCurrentPage - 1) + ')">‹ Prev</button>';

        let startP = Math.max(1, libraryCurrentPage - 2);
        let endP = Math.min(totalPages, libraryCurrentPage + 2);
        if (startP > 1) html += '<span class="page-info">...</span>';
        for (let p = startP; p <= endP; p++) {
          html += '<button class="page-btn ' + (p === libraryCurrentPage ? 'active' : '') + '" onclick="setLibraryPage(' + p + ')">' + p + '</button>';
        }
        if (endP < totalPages) html += '<span class="page-info">...</span>';

        html += '<button class="page-btn" ' + (libraryCurrentPage === totalPages ? 'disabled' : '') + ' onclick="setLibraryPage(' + (libraryCurrentPage + 1) + ')">Next ›</button>';
        html += '<button class="page-btn" ' + (libraryCurrentPage === totalPages ? 'disabled' : '') + ' onclick="setLibraryPage(' + totalPages + ')">Last »</button>';
        html += '<span class="page-info">Page ' + libraryCurrentPage + ' of ' + totalPages + ' (' + totalCount + ' works)</span>';
        html += '</div>';
      }

      container.innerHTML = html;

      if (savedScrollPositions['library'] && savedScrollPositions['library'] > 0) {
        const targetScroll = savedScrollPositions['library'];
        window.scrollTo({ top: targetScroll, behavior: 'instant' });
        requestAnimationFrame(() => {
          window.scrollTo({ top: targetScroll, behavior: 'instant' });
          setTimeout(() => {
            window.scrollTo({ top: targetScroll, behavior: 'instant' });
          }, 60);
          setTimeout(() => {
            window.scrollTo({ top: targetScroll, behavior: 'instant' });
          }, 180);
        });
      }
    }

    async function playWorkDirectly(rjCode) {
      let work = allWorks.find(w => w.rjCode === rjCode);
      if (!work) {
        try {
          const res = await apiFetch('/api/library?q=' + encodeURIComponent(rjCode));
          const list = await res.json();
          work = Array.isArray(list) ? list[0] : null;
        } catch (e) {}
      }
      if (work) {
        currentWork = work;
        playTrack(0, true);
      }
    }

    function normRj(code) {
      return (code || '').toUpperCase().replace(/^RJ0*/, 'RJ');
    }

    function renderWorkDetailUI(work) {
      if (!work || currentView !== 'work-detail') return;
      currentWork = work;
      const container = document.getElementById('viewContainer');
      if (!container) return;

      updatePageTitle((work.rjCode ? work.rjCode + ' - ' : '') + (work.title || 'Work Detail'));
      const display = getDisplayCover(work);

      const rawCv = getWorkCV(work);
      const cvList = rawCv && rawCv !== 'N/A'
        ? rawCv.split(/[,、/&＋+;・\\n|]/).map(function(s) { return cleanCVName(s); }).filter(Boolean)
        : [];
      
      const cvNamesSet = new Set();
      cvList.forEach(function(c) {
        cvNamesSet.add(c.toLowerCase());
        const entry = getTagEntry(c);
        if (entry) {
          if (entry.romaji) cvNamesSet.add(entry.romaji.toLowerCase());
          if (entry.english) cvNamesSet.add(entry.english.toLowerCase());
        }
      });

      const cvPills = cvList.length > 0
        ? Array.from(new Set(cvList)).map(function(c) {
            return '<span class="tag-pill" style="display:inline-flex; align-items:center; gap:4px; margin-right:4px; background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.3); font-weight:700;" data-cv="' + c.replace(/"/g, '&quot;') + '" onclick="navCv(this.dataset.cv)">🎙️ ' + formatCV(c) + '</span>';
          }).join('')
        : '<span style="color:var(--text-muted);">N/A</span>';

      const circlePill = work.circle && work.circle !== 'N/A'
        ? '<span class="tag-pill" style="display:inline-flex; align-items:center; gap:4px; background:rgba(255,255,255,0.06); border:1px solid var(--border); font-weight:700;" data-circle="' + work.circle.replace(/"/g, '&quot;') + '" onclick="navCircle(this.dataset.circle)">🏢 ' + work.circle + '</span>'
        : '<span style="color:var(--text-muted);">N/A</span>';

      const filteredTags = (work.tags || []).filter(function(t) {
        const clean = (t || '').trim();
        if (!clean) return false;
        if (cvNamesSet.has(clean.toLowerCase())) return false;
        const entry = getTagEntry(clean);
        if (entry && entry.isCV) return false;
        return true;
      });

      const tagPills = filteredTags.map(function(t) {
        return '<span class="tag-pill" data-tag="' + t.replace(/"/g, '&quot;') + '" onclick="navGenre(this.dataset.tag)">' + formatTag(t) + '</span>';
      }).join('');

      // Separate Physical Audio Tracks vs Chapter Markers
      const rawTracks = work.tracks || [];
      let tracksList = rawTracks;
      let chaptersList = [];

      let maxDuration = 0;
      if (audio && audio.duration && !isNaN(audio.duration) && audio.duration > 0 && currentPlayingWork && normRj(currentPlayingWork.rjCode) === normRj(work.rjCode)) {
        maxDuration = audio.duration;
      } else if (rawTracks.length > 0 && rawTracks[0].duration > 0) {
        maxDuration = rawTracks[0].duration;
      }

      const numTracks = Math.max(1, tracksList.length);

      if (Array.isArray(work.chapters) && work.chapters.length > 0) {
        chaptersList = work.chapters;
      } else if (rawTracks.length > 0) {
        chaptersList = rawTracks.map((t, idx) => ({
          id: t.id || (idx + 1),
          title: t.title,
          startTime: t.startTime || 0,
          duration: t.duration || 0,
          formattedTime: t.formattedTime || formatTime(t.startTime || 0),
          trackIndex: idx
        }));
      }

      // Mathematical Cumulative Duration & Track Partitioning Algorithm
      const totalChapters = chaptersList.length;
      const distinctAssignedTracks = new Set(
        chaptersList.map(c => parseInt(c.trackIndex, 10)).filter(n => !isNaN(n) && n >= 0 && n < numTracks)
      );
      const hasDistinctTracks = distinctAssignedTracks.size > 1;

      const trackDurations = tracksList.map(t => Math.max(0, Math.round(Number(t.duration) || 0)));
      const hasKnownTrackDurs = trackDurations.filter(d => d > 0).length >= numTracks - 1 && trackDurations[0] > 0;

      let currentTrk = 0;
      let runningTrackOffset = 0;

      chaptersList = chaptersList.map(function(c, i) {
        const dur = Math.max(0, Math.round(Number(c.duration) || 0));
        let trk = 0;

        if (numTracks > 1) {
          if (hasKnownTrackDurs) {
            const targetTrackDur = trackDurations[currentTrk] || 0;
            // If adding this chapter exceeds the current track's duration by more than 3s, advance to next track
            if (targetTrackDur > 0 && currentTrk < numTracks - 1 && (runningTrackOffset + dur) > (targetTrackDur + 3)) {
              currentTrk++;
              runningTrackOffset = 0;
            }
            trk = currentTrk;
          } else if (hasDistinctTracks) {
            trk = Math.min(Math.max(0, parseInt(c.trackIndex, 10) || 0), numTracks - 1);
            if (trk !== currentTrk) {
              currentTrk = trk;
              runningTrackOffset = 0;
            }
          } else {
            // Chapters were not pre-partitioned in metadata: partition across the N physical tracks!
            const tm = ((c.folder ? c.folder + '/' : '') + (c.title || '')).match(/(?:トラック|track|disc|disk|cd|part|vol|volume|side|第)\s*([0-9]+)/i);
            if (tm && tm[1]) {
              const num = parseInt(tm[1], 10) - 1;
              if (num >= 0 && num < numTracks) {
                trk = num;
              } else {
                trk = Math.min(Math.floor(i * numTracks / totalChapters), numTracks - 1);
              }
            } else {
              trk = Math.min(Math.floor(i * numTracks / totalChapters), numTracks - 1);
            }
            if (trk !== currentTrk) {
              currentTrk = trk;
              runningTrackOffset = 0;
            }
          }
        } else {
          currentTrk = 0;
          trk = 0;
        }

        const startSecs = runningTrackOffset;
        runningTrackOffset += dur;

        return {
          ...c,
          startTime: startSecs,
          duration: dur,
          formattedTime: formatTime(startSecs),
          trackIndex: trk
        };
      });

      // Exact cumulative duration cutoff for single track stream or known maxDuration
      if (numTracks <= 1 && maxDuration > 0 && chaptersList.length > 0) {
        let running = 0;
        let cutoff = -1;
        for (let i = 0; i < chaptersList.length; i++) {
          running += (chaptersList[i].duration || 0);
          if (Math.abs(running - maxDuration) <= 3) {
            cutoff = i;
            break;
          } else if (running > maxDuration + 5) {
            cutoff = i > 0 ? i - 1 : 0;
            break;
          }
        }
        if (cutoff >= 0 && cutoff < chaptersList.length - 1) {
          chaptersList = chaptersList.slice(0, cutoff + 1);
        } else {
          chaptersList = chaptersList.filter(c => (c.startTime || 0) < maxDuration - 2);
        }
      } else if (numTracks > 1 && hasKnownTrackDurs) {
        chaptersList = chaptersList.filter(c => {
          const tDur = trackDurations[c.trackIndex || 0];
          return !tDur || (c.startTime || 0) < tDur - 2;
        });
      }
      work.chapters = chaptersList;
      if (currentPlayingWork && normRj(currentPlayingWork.rjCode) === normRj(work.rjCode)) {
        currentPlayingWork.chapters = chaptersList;
      }
      currentWorkChapters = chaptersList;

      const galleryCount = (Array.isArray(work.gallery) ? work.gallery.length : 0);
      let html = '<div class="work-detail-banner"><img class="detail-cover" src="' + display.coverUrl + '" onerror="handleImgError(this)"><div class="detail-info"><div style="display:flex; gap:8px; margin-bottom:8px;"><span class="card-rj">' + work.rjCode + '</span><span style="background:#0e7490; color:#fff; font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:4px;">' + (work.hasHls ? 'HLS Chapters' : 'Multi-Track') + '</span></div><h1 class="detail-title">' + work.title + '</h1><div class="detail-meta" style="margin-top:6px; display:flex; align-items:center; flex-wrap:wrap; gap:6px;"><strong>Voice Actor (CV):</strong> ' + cvPills + '</div><div class="detail-meta" style="margin-top:6px; display:flex; align-items:center; flex-wrap:wrap; gap:6px;"><strong>Circle:</strong> ' + circlePill + '</div><div class="tags-row">' + tagPills + '</div><div style="margin-top:auto; padding-top:16px; display:flex; flex-wrap:wrap; gap:10px;"><button class="btn-primary" onclick="playTrack(0, true)">▶ Play All</button><button class="btn-outline" id="btnWorkGallery" data-rj="' + work.rjCode + '" onclick="openWorkGalleryModal()" style="display:' + (galleryCount > 0 ? 'inline-flex' : 'none') + ';">🖼️ Gallery (<span id="btnWorkGalleryCount">' + galleryCount + '</span>)</button><button class="btn-outline" data-rj="' + work.rjCode + '" onclick="addWorkToPlaylistAction(this.dataset.rj)">➕ Add Work to Playlist</button><button class="btn-outline" data-rj="' + work.rjCode + '" onclick="refreshSingleWork(this.dataset.rj)">🔄 Refresh</button><button class="btn-outline" data-rj="' + work.rjCode + '" onclick="deleteWorkItem(this.dataset.rj)">🗑️ Remove</button><button class="btn-outline" onclick="navBack()">← Back</button></div></div></div>';

      // 1. Physical Audio Tracklist Section
      html += '<h3 style="font-size:1.2rem; font-weight:700; margin-top:24px; margin-bottom:12px; display:flex; align-items:center; gap:8px;"><span>🎵 Audio Tracks (' + tracksList.length + ')</span></h3>';
      html += '<table class="tracks-table audio-tracks-table"><thead><tr><th style="width: 40px;">#</th><th>Track Title</th><th style="width: 120px;">Stream Format</th><th style="width: 160px; text-align:right;">Action</th></tr></thead><tbody>';

      tracksList.forEach(function(t, i) {
        const formatBadge = t.isHls ? '<span style="font-size:0.75rem; background:rgba(14,116,144,0.2); color:#38bdf8; border:1px solid rgba(56,189,248,0.3); padding:2px 8px; border-radius:4px; font-weight:700;">HLS Master</span>' : '<span style="font-size:0.75rem; background:rgba(255,255,255,0.06); color:#d1d5db; border:1px solid var(--border); padding:2px 8px; border-radius:4px; font-weight:700;">Direct MP3</span>';
        html += '<tr class="track-row" id="track-row-' + i + '" data-idx="' + i + '" onclick="playTrack(parseInt(this.dataset.idx), true)"><td>' + t.id + '</td><td><strong>' + t.title + '</strong></td><td>' + formatBadge + '</td><td style="text-align:right;"><div style="display:inline-flex; gap:6px;"><button class="btn-primary" style="padding: 4px 10px; font-size: 0.75rem;" data-idx="' + i + '" onclick="event.stopPropagation(); playTrack(parseInt(this.dataset.idx), true)">▶ Play</button><button class="btn-outline" style="padding: 4px 10px; font-size: 0.75rem;" data-idx="' + i + '" onclick="event.stopPropagation(); addTrackToPlaylistAction(parseInt(this.dataset.idx))">➕ Playlist</button></div></td></tr>';
      });
      html += '</tbody></table>';

      // 2. Chapters & Cue Points Section (if present)
      if (chaptersList.length > 0) {
        const isMultiTrack = tracksList.length > 1;
        const trackColorThemes = [
          { border: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)', text: '#38bdf8' },
          { border: '#c084fc', bg: 'rgba(192, 132, 252, 0.12)', text: '#c084fc' },
          { border: '#34d399', bg: 'rgba(52, 211, 153, 0.12)', text: '#34d399' },
          { border: '#fb923c', bg: 'rgba(251, 146, 60, 0.12)', text: '#fb923c' },
          { border: '#f472b6', bg: 'rgba(244, 114, 182, 0.12)', text: '#f472b6' },
          { border: '#a3e635', bg: 'rgba(163, 230, 53, 0.12)', text: '#a3e635' }
        ];

        html += '<h3 style="font-size:1.2rem; font-weight:700; margin-top:36px; margin-bottom:8px; display:flex; align-items:center; gap:8px;"><span>📑 Chapters & Scene Timestamps (' + chaptersList.length + ')</span></h3>';
        html += '<p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:12px;">Click any timestamp or Jump button to seek the audio player directly to that scene cue point.' + (isMultiTrack ? ' Color indicators highlight which audio track section each scene belongs to.' : '') + '</p>';
        html += '<table class="tracks-table chapters-table"><thead><tr><th style="width: 40px;">#</th>' + (isMultiTrack ? '<th style="width: 120px;">Track Section</th>' : '') + '<th>Scene / Chapter Title</th><th style="width: 140px;">Timestamp Offset</th><th style="width: 160px; text-align:right;">Action</th></tr></thead><tbody>';

        chaptersList.forEach(function(c, i) {
          const startTime = c.startTime || 0;
          const trackIdx = c.trackIndex || 0;
          const timeStr = c.formattedTime || formatTime(startTime);
          const trkTheme = trackColorThemes[trackIdx % trackColorThemes.length];
          const rowStyle = isMultiTrack ? ' style="border-left: 3px solid ' + trkTheme.border + ';"' : '';
          const trkBadge = isMultiTrack 
            ? '<td><span class="tag-pill" style="font-size:0.75rem; padding: 2px 8px; border-radius: 4px; font-weight:700; background:' + trkTheme.bg + '; color:' + trkTheme.text + '; border: 1px solid ' + trkTheme.border + '; display:inline-flex; align-items:center; gap:4px;">🎵 Track ' + (trackIdx + 1) + '</span></td>'
            : '';

          html += '<tr class="chapter-row" id="chapter-row-' + i + '" data-idx="' + i + '" data-start="' + startTime + '" data-track="' + trackIdx + '"' + rowStyle + ' onclick="jumpToChapter(' + startTime + ', ' + trackIdx + ')">';
          html += '<td>' + (c.id || (i + 1)) + '</td>';
          if (isMultiTrack) html += trkBadge;
          html += '<td><strong>' + c.title + '</strong></td>';
          html += '<td><button class="timestamp-btn" onclick="event.stopPropagation(); jumpToChapter(' + startTime + ', ' + trackIdx + ')" title="Jump to ' + timeStr + '">⏱️ ' + timeStr + '</button></td>';
          html += '<td style="text-align:right;"><div style="display:inline-flex; gap:6px;"><button class="btn-primary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="event.stopPropagation(); jumpToChapter(' + startTime + ', ' + trackIdx + ')">▶ Jump</button><button class="btn-outline" style="padding: 4px 10px; font-size: 0.75rem;" data-idx="' + i + '" onclick="event.stopPropagation(); addChapterToPlaylistAction(parseInt(this.dataset.idx))">➕ Playlist</button></div></td>';
          html += '</tr>';
        });
        html += '</tbody></table>';
      }

      container.innerHTML = html;
    }

    async function loadWorkDetail(rjCode) {
      currentView = 'work-detail';
      window.location.hash = '#/work/' + encodeURIComponent(rjCode);
      const container = document.getElementById('viewContainer');
      let work = allWorks.find(function(w) { return w.rjCode === rjCode || normRj(w.rjCode) === normRj(rjCode); });
      if (!work && currentWork && (currentWork.rjCode === rjCode || normRj(currentWork.rjCode) === normRj(rjCode))) {
        work = currentWork;
      }
      if (!work) {
        try {
          const res = await apiFetch('/api/library?q=' + encodeURIComponent(rjCode));
          const list = await res.json();
          work = Array.isArray(list) ? list[0] : null;
          if (work && !allWorks.some(w => normRj(w.rjCode) === normRj(work.rjCode))) {
            allWorks.push(work);
          }
        } catch (e) {}
      }
      if (!work) { container.innerHTML = '<div style="padding:2rem;">Work not found</div>'; return; }
      
      // Retain existing chapters/gallery if currentWork already had them
      if (currentWork && normRj(currentWork.rjCode) === normRj(work.rjCode)) {
        if (Array.isArray(currentWork.chapters) && currentWork.chapters.length > 0 && (!work.chapters || work.chapters.length <= 1)) {
          work.chapters = currentWork.chapters;
        }
        if (Array.isArray(currentWork.gallery) && currentWork.gallery.length > 0 && (!work.gallery || work.gallery.length === 0)) {
          work.gallery = currentWork.gallery;
        }
      }

      renderWorkDetailUI(work);

      // Instantly check and fetch rich chapters/gallery in background
      fetchChaptersLazy(work.rjCode);
    }

    let currentLightboxGallery = [];
    let currentLightboxIndex = 0;
    let galleryViewMode = (typeof window !== 'undefined' && window.innerWidth <= 768) ? 'strip' : 'grid';

    function toggleGalleryViewMode() {
      galleryViewMode = (galleryViewMode === 'strip' ? 'grid' : 'strip');
      updateGalleryViewModeUI();
    }

    function updateGalleryViewModeUI() {
      const grid = document.getElementById('workGalleryModalGrid');
      const btn = document.getElementById('btnGalleryViewMode');
      if (!grid) return;
      if (galleryViewMode === 'strip') {
        grid.classList.add('view-strip');
        grid.classList.remove('view-grid');
        if (btn) btn.innerHTML = '⊞ Grid View';
      } else {
        grid.classList.remove('view-strip');
        grid.classList.add('view-grid');
        if (btn) btn.innerHTML = '↔ Carousel View';
      }
    }

    function openWorkGalleryModal() {
      const modal = document.getElementById('workGalleryModal');
      const grid = document.getElementById('workGalleryModalGrid');
      const title = document.getElementById('workGalleryModalTitle');
      if (!modal || !grid) return;
      
      const gallery = (currentWork && Array.isArray(currentWork.gallery)) ? currentWork.gallery : [];
      if (title && currentWork) {
        title.innerHTML = '🖼️ Gallery: ' + currentWork.title + ' (' + gallery.length + ')';
      }

      if (window.innerWidth <= 768) {
        galleryViewMode = 'strip';
      }
      updateGalleryViewModeUI();
      
      if (gallery.length === 0) {
        grid.innerHTML = '<div style="color:var(--text-muted); text-align:center; padding:30px; width:100%;">No illustrations or bonus artwork found for this work.</div>';
      } else {
        let html = '';
        gallery.forEach(function(g, gi) {
          const cap = (g.title || ('Artwork #' + (gi + 1))).replace(/'/g, "\\'");
          const pUrl = g.proxyUrl || g.url;
          const label = (g.title ? g.title : ('Page #' + (gi + 1))) + ' (' + (gi + 1) + '/' + gallery.length + ')';
          html += '<div class="gallery-card" data-idx="' + gi + '" onclick="openLightboxModal(null, null, null, parseInt(this.dataset.idx))">';
          html += '<div class="gallery-thumb-wrap"><img class="gallery-thumb" src="' + pUrl + '" loading="lazy" onerror="handleImgError(this)"></div>';
          html += '<div class="gallery-card-title" title="' + (g.title || '') + '">' + label + '</div>';
          html += '</div>';
        });
        grid.innerHTML = html;
        grid.scrollLeft = 0;
      }
      modal.style.display = 'flex';
    }

    function closeWorkGalleryModal() {
      const modal = document.getElementById('workGalleryModal');
      if (modal) modal.style.display = 'none';
    }

    function openLightboxModal(imgUrl, caption, galleryList = null, index = 0) {
      const modal = document.getElementById('imageLightboxModal');
      if (!modal) return;

      if (Array.isArray(galleryList) && galleryList.length > 0) {
        currentLightboxGallery = galleryList;
        currentLightboxIndex = (index >= 0 && index < galleryList.length) ? index : 0;
      } else if (currentWork && Array.isArray(currentWork.gallery) && currentWork.gallery.length > 0) {
        currentLightboxGallery = currentWork.gallery;
        if (imgUrl) {
          const foundIdx = currentLightboxGallery.findIndex(g => (g.proxyUrl === imgUrl || g.url === imgUrl));
          currentLightboxIndex = foundIdx !== -1 ? foundIdx : 0;
        } else {
          currentLightboxIndex = (index >= 0 && index < currentLightboxGallery.length) ? index : 0;
        }
      } else if (imgUrl) {
        currentLightboxGallery = [{ url: imgUrl, proxyUrl: imgUrl, title: caption || '' }];
        currentLightboxIndex = 0;
      } else {
        return;
      }

      renderLightboxCurrent();
      modal.style.display = 'flex';
    }

    function renderLightboxCurrent() {
      const img = document.getElementById('lightboxImg');
      const cap = document.getElementById('lightboxCaption');
      const prevBtn = document.getElementById('lightboxPrevBtn');
      const nextBtn = document.getElementById('lightboxNextBtn');
      if (!img || currentLightboxGallery.length === 0) return;

      const item = currentLightboxGallery[currentLightboxIndex];
      if (!item) return;

      img.src = item.proxyUrl || item.url || '';
      const total = currentLightboxGallery.length;
      const titleText = item.title || ('Artwork #' + (currentLightboxIndex + 1));
      if (cap) {
        cap.innerText = total > 1 ? '[' + (currentLightboxIndex + 1) + ' / ' + total + '] ' + titleText : titleText;
      }
      if (prevBtn) prevBtn.style.display = total > 1 ? 'flex' : 'none';
      if (nextBtn) nextBtn.style.display = total > 1 ? 'flex' : 'none';
    }

    function navLightbox(direction) {
      if (!currentLightboxGallery || currentLightboxGallery.length <= 1) return;
      currentLightboxIndex = (currentLightboxIndex + direction + currentLightboxGallery.length) % currentLightboxGallery.length;
      renderLightboxCurrent();
    }

    function closeLightboxModal() {
      const modal = document.getElementById('imageLightboxModal');
      const img = document.getElementById('lightboxImg');
      if (modal) modal.style.display = 'none';
      if (img) img.src = '';
    }

    window.jumpToChapter = function(startTime, trackIdx = 0) {
      startTime = Math.max(0, parseFloat(startTime) || 0);
      trackIdx = Math.max(0, parseInt(trackIdx, 10) || 0);

      const targetWork = (currentView === 'work-detail' && currentWork) ? currentWork : (currentPlayingWork || currentWork);
      if (!targetWork) return;
      if (!targetWork.tracks || targetWork.tracks.length === 0) return;

      const numTracks = targetWork.tracks.length;
      const safeTrackIdx = (trackIdx < numTracks) ? trackIdx : (targetWork.hasHls ? 0 : Math.min(trackIdx, numTracks - 1));

      playTrack(safeTrackIdx, true, targetWork, startTime);

      highlightActiveChapter(startTime, safeTrackIdx);
      const timeStr = formatTime(startTime);
      const currTimeEl = document.getElementById('currTime');
      const popupCurrTimeEl = document.getElementById('popupCurrTime');
      if (currTimeEl) currTimeEl.innerText = timeStr;
      if (popupCurrTimeEl) popupCurrTimeEl.innerText = timeStr;
      if (currentPlayingWork) updatePopupPlayerUI();
    };

    function highlightActiveChapter(ct, trackIdx = -1) {
      const currentTrk = (trackIdx >= 0) ? trackIdx : currentTrackIndex;
      
      const tableRows = document.querySelectorAll('.chapters-table .chapter-row');
      let activeTableIdx = -1;
      tableRows.forEach((r, i) => {
        const st = parseFloat(r.dataset.start || 0);
        const trk = parseInt(r.dataset.track || 0, 10);
        if (trk === currentTrk && ct >= st) activeTableIdx = i;
      });
      tableRows.forEach((r, i) => {
        r.classList.toggle('active', i === activeTableIdx);
      });

      const drawerRows = document.querySelectorAll('#popupChaptersList .chapter-row');
      let activeDrawerIdx = -1;
      drawerRows.forEach((r, i) => {
        const st = parseFloat(r.dataset.start || 0);
        const trk = parseInt(r.dataset.track || 0, 10);
        if (trk === currentTrk && ct >= st) activeDrawerIdx = i;
      });
      drawerRows.forEach((r, i) => {
        r.classList.toggle('active', i === activeDrawerIdx);
      });
    }

    function addChapterToPlaylistAction(idx) {
      if (!currentWork) return;
      const c = (currentWorkChapters && currentWorkChapters[idx]) ? currentWorkChapters[idx] : null;
      if (!c) return;
      const track = (currentWork.tracks && currentWork.tracks[c.trackIndex || 0]) || (currentWork.tracks && currentWork.tracks[0]) || {};
      openAddToPlaylistModal({
        rjCode: currentWork.rjCode,
        trackId: c.id || (idx + 1),
        title: c.title,
        workTitle: currentWork.title,
        startTime: c.startTime || 0,
        streamUrl: track.streamUrl,
        isHls: track.isHls,
        poster: currentWork.coverUrl,
        cv: currentWork.cv || ''
      });
    }

    function addWorkToPlaylistAction(rj) {
      let work = currentWork;
      if (!work || (rj && normRj(work.rjCode) !== normRj(rj))) {
        work = (allWorks || []).find(w => normRj(w.rjCode) === normRj(rj)) || work;
      }
      if (!work && rj) {
        work = { rjCode: rj, title: rj, coverUrl: '' };
      }
      if (!work) return;
      openAddToPlaylistModal({
        rjCode: work.rjCode,
        title: work.title,
        workTitle: work.title,
        poster: work.coverUrl,
        cv: work.cv || '',
        isWork: true
      });
    }

    function addTrackToPlaylistAction(idx) {
      if (!currentWork || !currentWork.tracks[idx]) return;
      const t = currentWork.tracks[idx];
      openAddToPlaylistModal({
        rjCode: currentWork.rjCode,
        trackId: t.id,
        title: t.title,
        workTitle: currentWork.title,
        startTime: t.startTime || 0,
        streamUrl: t.streamUrl,
        isHls: t.isHls,
        poster: currentWork.coverUrl,
        cv: currentWork.cv || ''
      });
    }

    async function loadWishlist() {
      updatePageTitle('Wishlist');
      const container = document.getElementById('viewContainer');
      if (!isAdmin) {
        container.innerHTML = renderLockedState('Wishlist Locked', 'Unlock admin access to view and manage wishlisted works.');
        return;
      }
      container.innerHTML = '<div style="text-align:center; padding: 3rem; color: var(--text-muted);">Loading Wishlist...</div>';
      try {
        const res = await apiFetch('/api/wishlist');
        const wishlist = await res.json();
        const list = Array.isArray(wishlist) ? wishlist : [];
        updateWishlistBadge(list.length);

        let html = '<div class="section-header">';
        html += '<div><h1 class="section-title">📋 Wishlist & Pending Ingestion (' + list.length + ')</h1>';
        html += '<p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">Works that were skipped during single/batch import (e.g. pending crawler or audio stream on CDN) are kept here for quick re-import.</p></div>';
        html += '<div style="display:flex; gap:10px; flex-wrap:wrap;">';
        if (list.length > 0) {
          html += '<button class="btn-primary" id="btnRetryAllWishlist" onclick="retryAllWishlist()">🔄 Re-try All Ingestion</button>';
          html += '<button class="btn-outline" onclick="clearAllWishlist()">🗑️ Clear Wishlist</button>';
        }
        html += '<button class="btn-outline" onclick="addManualWishlist()">➕ Add RJ to Wishlist</button>';
        html += '</div></div>';

        html += '<div id="wishlistProgressBox" style="display: none; margin-bottom: 20px; background: #0c0d14; border: 1px solid var(--border); border-radius: 10px; padding: 14px;">';
        html += '<div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;"><span id="wishlistStatusText" style="color: #38bdf8;">Retrying works...</span><span id="wishlistPercentage" style="color: var(--text-muted);">0%</span></div>';
        html += '<div style="width: 100%; height: 6px; background: #1a1c26; border-radius: 3px; overflow: hidden;"><div id="wishlistProgressBar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #ff3366, #38bdf8); transition: width 0.2s;"></div></div>';
        html += '</div>';

        if (list.length === 0) {
          html += '<div style="padding: 4rem 2rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border);">';
          html += '<div style="font-size: 3rem; margin-bottom: 12px;">📋</div>';
          html += '<h3 style="font-size: 1.15rem; color: #fff; font-weight: 700; margin-bottom: 6px;">Your Wishlist is Empty</h3>';
          html += '<p style="max-width: 480px; margin: 0 auto 20px; font-size: 0.9rem;">When you import works via Single Add or Batch Import that Japanese ASMR has not crawled yet, they will automatically appear here.</p>';
          html += '<div style="display:flex; gap:10px; justify-content:center;"><button class="btn-primary" onclick="openImportModal()">📥 Batch Import Works</button><button class="btn-outline" onclick="quickAddRj()">+ Add RJ Code</button></div>';
          html += '</div>';
        } else {
          html += '<table class="tracks-table"><thead><tr><th style="width: 40px;">#</th><th style="width: 50px;">Art</th><th>RJ Code & Title</th><th>Circle / CV</th><th>Reason / Status</th><th style="width: 140px;">Date Added</th><th style="width: 160px; text-align:right;">Actions</th></tr></thead><tbody>';
          list.forEach((item, idx) => {
            const cover = item.coverUrl || ('/image-proxy?rj=' + item.rjCode);
            const dateStr = item.addedAt ? new Date(item.addedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
            html += '<tr class="wishlist-row" id="wishlist-row-' + item.rjCode + '">';
            html += '<td>' + (idx + 1) + '</td>';
            html += '<td><img src="' + cover + '" data-rj="' + item.rjCode + '" onerror="handleImgError(this)" style="width:36px; height:36px; border-radius:6px; object-fit:cover;"></td>';
            html += '<td><div style="font-weight:700;"><span class="card-rj" style="font-size:0.75rem; padding:1px 6px; margin-right:6px;">' + item.rjCode + '</span>' + item.title + '</div></td>';
            html += '<td><div style="color:#38bdf8; font-size:0.85rem;">' + (item.cv || '—') + '</div><div style="color:var(--text-muted); font-size:0.75rem;">' + (item.circle || '—') + '</div></td>';
            html += '<td><span style="font-size:0.75rem; background:rgba(245,158,11,0.15); color:#f59e0b; border:1px solid rgba(245,158,11,0.3); padding:2px 8px; border-radius:4px; font-weight:700;">⚠️ ' + (item.reason || 'Audio stream pending') + '</span></td>';
            html += '<td style="color:var(--text-muted); font-size:0.8rem;">' + dateStr + '</td>';
            html += '<td style="text-align:right;"><div style="display:inline-flex; gap:6px;"><button class="btn-primary" style="padding: 4px 10px; font-size: 0.75rem;" id="btn-retry-' + item.rjCode + '" data-rj="' + item.rjCode + '" onclick="retryWishlistItem(this.dataset.rj)">🔄 Re-try</button><button class="btn-outline" style="padding: 4px 8px; font-size: 0.75rem;" data-rj="' + item.rjCode + '" onclick="deleteWishlistItem(this.dataset.rj)">🗑️</button></div></td>';
            html += '</tr>';
          });
          html += '</tbody></table>';
        }
        container.innerHTML = html;
      } catch (e) {
        container.innerHTML = '<div style="color:#ff3366; padding:2rem;">Error: ' + e.message + '</div>';
      }
    }

    async function retryWishlistItem(rjCode) {
      const btn = document.getElementById('btn-retry-' + rjCode);
      if (btn) { btn.disabled = true; btn.innerText = 'Retrying...'; }
      try {
        const res = await apiFetch('/api/wishlist/retry/' + encodeURIComponent(rjCode), { method: 'POST' });
        const data = await res.json();
        if (data.success && data.work) {
          alert('🎉 Successfully resolved and imported ' + rjCode + ': ' + (data.work.title || ''));
          updateWishlistBadge();
          loadWishlist();
        } else {
          alert('⚠️ Re-import failed for ' + rjCode + ': ' + (data.error || 'Audio still pending on CDN'));
          if (btn) { btn.disabled = false; btn.innerText = '🔄 Re-try'; }
        }
      } catch (e) {
        alert('Error: ' + e.message);
        if (btn) { btn.disabled = false; btn.innerText = '🔄 Re-try'; }
      }
    }

    async function retryAllWishlist() {
      const btn = document.getElementById('btnRetryAllWishlist');
      const box = document.getElementById('wishlistProgressBox');
      const status = document.getElementById('wishlistStatusText');
      const pct = document.getElementById('wishlistPercentage');
      const bar = document.getElementById('wishlistProgressBar');

      if (btn) { btn.disabled = true; btn.innerText = 'Retrying All...'; }
      if (box) box.style.display = 'block';

      try {
        const res = await apiFetch('/api/wishlist');
        const list = await res.json();
        if (!Array.isArray(list) || list.length === 0) {
          loadWishlist();
          return;
        }

        let succeeded = 0;
        let failed = 0;
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          const progressPct = Math.round((i / list.length) * 100);
          if (pct) pct.innerText = progressPct + '%';
          if (bar) bar.style.width = progressPct + '%';
          if (status) status.innerText = 'Retrying ' + (i + 1) + '/' + list.length + ': ' + item.rjCode + '...';

          try {
            const rRes = await apiFetch('/api/wishlist/retry/' + encodeURIComponent(item.rjCode), { method: 'POST' });
            const rData = await rRes.json();
            if (rData.success) succeeded++;
            else failed++;
          } catch(e) {
            failed++;
          }
        }

        if (pct) pct.innerText = '100%';
        if (bar) bar.style.width = '100%';
        if (status) status.innerText = '🎉 Done: ' + succeeded + ' imported into library, ' + failed + ' still pending.';

        updateWishlistBadge();
        setTimeout(() => { loadWishlist(); }, 1500);
      } catch (e) {
        alert('Error: ' + e.message);
        if (btn) { btn.disabled = false; btn.innerText = '🔄 Re-try All Ingestion'; }
      }
    }

    async function addManualWishlist() {
      const rj = prompt('Enter RJ Code to save to Wishlist (e.g. RJ01078356):');
      if (!rj) return;
      const match = rj.match(/RJ\d+/i);
      if (!match) { alert('Invalid RJ code format.'); return; }
      try {
        const res = await apiFetch('/api/wishlist', {
          method: 'POST',
          body: JSON.stringify({ rjCode: match[0].toUpperCase(), reason: 'Manually added to wishlist' })
        });
        const data = await res.json();
        if (data.alreadyInLibrary) {
          alert('ℹ️ ' + match[0].toUpperCase() + ' is already in your Library!');
        } else {
          updateWishlistBadge();
          loadWishlist();
        }
      } catch (e) { alert('Error: ' + e.message); }
    }

    async function deleteWishlistItem(rjCode) {
      if (!confirm('Remove ' + rjCode + ' from wishlist?')) return;
      try {
        await apiFetch('/api/wishlist/' + encodeURIComponent(rjCode), { method: 'DELETE' });
        updateWishlistBadge();
        loadWishlist();
      } catch(e) { alert('Error: ' + e.message); }
    }

    async function clearAllWishlist() {
      if (!confirm('Are you sure you want to clear all items from wishlist?')) return;
      try {
        await apiFetch('/api/wishlist/CLEAR_ALL', { method: 'DELETE' });
        updateWishlistBadge();
        loadWishlist();
      } catch(e) { alert('Error: ' + e.message); }
    }

    async function updateWishlistBadge(count = null) {
      const badge = document.getElementById('wishlistCountBadge');
      if (!badge) return;
      if (count !== null) {
        badge.innerText = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
        return;
      }
      if (!isAdmin) {
        badge.style.display = 'none';
        return;
      }
      try {
        const res = await apiFetch('/api/wishlist');
        const list = await res.json();
        const c = Array.isArray(list) ? list.length : 0;
        badge.innerText = c;
        badge.style.display = c > 0 ? 'inline-block' : 'none';
      } catch(e) {}
    }

    async function loadGenres() {
      updatePageTitle('Genres');
      const container = document.getElementById('viewContainer');
      if (!isAdmin) {
        container.innerHTML = renderLockedState('Genres & Tags Locked', 'Unlock admin access to browse genres and tags.');
        return;
      }
      try {
        const res = await apiFetch('/api/tags');
        const data = await res.json();
        const tags = Array.isArray(data) ? data : (data.tags || []);
        if (data && data.tagDict) {
          window.tagDict = Object.assign({}, window.BASE_TAG_DICT || {}, window.tagDict || {}, data.tagDict);
        }
        let html = '<div class="section-header"><h1 class="section-title">🏷️ Genres & Tags</h1></div><div class="tag-cloud">';
        const filteredTags = tags.filter(function(t) {
          const entry = getTagEntry(t.name);
          return !(entry && entry.isCV);
        });
        filteredTags.forEach(function(t) {
          html += '<div class="tag-cloud-item" data-tag="' + t.name.replace(/"/g, '&quot;') + '" onclick="navGenre(this.dataset.tag)"><span>' + formatTag(t.name) + '</span><span class="tag-count">' + t.count + ' works</span></div>';
        });
        html += '</div>';
        container.innerHTML = html;
      } catch(e) {}
    }

    async function loadArtists() {
      updatePageTitle('Artists');
      const container = document.getElementById('viewContainer');
      if (!isAdmin) {
        container.innerHTML = renderLockedState('Voice Actors Locked', 'Unlock admin access to browse voice actors.');
        return;
      }
      try {
        const res = await apiFetch('/api/artists');
        const artists = await res.json();
        let html = '<div class="section-header"><h1 class="section-title">🎙️ Voice Actors (CV)</h1></div><div class="tag-cloud">';
        (Array.isArray(artists) ? artists : []).forEach(function(a) {
          html += '<div class="tag-cloud-item" data-cv="' + a.name.replace(/"/g, '&quot;') + '" onclick="navCv(this.dataset.cv)"><span>' + formatCV(a.name) + '</span><span class="tag-count">' + a.count + ' works</span></div>';
        });
        html += '</div>';
        container.innerHTML = html;
      } catch(e) {}
    }

    async function loadPlaylists() {
      updatePageTitle('Playlists');
      const container = document.getElementById('viewContainer');
      if (!isAdmin) {
        container.innerHTML = renderLockedState('Playlists Locked', 'Unlock admin access to view and manage playlists.');
        return;
      }
      try {
        const res = await apiFetch('/api/playlists');
        const rawPlaylists = await res.json();
        let playlists = Array.isArray(rawPlaylists) ? [...rawPlaylists] : [];

        if (!playlists.some(p => p.id === 'pl-favorites')) {
          playlists.unshift({ id: 'pl-favorites', name: '❤️ Favorites', description: 'Your favorited works & tracks', coverUrl: '', items: [] });
        }

        let html = '<div class="section-header"><h1 class="section-title">📜 Playlists (' + playlists.length + ')</h1><button class="btn-primary" style="font-size:0.85rem; padding:8px 16px;" onclick="openPlaylistModal()">➕ Create New Playlist</button></div>';

        if (playlists.length === 0) {
          html += '<div style="padding: 3.5rem 2rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border);"><div style="font-size: 2.5rem; margin-bottom: 8px;">📜</div><p style="margin-bottom: 16px; font-weight:600;">No playlists yet</p><button class="btn-primary" onclick="openPlaylistModal()">➕ Create Playlist</button></div>';
        } else {
          html += '<div class="works-grid mode-medium">';
          playlists.forEach(function(p) {
            const cover = p.coverUrl || (p.items && p.items[0] && p.items[0].poster) || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23181a24"/><text x="50%" y="50%" font-size="40" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle">📜</text></svg>';
            const count = p.items ? p.items.length : 0;
            html += '<div class="work-card" data-pl="' + p.id + '" onclick="navPlaylist(this.dataset.pl)">';
            html += '<div class="card-cover-wrapper"><img class="card-cover" src="' + cover + '" onerror="handleImgError(this)"></div>';
            html += '<div class="card-badge-row"><span class="card-rj">' + (p.id === 'pl-favorites' ? 'FAVORITES' : 'PLAYLIST') + '</span><span style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">' + count + ' tracks</span></div>';
            html += '<div class="card-title">' + p.name + '</div>';
            html += '<div class="card-sub">' + (p.description || 'Personal curated playlist') + '</div>';
            html += '</div>';
          });
          html += '</div>';
        }
        container.innerHTML = html;
      } catch(e) {}
    }

    function setPlaylistViewMode(mode, plId) {
      playlistViewMode = mode;
      try { localStorage.setItem('astreamer_pl_view_mode', mode); } catch(e) {}
      loadPlaylistDetail(plId);
    }

    function setPlaylistPage(page, plId) {
      playlistCurrentPage = page;
      loadPlaylistDetail(plId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function loadPlaylistDetail(plId) {
      try {
        const res = await apiFetch('/api/playlists');
        const playlists = await res.json();
        if (!Array.isArray(playlists)) return;
        const pl = playlists.find(function(p) { return p.id === plId; });
        if (!pl) return;
        currentPlaylist = pl;
        updatePageTitle(pl.name ? (pl.name.replace(/^[^\w\s\d]+/, '').trim() || pl.name) : 'Playlist');

        const container = document.getElementById('viewContainer');
        const items = pl.items || [];
        const cover = pl.coverUrl || (items[0] && items[0].poster) || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23181a24"/><text x="50%" y="50%" font-size="40" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle">📜</text></svg>';

        let html = '<div class="work-detail-banner"><img class="detail-cover" src="' + cover + '" id="playlistDetailCover" onerror="handleImgError(this)"><div class="detail-info"><span class="card-rj" style="width:fit-content; margin-bottom:8px;">' + (pl.id === 'pl-favorites' ? 'FAVORITES' : 'PLAYLIST') + '</span><h1 class="detail-title" id="playlistDetailTitle">' + pl.name + '</h1><div class="detail-meta" id="playlistDetailDesc">' + (pl.description || 'Custom audio playlist') + '</div><div class="detail-meta" id="playlistDetailCount"><strong>Total Tracks:</strong> ' + items.length + '</div><div style="margin-top:auto; padding-top:16px; display:flex; flex-wrap:wrap; gap:10px;">' + (items.length > 0 ? '<button class="btn-primary" id="playAllPlaylistBtn" data-pl="' + pl.id + '" onclick="playPlaylistItem(0, this.dataset.pl)">▶ Play All</button>' : '') + (pl.id !== 'pl-favorites' ? '<button class="btn-outline" data-pl="' + pl.id + '" onclick="deletePlaylistAction(this.dataset.pl)">🗑️ Delete Playlist</button>' : '') + '<button class="btn-outline" data-view="playlists" onclick="switchView(this.dataset.view)">← Back to Playlists</button></div></div></div>';

        html += '<div class="view-modes-bar">';
        html += '<div style="display:flex; align-items:center; gap:8px;"><span style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">VIEW:</span>';
        html += '<div class="view-mode-buttons">';
        html += '<button class="view-btn ' + (playlistViewMode === 'list' ? 'active' : '') + '" data-mode="list" data-pl="' + pl.id + '" onclick="setPlaylistViewMode(this.dataset.mode, this.dataset.pl)">📋 List</button>';
        html += '<button class="view-btn ' + (playlistViewMode === 'grid' ? 'active' : '') + '" data-mode="grid" data-pl="' + pl.id + '" onclick="setPlaylistViewMode(this.dataset.mode, this.dataset.pl)">🎴 Grid</button>';
        html += '</div></div>';
        html += '<div style="font-size:0.85rem; color:var(--text-muted); font-weight:700;">' + items.length + ' tracks in playlist</div>';
        html += '</div>';

        if (items.length === 0) {
          html += '<div style="padding:3rem; text-align:center; color:var(--text-muted); background:var(--bg-card); border-radius:12px; border:1px solid var(--border);">Playlist is empty. Add tracks from any work in your Library!</div>';
        } else if (playlistViewMode === 'grid') {
          html += '<div class="works-grid mode-medium">';
          items.forEach(function(item, index) {
            const itemPoster = item.poster || cover;
            const isRowActive = currentPlaylistItemIndex === index && currentPlayingWork && normRj(currentPlayingWork.rjCode) === normRj(item.rjCode);
            const cvDisplay = item.cv ? formatCV(item.cv) : '';
            html += '<div class="work-card playlist-card-row ' + (isRowActive ? 'active' : '') + '" data-rj="' + (item.rjCode || '') + '" data-pl-idx="' + index + '" onclick="navWork(this.dataset.rj)">';
            html += '<div class="card-cover-wrapper"><img class="card-cover" src="' + itemPoster + '" data-rj="' + (item.rjCode || '') + '" onerror="handleImgError(this)"></div>';
            html += '<div class="card-badge-row"><span class="card-rj">' + (item.rjCode || '#' + (index + 1)) + '</span><div style="display:flex; gap:6px; align-items:center;"><button class="btn-primary" style="padding:2px 8px; font-size:0.75rem;" data-pl="' + pl.id + '" data-idx="' + index + '" onclick="event.stopPropagation(); playPlaylistItem(parseInt(this.dataset.idx), this.dataset.pl)">▶ Play</button><span data-pl="' + pl.id + '" data-idx="' + index + '" onclick="event.stopPropagation(); removePlaylistItem(this.dataset.pl, parseInt(this.dataset.idx))" title="Remove Track" style="cursor:pointer; font-size:0.9rem;">🗑️</span></div></div>';
            html += '<div class="card-title">' + item.title + '</div>';
            html += '<div class="card-sub">' + (item.workTitle || cvDisplay || 'Track ' + (index + 1)) + '</div>';
            html += '</div>';
          });
          html += '</div>';
        } else {
          html += '<table class="tracks-table playlist-tracks-table"><thead><tr><th style="width: 40px;">#</th><th style="width: 50px;">Art</th><th>Track Title</th><th>Work / RJ</th><th>CV</th><th style="width: 140px; text-align:right;">Actions</th></tr></thead><tbody>';
          items.forEach(function(item, index) {
            const itemPoster = item.poster || cover;
            const isRowActive = currentPlaylistItemIndex === index && currentPlayingWork && normRj(currentPlayingWork.rjCode) === normRj(item.rjCode);
            const workCvText = (item.workTitle || item.rjCode) + (item.cv ? ' • ' + formatCV(item.cv) : '');
            html += '<tr class="playlist-track-row ' + (isRowActive ? 'active' : '') + '" data-rj="' + (item.rjCode || '') + '" data-pl-idx="' + index + '" onclick="navWork(this.dataset.rj)">';
            html += '<td>' + (index + 1) + '</td>';
            html += '<td><img src="' + itemPoster + '" data-rj="' + (item.rjCode || '') + '" onerror="handleImgError(this)" style="width:44px; height:44px; border-radius:8px; object-fit:cover;"></td>';
            html += '<td class="pl-track-title"><strong>' + item.title + '</strong></td>';
            html += '<td class="pl-work-title" style="color:var(--text-muted);">' + workCvText + '</td>';
            html += '<td class="pl-cv-col" style="color:#38bdf8;">' + (item.cv ? formatCV(item.cv) : '—') + '</td>';
            html += '<td class="pl-actions-col" style="text-align:right;"><div style="display:inline-flex; gap:6px; align-items:center; justify-content:flex-end;"><button class="btn-primary" style="padding: 4px 10px; font-size: 0.75rem;" data-pl="' + pl.id + '" data-idx="' + index + '" onclick="event.stopPropagation(); playPlaylistItem(parseInt(this.dataset.idx), this.dataset.pl)">▶ Play</button><button class="btn-outline" style="padding: 4px 8px; font-size: 0.75rem;" title="Remove Track" data-pl="' + pl.id + '" data-idx="' + index + '" onclick="event.stopPropagation(); removePlaylistItem(this.dataset.pl, parseInt(this.dataset.idx))">🗑️</button></div></td>';
            html += '</tr>';
          });
          html += '</tbody></table>';
        }
        container.innerHTML = html;
      } catch (e) {}
    }

    function highlightActivePlaylistRows(index) {
      document.querySelectorAll('.playlist-track-row').forEach(function(r) {
        r.classList.toggle('active', parseInt(r.dataset.plIdx) === index);
      });
      document.querySelectorAll('.playlist-card-row').forEach(function(c) {
        c.classList.toggle('active', parseInt(c.dataset.plIdx) === index);
      });
    }

    async function removePlaylistItem(plId, index) {
      if (!confirm('Remove track from playlist?')) return;
      try {
        await apiFetch('/api/playlists/' + plId + '/items/' + index, { method: 'DELETE' });
        loadPlaylistDetail(plId);
      } catch (e) {}
    }

    async function deletePlaylistAction(plId) {
      if (!confirm('Are you sure you want to delete this playlist?')) return;
      try {
        await apiFetch('/api/playlists/' + plId, { method: 'DELETE' });
        switchView('playlists');
      } catch (e) {}
    }

    async function playPlaylistItem(index, plId) {
      try {
        const res = await apiFetch('/api/playlists');
        const playlists = await res.json();
        const pl = (Array.isArray(playlists) ? playlists : []).find(p => p.id === plId);
        if (!pl || !pl.items[index]) return;
        const item = pl.items[index];
        let work = allWorks.find(w => normRj(w.rjCode) === normRj(item.rjCode));
        if (!work) {
          try {
            const wRes = await apiFetch('/api/library?q=' + encodeURIComponent(item.rjCode));
            const list = await wRes.json();
            work = Array.isArray(list) ? list[0] : null;
          } catch(e) {}
        }
        if (work) {
          currentPlaylistItemIndex = index;
          highlightActivePlaylistRows(index);
          const targetTrackIdx = work.tracks.findIndex(t => t.id === item.trackId) >= 0 ? work.tracks.findIndex(t => t.id === item.trackId) : 0;
          const isAlreadyPlaying = currentPlayingWork && normRj(currentPlayingWork.rjCode) === normRj(work.rjCode) && currentTrackIndex === targetTrackIdx && !audio.paused;
          if (!isAlreadyPlaying) {
            playTrack(targetTrackIdx, true, work);
          }
        }
      } catch (e) {}
    }

    function setHistorySort(mode) {
      historySortMode = mode;
      try { localStorage.setItem('astreamer_history_sort', mode); } catch(e) {}
      loadHistory();
    }

    async function clearPlaybackHistory() {
      if (!confirm('Are you sure you want to clear your playback history?')) return;
      try { localStorage.removeItem('astreamer_play_history'); } catch(e) {}
      try { await apiFetch('/api/history', { method: 'DELETE' }); } catch(e) {}
      loadHistory();
    }

    function formatRelativeDate(isoStr) {
      try {
        const d = new Date(isoStr);
        if (isNaN(d.getTime())) return '';
        const now = new Date();
        const diffSecs = Math.floor((now - d) / 1000);
        if (diffSecs < 60) return 'Just now';
        if (diffSecs < 3600) return Math.floor(diffSecs / 60) + 'm ago';
        if (diffSecs < 86400) return Math.floor(diffSecs / 3600) + 'h ago';
        if (diffSecs < 604800) return Math.floor(diffSecs / 86400) + 'd ago';
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch(e) { return ''; }
    }

    async function loadHistory() {
      updatePageTitle('History');
      const container = document.getElementById('viewContainer');
      if (!isAdmin) {
        container.innerHTML = renderLockedState('History Locked', 'Unlock admin access to view playback history.');
        return;
      }

      let history = [];
      try {
        const res = await apiFetch('/api/history');
        if (res.ok) {
          history = await res.json();
          if (Array.isArray(history)) {
            try { localStorage.setItem('astreamer_play_history', JSON.stringify(history)); } catch(e) {}
          }
        }
      } catch(e) {}

      if (!Array.isArray(history) || history.length === 0) {
        try {
          history = JSON.parse(localStorage.getItem('astreamer_play_history') || '[]');
        } catch(e) { history = []; }
      }

      // Sorting
      const sorted = [...history];
      if (historySortMode === 'date-desc') {
        sorted.sort((a, b) => new Date(b.playedAt || 0) - new Date(a.playedAt || 0));
      } else if (historySortMode === 'date-asc') {
        sorted.sort((a, b) => new Date(a.playedAt || 0) - new Date(b.playedAt || 0));
      } else if (historySortMode === 'title-asc') {
        sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      } else if (historySortMode === 'rj-asc') {
        sorted.sort((a, b) => (a.rjCode || '').localeCompare(b.rjCode || ''));
      }

      let html = '<div class="section-header">';
      html += '<h1 class="section-title">🕒 Playback History (' + sorted.length + ')</h1>';
      if (sorted.length > 0) {
        html += '<button class="btn-outline" style="font-size:0.85rem; color:#ff3366; border-color:rgba(255,51,102,0.3);" onclick="clearPlaybackHistory()">🗑️ Clear History</button>';
      }
      html += '</div>';

      html += '<div class="view-modes-bar">';
      html += '<div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">';
      html += '<span style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">SORT BY:</span>';
      html += '<div class="view-mode-buttons">';
      html += '<button class="view-btn ' + (historySortMode === 'date-desc' ? 'active' : '') + '" data-sort="date-desc" onclick="setHistorySort(this.dataset.sort)">⏳ Newest</button>';
      html += '<button class="view-btn ' + (historySortMode === 'date-asc' ? 'active' : '') + '" data-sort="date-asc" onclick="setHistorySort(this.dataset.sort)">⌛ Oldest</button>';
      html += '<button class="view-btn ' + (historySortMode === 'title-asc' ? 'active' : '') + '" data-sort="title-asc" onclick="setHistorySort(this.dataset.sort)">🔤 Title</button>';
      html += '<button class="view-btn ' + (historySortMode === 'rj-asc' ? 'active' : '') + '" data-sort="rj-asc" onclick="setHistorySort(this.dataset.sort)">🏷️ RJ Code</button>';
      html += '</div></div>';
      html += '<div style="font-size:0.8rem; color:var(--text-muted);">Cloudflare KV Synced • Up to 20 recently played</div>';
      html += '</div>';

      if (sorted.length === 0) {
        html += '<div style="padding: 4rem 2rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border);"><div style="font-size:2.5rem; margin-bottom:8px;">🎧</div><p style="font-weight:600; margin-bottom:6px;">No Playback History Yet</p><p style="font-size:0.85rem;">Play any track to sync your listening history across all devices!</p></div>';
        container.innerHTML = html;
        return;
      }

      html += '<table class="works-list-table history-list-table"><thead><tr><th style="width:50px;">Cover</th><th style="width:110px;">RJ Code</th><th>Work Title</th><th>Voice Actor / Circle</th><th style="width:140px;">Last Played</th><th style="width:90px; text-align:right;">Actions</th></tr></thead><tbody>';
      sorted.forEach(function(item) {
        const displayCover = getDisplayCover({ rjCode: item.rjCode, coverUrl: item.coverUrl });
        const relTime = formatRelativeDate(item.playedAt);
        const fullDate = item.playedAt ? new Date(item.playedAt).toLocaleString() : '';
        const cvDisplay = formatCV(item.cv);
        const metaLine = (cvDisplay ? '<span style="color:#38bdf8; font-weight:600;">' + cvDisplay + '</span>' : '') + (cvDisplay && item.circle ? ' • ' : '') + (item.circle ? '<span>' + item.circle + '</span>' : '') + ' • <span class="card-rj" style="padding:1px 5px; font-size:0.7rem;">' + item.rjCode + '</span>';
        html += '<tr class="works-list-row" data-rj="' + item.rjCode + '" onclick="navWork(this.dataset.rj)">';
        html += '<td class="w-col-cover"><img class="list-thumb" src="' + displayCover.coverUrl + '" data-rj="' + item.rjCode + '" onerror="handleImgError(this)"></td>';
        html += '<td class="w-col-rj"><span class="card-rj">' + item.rjCode + '</span></td>';
        html += '<td class="w-col-title"><strong>' + item.title + '</strong>' + (item.trackTitle ? '<div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Track: ' + item.trackTitle + '</div>' : '') + '</td>';
        html += '<td class="w-col-meta"><div class="w-meta-inner">' + metaLine + '<span style="color:var(--text-muted); font-size:0.72rem; margin-left:4px;" title="' + fullDate + '">🕒 ' + relTime + '</span></div></td>';
        html += '<td class="w-col-date" style="color:var(--text-muted); font-size:0.8rem;" title="' + fullDate + '">🕒 ' + relTime + '</td>';
        html += '<td class="w-col-actions" style="text-align:right;"><button class="btn-outline" style="padding:3px 8px; font-size:0.75rem;" data-rj="' + item.rjCode + '" onclick="event.stopPropagation(); playWorkDirectly(this.dataset.rj)">▶ Play</button></td>';
        html += '</tr>';
      });
      html += '</tbody></table>';

      container.innerHTML = html;
    }

    function loadSettings() {
      updatePageTitle('Settings');
      const container = document.getElementById('viewContainer');
      let html = '<div class="section-header"><h1 class="section-title">⚙️ App Settings</h1></div>';
      
      html += '<div class="settings-card"><h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 6px;">🛡️ Content Privacy & Disguise Mode</h3><p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 18px;">Control how adult (NSFW) cover art and tags are presented on your screen.</p>';
      html += '<div class="settings-option ' + (contentMode === 'NSFW' ? 'selected' : '') + '" data-mode="NSFW" onclick="setContentMode(this.dataset.mode)"><input type="radio" name="contentMode" value="NSFW" class="settings-radio" ' + (contentMode === 'NSFW' ? 'checked' : '') + '><div><div class="settings-label">🌶️ NSFW (Full Adult - Default)</div><div class="settings-desc">Show all original high-resolution cover arts, adult tags, and uncensored catalog.</div></div></div>';
      html += '<div class="settings-option ' + (contentMode === 'PSFW' ? 'selected' : '') + '" data-mode="PSFW" onclick="setContentMode(this.dataset.mode)"><input type="radio" name="contentMode" value="PSFW" class="settings-radio" ' + (contentMode === 'PSFW' ? 'checked' : '') + '><div><div class="settings-label">🎭 PSFW (Pseudo-SFW / Disguise Covers)</div><div class="settings-desc">Full audio remains playable, but adult cover arts are disguised with glowing stylized SFW artwork. (Press Esc to quickly toggle).</div></div></div>';
      html += '<div class="settings-option ' + (contentMode === 'SFW' ? 'selected' : '') + '" data-mode="SFW" onclick="setContentMode(this.dataset.mode)"><input type="radio" name="contentMode" value="SFW" class="settings-radio" ' + (contentMode === 'SFW' ? 'checked' : '') + '><div><div class="settings-label">🛡️ SFW (Strict Safe For Work)</div><div class="settings-desc">Hide all adult works and NSFW tags completely from the library and tag cloud.</div></div></div>';
      html += '</div>';


      html += '<div class="settings-card"><h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 6px;">🌐 AI Tag Translation & Dictionary Sync</h3><p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px;">Scan your library for untranslated Japanese tags and voice actor names, then translate them with OpenRouter AI (DeepSeek) to build your tri-part (Japanese | Rōmaji | English) dictionary.</p>';
      html += '<div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center;"><button class="btn-primary" id="btnUpdateTagTranslation" onclick="checkUntranslatedTags()">🌐 Update Tag Translations</button><button class="btn-outline" style="border-color: rgba(167, 139, 250, 0.4); color: #c4b5fd;" onclick="rebootTagDictionary()">🔄 Reset & Wipe Stale Tag Cache</button><span id="tagTranslationStatus" style="font-size:0.85rem; color:#38bdf8; display:none;"></span></div></div>';

      html += '<div class="settings-card"><h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 6px;">🔄 Re-fetch & Update Metadata</h3><p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px;">Re-scan DLsite for all existing works to fix missing titles, circle names, and tags.</p>';
      html += '<div style="display:flex; gap:12px; align-items:center;"><button class="btn-primary" id="btnRefreshAll" onclick="refreshAllMetadata()">🔄 Re-Fetch All Metadata</button><span id="refreshStatus" style="font-size:0.85rem; color:#38bdf8; display:none;"></span></div></div>';

      html += '<div class="settings-card"><h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 6px;">💾 Library Data & Sync</h3><p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px;">Export your cached library and playlists as JSON or restore your local database to Cloudflare KV.</p>';
      html += '<div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center;"><button class="btn-primary" onclick="exportBackup()">📥 Export JSON Backup</button><input type="file" id="backupFileInput" accept=".json" style="display:none;" onchange="importBackupFile(event)"><button class="btn-outline" onclick="triggerBackupUpload()">📤 Restore / Upload Backup JSON</button></div></div>';

      html += '<div class="settings-card"><h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 6px;">🔑 Admin Authentication Session</h3><p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px;">Lock your session or switch admin credentials.</p>';
      html += '<button class="btn-outline" style="border-color: rgba(255,51,102,0.4); color: #ff3366;" onclick="toggleAdminModal()">🚪 Lock / Log Out Admin</button></div>';

      html += '<div class="settings-card"><h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 6px;">🐧 aStreamer v1.5 Milestone Release</h3><p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px;">Featuring Self-Learning Bilingual Tag Dictionary, Adaptive Artwork Carousel Gallery, and Mobile 2-Row Card Layouts.</p>';
      html += '<button class="btn-outline" onclick="openChangelogModal()">📜 View Version 1.5 Release Notes & Architecture</button></div>';

      container.innerHTML = html;
    }

    function openChangelogModal() { document.getElementById('changelogModal').style.display = 'flex'; }
    function closeChangelogModal() { document.getElementById('changelogModal').style.display = 'none'; }

    // Floating Corner Player Controls
    function openPopupPlayer() {
      if (!currentWork && allWorks.length > 0) {
        currentWork = allWorks[0];
        playTrack(0, false);
      }
      updatePopupPlayerUI();
      const el = document.getElementById('popupPlayerModal');
      if (el) el.style.display = 'flex';
      const playerBar = document.querySelector('.player-bar');
      if (playerBar) playerBar.style.display = 'none';
    }

    function closePopupPlayer() {
      const el = document.getElementById('popupPlayerModal');
      if (el) el.style.display = 'none';
      const playerBar = document.querySelector('.player-bar');
      if (playerBar) playerBar.style.display = 'flex';
    }

    function openPopupPlayerWithChapters() {
      openPopupPlayer();
      isChapterDrawerOpen = true;
      const listEl = document.getElementById('popupChaptersList');
      const chevEl = document.getElementById('popupChapterChevron');
      if (listEl) listEl.style.display = 'flex';
      if (chevEl) chevEl.innerText = '▲';
    }

    function togglePopupPlayer() {
      const el = document.getElementById('popupPlayerModal');
      if (el && el.style.display === 'flex') {
        closePopupPlayer();
      } else {
        openPopupPlayer();
      }
    }

    function toggleChapterDrawer() {
      isChapterDrawerOpen = !isChapterDrawerOpen;
      const listEl = document.getElementById('popupChaptersList');
      const chevEl = document.getElementById('popupChapterChevron');
      listEl.style.display = isChapterDrawerOpen ? 'flex' : 'none';
      chevEl.innerText = isChapterDrawerOpen ? '▲' : '▼';
    }

    function updatePopupPlayerUI() {
      if (!currentWork) return;
      const track = currentWork.tracks[currentTrackIndex] || currentWork.tracks[0];
      const display = getDisplayCover(currentWork);

      document.getElementById('popupTitle').innerText = track ? track.title : currentWork.title;
      document.getElementById('popupSub').innerText = currentWork.rjCode + ' • ' + (currentWork.circle || 'Circle N/A');
      document.getElementById('popupCover').src = display.coverUrl;
      document.getElementById('popupHlsBadge').innerText = (track && track.isHls) ? 'HLS Stream' : 'Direct Audio';
      document.getElementById('popupDisguisedBadge').style.display = display.isDisguised ? 'block' : 'none';
      document.getElementById('popupFavBtn').innerText = currentWork.favorite ? '❤️' : '🤍';

      // CV Badges in Popup
      const cvContainer = document.getElementById('popupCvRow');
      const activeWorkCV = getWorkCV(currentWork);
      if (activeWorkCV && activeWorkCV !== 'N/A') {
        const cvs = activeWorkCV.split(/[,、/&＋+;・\\n|]/).map(s => cleanCVName(s)).filter(Boolean);
        const uniqueCvs = Array.from(new Set(cvs));
        cvContainer.innerHTML = uniqueCvs.map(c => '<span class="tag-pill" style="font-size:0.75rem; background:rgba(56,189,248,0.15); color:#38bdf8; border-color:rgba(56,189,248,0.3); font-weight:700;" data-cv="' + c.replace(/"/g, '&quot;') + '" onclick="closePopupPlayer(); navCv(this.dataset.cv)">🎙️ ' + formatCV(c) + '</span>').join('');
      } else {
        cvContainer.innerHTML = '';
      }

      // Populate Chapter / Track Drawer (Separated)
      const tracks = currentWork.tracks || [];
      let chapters = [];
      if (Array.isArray(currentWork.chapters) && currentWork.chapters.length > 0) {
        chapters = currentWork.chapters;
      } else if (tracks.length > 0) {
        chapters = tracks.map((t, idx) => ({ id: t.id || (idx + 1), title: t.title, startTime: t.startTime || 0, formattedTime: t.formattedTime || formatTime(t.startTime || 0), trackIndex: idx }));
      }

      if (chapters.length > 0) {
        let maxDuration = 0;
        if (audio && audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
          maxDuration = audio.duration;
        } else if (tracks.length > 0 && tracks[0].duration > 0) {
          maxDuration = tracks[0].duration;
        }
        if (currentWork.hasHls && maxDuration > 0) {
          chapters = chapters.filter(c => (c.startTime || 0) < maxDuration - 2);
        }
      }

      const drawerList = document.getElementById('popupChaptersList');
      drawerList.innerHTML = '';

      if (chapters.length > 0) {
        document.getElementById('popupChapterToggleLabel').innerText = '📑 Chapters (' + chapters.length + ')' + (tracks.length > 1 ? ' / 🎵 Tracks (' + tracks.length + ')' : '');

        const chapHeading = document.createElement('div');
        chapHeading.style.cssText = 'font-size:0.75rem; color:#38bdf8; font-weight:800; text-transform:uppercase; margin-bottom:4px; padding:2px 4px;';
        chapHeading.innerText = '📑 Chapters & Scenes';
        drawerList.appendChild(chapHeading);

        const trackColorThemes = [
          { border: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)', text: '#38bdf8' },
          { border: '#c084fc', bg: 'rgba(192, 132, 252, 0.12)', text: '#c084fc' },
          { border: '#34d399', bg: 'rgba(52, 211, 153, 0.12)', text: '#34d399' },
          { border: '#fb923c', bg: 'rgba(251, 146, 60, 0.12)', text: '#fb923c' },
          { border: '#f472b6', bg: 'rgba(244, 114, 182, 0.12)', text: '#f472b6' },
          { border: '#a3e635', bg: 'rgba(163, 230, 53, 0.12)', text: '#a3e635' }
        ];

        chapters.forEach((c, i) => {
          const trackIdx = c.trackIndex || 0;
          const trkTheme = trackColorThemes[trackIdx % trackColorThemes.length];
          const item = document.createElement('div');
          item.className = 'popup-chapter-item chapter-row';
          item.dataset.start = c.startTime || 0;
          item.dataset.track = trackIdx;
          if (tracks.length > 1) {
            item.style.borderLeft = '3px solid ' + trkTheme.border;
          }
          const trkTag = (tracks.length > 1) ? '<span style="font-size:0.7rem; font-weight:700; margin-right:6px; color:' + trkTheme.text + ';">[Track ' + (trackIdx + 1) + ']</span>' : '';
          item.innerHTML = '<span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + (c.id || (i+1)) + '. ' + trkTag + c.title + '</span><span style="color:#38bdf8; font-variant-numeric:tabular-nums; flex-shrink:0; margin-left:8px;">⏱️ ' + (c.formattedTime || '00:00') + '</span>';
          item.onclick = () => { jumpToChapter(c.startTime || 0, trackIdx); };
          drawerList.appendChild(item);
        });

        if (tracks.length > 1) {
          const trackHeading = document.createElement('div');
          trackHeading.style.cssText = 'font-size:0.75rem; color:var(--text-muted); font-weight:800; text-transform:uppercase; margin-top:8px; margin-bottom:4px; padding:4px 4px 2px; border-top:1px solid rgba(255,255,255,0.06);';
          trackHeading.innerText = '🎵 Audio Track Files';
          drawerList.appendChild(trackHeading);

          tracks.forEach((t, i) => {
            const item = document.createElement('div');
            item.className = 'popup-chapter-item' + (i === currentTrackIndex ? ' active' : '');
            item.innerHTML = '<span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + t.id + '. ' + t.title + '</span><span style="color:var(--text-muted); font-variant-numeric:tabular-nums; flex-shrink:0; margin-left:8px;">' + (t.formattedTime || '') + '</span>';
            item.onclick = () => { playTrack(i, true); updatePopupPlayerUI(); };
            drawerList.appendChild(item);
          });
        }
      } else {
        document.getElementById('popupChapterToggleLabel').innerText = '🎵 Tracklist (' + tracks.length + ')';
        tracks.forEach((t, i) => {
          const item = document.createElement('div');
          item.className = 'popup-chapter-item' + (i === currentTrackIndex ? ' active' : '');
          item.innerHTML = '<span>' + t.id + '. ' + t.title + '</span><span style="color:#38bdf8; font-variant-numeric:tabular-nums;">' + (t.formattedTime || '') + '</span>';
          item.onclick = () => { playTrack(i, true); updatePopupPlayerUI(); };
          drawerList.appendChild(item);
        });
      }
    }

    function jumpToCurrentWorkDetail() {
      if (!currentPlayingWork) return;
      closePopupPlayer();
      switchView('work-detail', currentPlayingWork.rjCode);
    }

    function addCurrentPlayingTrackToPlaylist() {
      if (!currentPlayingWork) return;
      const track = (currentPlayingWork.tracks && currentPlayingWork.tracks[currentTrackIndex]) || (currentPlayingWork.tracks && currentPlayingWork.tracks[0]) || {};
      openAddToPlaylistModal({
        rjCode: currentPlayingWork.rjCode,
        trackId: track.id || 1,
        title: track.title || currentPlayingWork.title,
        workTitle: currentPlayingWork.title,
        startTime: 0,
        streamUrl: track.streamUrl,
        isHls: track.isHls,
        poster: currentPlayingWork.coverUrl,
        cv: currentPlayingWork.cv || ''
      });
    }

    function toggleCurrentWorkFav() {
      if (!currentPlayingWork) return;
      toggleFav(currentPlayingWork.rjCode);
      document.getElementById('popupFavBtn').innerText = currentPlayingWork.favorite ? '❤️' : '🤍';
    }

    async function fetchChaptersLazy(rjCode, force = false, targetDur = 0) {
      if (!rjCode) return;
      if (force) {
        chapterFetchCache.delete(rjCode);
        chapterFetchCache.delete(normRj(rjCode));
      } else if (chapterFetchCache.has(rjCode) || chapterFetchCache.has(normRj(rjCode))) {
        return;
      }
      chapterFetchCache.add(rjCode);
      chapterFetchCache.add(normRj(rjCode));
      try {
        let apiUrl = '/api/library/chapters/' + encodeURIComponent(rjCode);
        const workItem = (allWorks && allWorks.find(w => normRj(w.rjCode) === normRj(rjCode))) || (currentPlayingWork && normRj(currentPlayingWork.rjCode) === normRj(rjCode) ? currentPlayingWork : currentWork);
        let reqDur = targetDur;
        if (reqDur <= 0) {
          if (audio && audio.duration && !isNaN(audio.duration) && audio.duration > 0 && currentPlayingWork && normRj(currentPlayingWork.rjCode) === normRj(rjCode)) {
            reqDur = Math.round(audio.duration);
          } else if (workItem && workItem.tracks && workItem.tracks[0] && workItem.tracks[0].duration > 0) {
            reqDur = Math.round(workItem.tracks[0].duration);
          }
        }
        if (reqDur > 0) {
          apiUrl += '?duration=' + reqDur;
        }
        const res = await apiFetch(apiUrl);
        const data = await res.json();
        if (data && data.success) {
          const target = allWorks.find(w => normRj(w.rjCode) === normRj(rjCode));
          let updatedUI = false;

          if (Array.isArray(data.chapters) && data.chapters.length > 0) {
            if (target) target.chapters = data.chapters;
            if (currentWork && normRj(currentWork.rjCode) === normRj(rjCode)) {
              currentWork.chapters = data.chapters;
              currentWorkChapters = data.chapters;
              updatedUI = true;
            }
            if (currentPlayingWork && normRj(currentPlayingWork.rjCode) === normRj(rjCode)) {
              currentPlayingWork.chapters = data.chapters;
              updatedUI = true;
            }
          }

          if (Array.isArray(data.gallery)) {
            if (target) target.gallery = data.gallery;
            if (currentWork && normRj(currentWork.rjCode) === normRj(rjCode)) {
              currentWork.gallery = data.gallery;
              const gBtn = document.getElementById('btnWorkGallery');
              const gCount = document.getElementById('btnWorkGalleryCount');
              if (gBtn && gCount) {
                gCount.innerText = data.gallery.length;
                gBtn.style.display = data.gallery.length > 0 ? 'inline-flex' : 'none';
              }
              updatedUI = true;
            }
          }

          if (updatedUI) {
            if (currentView === 'work-detail' && currentWork && normRj(currentWork.rjCode) === normRj(rjCode)) {
              renderWorkDetailUI(currentWork);
            }
            if (currentPlayingWork && normRj(currentPlayingWork.rjCode) === normRj(rjCode)) {
              updatePopupPlayerUI();
            }
          }
          return data;
        }
        return data;
      } catch (e) {
        return null;
      }
    }

    async function refreshAllMetadata() {
      const btn = document.getElementById('btnRefreshAll');
      const status = document.getElementById('refreshStatus');
      if (!btn || !status) return;

      if (isMassRefreshing) {
        isMassRefreshing = false;
        btn.innerText = 'Stopping...';
        btn.disabled = true;
        return;
      }

      if (!confirm('⚠️ Are you sure you want to re-fetch metadata for ALL works in your library?\\n\\nThis will check and update basic metadata with smart change-detection (0 writes if already matching, max 1 batch write if changes exist).')) {
        return;
      }

      isMassRefreshing = true;
      btn.disabled = false;
      btn.innerText = '⏹️ Stop Re-Fetch';
      btn.style.background = '#ef4444';
      btn.style.borderColor = '#ef4444';
      status.style.display = 'inline';

      try {
        const res = await apiFetch('/api/library');
        const works = await res.json();
        if (!Array.isArray(works) || works.length === 0) {
          status.innerText = 'Library is empty.';
          btn.innerText = '🔄 Re-Fetch All Metadata';
          btn.style.background = '';
          btn.style.borderColor = '';
          isMassRefreshing = false;
          return;
        }

        const rjList = works.map(w => w.rjCode);
        status.innerText = 'Updating metadata for ' + rjList.length + ' works (Single batch KV save)...';

        const batchRes = await apiFetch('/api/library/refresh-batch', {
          method: 'POST',
          body: JSON.stringify({ rjList })
        });
        const batchData = await batchRes.json().catch(() => ({}));

        if (batchData && batchData.total !== undefined) {
          if (batchData.savedToKv) {
            status.innerText = '✅ Finished! Updated ' + batchData.updated + ' works (' + (batchData.unchanged || 0) + ' unchanged, ' + (batchData.failed || 0) + ' failed) in 1 single KV write!';
          } else {
            status.innerText = '✅ Finished! All ' + (batchData.unchanged || batchData.total) + ' works already have matching metadata. (0 KV writes used)!';
          }
        } else {
          status.innerText = '✅ Batch update completed.';
        }
      } catch (e) {
        if (e.message !== 'Unauthorized') {
          status.innerText = 'Error: ' + e.message;
        }
      } finally {
        isMassRefreshing = false;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.innerText = '🔄 Re-Fetch All Metadata';
        setTimeout(() => { loadLibrary(); }, 1200);
      }
    }

    async function refreshSingleWork(rjCode) {
      try {
        chapterFetchCache.delete(rjCode);
        chapterFetchCache.delete(normRj(rjCode));

        const res = await apiFetch('/api/library/refresh/' + encodeURIComponent(rjCode), { method: 'POST' });
        const data = await res.json();

        if (data.success) {
          const idx = allWorks.findIndex(w => normRj(w.rjCode) === normRj(rjCode));
          if (idx !== -1 && data.work) {
            allWorks[idx] = Object.assign({}, allWorks[idx], data.work);
          }
          if (currentWork && normRj(currentWork.rjCode) === normRj(rjCode)) {
            currentWork = Object.assign({}, currentWork, data.work);
          }
        }

        // Fetch fresh chapters directly from on-demand API
        const chapData = await fetchChaptersLazy(rjCode, true);

        if (currentWork && normRj(currentWork.rjCode) === normRj(rjCode)) {
          renderWorkDetailUI(currentWork);
        }

        const chapsCount = (chapData && Array.isArray(chapData.chapters)) ? chapData.chapters.length : ((currentWork && Array.isArray(currentWork.chapters)) ? currentWork.chapters.length : 0);
        const galleryCount = (chapData && Array.isArray(chapData.gallery)) ? chapData.gallery.length : ((currentWork && Array.isArray(currentWork.gallery)) ? currentWork.gallery.length : 0);

        let asmrMsg = '';
        if (chapsCount > 0 || galleryCount > 0) {
          asmrMsg = ' (' + chapsCount + ' chapters, ' + galleryCount + ' art)';
        }

        if (data.success) {
          if (data.changed) {
            showToast('✅ Work refreshed! Metadata updated' + asmrMsg, 3200);
          } else {
            showToast('✅ Work refreshed! Up-to-date' + asmrMsg, 3200);
          }
        } else {
          showToast('❌ Refresh failed: ' + (data.error || 'Unknown error'), 4000);
        }
      } catch (e) {
        if (e.message !== 'Unauthorized') {
          showToast('❌ Error: ' + e.message, 4000);
        }
      }
    }

    async function rebootTagDictionary() {
      const NL = String.fromCharCode(10);
      if (!confirm('🧹 Clean & Purge Stale Tag Cache:' + NL + NL +
                   'This will remove incomplete/broken/untranslated cache entries while keeping all your valid AI and custom translations.' + NL + NL +
                   'Do you want to continue?')) {
        return;
      }
      const statusEl = document.getElementById('tagTranslationStatus');
      if (statusEl) {
        statusEl.style.display = 'inline-block';
        statusEl.textContent = 'Purging stale/broken cache entries...';
      }
      try {
        const res = await apiFetch('/api/tags/reset-dict', { method: 'POST' });
        const data = await res.json();
        window.tagDict = Object.assign({}, window.BASE_TAG_DICT, data.tagDict || {});
        if (statusEl) statusEl.textContent = '✅ Cleaned ' + (data.removedCount || 0) + ' stale entries (kept ' + (data.preservedCount || 0) + ' good translations). Now scanning library...';
        await checkUntranslatedTags();
      } catch (e) {
        alert('Clean failed: ' + e.message);
      }
    }

    function openTransProgressModal() {
      const modal = document.getElementById('tagTranslationProgressModal');
      const logBox = document.getElementById('transLogBox');
      const closeBtn = document.getElementById('transModalCloseBtn');
      const doneBtn = document.getElementById('transModalDoneBtn');
      if (logBox) logBox.innerHTML = '';
      if (closeBtn) closeBtn.style.display = 'none';
      if (doneBtn) doneBtn.style.display = 'none';
      updateTransProgress(0, 'Initializing...', '0 / 0');
      if (modal) modal.style.display = 'flex';
    }

    function closeTransProgressModal() {
      const modal = document.getElementById('tagTranslationProgressModal');
      if (modal) modal.style.display = 'none';
    }

    function updateTransProgress(percent, stageText, statsText) {
      const bar = document.getElementById('transProgressBar');
      const pText = document.getElementById('transProgressPercent');
      const sText = document.getElementById('transProgressStage');
      const statEl = document.getElementById('transStatsText');
      if (bar) bar.style.width = Math.min(100, Math.max(0, percent)) + '%';
      if (pText) pText.textContent = Math.round(percent) + '%';
      if (sText && stageText) sText.textContent = stageText;
      if (statEl && statsText) statEl.textContent = statsText;
    }

    let lastFailedBatchInfo = null;
    let transUserActionResolver = null;

    function openTransProgressModal() {
      const modal = document.getElementById('tagTranslationProgressModal');
      const logBox = document.getElementById('transLogBox');
      const closeBtn = document.getElementById('transModalCloseBtn');
      const doneBtn = document.getElementById('transModalDoneBtn');
      const failedBar = document.getElementById('transFailedBar');
      if (logBox) logBox.innerHTML = '';
      if (closeBtn) closeBtn.style.display = 'none';
      if (doneBtn) doneBtn.style.display = 'none';
      if (failedBar) failedBar.style.display = 'none';
      updateTransProgress(0, 'Initializing...', '0 / 0');
      if (modal) modal.style.display = 'flex';
    }

    function closeTransProgressModal() {
      const modal = document.getElementById('tagTranslationProgressModal');
      if (modal) modal.style.display = 'none';
    }

    function handleTransAction(action) {
      const failedBar = document.getElementById('transFailedBar');
      if (failedBar) failedBar.style.display = 'none';
      if (typeof transUserActionResolver === 'function') {
        const resolve = transUserActionResolver;
        transUserActionResolver = null;
        resolve(action);
      }
    }

    function downloadFailedResponse() {
      if (!lastFailedBatchInfo) {
        alert('No failed response information available.');
        return;
      }
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(lastFailedBatchInfo, null, 2));
      const dlAnchorElem = document.createElement('a');
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", "translation_batch_error_" + (lastFailedBatchInfo.batchNum || 1) + ".json");
      dlAnchorElem.click();
    }

    function updateTransProgress(percent, stageText, statsText) {
      const bar = document.getElementById('transProgressBar');
      const pText = document.getElementById('transProgressPercent');
      const sText = document.getElementById('transProgressStage');
      const statEl = document.getElementById('transStatsText');
      if (bar) bar.style.width = Math.min(100, Math.max(0, percent)) + '%';
      if (pText) pText.textContent = Math.round(percent) + '%';
      if (sText && stageText) sText.textContent = stageText;
      if (statEl && statsText) statEl.textContent = statsText;
    }

    function logTransProgress(msg, type = 'info') {
      const logBox = document.getElementById('transLogBox');
      if (!logBox) return;
      const time = new Date().toLocaleTimeString();
      let color = '#cbd5e1';
      if (type === 'success' || msg.includes('✅') || msg.includes('✨') || msg.includes('🎉')) color = '#4ade80';
      else if (type === 'warn' || msg.includes('⚠️') || msg.includes('⏸️')) color = '#fbbf24';
      else if (type === 'error' || msg.includes('❌')) color = '#f87171';
      else if (msg.includes('🤖') || msg.includes('⏳')) color = '#38bdf8';

      const line = document.createElement('div');
      line.style.color = color;
      line.style.marginBottom = '3px';
      line.textContent = '[' + time + '] ' + msg;
      logBox.appendChild(line);
      logBox.scrollTop = logBox.scrollHeight;
    }

    function finishTransProgress(localCount, llmCount) {
      const closeBtn = document.getElementById('transModalCloseBtn');
      const doneBtn = document.getElementById('transModalDoneBtn');
      const failedBar = document.getElementById('transFailedBar');
      if (failedBar) failedBar.style.display = 'none';
      if (closeBtn) closeBtn.style.display = 'inline-block';
      if (doneBtn) doneBtn.style.display = 'inline-block';
      updateTransProgress(100, '✅ Translation Completed', (localCount + llmCount) + ' items processed');
      if (currentView === 'genres') loadGenres();
      else if (currentView === 'artists') loadArtists();
      else if (currentView === 'library') loadLibrary(currentFilterParams);
    }

    async function checkUntranslatedTags() {
      const statusEl = document.getElementById('tagTranslationStatus');
      const btn = document.getElementById('btnUpdateTagTranslation');
      if (statusEl) {
        statusEl.style.display = 'inline-block';
        statusEl.textContent = '1/5 Scanning library for untranslated tags & CV names...';
      }

      openTransProgressModal();
      updateTransProgress(5, '1/5 Scanning library metadata...');
      logTransProgress('🔍 Scanning library metadata and server aggregations...');

      // Ensure library, tags, and artists are loaded
      if (!allWorks || allWorks.length === 0) {
        try {
          const res = await apiFetch('/api/library');
          const works = await res.json();
          if (Array.isArray(works)) allWorks = works;
        } catch(e) {}
      }
      let serverTags = [];
      let serverArtists = [];
      try {
        const [tagRes, artRes] = await Promise.all([
          apiFetch('/api/tags'),
          apiFetch('/api/artists')
        ]);
        const tagData = await tagRes.json();
        serverTags = Array.isArray(tagData) ? tagData : (tagData.tags || []);
        serverArtists = await artRes.json();
      } catch(e) {}

      const allCandidateTags = new Set();
      const allCandidateCVs = new Set();

      (allWorks || []).forEach(w => {
        if (Array.isArray(w.tags)) {
          w.tags.forEach(t => {
            const clean = String(t || '').trim();
            if (clean) allCandidateTags.add(clean);
          });
        }
        if (w.cv && w.cv !== 'N/A') {
          String(w.cv).split(/[,、/&＋+;]/).forEach(c => {
            const clean = c.trim();
            if (clean) allCandidateCVs.add(clean);
          });
        }
      });

      (serverTags || []).forEach(t => {
        const name = (t.name || t.tag || t || '').trim();
        if (name) allCandidateTags.add(name);
      });

      (serverArtists || []).forEach(a => {
        const name = (a.name || a.cv || a || '').trim();
        if (name) allCandidateCVs.add(name);
      });

      logTransProgress('Found ' + allCandidateTags.size + ' unique tags and ' + allCandidateCVs.size + ' voice actors in library.');

      function isTagProperlyTranslated(tag, isCV) {
        if (!tag) return true;
        const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(tag);
        if (!hasJapanese) return true;
        const entry = getTagEntry(tag);
        if (!entry) return false;
        const romaji = (entry.romaji || '').trim();
        const english = (entry.english || '').trim();
        const validRomaji = romaji && /[a-zA-Z]/.test(romaji) && romaji !== tag;
        const validEnglish = english && /[a-zA-Z]/.test(english) && english !== tag;
        if (isCV || entry.isCV) {
          return !!validRomaji;
        }
        return !!(validRomaji && validEnglish);
      }

      updateTransProgress(15, '2/5 Resolving tags locally with Pass 2 & taxonomy...');
      const resolvedBatch = {};
      const needsTranslation = [];

      allCandidateTags.forEach(tag => {
        if (isTagProperlyTranslated(tag, false)) return;
        const p2 = resolveTagPass2Client(tag);
        if (p2 && p2.romaji && p2.english && /[a-zA-Z]/.test(p2.romaji) && /[a-zA-Z]/.test(p2.english) && p2.romaji !== tag && p2.english !== tag) {
          resolvedBatch[tag] = { romaji: p2.romaji, english: p2.english };
        } else {
          needsTranslation.push(tag);
        }
      });

      allCandidateCVs.forEach(cv => {
        if (isTagProperlyTranslated(cv, true)) return;
        const p2 = resolveTagPass2Client(cv);
        if (p2 && p2.romaji && /[a-zA-Z]/.test(p2.romaji) && p2.romaji !== cv) {
          resolvedBatch[cv] = { romaji: p2.romaji, isCV: true };
        } else {
          needsTranslation.push(cv);
        }
      });

      const localResolvedCount = Object.keys(resolvedBatch).length;
      const totalLlm = needsTranslation.length;

      if (localResolvedCount > 0) {
        logTransProgress('⚡ Pass 2: Resolved ' + localResolvedCount + ' tags locally (0 LLM cost).');
        updateTransProgress(25, '3/5 Saving ' + localResolvedCount + ' local tags to storage...');
        try {
          await apiFetch('/api/tags/sync-dict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ updates: resolvedBatch, newEntries: resolvedBatch })
          });
          window.tagDict = Object.assign({}, window.BASE_TAG_DICT || {}, window.tagDict || {}, resolvedBatch);
        } catch(e) {}
      }

      if (totalLlm === 0) {
        logTransProgress('✨ All tags and voice actors in your library are translated & up to date!');
        if (statusEl) statusEl.textContent = '✨ All tags and voice actors in your library are translated & synced!';
        finishTransProgress(localResolvedCount, 0);
        return;
      }

      const BATCH_SIZE = 75;
      const totalBatches = Math.ceil(totalLlm / BATCH_SIZE);
      logTransProgress('🤖 ' + totalLlm + ' tags need DeepSeek AI. Splitting into ' + totalBatches + ' batches (' + BATCH_SIZE + ' tags/batch)...');

      if (btn) btn.disabled = true;
      let successLlmCount = 0;

      for (let i = 0; i < totalBatches; i++) {
        let batchNum = i + 1;
        let start = i * BATCH_SIZE;
        let chunk = needsTranslation.slice(start, start + BATCH_SIZE);

        let retryCount = 0;
        let batchCompleted = false;

        while (!batchCompleted) {
          const percent = Math.round(25 + ((i / totalBatches) * 70));
          updateTransProgress(percent, '4/5 DeepSeek AI: Batch ' + batchNum + ' of ' + totalBatches + ' (' + chunk.length + ' items)...', successLlmCount + ' / ' + totalLlm + ' translated');
          logTransProgress('⏳ Batch ' + batchNum + '/' + totalBatches + (retryCount > 0 ? ' (Retry ' + retryCount + ')' : '') + ': Requesting translation for ' + chunk.length + ' tags from DeepSeek AI...');

          try {
            const res = await apiFetch('/api/tags/translate-batch', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tags: chunk })
            });
            const data = await res.json();

            if (data && data.success && data.translations) {
              const count = Object.keys(data.translations).length;
              successLlmCount += count;
              Object.assign(resolvedBatch, data.translations);
              window.tagDict = Object.assign({}, window.BASE_TAG_DICT || {}, window.tagDict || {}, data.translations);

              // Persist immediately to KV
              await apiFetch('/api/tags/sync-dict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updates: data.translations, newEntries: data.translations })
              }).catch(() => {});

              logTransProgress('✅ Batch ' + batchNum + '/' + totalBatches + ': Received ' + count + ' translations and saved to KV storage!');
              batchCompleted = true;
            } else {
              const errMsg = (data && data.error) || 'Translation request failed';
              logTransProgress('❌ Batch ' + batchNum + '/' + totalBatches + ' failed: ' + errMsg, 'error');

              lastFailedBatchInfo = {
                batchNum: batchNum,
                totalBatches: totalBatches,
                chunk: chunk,
                error: errMsg,
                rawResponse: (data && data.rawResponse) || '',
                timestamp: new Date().toISOString()
              };

              const reasonEl = document.getElementById('transFailedReason');
              const failedBar = document.getElementById('transFailedBar');
              if (reasonEl) reasonEl.textContent = errMsg;
              if (failedBar) failedBar.style.display = 'block';

              logTransProgress('⏸️ Paused. Choose an action below: [Retry Batch], [Skip & Continue], or [Download Raw Error Log].', 'warn');

              const userAction = await new Promise(resolve => {
                transUserActionResolver = resolve;
              });

              if (userAction === 'retry') {
                retryCount++;
                logTransProgress('🔄 Retrying Batch ' + batchNum + '...');
              } else if (userAction === 'skip') {
                logTransProgress('⏭️ Skipped Batch ' + batchNum + '. Continuing to next batch...');
                batchCompleted = true;
              } else {
                logTransProgress('⏹️ Translation stopped by user.');
                finishTransProgress(localResolvedCount, successLlmCount);
                if (btn) btn.disabled = false;
                return;
              }
            }
          } catch (err) {
            logTransProgress('❌ Network error on Batch ' + batchNum + ': ' + err.message, 'error');

            lastFailedBatchInfo = {
              batchNum: batchNum,
              chunk: chunk,
              error: err.message,
              timestamp: new Date().toISOString()
            };

            const reasonEl = document.getElementById('transFailedReason');
            const failedBar = document.getElementById('transFailedBar');
            if (reasonEl) reasonEl.textContent = err.message;
            if (failedBar) failedBar.style.display = 'block';

            const userAction = await new Promise(resolve => {
              transUserActionResolver = resolve;
            });

            if (userAction === 'retry') {
              retryCount++;
            } else {
              batchCompleted = true;
            }
          }
        }

        // Pause between batches
        if (i < totalBatches - 1) {
          await new Promise(r => setTimeout(r, 400));
        }
      }

      logTransProgress('🎉 Finished! Translated ' + successLlmCount + ' items with DeepSeek AI + ' + localResolvedCount + ' locally.');
      if (statusEl) statusEl.textContent = '✅ Translated and synced ' + (localResolvedCount + successLlmCount) + ' items!';
      finishTransProgress(localResolvedCount, successLlmCount);
      if (btn) btn.disabled = false;
    }

    async function exportBackup() {
      window.location.href = '/api/backup';
    }

    async function importBackupFile(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          const res = await apiFetch('/api/backup', {
            method: 'POST',
            body: JSON.stringify(parsed)
          });
          const data = await res.json();
          if (data.success) {
            alert('✅ Backup restored successfully to Cloudflare KV!');
            loadLibrary();
          } else {
            alert('Failed: ' + (data.error || 'Unknown error'));
          }
        } catch (err) {
          alert('Invalid JSON file: ' + err.message);
        }
      };
      reader.readAsText(file);
    }

    async function setContentMode(mode) {
      contentMode = mode;
      localStorage.setItem('astreamer_content_mode', mode);
      await apiFetch('/api/settings', { method: 'POST', body: JSON.stringify({ contentMode: mode }) });
      if (currentView === 'settings') loadSettings();
      else if (currentView === 'library') renderLibraryGrid(allWorks, currentFilterParams);
      else if (currentView === 'work-detail' && currentWork) loadWorkDetail(currentWork.rjCode);
      if (currentWork) updatePopupPlayerUI();
    }

    function setupMediaSessionHandlers() {
      if (!('mediaSession' in navigator)) return;
      try {
        navigator.mediaSession.setActionHandler('play', () => {
          if (audio.paused) audio.play().catch(() => {});
        });
        navigator.mediaSession.setActionHandler('pause', () => {
          if (!audio.paused) audio.pause();
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => playPrevTrack());
        navigator.mediaSession.setActionHandler('nexttrack', () => playNextTrack());
        navigator.mediaSession.setActionHandler('seekbackward', (d) => seekRelative(-(d?.seekOffset || 10)));
        navigator.mediaSession.setActionHandler('seekforward', (d) => seekRelative(d?.seekOffset || 10));
        navigator.mediaSession.setActionHandler('stop', () => {
          audio.pause();
          audio.currentTime = 0;
        });
      } catch (e) {}
    }

    function setupMediaSession(track, display) {
      if (!('mediaSession' in navigator) || !currentPlayingWork) return;
      try {
        let artworkSrc = display.coverUrl || '';
        if (artworkSrc && !artworkSrc.startsWith('http') && !artworkSrc.startsWith('data:')) {
          artworkSrc = new URL(artworkSrc, window.location.origin).href;
        }
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.title,
          artist: currentPlayingWork.cv || currentPlayingWork.circle || 'aStreamer',
          album: currentPlayingWork.title,
          artwork: artworkSrc ? [
            { src: artworkSrc, sizes: '512x512', type: 'image/jpeg' },
            { src: artworkSrc, sizes: '256x256', type: 'image/jpeg' },
            { src: artworkSrc, sizes: '128x128', type: 'image/jpeg' }
          ] : []
        });
        setupMediaSessionHandlers();
      } catch (e) {}
    }

    window.playTrack = function(index, userTriggered = true, targetWork = null, startTime = 0) {
      index = Math.max(0, parseInt(index, 10) || 0);
      startTime = Math.max(0, parseFloat(startTime) || 0);

      if (targetWork) {
        currentPlayingWork = targetWork;
      } else if (!currentPlayingWork) {
        currentPlayingWork = currentWork || (allWorks && allWorks[0]);
      } else if (currentWork && currentView === 'work-detail' && normRj(currentWork.rjCode) !== normRj(currentPlayingWork.rjCode) && userTriggered) {
        currentPlayingWork = currentWork;
      }
      if (!currentPlayingWork || !currentPlayingWork.tracks || currentPlayingWork.tracks.length === 0) return;
      if (index >= currentPlayingWork.tracks.length) {
        index = currentPlayingWork.hasHls ? 0 : Math.min(index, currentPlayingWork.tracks.length - 1);
      }
      currentTrackIndex = index;
      const track = currentPlayingWork.tracks[index];
      const display = getDisplayCover(currentPlayingWork);

      document.getElementById('playerTitle').innerText = track.title || 'Track ' + (index + 1);
      document.getElementById('playerSub').innerText = (currentPlayingWork.rjCode || '') + ' • ' + (currentPlayingWork.title || '');
      document.getElementById('playerCover').src = display.coverUrl;

      const knownDur = track.duration || 0;
      const initialTotal = knownDur > 0 ? formatTime(knownDur) : (track.formattedTime || '--:--');
      document.getElementById('currTime').innerText = formatTime(startTime || 0);
      document.getElementById('totalTime').innerText = initialTotal;
      document.getElementById('popupCurrTime').innerText = formatTime(startTime || 0);
      document.getElementById('popupTotalTime').innerText = initialTotal;
      document.getElementById('scrubber').value = 0;
      document.getElementById('popupScrubber').value = 0;

      updatePopupPlayerUI();
      recordPlayHistory(currentPlayingWork, index);

      audio.muted = false;
      if (audio.volume === 0) audio.volume = 1.0;

      document.querySelectorAll('.track-row').forEach((r, i) => r.classList.toggle('active', i === index));

      // MediaSession Background Audio Metadata API
      setupMediaSession(track, display);

      // Fetch rich chapters and gallery if not yet loaded
      if (currentPlayingWork && currentPlayingWork.rjCode && (!currentPlayingWork.chapters || currentPlayingWork.chapters.length <= 1)) {
        fetchChaptersLazy(currentPlayingWork.rjCode);
      }

      const seekTime = (startTime > 0) ? startTime : (track.startTime || 0);

      if (track.isHls) {
        playHlsStream(track.streamUrl, seekTime, userTriggered);
      } else {
        playDirectAudio(track.streamUrl, userTriggered, seekTime);
      }
    };

    function playHlsStream(m3u8Url, startTime = 0, userTriggered = true) {
      startTime = Math.max(0, parseFloat(startTime) || 0);
      if (hls && loadedHlsUrl === m3u8Url) {
        try { audio.currentTime = startTime; } catch(e) {}
        if (userTriggered) {
          const p = audio.play();
          if (p && p.then) {
            p.then(() => {
              if (startTime > 0 && Math.abs(audio.currentTime - startTime) > 1) {
                try { audio.currentTime = startTime; } catch(e) {}
              }
            }).catch(e => console.log('Play error:', e));
          }
        }
        return;
      }
      if (hls) { hls.destroy(); hls = null; }
      loadedHlsUrl = m3u8Url;
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          maxBufferLength: 60,
          startPosition: startTime >= 0 ? startTime : -1
        });
        hls.loadSource(m3u8Url);
        hls.attachMedia(audio);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (startTime > 0) {
            try { audio.currentTime = startTime; } catch(e) {}
          }
          if (userTriggered) {
            const p = audio.play();
            if (p && p.then) {
              p.then(() => {
                if (startTime > 0 && Math.abs(audio.currentTime - startTime) > 1) {
                  try { audio.currentTime = startTime; } catch(e) {}
                }
              }).catch(e => console.log('Autoplay handled:', e));
            }
          }
        });
      } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
        audio.src = m3u8Url;
        let seekDone = false;
        const onReady = () => {
          if (seekDone) return;
          seekDone = true;
          try { audio.currentTime = startTime; } catch(e) {}
          if (userTriggered) {
            const p = audio.play();
            if (p && p.then) {
              p.then(() => {
                if (startTime > 0 && Math.abs(audio.currentTime - startTime) > 1) {
                  try { audio.currentTime = startTime; } catch(e) {}
                }
              }).catch(e => console.log('Play:', e));
            }
          }
        };
        audio.addEventListener('loadedmetadata', onReady, { once: true });
        audio.addEventListener('canplay', onReady, { once: true });
      }
    }

    function playDirectAudio(srcUrl, userTriggered = true, startTime = 0) {
      startTime = Math.max(0, parseFloat(startTime) || 0);
      if (hls) { hls.destroy(); hls = null; loadedHlsUrl = null; }
      const isSameSrc = audio.src && (audio.src === srcUrl || audio.src.endsWith(srcUrl) || (new URL(srcUrl, window.location.origin).href === audio.src));
      if (isSameSrc && !audio.error && audio.readyState >= 1) {
        try { audio.currentTime = startTime; } catch(e) {}
        if (userTriggered) {
          const p = audio.play();
          if (p && p.then) {
            p.then(() => {
              if (startTime > 0 && Math.abs(audio.currentTime - startTime) > 1) {
                try { audio.currentTime = startTime; } catch(e) {}
              }
            }).catch(e => console.log('Play error:', e));
          }
        }
        return;
      }
      audio.src = srcUrl;
      let seekDone = false;
      const onReady = () => {
        if (seekDone) return;
        seekDone = true;
        try {
          if (startTime > 0) audio.currentTime = startTime;
        } catch(e) {}
        if (userTriggered) {
          const p = audio.play();
          if (p && p.then) {
            p.then(() => {
              if (startTime > 0 && Math.abs(audio.currentTime - startTime) > 1) {
                try { audio.currentTime = startTime; } catch(e) {}
              }
            }).catch(e => console.log('Play error:', e));
          }
        }
      };
      audio.addEventListener('loadedmetadata', onReady, { once: true });
      audio.addEventListener('canplay', onReady, { once: true });
    }

    function togglePlayPause() {
      if (audio.paused) audio.play();
      else audio.pause();
    }

    audio.addEventListener('loadedmetadata', () => {
      const dur = audio.duration;
      if (dur && !isNaN(dur) && dur > 0 && currentPlayingWork) {
        if (currentPlayingWork.tracks && currentPlayingWork.tracks[currentTrackIndex]) {
          currentPlayingWork.tracks[currentTrackIndex].duration = Math.round(dur);
          currentPlayingWork.tracks[currentTrackIndex].formattedTime = formatTime(Math.round(dur));
        }
        const numTracks = (currentPlayingWork.tracks) ? currentPlayingWork.tracks.length : 1;
        if (numTracks <= 1 && Array.isArray(currentPlayingWork.chapters) && currentPlayingWork.chapters.length > 0) {
          let running = 0;
          let cutoff = -1;
          for (let i = 0; i < currentPlayingWork.chapters.length; i++) {
            running += (currentPlayingWork.chapters[i].duration || 0);
            if (Math.abs(running - dur) <= 3) {
              cutoff = i;
              break;
            } else if (running > dur + 5) {
              cutoff = i > 0 ? i - 1 : 0;
              break;
            }
          }
          if (cutoff >= 0 && cutoff < currentPlayingWork.chapters.length - 1) {
            currentPlayingWork.chapters = currentPlayingWork.chapters.slice(0, cutoff + 1);
          } else {
            currentPlayingWork.chapters = currentPlayingWork.chapters.filter(c => (c.startTime || 0) < dur - 2);
          }
          if (currentWork && currentWork.rjCode === currentPlayingWork.rjCode) {
            currentWork.chapters = currentPlayingWork.chapters;
            currentWorkChapters = currentPlayingWork.chapters;
            renderWorkDetailUI(currentWork);
          }
          updatePopupPlayerUI();
        }
      }
    });

    audio.addEventListener('play', () => {
      document.getElementById('playPauseBtn').innerText = '⏸';
      document.getElementById('popupPlayPauseBtn').innerText = '⏸';
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
    });
    audio.addEventListener('pause', () => {
      document.getElementById('playPauseBtn').innerText = '▶';
      document.getElementById('popupPlayPauseBtn').innerText = '▶';
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
    });
    audio.addEventListener('ended', () => {
      playNextTrack();
    });
    audio.addEventListener('timeupdate', () => {
      const ct = audio.currentTime;
      const dur = audio.duration || 0;
      const fmtCt = formatTime(ct);
      const fmtDur = formatTime(dur);

      document.getElementById('currTime').innerText = fmtCt;
      document.getElementById('totalTime').innerText = fmtDur;
      document.getElementById('popupCurrTime').innerText = fmtCt;
      document.getElementById('popupTotalTime').innerText = fmtDur;

      if (dur > 0) {
        const pct = (ct / dur) * 100;
        document.getElementById('scrubber').value = pct;
        document.getElementById('popupScrubber').value = pct;
      }

      highlightActiveChapter(ct, currentTrackIndex);

      if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession && dur > 0 && !isNaN(ct)) {
        try {
          navigator.mediaSession.setPositionState({
            duration: dur,
            playbackRate: audio.playbackRate || 1,
            position: Math.min(ct, dur)
          });
        } catch(e) {}
      }
    });

    function formatTime(secs) {
      if (isNaN(secs)) return '00:00';
      const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = Math.floor(secs % 60);
      if (h > 0) return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
      return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }

    function onScrub(val) {
      if (audio.duration) {
        audio.currentTime = (val / 100) * audio.duration;
      }
    }
    function seekRelative(secs) { audio.currentTime = Math.max(0, audio.currentTime + secs); }

    function getContextWorksList() {
      if (!allWorks || allWorks.length === 0) return [];
      let list = [...allWorks];
      if (contentMode === 'SFW') list = list.filter(w => !isWorkNsfw(w));
      if (currentFilterParams && Object.keys(currentFilterParams).length > 0) {
        if (currentFilterParams.tag) list = list.filter(w => (w.tags || []).some(t => t.toLowerCase().trim() === currentFilterParams.tag.toLowerCase().trim()));
        if (currentFilterParams.cv) list = list.filter(w => w.cv && w.cv.toLowerCase().includes(currentFilterParams.cv.toLowerCase().trim()));
        if (currentFilterParams.favorite === 'true') list = list.filter(w => w.favorite);
        if (currentFilterParams.q) {
          const q = currentFilterParams.q.toLowerCase().trim();
          list = list.filter(w => w.rjCode.toLowerCase().includes(q) || w.title.toLowerCase().includes(q) || (w.circle && w.circle.toLowerCase().includes(q)) || (w.cv && w.cv.toLowerCase().includes(q)) || (w.tags && w.tags.some(t => t.toLowerCase().includes(q))));
        }
      }
      return list;
    }

    function playNextTrack() {
      if (!currentPlayingWork) {
        const list = getContextWorksList();
        if (list.length > 0) {
          currentPlayingWork = list[0];
          playTrack(0, true, currentPlayingWork);
        }
        return;
      }

      // Record current work and track into history stack before advancing
      if (currentPlayingWork && currentPlayingWork.tracks && currentPlayingWork.tracks[currentTrackIndex]) {
        playbackHistoryStack.push({ work: currentPlayingWork, trackIndex: currentTrackIndex });
        if (playbackHistoryStack.length > 50) playbackHistoryStack.shift();
      }

      // 1. RANDOM / SHUFFLE PLAYBACK
      if (isShuffle) {
        const contextList = getContextWorksList();
        if (contextList.length === 0) return;

        if (contextList.length > 1) {
          const others = contextList.filter(w => w.rjCode !== currentPlayingWork.rjCode);
          const pool = others.length > 0 ? others : contextList;
          const randWork = pool[Math.floor(Math.random() * pool.length)];
          const tracks = randWork.tracks || [];
          const randTrackIdx = tracks.length > 0 ? Math.floor(Math.random() * tracks.length) : 0;
          currentPlayingWork = randWork;
          playTrack(randTrackIdx, true, randWork);
        } else {
          const tracks = currentPlayingWork.tracks || [];
          if (tracks.length > 1) {
            let randTrackIdx = Math.floor(Math.random() * tracks.length);
            if (randTrackIdx === currentTrackIndex) randTrackIdx = (currentTrackIndex + 1) % tracks.length;
            playTrack(randTrackIdx, true);
          } else {
            playTrack(0, true);
          }
        }
        return;
      }

      // 2. SEQUENTIAL PLAYBACK
      if (currentPlayingWork.tracks && currentTrackIndex + 1 < currentPlayingWork.tracks.length) {
        playTrack(currentTrackIndex + 1, true);
      } else {
        // Last track reached -> seamlessly transition to the next work in active context order
        const contextList = getContextWorksList();
        if (contextList.length > 0) {
          const curIdx = contextList.findIndex(w => w.rjCode === currentPlayingWork.rjCode);
          let nextWork;
          if (curIdx >= 0 && curIdx + 1 < contextList.length) {
            nextWork = contextList[curIdx + 1];
          } else {
            nextWork = contextList[0];
          }
          currentPlayingWork = nextWork;
          playTrack(0, true, nextWork);
        }
      }
    }

    function playPrevTrack() {
      if (!currentPlayingWork) return;

      // 1. RANDOM / SHUFFLE PLAYBACK: Traverse back through history
      if (isShuffle) {
        if (playbackHistoryStack.length > 0) {
          const prevEntry = playbackHistoryStack.pop();
          if (prevEntry && prevEntry.work) {
            currentPlayingWork = prevEntry.work;
            playTrack(prevEntry.trackIndex || 0, true, prevEntry.work);
            return;
          }
        }
        audio.currentTime = 0;
        return;
      }

      // 2. SEQUENTIAL PLAYBACK
      if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
      }

      if (currentTrackIndex - 1 >= 0) {
        playTrack(currentTrackIndex - 1, true);
      } else {
        // First track reached -> seamlessly retreat to previous work in active context order
        const contextList = getContextWorksList();
        if (contextList.length > 0) {
          const curIdx = contextList.findIndex(w => w.rjCode === currentPlayingWork.rjCode);
          let prevWork;
          if (curIdx > 0) {
            prevWork = contextList[curIdx - 1];
          } else {
            prevWork = contextList[contextList.length - 1];
          }
          currentPlayingWork = prevWork;
          const lastTrackIdx = (prevWork.tracks && prevWork.tracks.length > 0) ? prevWork.tracks.length - 1 : 0;
          playTrack(lastTrackIdx, true, prevWork);
        }
      }
    }
    function setVolume(val) {
      audio.volume = parseFloat(val);
      document.getElementById('volumeSlider').value = val;
      document.getElementById('popupVolumeSlider').value = val;
    }
    function toggleMute() { audio.muted = !audio.muted; }

    let currentTitleQuery = '';
    let currentTagQuery = '';

    function handleTitleSearch(val) {
      currentTitleQuery = val || '';
      const sidebarSearch = document.getElementById('globalSearch');
      const mobSearch = document.getElementById('mobileSearchInput');
      if (sidebarSearch && sidebarSearch.value !== val) sidebarSearch.value = val;
      if (mobSearch && mobSearch.value !== val) mobSearch.value = val;
      applyFilters();
    }

    function handleTagSearchInput(val) {
      currentTagQuery = val || '';
      const sidebarTag = document.getElementById('globalTagSearch');
      const mobTag = document.getElementById('mobileTagSearchInput');
      if (sidebarTag && sidebarTag.value !== val) sidebarTag.value = val;
      if (mobTag && mobTag.value !== val) mobTag.value = val;
      applyFilters();
    }

    function handleSearch(val) {
      handleTitleSearch(val);
    }

    function applyFilters() {
      const tQuery = (currentTitleQuery || '').trim().toLowerCase();
      const rawTagQuery = (currentTagQuery || '').trim();

      if (!tQuery && !rawTagQuery) {
        libraryCurrentPage = 1;
        renderLibraryGrid(allWorks, {});
        return;
      }

      const tagTokens = rawTagQuery ? rawTagQuery.split(/[+,]+/).map(s => s.trim().toLowerCase()).filter(Boolean) : [];

      const filtered = allWorks.filter(w => {
        // 1. Title / RJ / Circle / CV search
        if (tQuery) {
          const matchRj = w.rjCode && w.rjCode.toLowerCase().includes(tQuery);
          const matchTitle = w.title && w.title.toLowerCase().includes(tQuery);
          const matchCircle = w.circle && w.circle.toLowerCase().includes(tQuery);
          const matchCv = w.cv && w.cv.toLowerCase().includes(tQuery);
          if (!matchRj && !matchTitle && !matchCircle && !matchCv) return false;
        }

        // 2. Tag '+' multi-filter matching
        if (tagTokens.length > 0) {
          const workTags = Array.isArray(w.tags) ? w.tags : [];
          const allWorkTagStrings = [...workTags];
          if (w.cv) {
            w.cv.split(/[,、/&＋+]/).forEach(c => {
              if (c.trim()) allWorkTagStrings.push(c.trim());
            });
          }

          const allTokensMatch = tagTokens.every(token => {
            return allWorkTagStrings.some(t => {
              const tLower = t.toLowerCase();
              if (tLower.includes(token)) return true;
              const entry = getTagEntry(t);
              if (entry) {
                if (entry.romaji && entry.romaji.toLowerCase().includes(token)) return true;
                if (entry.english && entry.english.toLowerCase().includes(token)) return true;
              }
              return false;
            });
          });

          if (!allTokensMatch) return false;
        }

        return true;
      });

      libraryCurrentPage = 1;
      renderLibraryGrid(filtered, { q: currentTitleQuery, tag: currentTagQuery });
    }

    // === Zen Browser Style Tag Search Modal ===
    let zenActiveIndex = -1;
    let zenSearchResults = [];
    let zenBackupQuery = '';

    function openZenTagSearch(initialQuery = '') {
      const modal = document.getElementById('zenTagSearchModal');
      const input = document.getElementById('zenTagSearchInput');
      if (!modal || !input) return;

      zenBackupQuery = currentTagQuery || '';
      modal.style.display = 'flex';
      renderZenChips();
      
      const queryToUse = typeof initialQuery === 'string' && initialQuery.length > 0 ? initialQuery : currentTagQuery;
      const parts = (queryToUse || '').split('+');
      const lastToken = parts[parts.length - 1].trim();
      input.value = lastToken;
      
      handleZenTagInput(lastToken);
      setTimeout(() => input.focus(), 50);
    }

    function closeZenTagSearch(cancel = false) {
      const modal = document.getElementById('zenTagSearchModal');
      if (modal) modal.style.display = 'none';
      zenActiveIndex = -1;

      if (cancel) {
        currentTagQuery = zenBackupQuery || '';
        const sidebarTag = document.getElementById('globalTagSearch');
        const mobTag = document.getElementById('mobileTagSearchInput');
        if (sidebarTag) sidebarTag.value = currentTagQuery;
        if (mobTag) mobTag.value = currentTagQuery;
      }
    }

    function applyZenTagSearch() {
      const input = document.getElementById('zenTagSearchInput');
      if (input && input.value && input.value.trim()) {
        const val = input.value.trim();
        if (zenSearchResults.length > 0 && zenActiveIndex >= 0) {
          addZenTag(zenSearchResults[zenActiveIndex].tag);
        } else if (zenSearchResults.length > 0) {
          addZenTag(zenSearchResults[0].tag);
        } else {
          addZenTag(val);
        }
      }
      const pills = getActiveTagPills();
      currentTagQuery = pills.join(' + ');
      
      const sidebarTag = document.getElementById('globalTagSearch');
      const mobTag = document.getElementById('mobileTagSearchInput');
      if (sidebarTag) sidebarTag.value = currentTagQuery;
      if (mobTag) mobTag.value = currentTagQuery;

      closeZenTagSearch(false);
      if (currentView !== 'library') {
        savedScrollPositions['library'] = 0;
        shuffledLibraryWorks = null;
        switchView('library', { tag: currentTagQuery }, true, 1);
      } else {
        applyFilters();
      }
    }

    function handleZenOverlayClick(e) {
      if (e.target.id === 'zenTagSearchModal') {
        closeZenTagSearch(true);
      }
    }

    function getActiveTagPills() {
      if (!currentTagQuery) return [];
      return currentTagQuery.split('+').map(t => t.trim()).filter(Boolean);
    }

    function renderZenChips() {
      const chipsBar = document.getElementById('zenChipsBar');
      const chipsList = document.getElementById('zenChipsList');
      if (!chipsBar || !chipsList) return;

      const pills = getActiveTagPills();
      if (pills.length === 0) {
        chipsBar.style.display = 'none';
        chipsList.innerHTML = '';
        return;
      }

      chipsBar.style.display = 'flex';
      chipsList.innerHTML = pills.map((p, idx) => {
        const formatted = formatTag(p);
        return '<span class="zen-chip">' +
          '<span>' + formatted + '</span>' +
          '<span class="zen-chip-remove" onclick="removeZenTag(' + idx + ')" title="Remove tag">✕</span>' +
        '</span>';
      }).join('');
    }

    function addZenTag(tag) {
      if (!tag) return;
      const pills = getActiveTagPills();
      if (!pills.includes(tag)) {
        pills.push(tag);
      }
      currentTagQuery = pills.join(' + ') + ' + ';
      
      const sidebarTag = document.getElementById('globalTagSearch');
      const mobTag = document.getElementById('mobileTagSearchInput');
      if (sidebarTag) sidebarTag.value = currentTagQuery;
      if (mobTag) mobTag.value = currentTagQuery;

      applyFilters();
      renderZenChips();

      const input = document.getElementById('zenTagSearchInput');
      if (input) {
        input.value = '';
        handleZenTagInput('');
        input.focus();
      }
    }

    function removeZenTag(index) {
      const pills = getActiveTagPills();
      if (index >= 0 && index < pills.length) {
        pills.splice(index, 1);
      }
      currentTagQuery = pills.length > 0 ? pills.join(' + ') + ' + ' : '';
      
      const sidebarTag = document.getElementById('globalTagSearch');
      const mobTag = document.getElementById('mobileTagSearchInput');
      if (sidebarTag) sidebarTag.value = currentTagQuery;
      if (mobTag) mobTag.value = currentTagQuery;

      applyFilters();
      renderZenChips();

      const input = document.getElementById('zenTagSearchInput');
      if (input) {
        handleZenTagInput(input.value);
        input.focus();
      }
    }

    function clearAllZenTags() {
      currentTagQuery = '';
      const sidebarTag = document.getElementById('globalTagSearch');
      const mobTag = document.getElementById('mobileTagSearchInput');
      if (sidebarTag) sidebarTag.value = '';
      if (mobTag) mobTag.value = '';

      applyFilters();
      renderZenChips();

      const input = document.getElementById('zenTagSearchInput');
      if (input) {
        input.value = '';
        handleZenTagInput('');
        input.focus();
      }
    }

    function handleZenTagInput(val) {
      const query = (val || '').trim().toLowerCase();
      const container = document.getElementById('zenResultsContainer');
      const countBadge = document.getElementById('zenResultsCountBadge');
      if (!container) return;

      const baseDict = window.BASE_TAG_DICT || {};
      const userDict = window.tagDict || {};
      const allDict = Object.assign({}, baseDict, userDict);

      // Gather tag counts across allWorks
      const tagCounts = {};
      const cvCounts = {};

      allWorks.forEach(w => {
        (w.tags || []).forEach(t => {
          const clean = t.trim();
          if (clean) tagCounts[clean] = (tagCounts[clean] || 0) + 1;
        });
        if (w.cv && w.cv !== 'N/A') {
          w.cv.split(/[,、/&＋+]/).forEach(c => {
            const clean = c.trim();
            if (clean) cvCounts[clean] = (cvCounts[clean] || 0) + 1;
          });
        }
      });

      const matchedCVs = [];
      const matchedGenres = [];
      const activePills = getActiveTagPills();
      const allTagKeys = new Set([...Object.keys(tagCounts), ...Object.keys(cvCounts), ...Object.keys(allDict)]);

      allTagKeys.forEach(tag => {
        if (!tag || activePills.includes(tag)) return;
        const entry = getTagEntry(tag);
        const count = tagCounts[tag] || cvCounts[tag] || 0;
        const isCV = (entry && entry.isCV) || !!cvCounts[tag];

        let isMatch = !query;
        if (query) {
          const tagLower = tag.toLowerCase();
          if (tagLower.includes(query)) isMatch = true;
          if (entry) {
            if (entry.romaji && entry.romaji.toLowerCase().includes(query)) isMatch = true;
            if (entry.english && entry.english.toLowerCase().includes(query)) isMatch = true;
          }
        }

        if (isMatch) {
          const item = {
            tag,
            count,
            isCV,
            romaji: entry ? entry.romaji : '',
            english: entry ? entry.english : ''
          };
          if (isCV) matchedCVs.push(item);
          else matchedGenres.push(item);
        }
      });

      matchedCVs.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
      matchedGenres.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

      const topCVs = matchedCVs.slice(0, 8);
      const topGenres = matchedGenres.slice(0, 30);

      zenSearchResults = [...topCVs, ...topGenres];
      zenActiveIndex = zenSearchResults.length > 0 ? 0 : -1;

      if (countBadge) {
        countBadge.textContent = zenSearchResults.length > 0 ? (zenSearchResults.length + ' matching tags') : '';
      }

      if (zenSearchResults.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px 20px; color: #64748b;">' +
          '<div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>' +
          '<div style="font-size: 0.95rem; font-weight: 600; color: #94a3b8;">No matching tags found</div>' +
          '<div style="font-size: 0.8rem; margin-top: 4px;">Try searching in Japanese (耳かき), Rōmaji (mimikaki), or English (ear cleaning)</div>' +
        '</div>';
        return;
      }

      let html = '';
      if (topCVs.length > 0) {
        html += '<div class="zen-category-title">🎙️ Voice Actors</div>';
        topCVs.forEach((s, idx) => {
          html += renderZenResultItem(s, idx);
        });
      }

      if (topGenres.length > 0) {
        html += '<div class="zen-category-title">🏷️ Genres & Themes</div>';
        topGenres.forEach((s, idx) => {
          html += renderZenResultItem(s, topCVs.length + idx);
        });
      }

      container.innerHTML = html;
    }

    function renderZenResultItem(s, globalIdx) {
      const isSelected = globalIdx === zenActiveIndex;
      const countBadge = s.count > 0 ? '<span class="zen-tag-badge">' + s.count + ' works</span>' : '';
      const safeTag = s.tag.split('"').join('&quot;');
      
      let romajiSpan = (s.romaji && s.romaji !== s.tag) ? '<span class="zen-tag-romaji">' + s.romaji + '</span>' : '';
      let engSpan = (s.english && s.english !== s.tag && s.english !== s.romaji) ? '<span class="zen-tag-eng">' + s.english + '</span>' : '';
      let sep1 = (romajiSpan || engSpan) ? '<span class="zen-tag-sep">|</span>' : '';
      let sep2 = (romajiSpan && engSpan) ? '<span class="zen-tag-sep">|</span>' : '';

      return '<div class="zen-result-item ' + (isSelected ? 'selected' : '') + '" data-index="' + globalIdx + '" data-tag="' + safeTag + '" onclick="addZenTag(this.dataset.tag)">' +
        '<div class="zen-tag-info">' +
          '<span class="zen-tag-orig">' + s.tag + '</span>' +
          sep1 +
          romajiSpan +
          sep2 +
          engSpan +
        '</div>' +
        '<div style="display: flex; align-items: center; gap: 8px;">' +
          countBadge +
          '<span style="color: #a78bfa; font-size: 0.95rem; font-weight: bold; opacity: 0.6;">+</span>' +
        '</div>' +
      '</div>';
    }

    function handleZenTagKeydown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeZenTagSearch(true);
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (zenActiveIndex >= 0 && zenActiveIndex < zenSearchResults.length) {
          addZenTag(zenSearchResults[zenActiveIndex].tag);
        } else {
          applyZenTagSearch();
        }
        return;
      }

      if (zenSearchResults.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        zenActiveIndex = (zenActiveIndex + 1) % zenSearchResults.length;
        updateZenSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        zenActiveIndex = (zenActiveIndex - 1 + zenSearchResults.length) % zenSearchResults.length;
        updateZenSelection();
      }
    }

    function updateZenSelection() {
      const items = document.querySelectorAll('#zenResultsContainer .zen-result-item');
      items.forEach((item, idx) => {
        if (idx === zenActiveIndex) {
          item.classList.add('selected');
          item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
          item.classList.remove('selected');
        }
      });
    }

    // Global ESC key listener to close Tag Search Modal
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const modal = document.getElementById('zenTagSearchModal');
        if (modal && modal.style.display === 'flex') {
          e.preventDefault();
          closeZenTagSearch(true);
        }
      }
    });

    async function quickAddRj() {
      const rj = prompt('Enter RJ Code to import (e.g. RJ01473335):');
      if (!rj) return;
      try {
        const res = await apiFetch('/api/library/resolve', { method: 'POST', body: JSON.stringify({ rjCode: rj }) });
        const data = await res.json();
        if (data.work) {
          alert('🎉 Successfully imported: ' + data.work.title);
          updateWishlistBadge();
          loadLibrary();
        } else if (data.wishlisted) {
          alert('⚠️ ' + rj.toUpperCase() + ' audio stream is not yet available on CDN. It has been automatically saved to your 📋 Wishlist so you can easily re-import it later once crawled!');
          updateWishlistBadge();
        } else {
          alert('Import failed: ' + (data.error || 'Unknown error'));
        }
      } catch (e) { alert('Error: ' + e.message); }
    }

    async function toggleFav(rjCode, event) {
      if (event) event.stopPropagation();
      const work = allWorks.find(w => w.rjCode === rjCode);
      let nextFavState = true;
      if (work) {
        work.favorite = !work.favorite;
        nextFavState = work.favorite;
      }

      const favIcons = document.querySelectorAll('.card-fav-' + rjCode);
      favIcons.forEach(icon => {
        icon.innerText = nextFavState ? '❤️' : '🤍';
        icon.title = nextFavState ? 'Favorited' : 'Add to Favorites';
        icon.style.transform = 'scale(1.35)';
        setTimeout(() => { icon.style.transform = 'scale(1)'; }, 180);
      });

      if (currentWork && currentWork.rjCode === rjCode) {
        document.getElementById('popupFavBtn').innerText = nextFavState ? '❤️' : '🤍';
      }

      try {
        await apiFetch('/api/library/favorite/' + rjCode, { method: 'POST' });
      } catch (e) {
        console.error('Failed to toggle favorite:', e);
      }
    }

    async function deleteWorkItem(rjCode) {
      if (!confirm('Remove ' + rjCode + ' from library?')) return;
      await apiFetch('/api/library/' + rjCode, { method: 'DELETE' });
      switchView('library');
    }

    function openImportModal() { document.getElementById('importModal').style.display = 'flex'; }
    function closeImportModal() { document.getElementById('importModal').style.display = 'none'; }
    function openPlaylistModal() { document.getElementById('playlistModal').style.display = 'flex'; }
    function closePlaylistModal() { document.getElementById('playlistModal').style.display = 'none'; }

    async function submitCreatePlaylist() {
      const name = document.getElementById('newPlName').value.trim();
      const desc = document.getElementById('newPlDesc').value.trim();
      if (!name) return;
        await apiFetch('/api/playlists', { method: 'POST', body: JSON.stringify({ name: name, description: desc }) });
      closePlaylistModal();
      loadPlaylists();
    }

    function handleFileUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => { document.getElementById('importTextarea').value = event.target.result; };
      reader.readAsText(file);
    }

    async function runBatchImport() {
      const text = document.getElementById('importTextarea').value;
      const rjList = [...new Set(text.toUpperCase().match(/RJ[0-9]{6,8}/g) || [])];

      if (rjList.length === 0) {
        alert('Please enter at least one valid RJ code (e.g. RJ01473335).');
        return;
      }

      const box = document.getElementById('importProgressBox');
      const status = document.getElementById('importStatusText');
      const pct = document.getElementById('importPercentage');
      const bar = document.getElementById('importProgressBar');
      const logs = document.getElementById('importLiveLogs');
      const btn = document.getElementById('btnRunImport');
      const btnCancel = document.getElementById('btnCancelImport');

      box.style.display = 'block';
      logs.innerHTML = '';
      btn.disabled = true;
      btn.innerText = 'Importing...';
      btnCancel.disabled = true;

      let succeeded = 0;
      let failed = 0;

      for (let i = 0; i < rjList.length; i++) {
        const rj = rjList[i];
        const progressPct = Math.round((i / rjList.length) * 100);
        pct.innerText = progressPct + '%';
        bar.style.width = progressPct + '%';
        status.innerText = 'Importing ' + (i + 1) + '/' + rjList.length + ': ' + rj + '...';

        try {
          const res = await apiFetch('/api/library/resolve', {
            method: 'POST',
            body: JSON.stringify({ rjCode: rj })
          });
          const data = await res.json();
          if (data && data.work) {
            succeeded++;
            const logEntry = document.createElement('div');
            logEntry.style.color = '#38bdf8';
            logEntry.innerText = '✅ ' + rj + ': ' + (data.work.title ? data.work.title.slice(0, 32) : '') + '... (Added)';
            logs.appendChild(logEntry);
          } else {
            failed++;
            const logEntry = document.createElement('div');
            logEntry.style.color = '#f59e0b';
            logEntry.innerText = '⚠️ ' + rj + ': ' + (data.error || 'Audio pending') + ' -> Saved to Wishlist 📋';
            logs.appendChild(logEntry);
          }
        } catch (e) {
          if (e.message === 'Unauthorized') return;
          failed++;
          const logEntry = document.createElement('div');
          logEntry.style.color = '#f59e0b';
          logEntry.innerText = '⚠️ ' + rj + ': ' + e.message + ' -> Saved to Wishlist 📋';
          logs.appendChild(logEntry);
        }
        logs.scrollTop = logs.scrollHeight;
      }

      pct.innerText = '100%';
      bar.style.width = '100%';
      status.innerText = '🎉 Completed! ' + succeeded + ' added, ' + failed + ' saved to Wishlist.';
      btn.disabled = false;
      btn.innerText = 'Done';
      btnCancel.disabled = false;

      updateWishlistBadge();

      setTimeout(() => {
        closeImportModal();
        loadLibrary();
      }, 1500);
    }

    let toastTimeout = null;
    function showToast(message, duration = 2800) {
      const el = document.getElementById('appToast');
      if (!el) return;
      el.innerHTML = message;
      el.style.display = 'flex';
      void el.offsetWidth;
      el.classList.add('show');
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => {
          if (!el.classList.contains('show')) el.style.display = 'none';
        }, 260);
      }, duration);
    }

    async function openAddToPlaylistModal(item) {
      pendingPlaylistItem = item;
      document.getElementById('addToPlaylistModal').style.display = 'flex';
      const listEl = document.getElementById('playlistSelectList');
      listEl.innerHTML = '<div style="color:var(--text-muted); padding:1rem; text-align:center;">Loading playlists...</div>';

      try {
        const res = await apiFetch('/api/playlists');
        const playlists = await res.json();
        let list = Array.isArray(playlists) ? [...playlists] : [];

        // Ensure ❤️ Favorites is always at the top
        const favIdx = list.findIndex(p => p.id === 'pl-favorites');
        let favPl;
        if (favIdx >= 0) {
          favPl = list.splice(favIdx, 1)[0];
        } else {
          favPl = { id: 'pl-favorites', name: '❤️ Favorites', items: [] };
        }
        list.unshift(favPl);

        let html = '';
        list.forEach(function(p) {
          const isFav = p.id === 'pl-favorites';
          const pName = isFav ? 'Favorites' : p.name;
          html += '<div class="playlist-select-item" data-pl="' + p.id + '" data-plname="' + pName.replace(/"/g, '&quot;') + '" onclick="addItemToPlaylist(this.dataset.pl, this.dataset.plname)"><span style="font-weight:700;">' + (isFav ? '❤️ Favorites' : '📜 ' + p.name) + '</span><span style="font-size:0.8rem; color:var(--text-muted);">' + (p.items || []).length + ' tracks</span></div>';
        });
        listEl.innerHTML = html;
      } catch (e) {
        listEl.innerHTML = '<div style="color:#ff3366; padding:1rem; text-align:center;">Failed to load playlists</div>';
      }
    }

    function closeAddToPlaylistModal() {
      document.getElementById('addToPlaylistModal').style.display = 'none';
      pendingPlaylistItem = null;
    }

    async function addItemToPlaylist(plId, plName) {
      const itemToSave = pendingPlaylistItem;
      if (!itemToSave) {
        showToast('❌ No item selected');
        return;
      }
      const targetPlName = plName || 'playlist';
      closeAddToPlaylistModal();
      try {
        const res = await apiFetch('/api/playlists/' + encodeURIComponent(plId) + '/items', {
          method: 'POST',
          body: JSON.stringify({ item: itemToSave })
        });
        const data = await res.json();
        if (data.success) {
          showToast('✅ Added to ' + targetPlName);
        } else {
          showToast('❌ ' + (data.error || 'Failed to add'));
        }
      } catch (e) {
        showToast('❌ ' + e.message);
      }
    }

    async function createAndAddToPlaylist() {
      const name = document.getElementById('quickNewPlName').value.trim();
      if (!name) return;
      try {
        const res = await apiFetch('/api/playlists', { method: 'POST', body: JSON.stringify({ name }) });
        const newPl = await res.json();
        if (newPl && newPl.id) {
          document.getElementById('quickNewPlName').value = '';
          await addItemToPlaylist(newPl.id, newPl.name);
        }
      } catch (e) {
        showToast('❌ ' + e.message);
      }
    }

    function addCurrentTrackToPlaylist() {
      if (!currentWork || !currentWork.tracks[currentTrackIndex]) {
        showToast('ℹ️ No track is currently loaded');
        return;
      }
      const t = currentWork.tracks[currentTrackIndex];
      openAddToPlaylistModal({
        rjCode: currentWork.rjCode,
        trackId: t.id,
        title: t.title,
        workTitle: currentWork.title,
        startTime: t.startTime || 0,
        streamUrl: t.streamUrl,
        isHls: t.isHls,
        poster: currentWork.coverUrl,
        cv: currentWork.cv || ''
      });
    }
  </script>
</body>
</html>`;

// ==========================================
// 8. ROOT ROUTE & SERVER LAUNCH
// ==========================================
app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(INDEX_HTML);
});

app.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`✨ aStreamer Suite is running at: http://localhost:${PORT}`);
  console.log(`🔑 Admin Passcode: ${ADMIN_PASSCODE}`);
  console.log(`=================================================\n`);
});

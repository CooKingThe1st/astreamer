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
const { resolveAndSaveWork, batchImport } = require('./scraper');

const httpAgent = new http.Agent({ family: 4 });
const httpsAgent = new https.Agent({ family: 4 });

const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'astreamer2026';

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Auth Middleware
function checkAuth(req, res, next) {
  const token = req.headers['x-admin-passcode'] || req.query.passcode;
  if (!token || token !== ADMIN_PASSCODE) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing passcode' });
  }
  next();
}

const { SFW_DISGUISE_RJ_LIST } = require('./db');

// Background auto-seeding for SFW disguise list if missing
(async () => {
  for (const rj of SFW_DISGUISE_RJ_LIST) {
    if (!db.getWorkByRj(rj)) {
      try {
        await resolveAndSaveWork(rj);
      } catch (e) {}
    }
  }
})();

// ==========================================
// 1. AUTHENTICATION & GATEKEEPER APIS
// ==========================================
app.post('/api/auth/login', (req, res) => {
  const { passcode } = req.body;
  if (passcode === ADMIN_PASSCODE) {
    res.json({ success: true, message: 'Authentication successful' });
  } else {
    res.status(401).json({ success: false, error: 'Invalid passcode' });
  }
});

// Settings API
app.get('/api/settings', (req, res) => {
  res.json(db.getSettings());
});

app.post('/api/settings', checkAuth, (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json({ success: true, settings: updated });
});

// ==========================================
// 2. LIBRARY & BATCH INGESTION APIS
// ==========================================

// Get all library works (with optional search, tag, or CV filter)
app.get('/api/library', (req, res) => {
  const { q, tag, cv, circle, favorite } = req.query;
  let works = db.getAllWorks();

  if (q) {
    const term = q.toLowerCase();
    works = works.filter(w => 
      w.rjCode.toLowerCase().includes(term) ||
      w.title.toLowerCase().includes(term) ||
      (w.circle && w.circle.toLowerCase().includes(term)) ||
      (w.cv && w.cv.toLowerCase().includes(term)) ||
      (w.tags && w.tags.some(t => t.toLowerCase().includes(term)))
    );
  }

  if (tag) {
    const cleanTag = tag.toLowerCase().trim();
    works = works.filter(w => (w.tags || []).some(t => t.toLowerCase().trim() === cleanTag));
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
// 4. AGGREGATIONS (GENRES & ARTISTS)
// ==========================================
app.get('/api/tags', (req, res) => {
  res.json(db.getAllTags());
});

app.get('/api/artists', (req, res) => {
  res.json(db.getAllArtists());
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
  if (!targetUrl) return res.status(400).send('Missing url parameter');

  if (targetUrl.startsWith('//')) {
    targetUrl = 'https:' + targetUrl;
  }

  const isDlsite = targetUrl.includes('dlsite.jp') || targetUrl.includes('dlsite.com');
  const referer = isDlsite ? 'https://www.dlsite.com/' : 'https://japaneseasmr.com/';

  try {
    const response = await axios({
      method: 'get',
      url: targetUrl,
      httpAgent,
      httpsAgent,
      responseType: 'stream',
      headers: {
        'Referer': referer,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 12000
    });

    res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    response.data.pipe(res);
  } catch (err) {
    console.error(`[Image Proxy Error] Failed ${targetUrl}:`, err.message);
    res.status(500).send('Failed to proxy image');
  }
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
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>aStreamer — Personal Audio & ASMR Suite</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <script src="https://cdn.jsdelivr.net/npm/hls.js@1.5.7/dist/hls.min.js"></script>
      <style>
        :root {
          --bg-main: #0c0d12;
          --bg-sidebar: #12141a;
          --bg-card: #181a24;
          --bg-card-hover: #222533;
          --accent: #ff3366;
          --accent-glow: rgba(255, 51, 102, 0.35);
          --accent-hover: #ff4d7d;
          --text-main: #ffffff;
          --text-muted: #9499ad;
          --border: #262938;
          --player-bg: #151722;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
        
        body {
          background: var(--bg-main);
          color: var(--text-main);
          height: 100vh;
          overflow: hidden;
          display: flex;
        }

        /* App Layout */
        .app-sidebar {
          width: 260px;
          min-width: 260px;
          background: var(--bg-sidebar);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 1.5rem 1rem;
          height: calc(100vh - 84px);
        }

        .logo-area {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 0.5rem 1.5rem;
          border-bottom: 1px solid var(--border);
          margin-bottom: 1.2rem;
        }

        .logo-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #ff3366, #9b51e0);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem; font-weight: 800;
        }

        .logo-title {
          font-size: 1.3rem; font-weight: 800;
          background: linear-gradient(135deg, #ff3366, #b066fe);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-section { display: flex; flex-direction: column; gap: 4px; flex: 1; overflow-y: auto; }
        .nav-title { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); padding: 0.8rem 0.5rem 0.4rem; font-weight: 700; }

        .nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 14px; border-radius: 8px;
          color: var(--text-muted); text-decoration: none;
          font-weight: 600; font-size: 0.92rem;
          cursor: pointer; transition: all 0.15s ease;
        }
        .nav-item:hover { color: #fff; background: rgba(255,255,255,0.05); }
        .nav-item.active { color: #fff; background: var(--accent); }

        .app-main {
          flex: 1;
          height: calc(100vh - 84px);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        /* Top Bar */
        .topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.2rem 2rem;
          background: rgba(12, 13, 18, 0.8);
          backdrop-filter: blur(12px);
          position: sticky; top: 0; z-index: 20;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .search-box {
          display: flex; align-items: center; gap: 10px;
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 24px; padding: 8px 18px; width: 340px;
        }
        .search-box input {
          background: transparent; border: none; outline: none;
          color: #fff; width: 100%; font-size: 0.9rem;
        }

        .top-actions { display: flex; align-items: center; gap: 12px; }

        .btn-primary {
          background: var(--accent); color: #fff; border: none;
          padding: 9px 18px; border-radius: 20px; font-weight: 700;
          cursor: pointer; font-size: 0.88rem; transition: 0.2s;
        }
        .btn-primary:hover { background: var(--accent-hover); box-shadow: 0 4px 15px var(--accent-glow); }

        .btn-outline {
          background: transparent; color: #fff; border: 1px solid var(--border);
          padding: 8px 16px; border-radius: 20px; font-weight: 600;
          cursor: pointer; font-size: 0.88rem;
        }
        .btn-outline:hover { background: var(--bg-card-hover); }

        /* Content Views */
        .view-container { padding: 2rem; max-width: 1400px; margin: 0 auto; width: 100%; }

        .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
        .section-title { font-size: 1.6rem; font-weight: 800; }

        /* Card Grid */
        .works-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        .work-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 12px; overflow: hidden; padding: 12px;
          cursor: pointer; transition: transform 0.2s, background 0.2s;
          position: relative; display: flex; flex-direction: column;
        }
        .work-card:hover { transform: translateY(-4px); background: var(--bg-card-hover); border-color: #3b3f54; }

        .card-cover {
          width: 100%; aspect-ratio: 3/4; border-radius: 8px;
          object-fit: cover; background: #08090c; margin-bottom: 10px;
        }

        .card-badge-row { display: flex; gap: 6px; margin-bottom: 6px; align-items: center; }
        .card-rj { background: var(--accent); color: #fff; font-size: 0.7rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; }
        .card-fav { margin-left: auto; cursor: pointer; color: var(--text-muted); }
        .card-fav.active { color: #ff3366; }

        .card-title { font-size: 0.92rem; font-weight: 700; line-height: 1.35; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .card-sub { font-size: 0.8rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        /* Work Detail View */
        .work-detail-banner {
          display: flex; gap: 28px; background: var(--bg-card);
          border: 1px solid var(--border); border-radius: 16px;
          padding: 24px; margin-bottom: 2rem;
        }
        .detail-cover { width: 220px; min-width: 220px; height: 300px; border-radius: 12px; object-fit: cover; }
        .detail-info { flex: 1; display: flex; flex-direction: column; }
        .detail-title { font-size: 1.6rem; font-weight: 800; margin-bottom: 12px; line-height: 1.3; }
        .detail-meta { font-size: 0.95rem; color: var(--text-muted); margin-bottom: 6px; }
        .detail-meta strong { color: #fff; }
        .tags-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
        .tag-pill {
          background: #232736; border: 1px solid #33384c;
          color: #d1d5db; font-size: 0.78rem; padding: 4px 10px; border-radius: 6px; cursor: pointer;
        }
        .tag-pill:hover { background: var(--accent); color: #fff; }

        /* Chapter Table */
        .tracks-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        .tracks-table th { text-align: left; padding: 10px 14px; font-size: 0.8rem; color: var(--text-muted); border-bottom: 1px solid var(--border); }
        .tracks-table td { padding: 12px 14px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 0.9rem; }
        .track-row { cursor: pointer; transition: 0.15s; }
        .track-row:hover { background: var(--bg-card-hover); }
        .track-row.active { background: rgba(255,51,102,0.12); color: var(--accent); }

        /* Tag Cloud Grid */
        .tag-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
        .tag-cloud-item {
          background: var(--bg-card); border: 1px solid var(--border);
          padding: 10px 18px; border-radius: 24px; font-weight: 600; font-size: 0.9rem;
          cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s;
        }
        .tag-cloud-item:hover { background: var(--accent); color: #fff; }
        .tag-count { background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; }

        /* Modal */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.75);
          backdrop-filter: blur(8px); z-index: 1000;
          display: none; align-items: center; justify-content: center;
        }
        .modal-content {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 16px; padding: 28px; width: 100%; max-width: 540px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
        }
        .modal-title { font-size: 1.3rem; font-weight: 800; margin-bottom: 14px; }
        .modal-textarea {
          width: 100%; height: 140px; background: #0c0d12; border: 1px solid var(--border);
          border-radius: 10px; padding: 12px; color: #fff; font-family: monospace; font-size: 0.9rem;
          outline: none; margin-bottom: 16px; resize: vertical;
        }

        /* Persistent Player Bar */
        .player-bar {
          position: fixed; bottom: 0; left: 0; right: 0; height: 84px;
          background: var(--player-bg); border-top: 1px solid var(--border);
          padding: 0 24px; display: flex; align-items: center; justify-content: space-between;
          z-index: 100; box-shadow: 0 -8px 24px rgba(0,0,0,0.5);
        }

        .player-left { display: flex; align-items: center; gap: 14px; width: 280px; }
        .player-thumb { width: 52px; height: 52px; border-radius: 8px; object-fit: cover; background: #0c0d12; }
        .player-track-info { overflow: hidden; }
        .player-title { font-size: 0.9rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .player-sub { font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .player-center { flex: 1; max-width: 560px; display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .player-controls { display: flex; align-items: center; gap: 18px; }
        .ctrl-btn { background: none; border: none; color: #fff; cursor: pointer; font-size: 1.1rem; opacity: 0.85; transition: 0.15s; }
        .ctrl-btn:hover { opacity: 1; color: var(--accent); }
        .play-btn-circle {
          width: 40px; height: 40px; border-radius: 50%;
          background: #fff; color: #000; display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem; cursor: pointer; border: none; transition: transform 0.15s;
        }
        .play-btn-circle:hover { transform: scale(1.08); background: var(--accent); color: #fff; }

        .scrubber-row { display: flex; align-items: center; gap: 12px; width: 100%; }
        .time-text { font-size: 0.75rem; color: var(--text-muted); font-variant-numeric: tabular-nums; min-width: 40px; }
        .scrubber { flex: 1; height: 4px; appearance: none; background: #333748; border-radius: 2px; outline: none; cursor: pointer; }
        .scrubber::-webkit-slider-thumb { appearance: none; width: 12px; height: 12px; border-radius: 50%; background: var(--accent); cursor: pointer; }

        .player-right { display: flex; align-items: center; gap: 12px; width: 280px; justify-content: flex-end; }
        .volume-slider { width: 90px; height: 4px; appearance: none; background: #333748; border-radius: 2px; outline: none; cursor: pointer; }
        .volume-slider::-webkit-slider-thumb { appearance: none; width: 10px; height: 10px; border-radius: 50%; background: #fff; }

        /* Disguised Cover Styling (PSFW Mode) */
        .card-cover-wrapper { position: relative; width: 100%; aspect-ratio: 3/4; margin-bottom: 10px; border-radius: 8px; overflow: hidden; }
        .card-cover-wrapper .card-cover { width: 100%; height: 100%; margin-bottom: 0; }
        .disguised-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(176,102,254,0.2) 0%, rgba(12,13,18,0.7) 100%);
          box-shadow: inset 0 0 18px rgba(176, 102, 254, 0.7);
          pointer-events: none; display: flex; align-items: flex-end; padding: 6px;
        }
        .disguised-badge {
          background: #7c3aed; color: #fff; font-size: 0.65rem; font-weight: 800;
          padding: 2px 6px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);
        }

        /* Settings Card */
        .settings-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 16px; padding: 24px; margin-bottom: 20px;
        }
        .settings-option {
          display: flex; align-items: flex-start; gap: 14px; padding: 14px;
          border-radius: 10px; border: 1px solid var(--border); margin-bottom: 10px;
          cursor: pointer; transition: 0.2s;
        }
        .settings-option:hover { background: var(--bg-card-hover); }
        .settings-option.selected { border-color: var(--accent); background: rgba(255,51,102,0.08); }
        .settings-radio { margin-top: 4px; accent-color: var(--accent); cursor: pointer; }
        .settings-label { font-size: 1rem; font-weight: 700; margin-bottom: 4px; }
        .settings-desc { font-size: 0.85rem; color: var(--text-muted); }
      </style>
    </head>
    <body>
      <!-- Passcode Gatekeeper Modal -->
      <div id="gatekeeperModal" class="modal-overlay" style="display: flex;">
        <div class="gatekeeper-card">
          <div class="logo-icon" style="margin: 0 auto 16px; width: 48px; height: 48px; font-size: 1.5rem;">✨</div>
          <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 8px;">Welcome to aStreamer</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px;">Please enter your admin passcode to unlock your personal library.</p>
          <input type="password" id="passcodeInput" placeholder="Enter Admin Passcode" style="width: 100%; padding: 14px 18px; border-radius: 10px; background: #0c0d12; border: 1px solid var(--border); color: #fff; font-size: 1rem; outline: none; margin-bottom: 16px; text-align: center;" onkeydown="if(event.key==='Enter') login()">
          <button class="btn-primary" style="width: 100%; padding: 14px; font-size: 1rem;" onclick="login()">Unlock Library</button>
          <div id="loginError" style="color: #ff3366; font-size: 0.85rem; margin-top: 12px; display: none;">Invalid Passcode</div>
        </div>
      </div>

      <!-- Batch Import Modal -->
      <div id="importModal" class="modal-overlay">
        <div class="modal-content">
          <h3 class="modal-title">📥 Batch Import RJ Works</h3>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 12px;">Paste multiple RJ codes (e.g. <code>RJ01473335, RJ441308, RJ01570152</code>) or upload a <code>.txt</code> file.</p>
          <textarea id="importTextarea" class="modal-textarea" placeholder="RJ01473335&#10;RJ441308&#10;RJ01570152"></textarea>
          <div style="margin-bottom: 18px;">
            <input type="file" id="importFileInput" accept=".txt" style="font-size: 0.85rem; color: var(--text-muted);" onchange="handleFileUpload(event)">
          </div>
          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button class="btn-outline" onclick="closeImportModal()">Cancel</button>
            <button class="btn-primary" id="btnRunImport" onclick="runBatchImport()">Start Import</button>
          </div>
          <div id="importProgress" style="margin-top: 14px; font-size: 0.85rem; color: #38bdf8; display: none;">Importing...</div>
        </div>
      </div>

      <!-- Add to Playlist Modal -->
      <div id="addToPlaylistModal" class="modal-overlay">
        <div class="modal-content">
          <h3 class="modal-title">➕ Add to Playlist</h3>
          <p id="addToPlaylistTrackLabel" style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px;"></p>
          
          <div style="margin-bottom: 16px;">
            <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 8px; font-weight: 700;">Select Existing Playlist:</div>
            <div id="existingPlaylistsList" style="display: flex; flex-direction: column; gap: 8px; max-height: 180px; overflow-y: auto; margin-bottom: 12px;"></div>
          </div>

          <div style="border-top: 1px solid var(--border); padding-top: 14px;">
            <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 8px; font-weight: 700;">Or Create New Playlist:</div>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="quickNewPlName" placeholder="New Playlist Name" style="flex: 1; padding: 10px 14px; border-radius: 8px; background: #0c0d12; border: 1px solid var(--border); color: #fff; outline: none; font-size: 0.9rem;">
              <button class="btn-primary" onclick="createAndAddToPlaylist()">Create & Add</button>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 18px;">
            <button class="btn-outline" onclick="closeAddToPlaylistModal()">Close</button>
          </div>
        </div>
      </div>

      <!-- Create Playlist Modal -->
      <div id="playlistModal" class="modal-overlay">
        <div class="modal-content">
          <h3 class="modal-title">📜 Create New Playlist</h3>
          <input type="text" id="newPlName" placeholder="Playlist Name (e.g. Chill Whispers)" style="width: 100%; padding: 12px; border-radius: 8px; background: #0c0d12; border: 1px solid var(--border); color: #fff; margin-bottom: 12px; outline: none;">
          <input type="text" id="newPlDesc" placeholder="Description (optional)" style="width: 100%; padding: 12px; border-radius: 8px; background: #0c0d12; border: 1px solid var(--border); color: #fff; margin-bottom: 18px; outline: none;">
          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button class="btn-outline" onclick="closePlaylistModal()">Cancel</button>
            <button class="btn-primary" onclick="submitCreatePlaylist()">Create</button>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <aside class="app-sidebar">
        <div class="logo-area">
          <div class="logo-icon">✨</div>
          <div class="logo-title">aStreamer</div>
        </div>

        <nav class="nav-section">
          <div class="nav-title">Menu</div>
          <div class="nav-item active" onclick="switchView('library')">📚 Library</div>
          <div class="nav-item" onclick="switchView('playlists')">📜 Playlists</div>
          <div class="nav-item" onclick="switchView('artists')">🎙️ Voice Actors</div>
          <div class="nav-item" onclick="switchView('genres')">🏷️ Genres & Tags</div>
          
          <div class="nav-title">Manage</div>
          <div class="nav-item" onclick="openImportModal()">📥 Batch Import</div>
          <div class="nav-item" onclick="exportBackup()">💾 Export Backup</div>
          <div class="nav-item" onclick="switchView('settings')">⚙️ Settings</div>
        </nav>
      </aside>

      <!-- Main Application Container -->
      <main class="app-main">
        <div class="topbar">
          <div class="search-box">
            <span>🔍</span>
            <input type="text" id="globalSearch" placeholder="Search title, RJ code, CV, circle..." oninput="handleSearch(this.value)">
          </div>
          <div class="top-actions">
            <button class="btn-primary" onclick="quickAddRj()">+ Add RJ Code</button>
          </div>
        </div>

        <div id="viewContainer" class="view-container">
          <!-- Dynamically populated view -->
        </div>
      </main>

      <!-- Persistent Bottom Audio Player Bar -->
      <footer class="player-bar">
        <div class="player-left">
          <img id="playerCover" class="player-thumb" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect width='48' height='48' fill='%23222'/%3E%3C/svg%3E">
          <div class="player-track-info">
            <div id="playerTitle" class="player-title">Select track to play</div>
            <div id="playerSub" class="player-sub">aStreamer</div>
          </div>
          <button class="ctrl-btn" title="Add Currently Playing to Playlist" style="margin-left: 6px; font-size: 1rem;" onclick="addCurrentTrackToPlaylist()">➕</button>
        </div>

        <div class="player-center">
          <div class="player-controls">
            <button class="ctrl-btn" title="Skip -10s" onclick="seekRelative(-10)">⏪ 10s</button>
            <button class="ctrl-btn" title="Previous Track" onclick="playPrevTrack()">⏮</button>
            <button id="playPauseBtn" class="play-btn-circle" onclick="togglePlayPause()">▶</button>
            <button class="ctrl-btn" title="Next Track" onclick="playNextTrack()">⏭</button>
            <button class="ctrl-btn" title="Skip +10s" onclick="seekRelative(10)">10s ⏩</button>
          </div>
          <div class="scrubber-row">
            <span id="currTime" class="time-text">00:00</span>
            <input type="range" id="scrubber" class="scrubber" min="0" max="100" value="0" oninput="onScrub(this.value)">
            <span id="totalTime" class="time-text">00:00</span>
          </div>
        </div>

        <div class="player-right">
          <button class="ctrl-btn" onclick="toggleMute()">🔊</button>
          <input type="range" id="volumeSlider" class="volume-slider" min="0" max="1" step="0.05" value="1" oninput="setVolume(this.value)">
        </div>
      </footer>

      <!-- Hidden native audio element -->
      <audio id="coreAudio" preload="metadata"></audio>

      <script>
        let authToken = localStorage.getItem('astreamer_passcode') || '';
        let contentMode = localStorage.getItem('astreamer_content_mode') || 'NSFW'; // 'SFW' | 'PSFW' | 'NSFW'
        let currentView = 'library';
        let allWorks = [];
        let currentWork = null;
        let currentTrackIndex = -1;
        let hls = null;
        let loadedHlsUrl = null;
        const audio = document.getElementById('coreAudio');

        const SFW_DISGUISE_LIST = [
          'RJ01681691', 'RJ01678330', 'RJ01694805', 'RJ01688728', 'RJ01693711',
          'RJ335043', 'RJ01360841', 'RJ346413', 'RJ01229288', 'RJ321035',
          'RJ317278', 'RJ387519', 'RJ370190', 'RJ343025', 'RJ373001',
          'RJ01144236', 'RJ336447', 'RJ329940', 'RJ403038', 'RJ370099',
          'RJ299717', 'RJ01323001', 'RJ363741', 'RJ333531', 'RJ357211', 'RJ01040461'
        ];

        const NSFW_KEYWORDS = [
          'nsfw', '18禁', 'r18', 'r-18', 'adult', 'erotic', 'futanari', 'hentai',
          '手コキ', '中出し', 'オナサポ', '乳首責め', '乳首', 'オナホ', 'セックス',
          '騎乗位', '交尾', '精飲', 'フェラ', 'パイズリ', 'アナル', '潮吹き', '痴女',
          'バイブ', '拘束', '催眠', '洗脳', '絶頂', '連続絶頂', '常識改変', 'インモラル',
          '乱交', '射精', '射精管理', '快楽堕ち', 'おまんこ', 'ちんぽ', 'ちんこ', '性力',
          'オホ声', 'オホ', '奉仕', '寸止め', 'ザーメン', '搾精', '淫乱', '発情',
          'メス堕ち', 'アヘ顔', '肉便器', 'マゾ', 'サド', '調教', '言葉責め', '責め',
          '愛撫', 'クンニ', '巨乳', '爆乳', '貧乳', '微乳', '催眠音声', '退廃',
          '背徳', '強制', '無理矢理', '媚び', '服従', '淫惑', '性器', '淫具', '孕'
        ];

        function isWorkNsfw(work) {
          if (!work) return false;
          // If explicitly in the verified SFW whitelist
          if (SFW_DISGUISE_LIST.includes(work.rjCode)) return false;
          if (work.isNsfw === true) return true;

          const text = (work.tags || []).join(' ') + ' ' + (work.title || '');
          const lower = text.toLowerCase();
          return NSFW_KEYWORDS.some(k => lower.includes(k.toLowerCase()));
        }

        // Returns { coverUrl, isDisguised }
        function getDisplayCover(work) {
          if (contentMode === 'PSFW' && isWorkNsfw(work)) {
            // Deterministic hash so same work always gets same SFW disguise cover
            let hash = 0;
            for (let i = 0; i < work.rjCode.length; i++) hash = (hash * 31 + work.rjCode.charCodeAt(i)) >>> 0;
            const sfwRj = SFW_DISGUISE_LIST[hash % SFW_DISGUISE_LIST.length];
            return {
              coverUrl: \`/image-proxy?url=\${encodeURIComponent('https://pic.weeabo0.xyz/' + sfwRj + '_img_main.jpg')}\`,
              isDisguised: true
            };
          }
          return { coverUrl: work.coverUrl, isDisguised: false };
        }

        // Check login on load
        window.addEventListener('DOMContentLoaded', () => {
          if (authToken) {
            document.getElementById('gatekeeperModal').style.display = 'none';
            loadLibrary();
          }
        });

        async function login() {
          const pass = document.getElementById('passcodeInput').value.trim();
          if (!pass) return;

          try {
            const res = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ passcode: pass })
            });
            const data = await res.json();
            if (data.success) {
              authToken = pass;
              localStorage.setItem('astreamer_passcode', pass);
              document.getElementById('gatekeeperModal').style.display = 'none';
              loadLibrary();
            } else {
              document.getElementById('loginError').style.display = 'block';
            }
          } catch (e) {
            document.getElementById('loginError').style.display = 'block';
          }
        }

        function authHeaders() {
          return { 'x-admin-passcode': authToken, 'Content-Type': 'application/json' };
        }

        // ================= Navigation & Views =================
        function switchView(view, param = null) {
          currentView = view;
          document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
          
          if (view === 'library') {
            document.querySelector('.nav-item:nth-child(2)')?.classList.add('active');
            loadLibrary(param || {});
          } else if (view === 'playlists') {
            document.querySelector('.nav-item:nth-child(3)')?.classList.add('active');
            loadPlaylists();
          } else if (view === 'artists') {
            document.querySelector('.nav-item:nth-child(4)')?.classList.add('active');
            loadArtists();
          } else if (view === 'genres') {
            document.querySelector('.nav-item:nth-child(5)')?.classList.add('active');
            loadGenres();
          } else if (view === 'settings') {
            document.querySelector('.nav-item:nth-child(9)')?.classList.add('active');
            loadSettings();
          } else if (view === 'work-detail') {
            loadWorkDetail(param);
          }
        }

        async function loadLibrary(filterParams = {}) {
          const container = document.getElementById('viewContainer');
          container.innerHTML = '<div style="text-align:center; padding: 3rem; color: var(--text-muted);">Loading Library...</div>';

          try {
            const url = new URL('/api/library', window.location.origin);
            Object.keys(filterParams).forEach(k => {
              if (filterParams[k]) url.searchParams.set(k, filterParams[k]);
            });

            const res = await fetch(url);
            let works = await res.json();
            
            // SFW Filter
            if (contentMode === 'SFW') {
              works = works.filter(w => !isWorkNsfw(w));
            }

            allWorks = works;
            renderLibraryGrid(works, filterParams);
          } catch (e) {
            container.innerHTML = '<div style="color:#ff3366; padding:2rem;">Error loading library: ' + e.message + '</div>';
          }
        }

        function renderLibraryGrid(works, filterParams = {}) {
          const container = document.getElementById('viewContainer');
          let filterHeader = '';

          const modeBadge = contentMode === 'PSFW' ? '<span class="disguised-badge" style="margin-left: 8px;">🎭 PSFW Disguise Mode Active</span>' : (contentMode === 'SFW' ? '<span style="background:#0e7490; color:#fff; font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:4px; margin-left:8px;">🛡️ SFW Filter Active</span>' : '');

          if (filterParams.tag) {
            filterHeader = \`
              <div style="background: rgba(255,51,102,0.12); border: 1px solid var(--accent); padding: 10px 18px; border-radius: 10px; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;">
                <span>🏷️ Filtered by Genre/Tag: <strong>\${filterParams.tag}</strong> (\${works.length} works)</span>
                <button class="btn-outline" style="padding: 4px 12px; font-size: 0.8rem;" onclick="loadLibrary()">✖ Clear Filter</button>
              </div>
            \`;
          } else if (filterParams.cv) {
            filterHeader = \`
              <div style="background: rgba(56,189,248,0.12); border: 1px solid #38bdf8; padding: 10px 18px; border-radius: 10px; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;">
                <span>🎙️ Filtered by Voice Actor: <strong>\${filterParams.cv}</strong> (\${works.length} works)</span>
                <button class="btn-outline" style="padding: 4px 12px; font-size: 0.8rem;" onclick="loadLibrary()">✖ Clear Filter</button>
              </div>
            \`;
          } else if (filterParams.favorite) {
            filterHeader = \`
              <div style="background: rgba(255,51,102,0.12); border: 1px solid var(--accent); padding: 10px 18px; border-radius: 10px; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;">
                <span>❤️ Showing <strong>Favorites</strong> (\${works.length} works)</span>
                <button class="btn-outline" style="padding: 4px 12px; font-size: 0.8rem;" onclick="loadLibrary()">✖ Show All</button>
              </div>
            \`;
          }

          let html = \`
            \${filterHeader}
            <div class="section-header">
              <h1 class="section-title">📚 Library (\${works.length}) \${modeBadge}</h1>
              <div>
                <button class="btn-outline" onclick="loadLibrary({ favorite: 'true' })">❤️ Favorites</button>
                <button class="btn-outline" onclick="loadLibrary()" style="margin-left: 8px;">All</button>
              </div>
            </div>
            <div class="works-grid">
          \`;

          if (works.length === 0) {
            html += '<div style="grid-column: 1/-1; padding: 3rem; text-align: center; color: var(--text-muted);">No works match this view. Try changing content mode in <strong>⚙️ Settings</strong> or adding more works.</div>';
          }

          works.forEach(w => {
            const display = getDisplayCover(w);
            html += \`
              <div class="work-card" onclick="switchView('work-detail', '\${w.rjCode}')">
                <div class="card-cover-wrapper">
                  <img class="card-cover" src="\${display.coverUrl}" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'260\\'><rect width=\\'200\\' height=\\'260\\' fill=\\'%23181a24\\'/></svg>'">
                  \${display.isDisguised ? '<div class="disguised-overlay"><span class="disguised-badge">🎭 Disguised SFW</span></div>' : ''}
                </div>
                <div class="card-badge-row">
                  <span class="card-rj">\${w.rjCode}</span>
                  <span class="card-fav" title="\${w.favorite ? 'Favorited' : 'Add to Favorites'}" onclick="event.stopPropagation(); toggleFav('\${w.rjCode}')">\${w.favorite ? '❤️' : '🤍'}</span>
                </div>
                <div class="card-title" title="\${w.title}">\${w.title}</div>
                <div class="card-sub">\${w.cv || w.circle || 'ASMR'}</div>
              </div>
            \`;
          });

          html += '</div>';
          container.innerHTML = html;
        }

        function loadSettings() {
          const container = document.getElementById('viewContainer');
          let html = \`
            <div class="section-header">
              <h1 class="section-title">⚙️ App Settings</h1>
            </div>

            <div class="settings-card">
              <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 6px;">🛡️ Content Privacy & Disguise Mode</h3>
              <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 18px;">Control how adult (NSFW) cover art and tags are presented on your screen.</p>
              
              <div class="settings-option \${contentMode === 'NSFW' ? 'selected' : ''}" onclick="setContentMode('NSFW')">
                <input type="radio" name="contentMode" value="NSFW" class="settings-radio" \${contentMode === 'NSFW' ? 'checked' : ''}>
                <div>
                  <div class="settings-label">🌶️ NSFW (Full Adult - Default)</div>
                  <div class="settings-desc">Show all original high-resolution cover arts, adult tags, and uncensored catalog.</div>
                </div>
              </div>

              <div class="settings-option \${contentMode === 'PSFW' ? 'selected' : ''}" onclick="setContentMode('PSFW')">
                <input type="radio" name="contentMode" value="PSFW" class="settings-radio" \${contentMode === 'PSFW' ? 'checked' : ''}>
                <div>
                  <div class="settings-label">🎭 PSFW (Pseudo-SFW / Disguise Covers)</div>
                  <div class="settings-desc">Full audio remains playable, but adult cover arts are disguised with glowing stylized SFW artwork.</div>
                </div>
              </div>

              <div class="settings-option \${contentMode === 'SFW' ? 'selected' : ''}" onclick="setContentMode('SFW')">
                <input type="radio" name="contentMode" value="SFW" class="settings-radio" \${contentMode === 'SFW' ? 'checked' : ''}>
                <div>
                  <div class="settings-label">🛡️ SFW (Strict Safe For Work)</div>
                  <div class="settings-desc">Hide all adult works and NSFW tags completely from the library and tag cloud.</div>
                </div>
              </div>
            </div>

            <div class="settings-card">
              <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 6px;">💾 Library Data & Backup</h3>
              <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px;">Export your cached library and playlists as JSON or restore from backup.</p>
              <div style="display: flex; gap: 10px;">
                <button class="btn-primary" onclick="exportBackup()">📥 Export JSON Backup</button>
              </div>
            </div>
          \`;

          container.innerHTML = html;
        }

        async function setContentMode(mode) {
          contentMode = mode;
          localStorage.setItem('astreamer_content_mode', mode);
          await fetch('/api/settings', {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ contentMode: mode })
          });
          loadSettings();
        }

        let pendingPlaylistItem = null;

        async function loadWorkDetail(rjCode) {
          const container = document.getElementById('viewContainer');
          const work = allWorks.find(w => w.rjCode === rjCode) || await (await fetch('/api/library?q=' + rjCode)).json().then(res => res[0]);

          if (!work) {
            container.innerHTML = '<div style="padding:2rem;">Work not found</div>';
            return;
          }

          currentWork = work;

          let html = \`
            <div class="work-detail-banner">
              <img class="detail-cover" src="\${work.coverUrl}">
              <div class="detail-info">
                <div style="display:flex; gap:8px; margin-bottom:8px;">
                  <span class="card-rj">\${work.rjCode}</span>
                  <span style="background:#0e7490; color:#fff; font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:4px;">\${work.hasHls ? 'HLS Chapters' : 'Multi-Track'}</span>
                </div>
                <h1 class="detail-title">\${work.title}</h1>
                <div class="detail-meta"><strong>Voice Actor (CV):</strong> \${work.cv || 'N/A'}</div>
                <div class="detail-meta"><strong>Circle:</strong> \${work.circle || 'N/A'}</div>
                <div class="tags-row">
                  \${(work.tags || []).map(t => \`<span class="tag-pill" onclick="switchView('library', { tag: '\${t}' })">\${t}</span>\`).join('')}
                </div>
                <div style="margin-top:auto; padding-top:16px; display:flex; flex-wrap:wrap; gap:10px;">
                  <button class="btn-primary" onclick="playTrack(0, true)">▶ Play All</button>
                  <button class="btn-outline" onclick="openAddToPlaylistModal({ rjCode: '\${work.rjCode}', title: '\${work.title.replace(/'/g, "")}', workTitle: '\${work.title.replace(/'/g, "")}', poster: '\${work.coverUrl}', cv: '\${work.cv || ""}', isWork: true })">➕ Add Work to Playlist</button>
                  <button class="btn-outline" onclick="deleteWorkItem('\${work.rjCode}')">🗑️ Remove</button>
                </div>
              </div>
            </div>

            <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:12px;">🎵 Tracklist / Chapters (\${work.totalTracks})</h3>
            <table class="tracks-table">
              <thead>
                <tr>
                  <th style="width: 40px;">#</th>
                  <th>Title</th>
                  <th style="width: 100px;">Offset</th>
                  <th style="width: 140px; text-align:right;">Action</th>
                </tr>
              </thead>
              <tbody>
          \`;

          work.tracks.forEach((t, i) => {
            html += \`
              <tr class="track-row" id="track-row-\${i}" onclick="playTrack(\${i}, true)">
                <td>\${t.id}</td>
                <td><strong>\${t.title}</strong></td>
                <td style="color:#38bdf8;">\${t.formattedTime || '00:00:00'}</td>
                <td style="text-align:right;">
                  <button class="btn-outline" style="padding: 4px 10px; font-size: 0.75rem;" onclick="event.stopPropagation(); openAddToPlaylistModal({ rjCode: '\${work.rjCode}', trackId: \${t.id}, title: '\${t.title.replace(/'/g, "")}', workTitle: '\${work.title.replace(/'/g, "")}', startTime: \${t.startTime || 0}, streamUrl: '\${t.streamUrl}', isHls: \${t.isHls}, poster: '\${work.coverUrl}', cv: '\${work.cv || ""}' })">➕ Playlist</button>
                </td>
              </tr>
            \`;
          });

          html += '</tbody></table>';
          container.innerHTML = html;
        }

        async function loadGenres() {
          const container = document.getElementById('viewContainer');
          const tags = await (await fetch('/api/tags')).json();

          let html = \`
            <div class="section-header">
              <h1 class="section-title">🏷️ Genres & Tags</h1>
            </div>
            <div class="tag-cloud">
          \`;

          tags.forEach(t => {
            html += \`
              <div class="tag-cloud-item" onclick="switchView('library', { tag: '\${t.name}' })">
                <span>\${t.name}</span>
                <span class="tag-count">\${t.count}</span>
              </div>
            \`;
          });

          html += '</div>';
          container.innerHTML = html;
        }

        async function loadArtists() {
          const container = document.getElementById('viewContainer');
          const artists = await (await fetch('/api/artists')).json();

          let html = \`
            <div class="section-header">
              <h1 class="section-title">🎙️ Voice Actors (CV)</h1>
            </div>
            <div class="tag-cloud">
          \`;

          artists.forEach(a => {
            html += \`
              <div class="tag-cloud-item" onclick="switchView('library', { cv: '\${a.name}' })">
                <span>\${a.name}</span>
                <span class="tag-count">\${a.count} works</span>
              </div>
            \`;
          });

          html += '</div>';
          container.innerHTML = html;
        }

        async function loadPlaylists() {
          const container = document.getElementById('viewContainer');
          const playlists = await (await fetch('/api/playlists')).json();

          let html = \`
            <div class="section-header">
              <h1 class="section-title">📜 Your Playlists</h1>
              <button class="btn-primary" onclick="openPlaylistModal()">+ New Playlist</button>
            </div>
            <div class="works-grid">
          \`;

          if (playlists.length === 0) {
            html += '<div style="grid-column: 1/-1; padding: 3rem; text-align: center; color: var(--text-muted);">No playlists yet. Create one with <strong>+ New Playlist</strong>.</div>';
          }

          playlists.forEach(p => {
            html += \`
              <div class="work-card" onclick="loadPlaylistDetail('\${p.id}')">
                <img class="card-cover" src="\${p.coverUrl || 'data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'260\\'><rect width=\\'200\\' height=\\'260\\' fill=\\'%23181a24\\'/></svg>'}">
                <div class="card-title">\${p.name}</div>
                <div class="card-sub">\${p.items?.length || 0} tracks</div>
              </div>
            \`;
          });

          html += '</div>';
          container.innerHTML = html;
        }

        async function loadPlaylistDetail(plId) {
          const container = document.getElementById('viewContainer');
          const playlists = await (await fetch('/api/playlists')).json();
          const pl = playlists.find(p => p.id === plId);

          if (!pl) {
            loadPlaylists();
            return;
          }

          let html = \`
            <div class="work-detail-banner">
              <img class="detail-cover" src="\${pl.coverUrl || 'data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'260\\'><rect width=\\'200\\' height=\\'260\\' fill=\\'%23181a24\\'/></svg>'}">
              <div class="detail-info">
                <span class="card-rj" style="width:fit-content; margin-bottom:8px;">PLAYLIST</span>
                <h1 class="detail-title">\${pl.name}</h1>
                <div class="detail-meta">\${pl.description || 'Custom playlist'}</div>
                <div class="detail-meta"><strong>Tracks:</strong> \${pl.items?.length || 0}</div>
                <div style="margin-top:auto; padding-top:16px; display:flex; gap:10px;">
                  \${pl.items?.length > 0 ? '<button class="btn-primary" onclick="playPlaylistItem(0, \\'' + pl.id + '\\')">▶ Play All</button>' : ''}
                  <button class="btn-outline" onclick="deletePlaylistAction('\${pl.id}')">🗑️ Delete Playlist</button>
                  <button class="btn-outline" onclick="switchView('playlists')">← Back to Playlists</button>
                </div>
              </div>
            </div>

            <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:12px;">🎵 Playlist Tracks (\${pl.items?.length || 0})</h3>
            <table class="tracks-table">
              <thead>
                <tr>
                  <th style="width: 40px;">#</th>
                  <th>Title</th>
                  <th>From Work</th>
                  <th style="width: 100px; text-align:right;">Action</th>
                </tr>
              </thead>
              <tbody>
          \`;

          if (!pl.items || pl.items.length === 0) {
            html += '<tr><td colspan="4" style="text-align:center; padding:2rem; color:var(--text-muted);">Playlist is empty. Add tracks from any work in your Library!</td></tr>';
          } else {
            pl.items.forEach((item, index) => {
              html += \`
                <tr class="track-row" onclick="playPlaylistItem(\${index}, '\${pl.id}')">
                  <td>\${index + 1}</td>
                  <td><strong>\${item.title}</strong></td>
                  <td style="color:var(--text-muted);">\${item.workTitle || item.rjCode}</td>
                  <td style="text-align:right;">
                    <button class="btn-outline" style="padding:4px 8px; font-size:0.75rem;" onclick="event.stopPropagation(); removePlaylistItem('\${pl.id}', \${index})">🗑️</button>
                  </td>
                </tr>
              \`;
            });
          }

          html += '</tbody></table>';
          container.innerHTML = html;
        }

        async function playPlaylistItem(index, plId) {
          const playlists = await (await fetch('/api/playlists')).json();
          const pl = playlists.find(p => p.id === plId);
          if (!pl || !pl.items[index]) return;

          const item = pl.items[index];
          const work = allWorks.find(w => w.rjCode === item.rjCode) || await (await fetch('/api/library?q=' + item.rjCode)).json().then(res => res[0]);

          if (work) {
            currentWork = work;
            const targetTrackIdx = work.tracks.findIndex(t => t.id === item.trackId) >= 0 ? work.tracks.findIndex(t => t.id === item.trackId) : 0;
            playTrack(targetTrackIdx, true);
          }
        }

        async function removePlaylistItem(plId, index) {
          await fetch(\`/api/playlists/\${plId}/items/\${index}\`, { method: 'DELETE', headers: authHeaders() });
          loadPlaylistDetail(plId);
        }

        async function deletePlaylistAction(plId) {
          if (!confirm('Are you sure you want to delete this playlist?')) return;
          await fetch(\`/api/playlists/\${plId}\`, { method: 'DELETE', headers: authHeaders() });
          switchView('playlists');
        }

        // ================= Playlist Add Modal Functions =================
        async function openAddToPlaylistModal(item) {
          pendingPlaylistItem = item;
          const modal = document.getElementById('addToPlaylistModal');
          const label = document.getElementById('addToPlaylistTrackLabel');
          const listContainer = document.getElementById('existingPlaylistsList');

          label.innerText = 'Track: ' + item.title + (item.workTitle ? ' (' + item.workTitle + ')' : '');
          listContainer.innerHTML = '<div style="color:var(--text-muted); font-size:0.85rem;">Loading playlists...</div>';
          modal.style.display = 'flex';

          try {
            const res = await fetch('/api/playlists');
            const playlists = await res.json();
            
            if (playlists.length === 0) {
              listContainer.innerHTML = '<div style="color:var(--text-muted); font-size:0.85rem;">No playlists found. Create one below!</div>';
            } else {
              listContainer.innerHTML = '';
              playlists.forEach(pl => {
                const btn = document.createElement('button');
                btn.className = 'nav-item';
                btn.style.width = '100%';
                btn.style.justifyContent = 'space-between';
                btn.innerHTML = \`<span>📜 \${pl.name}</span><span style="font-size:0.75rem; color:var(--text-muted);">\${pl.items?.length || 0} tracks</span>\`;
                btn.onclick = () => addItemToPlaylist(pl.id);
                listContainer.appendChild(btn);
              });
            }
          } catch (e) {
            listContainer.innerHTML = '<div style="color:#ff3366;">Error loading playlists</div>';
          }
        }

        function closeAddToPlaylistModal() {
          document.getElementById('addToPlaylistModal').style.display = 'none';
          pendingPlaylistItem = null;
        }

        async function addItemToPlaylist(plId) {
          if (!pendingPlaylistItem) return;

          try {
            const res = await fetch(\`/api/playlists/\${plId}/items\`, {
              method: 'POST',
              headers: authHeaders(),
              body: JSON.stringify({ item: pendingPlaylistItem })
            });
            const data = await res.json();
            if (data.success) {
              alert('✅ Added to playlist!');
              closeAddToPlaylistModal();
            }
          } catch (e) {
            alert('Failed to add: ' + e.message);
          }
        }

        async function createAndAddToPlaylist() {
          const name = document.getElementById('quickNewPlName').value.trim();
          if (!name) return;

          try {
            const res = await fetch('/api/playlists', {
              method: 'POST',
              headers: authHeaders(),
              body: JSON.stringify({ name })
            });
            const newPl = await res.json();
            if (newPl && newPl.id) {
              document.getElementById('quickNewPlName').value = '';
              await addItemToPlaylist(newPl.id);
            }
          } catch (e) {
            alert('Error creating playlist: ' + e.message);
          }
        }

        function addCurrentTrackToPlaylist() {
          if (!currentWork || !currentWork.tracks[currentTrackIndex]) {
            alert('No track is currently loaded to add');
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

        // ================= Core Audio Engine =================
        function playTrack(index, userTriggered = true) {
          if (!currentWork || !currentWork.tracks[index]) return;

          currentTrackIndex = index;
          const track = currentWork.tracks[index];

          document.getElementById('playerTitle').innerText = track.title;
          document.getElementById('playerSub').innerText = currentWork.rjCode + ' • ' + currentWork.title;
          document.getElementById('playerCover').src = currentWork.coverUrl;

          audio.muted = false;
          if (audio.volume === 0) audio.volume = 1.0;

          document.querySelectorAll('.track-row').forEach((r, i) => {
            r.classList.toggle('active', i === index);
          });

          if (track.isHls) {
            playHlsStream(track.streamUrl, track.startTime || 0, userTriggered);
          } else {
            playDirectAudio(track.streamUrl, userTriggered);
          }
        }

        function playHlsStream(m3u8Url, startTime, userTriggered) {
          if (hls && loadedHlsUrl === m3u8Url) {
            audio.currentTime = startTime;
            if (userTriggered) audio.play().catch(e => console.log('Play error:', e));
            return;
          }

          if (hls) {
            hls.destroy();
            hls = null;
          }

          if (Hls.isSupported()) {
            hls = new Hls({
              enableWorker: false,
              lowLatencyMode: false,
              maxBufferLength: 30
            });

            hls.loadSource(m3u8Url);
            hls.attachMedia(audio);
            loadedHlsUrl = m3u8Url;

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              if (startTime > 0) audio.currentTime = startTime;
              if (userTriggered) audio.play().catch(e => console.log('Autoplay handled:', e));
            });
          } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
            audio.src = m3u8Url;
            audio.addEventListener('loadedmetadata', () => {
              if (startTime > 0) audio.currentTime = startTime;
              if (userTriggered) audio.play().catch(e => console.log('Play:', e));
            }, { once: true });
          }
        }

        function playDirectAudio(srcUrl, userTriggered) {
          if (hls) {
            hls.destroy();
            hls = null;
            loadedHlsUrl = null;
          }
          audio.src = srcUrl;
          if (userTriggered) audio.play().catch(e => console.log('Play error:', e));
        }

        function togglePlayPause() {
          if (audio.paused) {
            audio.play();
          } else {
            audio.pause();
          }
        }

        audio.addEventListener('play', () => {
          document.getElementById('playPauseBtn').innerText = '⏸';
        });

        audio.addEventListener('pause', () => {
          document.getElementById('playPauseBtn').innerText = '▶';
        });

        audio.addEventListener('timeupdate', () => {
          const ct = audio.currentTime;
          const dur = audio.duration || 0;
          document.getElementById('currTime').innerText = formatTime(ct);
          document.getElementById('totalTime').innerText = formatTime(dur);
          
          if (dur > 0) {
            document.getElementById('scrubber').value = (ct / dur) * 100;
          }
        });

        function formatTime(secs) {
          if (isNaN(secs)) return '00:00';
          const h = Math.floor(secs / 3600);
          const m = Math.floor((secs % 3600) / 60);
          const s = Math.floor(secs % 60);
          if (h > 0) {
            return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
          }
          return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
        }

        function onScrub(val) {
          if (audio.duration) {
            audio.currentTime = (val / 100) * audio.duration;
          }
        }

        function seekRelative(secs) {
          audio.currentTime = Math.max(0, audio.currentTime + secs);
        }

        function playNextTrack() {
          if (currentWork && currentTrackIndex + 1 < currentWork.tracks.length) {
            playTrack(currentTrackIndex + 1, true);
          }
        }

        function playPrevTrack() {
          if (currentWork && currentTrackIndex - 1 >= 0) {
            playTrack(currentTrackIndex - 1, true);
          }
        }

        function setVolume(val) {
          audio.volume = parseFloat(val);
        }

        function toggleMute() {
          audio.muted = !audio.muted;
        }

        // ================= Action Helpers =================
        function handleSearch(val) {
          const term = val.trim().toLowerCase();
          if (!term) {
            renderLibraryGrid(allWorks);
            return;
          }
          const filtered = allWorks.filter(w => 
            w.rjCode.toLowerCase().includes(term) ||
            w.title.toLowerCase().includes(term) ||
            (w.circle && w.circle.toLowerCase().includes(term)) ||
            (w.cv && w.cv.toLowerCase().includes(term)) ||
            (w.tags && w.tags.some(t => t.toLowerCase().includes(term)))
          );
          renderLibraryGrid(filtered, { q: val });
        }

        async function quickAddRj() {
          const rj = prompt('Enter RJ Code to import into library (e.g. RJ01473335):');
          if (!rj) return;

          try {
            const res = await fetch('/api/library/resolve', {
              method: 'POST',
              headers: authHeaders(),
              body: JSON.stringify({ rjCode: rj })
            });
            const data = await res.json();
            if (data.work) {
              alert('Successfully imported: ' + data.work.title);
              loadLibrary();
            } else {
              alert('Import failed: ' + (data.error || 'Unknown error'));
            }
          } catch (e) {
            alert('Error: ' + e.message);
          }
        }

        async function toggleFav(rjCode) {
          const res = await fetch('/api/library/favorite/' + rjCode, { method: 'POST', headers: authHeaders() });
          loadLibrary();
        }

        async function deleteWorkItem(rjCode) {
          if (!confirm('Remove ' + rjCode + ' from library?')) return;
          await fetch('/api/library/' + rjCode, { method: 'DELETE', headers: authHeaders() });
          switchView('library');
        }

        // ================= Modal Controllers =================
        function openImportModal() {
          document.getElementById('importModal').style.display = 'flex';
        }

        function closeImportModal() {
          document.getElementById('importModal').style.display = 'none';
        }

        function openPlaylistModal() {
          document.getElementById('playlistModal').style.display = 'flex';
        }

        function closePlaylistModal() {
          document.getElementById('playlistModal').style.display = 'none';
        }

        async function submitCreatePlaylist() {
          const name = document.getElementById('newPlName').value.trim();
          const desc = document.getElementById('newPlDesc').value.trim();
          if (!name) return;

          await fetch('/api/playlists', {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ name, description: desc })
          });
          closePlaylistModal();
          loadPlaylists();
        }

        function handleFileUpload(e) {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (event) => {
            document.getElementById('importTextarea').value = event.target.result;
          };
          reader.readAsText(file);
        }

        async function runBatchImport() {
          const text = document.getElementById('importTextarea').value;
          const progress = document.getElementById('importProgress');
          progress.style.display = 'block';
          progress.innerText = 'Importing works... please wait.';

          try {
            const res = await fetch('/api/library/batch-import', {
              method: 'POST',
              headers: authHeaders(),
              body: JSON.stringify({ textData: text })
            });
            const data = await res.json();
            progress.innerText = \`Done! \${data.succeeded?.length || 0} succeeded, \${data.failed?.length || 0} failed.\`;
            setTimeout(() => {
              closeImportModal();
              loadLibrary();
            }, 1500);
          } catch (e) {
            progress.innerText = 'Import failed: ' + e.message;
          }
        }

        function exportBackup() {
          window.open('/api/backup?passcode=' + encodeURIComponent(authToken), '_blank');
        }
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`✨ aStreamer Suite is running at: http://localhost:${PORT}`);
  console.log(`🔑 Admin Passcode: ${ADMIN_PASSCODE}`);
  console.log(`=================================================\n`);
});

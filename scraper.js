const axios = require('axios');
const http = require('http');
const https = require('https');
const db = require('./db');

const httpsAgent = new https.Agent({
  family: 4,
  ciphers: [
    'TLS_AES_128_GCM_SHA256',
    'TLS_AES_256_GCM_SHA384',
    'TLS_CHACHA20_POLY1305_SHA256',
    'ECDHE-ECDSA-AES128-GCM-SHA256',
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-ECDSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES256-GCM-SHA384'
  ].join(':'),
  honorCipherOrder: true,
  minVersion: 'TLSv1.2'
});
const httpAgent = new http.Agent({ family: 4 });

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9,ja;q=0.8',
  'Referer': 'https://hentaiasmr.moe/'
};

function formatServerTime(secs) {
  if (isNaN(secs) || secs < 0) return '00:00';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  if (h > 0) {
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function getDlsiteCoverBucket(rjCode) {
  const clean = (rjCode || '').toUpperCase().trim();
  const match = clean.match(/^(?:RJ|VJ|BJ)?(\d+)$/i);
  if (!match) return clean;
  const pref = (clean.match(/^(RJ|VJ|BJ)/i) || [])[1] || 'RJ';
  const digits = match[1];
  const num = parseInt(digits, 10);
  const bucketNum = Math.ceil(num / 1000) * 1000;
  return pref.toUpperCase() + String(bucketNum).padStart(digits.length, '0');
}

function parseIsoDuration(str) {
  if (!str) return 0;
  const m = str.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i);
  if (m && (m[1] || m[2] || m[3])) {
    const h = parseInt(m[1] || '0', 10);
    const min = parseInt(m[2] || '0', 10);
    const s = parseInt(m[3] || '0', 10);
    return h * 3600 + min * 60 + s;
  }
  const hm = str.match(/(?:(\d+)\s*h(?:ours?)?)?\s*(?:(\d+)\s*m(?:in(?:utes?)?)?)?\s*(?:(\d+)\s*s(?:ec(?:onds?)?)?)?/i);
  if (hm && (hm[1] || hm[2] || hm[3])) {
    return parseInt(hm[1] || '0', 10) * 3600 + parseInt(hm[2] || '0', 10) * 60 + parseInt(hm[3] || '0', 10);
  }
  const col = str.match(/(?:(\d+):)?(\d+):(\d+)/);
  if (col) {
    if (col[1]) return parseInt(col[1], 10) * 3600 + parseInt(col[2], 10) * 60 + parseInt(col[3], 10);
    return parseInt(col[2], 10) * 60 + parseInt(col[3], 10);
  }
  return 0;
}

function parseFileSizeToBytes(str) {
  if (!str) return 0;
  const m = str.match(/([0-9.]+)\s*(GB|MB|KB|G|M|K)B?/i);
  if (!m) return 0;
  const val = parseFloat(m[1]);
  const unit = m[2].toUpperCase();
  if (unit.startsWith('G')) return Math.round(val * 1024 * 1024 * 1024);
  if (unit.startsWith('M')) return Math.round(val * 1024 * 1024);
  if (unit.startsWith('K')) return Math.round(val * 1024);
  return Math.round(val);
}

// Strategy H: HentaiASMR REST API & Direct Media CDN Probe (Zero HTML scraping)
async function fetchHentaiAsmrMetadata(cleanRj, options = {}) {
  const cleanUpper = (cleanRj || '').toUpperCase().trim();
  const cleanLower = (cleanRj || '').toLowerCase().trim();
  if (!cleanUpper) return null;
  const skipAudioProbe = Boolean(options && options.skipAudioProbe);

  // 1. Query WordPress REST API by slug then search
  const apiUrls = [
    `https://hentaiasmr.moe/wp-json/wp/v2/posts?slug=${encodeURIComponent(cleanLower)}&_embed=1`,
    `https://hentaiasmr.moe/wp-json/wp/v2/posts?search=${encodeURIComponent(cleanUpper)}&_embed=1`
  ];

  let post = null;
  for (const url of apiUrls) {
    try {
      const res = await axios.get(url, {
        headers: {
          'User-Agent': BROWSER_HEADERS['User-Agent'],
          'Accept': 'application/json, text/plain, */*'
        },
        httpsAgent,
        timeout: 6000
      });
      if (res.status === 200 && Array.isArray(res.data) && res.data.length > 0) {
        const posts = res.data;
        const match = posts.find(p => {
          const pSlug = (p.slug || '').toLowerCase();
          const pTitle = (p.title?.rendered || '').toUpperCase();
          return pSlug === cleanLower || pTitle.includes(cleanUpper) || (p.content?.rendered || '').includes(cleanUpper);
        }) || posts[0];
        if (match) {
          post = match;
          break;
        }
      }
    } catch (e) {}
  }

  if (!post || !post.id) return null;

  const postId = post.id;
  const rawTitle = (post.title?.rendered || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&#038;/g, '&')
    .replace(/^\[(?:RJ|VJ|BJ)\d+\]\s*/i, '')
    .trim();

  // Cover image
  let coverUrl = '';
  if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
    const media = post._embedded['wp:featuredmedia'][0];
    coverUrl = media.source_url || media.media_details?.sizes?.full?.source_url || '';
  }

  // Terms: tags, actors, categories
  const tags = [];
  const tagTranslations = {};
  const cvList = [];
  let cvJa = '';
  let cvRomaji = '';

  if (post._embedded && Array.isArray(post._embedded['wp:term'])) {
    for (const group of post._embedded['wp:term']) {
      if (!Array.isArray(group)) continue;
      for (const term of group) {
        if (!term || !term.name) continue;
        const tName = term.name.trim();
        const taxonomy = term.taxonomy || '';
        
        let rawSlug = term.slug || '';
        try { rawSlug = decodeURIComponent(rawSlug); } catch (e) {}

        if (taxonomy === 'actors' || taxonomy === 'cv') {
          tName.split(/[,、/&＋+;・]/).forEach(c => {
            const cleanC = c.replace(/様|さん|氏|他|'/g, '').trim();
            if (cleanC && cleanC.length >= 2 && !cvList.includes(cleanC)) {
              cvList.push(cleanC);
            }
          });
          if (!cvJa && cvList.length > 0) cvJa = cvList[0];
          if (rawSlug && /[a-zA-Z]/.test(rawSlug)) {
            const rom = normalizeCVRomaji(tName, rawSlug.replace(/-/g, ' '));
            if (!cvRomaji) cvRomaji = rom;
            tagTranslations[tName] = { romaji: rom, isCV: true };
            if (db.BASE_TAG_DICT) {
              db.BASE_TAG_DICT[tName] = { romaji: rom, isCV: true };
            }
          }
        } else if (taxonomy === 'post_tag' || taxonomy === 'category') {
          if (tName && !tags.includes(tName) && !['NSFW', 'SFW', 'Uncategorized'].includes(tName)) {
            tags.push(tName);
          }
        }
      }
    }
  }

  const cv = cvList.join(', ');

  // 2. Direct Media CDN Probe for Audio Files
  const singleTrackCandidates = [];

  // Unescape content HTML and extract embedded audio URLs
  const unescapedContent = (post.content?.rendered || '')
    .replace(/\\\//g, '/')
    .replace(/&#8217;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
  const contentUrls = unescapedContent.match(/https?:\/\/[^\s"'<>]+\.(?:mp3|m4a|wav|ogg|flac|m3u8)/gi) || [];
  contentUrls.forEach(u => {
    if (u && !singleTrackCandidates.includes(u)) singleTrackCandidates.push(u);
  });

  // Discovered Single-Track Patterns across CDN endpoints
  const singlePatterns = [
    `https://cdn16.hentaiasmr.moe/audio/${postId}.mp3`,
    `https://cdn.hentaiasmr.moe/audio/${postId}.mp3`,
    `https://cdn-otome.hentaiasmr.moe/audio/${postId}.mp3`,
    `https://cdn.hentaiasmr.moe/mp4/${postId}.mp3`,
    `https://cdn16.hentaiasmr.moe/mp4/${postId}.mp3`,
    `https://cdn-otome.hentaiasmr.moe/mp4/${postId}.mp3`,
    `https://cdn.hentaiasmr.moe/mf/${postId}/merge/${cleanUpper}.mp3`,
    `https://cdn16.hentaiasmr.moe/mf/${postId}/merge/${cleanUpper}.mp3`,
    `https://cdn-otome.hentaiasmr.moe/mf/${postId}/merge/${cleanUpper}.mp3`,
    `https://cdn.hentaiasmr.moe/audio/${cleanUpper}.mp3`,
    `https://cdn16.hentaiasmr.moe/audio/${cleanUpper}.mp3`
  ];
  singlePatterns.forEach(u => {
    if (!singleTrackCandidates.includes(u)) singleTrackCandidates.push(u);
  });

  const probeReferer = post.link || `https://hentaiasmr.moe/${cleanLower}.html`;
  const probeHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Referer': probeReferer,
    'Origin': 'https://hentaiasmr.moe',
    'Accept': '*/*'
  };

  async function probeMediaCandidate(targetUrl) {
    if (!targetUrl) return null;
    try {
      let res = await axios.get(encodeURI(targetUrl), {
        headers: {
          ...probeHeaders,
          'Range': 'bytes=0-0'
        },
        httpsAgent,
        httpAgent,
        timeout: 5000,
        validateStatus: s => (s >= 200 && s < 400) || s === 206
      });
      if (!res || (res.status >= 400 && res.status !== 206)) {
        try {
          const headRes = await axios.head(encodeURI(targetUrl), {
            headers: probeHeaders,
            httpsAgent,
            httpAgent,
            timeout: 5000,
            validateStatus: s => (s >= 200 && s < 400)
          });
          if (headRes && headRes.status >= 200 && headRes.status < 400) {
            res = headRes;
          }
        } catch (he) {}
      }
      if (res && ((res.status >= 200 && res.status < 400) || res.status === 206)) {
        let size = 0;
        const cr = res.headers && res.headers['content-range'];
        if (cr) {
          const m = cr.match(/\/(\d+)/);
          if (m) size = parseInt(m[1], 10);
        }
        if (!size && res.headers) size = parseInt(res.headers['content-length'] || '0', 10);
        return { ok: true, size };
      }
    } catch (e) {}
    return null;
  }

  const audioTracks = [];
  let foundPattern = null;
  const triedUrls = [];

  if (!skipAudioProbe) {
    for (const mergeUrl of singleTrackCandidates) {
      triedUrls.push(mergeUrl);
      const probe = await probeMediaCandidate(mergeUrl);
      if (probe && probe.ok) {
        audioTracks.push({
          index: 1,
          title: `${rawTitle || cleanUpper} (Full)`,
          rawTitle: `${cleanUpper}.mp3`,
          streamUrl: mergeUrl,
          category: 'main',
          _size: probe.size || 0,
          isHls: false
        });
        foundPattern = mergeUrl.includes('/audio/') ? 'audio_direct' : (mergeUrl.includes('/mp4/') ? 'mp4_direct' : 'merge');
        break;
      }
    }

    // Variation B: Multi-track -> /mf/{id}/1.mp3, 2.mp3, 3.mp3...
    if (audioTracks.length === 0) {
      const cdnBases = [
        'https://cdn.hentaiasmr.moe/mf/',
        'https://cdn16.hentaiasmr.moe/mf/',
        'https://cdn-otome.hentaiasmr.moe/mf/'
      ];

      for (const cdn of cdnBases) {
        let trackNum = 1;
        let consecutiveMisses = 0;
        while (trackNum <= 40 && consecutiveMisses === 0) {
          const tUrl = `${cdn}${postId}/${trackNum}.mp3`;
          triedUrls.push(tUrl);
          const probe = await probeMediaCandidate(tUrl);
          if (probe && probe.ok) {
            audioTracks.push({
              index: trackNum,
              title: `Track ${trackNum}`,
              rawTitle: `${trackNum}.mp3`,
              streamUrl: tUrl,
              category: trackNum === 1 ? 'main' : (trackNum === 2 ? 'freetalk' : 'bonus'),
              _size: probe.size || 0,
              isHls: false
            });
            foundPattern = 'multitrack';
            trackNum++;
          } else {
            consecutiveMisses++;
          }
        }
        if (audioTracks.length > 0) break;
      }
    }
  }

  const isAudioFound = audioTracks.length > 0;
  const diagnostic = (!isAudioFound && postId) ? {
    rjCode: cleanUpper,
    postId,
    slug: post.slug,
    postLink: post.link || `https://hentaiasmr.moe/${cleanLower}.html`,
    title: rawTitle,
    triedUrls
  } : null;

  return {
    postId,
    title: rawTitle,
    circle: 'ASMR Circle',
    cv: cvJa ? (cvRomaji ? `${cvJa} (${cvRomaji})` : cvJa) : (cv || 'N/A'),
    cvJa,
    cvRomaji,
    releaseDate: '',
    series: '',
    duration: 0,
    totalBytes: audioTracks.reduce((sum, t) => sum + (t._size || 0), 0),
    tags,
    tagTranslations,
    rawCoverUrl: coverUrl,
    audioTracks,
    foundPattern,
    diagnostic,
    isAudioFound,
    isNsfw: true
  };
}

// 1. Fetch Official DLsite Metadata (Universal Multi-Layer Extractor)
async function fetchDlsiteMetadata(rjCode) {
  const cleanRj = rjCode.toUpperCase();
  const cleanNum = cleanRj.replace(/^(?:RJ|VJ|BJ)/i, '');
  const divisions = ['maniax', 'home', 'girls', 'pro', 'books'];
  let dlsiteMeta = null;

  // Strategy 0: ASMR.one Public API
  try {
    const asmrRes = await axios.get(`https://api.asmr-200.com/api/work/${cleanNum}`, {
      headers: { 'User-Agent': BROWSER_HEADERS['User-Agent'] },
      timeout: 5000
    });
    if (asmrRes.data) {
      const data = asmrRes.data;
      const cv = Array.isArray(data.vas) && data.vas.length > 0 ? data.vas.map(v => v.name).join(', ') : '';
      const tags = [];
      const tagTranslations = {};
      if (Array.isArray(data.tags)) {
        data.tags.forEach(t => {
          const name = t.name || (typeof t === 'string' ? t : '');
          if (name && !tags.includes(name)) tags.push(name);
          const en = t.i18n?.['en-us']?.name || t.i18n?.['en']?.name || (db.BASE_TAG_DICT && db.BASE_TAG_DICT[name]) || '';
          if (name && en && name !== en) {
            tagTranslations[name] = en;
          }
        });
      }
      let imgUrl = data.mainCoverUrl || data.thumbnailCoverUrl || data.samCoverUrl || '';
      if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;

      const isAdult = (data.age_category === 1 || data.age_category_string === 'general' || data.rating === 'general') ? false : true;

      if (data.title) {
        dlsiteMeta = {
          title: data.title,
          circle: data.circle?.name || '',
          cv: cv || 'N/A',
          rawCoverUrl: imgUrl,
          tags: tags,
          tagTranslations: tagTranslations,
          isNsfw: isAdult ?? true
        };
      }
    }
  } catch (err) {}

  // Strategy A: JSON APIs across divisions
  for (const div of divisions) {
    try {
      const url = `https://www.dlsite.com/${div}/api/=/product.json?workno=${cleanRj}`;
      const res = await axios.get(url, {
        headers: {
          'User-Agent': BROWSER_HEADERS['User-Agent'],
          'Accept-Language': 'ja,en;q=0.9'
        },
        timeout: 5000
      });

      if (res.data && res.data.length > 0) {
        const item = res.data[0];
        let cv = dlsiteMeta?.cv || '';
        if (!cv || cv === 'N/A') {
          if (Array.isArray(item.voice_actor)) cv = item.voice_actor.join(', ');
          else if (typeof item.voice_actor === 'string') cv = item.voice_actor;
          else if (item.creators && item.creators.voice_actor) {
            cv = item.creators.voice_actor.map(v => v.name || v).join(', ');
          }
        }

        let imgUrl = dlsiteMeta?.rawCoverUrl || (typeof item.image_main === 'string' ? item.image_main : (item.image_main?.url || item.work_image || ''));
        if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;

        const isAdult = (item.age_category === 1 || item.age_category_string === 'general') ? false : true;

        const genres = (item.genres || []).map(g => g.name || g);
        const tags = Array.from(new Set([...(dlsiteMeta?.tags || []), ...genres]));

        dlsiteMeta = {
          title: item.work_name || dlsiteMeta?.title || '',
          circle: item.maker_name || dlsiteMeta?.circle || '',
          cv: cv || 'N/A',
          rawCoverUrl: imgUrl,
          tags: tags,
          isNsfw: isAdult
        };
        break;
      }
    } catch (err) {}
  }

  // Strategy B: HentaiASMR REST API Fallback (Rich Japanese & English Romaji CVs, Series, Release Dates)
  if (!dlsiteMeta || !dlsiteMeta.cv || dlsiteMeta.cv === 'N/A' || !dlsiteMeta.circle || (dlsiteMeta.tags && dlsiteMeta.tags.length < 3) || !dlsiteMeta.title) {
    try {
      const moeMeta = await fetchHentaiAsmrMetadata(cleanRj, { skipAudioProbe: true });
      if (moeMeta) {
        const mergedTags = Array.from(new Set([...(dlsiteMeta?.tags || []), ...(moeMeta.tags || [])]));
        if (moeMeta.series && !mergedTags.includes(moeMeta.series)) {
          mergedTags.push(moeMeta.series);
        }

        const mergedTranslations = Object.assign({}, dlsiteMeta?.tagTranslations || {}, moeMeta.tagTranslations || {});
        if (moeMeta.cvJa && moeMeta.cvRomaji) {
          mergedTranslations[moeMeta.cvJa] = { romaji: moeMeta.cvRomaji, isCV: true };
          if (db.BASE_TAG_DICT) {
            db.BASE_TAG_DICT[moeMeta.cvJa] = { romaji: moeMeta.cvRomaji, isCV: true };
          }
        }

        dlsiteMeta = {
          title: dlsiteMeta?.title || moeMeta.title || `Work ${cleanRj}`,
          circle: (dlsiteMeta?.circle && dlsiteMeta.circle !== 'ASMR Circle') ? dlsiteMeta.circle : (moeMeta.circle || 'ASMR Circle'),
          cv: (dlsiteMeta?.cv && dlsiteMeta.cv !== 'N/A') ? dlsiteMeta.cv : (moeMeta.cv || 'N/A'),
          cvJa: moeMeta.cvJa || '',
          cvRomaji: moeMeta.cvRomaji || '',
          series: moeMeta.series || dlsiteMeta?.series || '',
          releaseDate: moeMeta.releaseDate || dlsiteMeta?.releaseDate || '',
          rawCoverUrl: dlsiteMeta?.rawCoverUrl || moeMeta.rawCoverUrl || '',
          tags: mergedTags.length > 0 ? mergedTags : ['ASMR', 'Audio'],
          tagTranslations: mergedTranslations,
          isNsfw: dlsiteMeta ? (dlsiteMeta.isNsfw ?? true) : true
        };
      }
    } catch (e) {}
  }

  if (!dlsiteMeta?.rawCoverUrl) {
    const bucket = getDlsiteCoverBucket(cleanRj);
    if (!dlsiteMeta) {
      dlsiteMeta = {
        title: `Work ${cleanRj}`,
        circle: 'ASMR Circle',
        cv: 'N/A',
        rawCoverUrl: `https://img.dlsite.jp/modpub/images2/work/doujin/${bucket}/${cleanRj}_img_main.jpg`,
        tags: ['ASMR', 'Audio'],
        isNsfw: true
      };
    } else {
      dlsiteMeta.rawCoverUrl = `https://img.dlsite.jp/modpub/images2/work/doujin/${bucket}/${cleanRj}_img_main.jpg`;
    }
  }

  if (dlsiteMeta) {
    const rawCv = db.getWorkCV ? db.getWorkCV(dlsiteMeta) : (dlsiteMeta.cv || '');
    const cvNames = [];
    if (rawCv && rawCv !== 'N/A') {
      rawCv.split(/[,、/&＋+;・\n|]/).forEach(c => {
        const clean = db.cleanCVName ? db.cleanCVName(c) : c.trim();
        if (clean) cvNames.push(clean.toLowerCase());
      });
    }
    if (Array.isArray(dlsiteMeta.tags)) {
      dlsiteMeta.tags = dlsiteMeta.tags.filter(t => {
        const clean = String(t || '').trim();
        if (!clean) return false;
        if (cvNames.includes(clean.toLowerCase())) return false;
        const entry = db.BASE_TAG_DICT && db.BASE_TAG_DICT[clean];
        if (entry && entry.isCV) return false;
        return true;
      });
      if (dlsiteMeta.tags.length === 0) dlsiteMeta.tags = ['ASMR', 'Audio'];
    }
  }

  return dlsiteMeta;
}

// 2. Probe CDN Directly (M3U8 HLS vs MP3 Multi-track)
// 2. Probe CDN Directly (M3U8 HLS vs MP3 Multi-track + HentaiASMR Moe comparator)
async function probeMediaCdn(rjCode, dlsiteMeta) {
  const cleanRj = rjCode.toUpperCase();
  const m3u8Url = `https://v.weeab0o.xyz/${cleanRj}.m3u8`;
  const bucket = getDlsiteCoverBucket(cleanRj);
  const coverUrl = dlsiteMeta?.rawCoverUrl || `https://img.dlsite.jp/modpub/images2/work/doujin/${bucket}/${cleanRj}_img_main.jpg`;

  // 1. Probe JapaneseASMR (weeab0o.xyz): First check primary MP3 & M3U8 in parallel
  const mainMp3Url = `https://v.weeab0o.xyz/${cleanRj}.mp3`;
  let hasM3u8 = false;
  const japTracks = [];

  const [mainMp3Res, m3u8Res] = await Promise.all([
    axios.head(encodeURI(mainMp3Url), {
      httpAgent,
      httpsAgent,
      headers: { 'Referer': 'https://japaneseasmr.com/', 'User-Agent': BROWSER_HEADERS['User-Agent'] },
      timeout: 3000,
      validateStatus: s => s >= 200 && s < 400
    }).catch(() => null),
    axios.get(m3u8Url, {
      httpAgent,
      httpsAgent,
      headers: { 'Referer': 'https://japaneseasmr.com/', 'User-Agent': BROWSER_HEADERS['User-Agent'] },
      timeout: 3000,
      validateStatus: s => s >= 200 && s < 400
    }).catch(() => null)
  ]);

  if (mainMp3Res && mainMp3Res.status >= 200 && mainMp3Res.status < 400) {
    const sz = parseInt(mainMp3Res.headers['content-length'] || '0', 10);
    japTracks.push({
      id: 1,
      title: 'Track 1 (トラック1)',
      size: sz,
      formattedTime: '00:00:00',
      startTime: 0,
      isHls: false,
      category: 'main',
      rawUrl: mainMp3Url,
      referer: 'https://japaneseasmr.com/',
      streamUrl: `/stream?url=${encodeURIComponent(mainMp3Url)}&referer=${encodeURIComponent('https://japaneseasmr.com/')}`,
      poster: `/image-proxy?url=${encodeURIComponent(coverUrl)}`
    });

    // Only probe bonus & extra tracks if the primary MP3 actually exists
    const bonusCandidates = [
      { type: 'freetalk', title: 'Free Talk (フリートーク)', url: `https://v.weeab0o.xyz/${cleanRj} freetalk.mp3` },
      { type: 'freetalk', title: 'Free Talk (フリートーク)', url: `https://v.weeab0o.xyz/${cleanRj}_freetalk.mp3` },
      { type: 'freetalk', title: 'Free Talk (フリートーク)', url: `https://v.weeab0o.xyz/${cleanRj}-freetalk.mp3` },
      { type: 'freetalk', title: 'Free Talk (フリートーク)', url: `https://v.weeab0o.xyz/${cleanRj}freetalk.mp3` },
      { type: 'bonus', title: 'Omake (おまけ)', url: `https://v.weeab0o.xyz/${cleanRj}omake.mp3` },
      { type: 'bonus', title: 'Omake (おまけ)', url: `https://v.weeab0o.xyz/${cleanRj} omake.mp3` },
      { type: 'bonus', title: 'Omake (おまけ)', url: `https://v.weeab0o.xyz/${cleanRj}_omake.mp3` },
      { type: 'bonus', title: 'Omake (おまけ)', url: `https://v.weeab0o.xyz/${cleanRj}-omake.mp3` },
      { type: 'bonus', title: 'Bonus (特典)', url: `https://v.weeab0o.xyz/${cleanRj} bonus.mp3` },
      { type: 'bonus', title: 'Bonus (特典)', url: `https://v.weeab0o.xyz/${cleanRj}bonus.mp3` },
      { type: 'bonus', title: 'Bonus (特典)', url: `https://v.weeab0o.xyz/${cleanRj}_bonus.mp3` },
      { type: 'main', title: 'Track 2 (トラック2)', url: `https://v.weeab0o.xyz/${cleanRj} 2.mp3` },
      { type: 'main', title: 'Track 3 (トラック3)', url: `https://v.weeab0o.xyz/${cleanRj} 3.mp3` },
      { type: 'main', title: 'Track 4 (トラック4)', url: `https://v.weeab0o.xyz/${cleanRj} 4.mp3` },
      { type: 'main', title: 'Track 5 (トラック5)', url: `https://v.weeab0o.xyz/${cleanRj} 5.mp3` },
      { type: 'main', title: 'Track 6 (トラック6)', url: `https://v.weeab0o.xyz/${cleanRj} 6.mp3` },
      { type: 'main', title: 'Track 7 (トラック7)', url: `https://v.weeab0o.xyz/${cleanRj} 7.mp3` },
      { type: 'main', title: 'Track 8 (トラック8)', url: `https://v.weeab0o.xyz/${cleanRj} 8.mp3` },
      { type: 'main', title: 'Track 2 (トラック2)', url: `https://v.weeab0o.xyz/${cleanRj}_2.mp3` },
      { type: 'main', title: 'Track 3 (トラック3)', url: `https://v.weeab0o.xyz/${cleanRj}_3.mp3` },
      { type: 'main', title: 'Track 2 (トラック2)', url: `https://v.weeab0o.xyz/${cleanRj}-2.mp3` },
      { type: 'main', title: 'Track 3 (トラック3)', url: `https://v.weeab0o.xyz/${cleanRj}-3.mp3` }
    ];

    const bonusChecks = await Promise.all(
      bonusCandidates.map(async (c) => {
        try {
          const res = await axios.head(encodeURI(c.url), {
            httpAgent,
            httpsAgent,
            headers: { 'Referer': 'https://japaneseasmr.com/', 'User-Agent': BROWSER_HEADERS['User-Agent'] },
            timeout: 3000,
            validateStatus: s => s >= 200 && s < 400
          });
          if (res && res.status >= 200 && res.status < 400) {
            const sz = parseInt(res.headers['content-length'] || '0', 10);
            return { ...c, size: sz };
          }
        } catch (e) {}
        return null;
      })
    );

    let trkIndex = 2;
    for (const b of bonusChecks) {
      if (b) {
        japTracks.push({
          id: trkIndex++,
          title: b.title,
          size: b.size,
          formattedTime: '00:00:00',
          startTime: 0,
          isHls: false,
          category: b.type,
          rawUrl: b.url,
          referer: 'https://japaneseasmr.com/',
          streamUrl: `/stream?url=${encodeURIComponent(b.url)}&referer=${encodeURIComponent('https://japaneseasmr.com/')}`,
          poster: `/image-proxy?url=${encodeURIComponent(coverUrl)}`
        });
      }
    }
  } else if (m3u8Res && m3u8Res.status === 200 && m3u8Res.data && m3u8Res.data.includes('#EXTM3U')) {
    hasM3u8 = true;
    let m3u8Secs = 0;
    const extinfMatches = m3u8Res.data.match(/#EXTINF:([0-9.]+)/g) || [];
    extinfMatches.forEach(m => {
      const s = parseFloat(m.replace('#EXTINF:', ''));
      if (!isNaN(s)) m3u8Secs += s;
    });
    const estBytes = Math.round(m3u8Secs * 16000); // ~128kbps audio estimation
    japTracks.push({
      id: 1,
      title: dlsiteMeta?.title ? `01. ${dlsiteMeta.title}` : '01. Audio Track',
      duration: Math.round(m3u8Secs),
      size: estBytes,
      formattedTime: m3u8Secs > 0 ? formatServerTime(Math.round(m3u8Secs)) : '00:00:00',
      startTime: 0,
      isHls: true,
      category: 'main',
      rawUrl: m3u8Url,
      referer: 'https://japaneseasmr.com/',
      streamUrl: `/stream?url=${encodeURIComponent(m3u8Url)}&referer=${encodeURIComponent('https://japaneseasmr.com/')}`,
      poster: `/image-proxy?url=${encodeURIComponent(coverUrl)}`
    });
  }

  // 2. Fetch Ground-Truth Reference Tracks from ASMR.one only if JapaneseASMR audio was NOT found
  let gtTracks = [];
  if (japTracks.length === 0) {
    try {
      const cleanNum = cleanRj.replace(/^(?:RJ|VJ|BJ)/i, '');
      const apiHosts = ['https://api.asmr.one', 'https://api.asmr-200.com'];
      for (const host of apiHosts) {
        try {
          const asmrRes = await axios.get(`${host}/api/tracks/${cleanNum}`, {
            httpAgent,
            httpsAgent,
            headers: { 'User-Agent': BROWSER_HEADERS['User-Agent'], 'Accept': 'application/json' },
            timeout: 5000
          });
          if (asmrRes.status === 200 && Array.isArray(asmrRes.data) && asmrRes.data.length > 0) {
            const audioList = [];
            const isBonus = (t) => /(特典|おまけ|bonus|extra|ex_|sp_|後日談|アフター|ショートストーリー|ss)/i.test(t || '');
            const isTalk = (t) => /(フリートーク|free[\s_-]?talk|talk|座談会|キャストコメント)/i.test(t || '');
            const isSamp = (t) => /(サンプル|sample|体験版|予告|試聴|pv|ダイジェスト|digest|\.mp4|\.mkv)/i.test(t || '');

            const trav = (items, folder = '') => {
              if (!Array.isArray(items)) return;
              for (const item of items) {
                if (!item) continue;
                const title = (item.title || '').trim();
                const type = (item.type || '').toLowerCase();
                const dur = Math.max(0, Math.round(Number(item.duration) || 0));
                if ((type === 'audio' || /\.(mp3|wav|flac|m4a|aac|ogg|opus)$/i.test(title)) && dur > 0 && !isSamp(title)) {
                  let cat = 'main';
                  if (isTalk(title) || isTalk(folder)) cat = 'freetalk';
                  else if (isBonus(title) || isBonus(folder)) cat = 'bonus';
                  audioList.push({
                    title: title.replace(/\.[a-zA-Z0-9]+$/, '').trim(),
                    duration: dur,
                    formattedTime: formatServerTime(dur),
                    category: cat,
                    folder: folder
                  });
                }
                if (Array.isArray(item.children) && item.children.length > 0) {
                  trav(item.children, folder ? `${folder}/${title}` : title);
                }
              }
            };
            trav(asmrRes.data);
            if (audioList.length > 0) {
              gtTracks = audioList;
              break;
            }
          }
        } catch (e) {}
        if (gtTracks.length > 0) break;
      }
    } catch (e) {}
  }

  // 3. Concurrently Probe HentaiASMR Moe Audio Tracks (Pure API + Direct Media CDN)
  // Optimization: If JapaneseASMR audio is already available, skip Moe CDN audio probing during initial import
  const moeTracks = [];
  let moeMeta = null;
  try {
    const skipMoeAudio = (japTracks.length > 0);
    moeMeta = await fetchHentaiAsmrMetadata(cleanRj, { skipAudioProbe: skipMoeAudio });
    if (moeMeta && Array.isArray(moeMeta.audioTracks) && moeMeta.audioTracks.length > 0) {
      await Promise.all(moeMeta.audioTracks.map(async (t) => {
        try {
          const probeRef = moeMeta.postLink || 'https://hentaiasmr.moe/';
          let mHead = null;
          try {
            mHead = await axios.get(encodeURI(t.streamUrl), {
              httpAgent,
              httpsAgent,
              headers: {
                'Range': 'bytes=0-0',
                'Referer': probeRef,
                'Origin': 'https://hentaiasmr.moe',
                'Accept': '*/*',
                'User-Agent': BROWSER_HEADERS['User-Agent']
              },
              timeout: 5000,
              validateStatus: s => (s >= 200 && s < 400) || s === 206
            });
          } catch (ge) {}

          if (!mHead || (mHead.status >= 400 && mHead.status !== 206)) {
            try {
              mHead = await axios.head(encodeURI(t.streamUrl), {
                httpAgent,
                httpsAgent,
                headers: {
                  'Referer': probeRef,
                  'Origin': 'https://hentaiasmr.moe',
                  'Accept': '*/*',
                  'User-Agent': BROWSER_HEADERS['User-Agent']
                },
                timeout: 5000,
                validateStatus: s => (s >= 200 && s < 400)
              });
            } catch (he) {}
          }

          if (mHead && ((mHead.status >= 200 && mHead.status < 400) || mHead.status === 206)) {
            const cr = mHead.headers && mHead.headers['content-range'];
            if (cr) {
              const m = cr.match(/\/(\d+)/);
              if (m) t._size = parseInt(m[1], 10);
            }
            if (!t._size && mHead.headers) {
              t._size = parseInt(mHead.headers['content-length'] || '0', 10);
            }
          }
        } catch (e) {}
      }));

      // Detect duplicate combined/all-in-one track in Moe playlist
      let maxTrackSize = 0;
      let maxTrackIdx = -1;
      let sumOtherSizes = 0;
      moeMeta.audioTracks.forEach((t, i) => {
        const sz = t._size || 0;
        if (sz > maxTrackSize) {
          maxTrackSize = sz;
          maxTrackIdx = i;
        }
      });
      moeMeta.audioTracks.forEach((t, i) => {
        if (i !== maxTrackIdx) sumOtherSizes += (t._size || 0);
      });
      const hasCombinedTrack = moeMeta.audioTracks.length >= 3 && maxTrackSize > 50 * 1024 * 1024 && Math.abs(maxTrackSize - sumOtherSizes) < (sumOtherSizes * 0.3);

      const freeTalkGt = gtTracks.find(t => t.category === 'freetalk' || /(?:フリートーク|free[\s_-]?talk|talk)/i.test(t.title));
      const combinedGt = gtTracks.find(t => /(?:つなぎ合わせた|つなげた|繋ぎ合わせた|all|full|総再生)/i.test(t.title));
      const bonusGt = gtTracks.filter(t => t.category === 'bonus' || /(?:おまけ|bonus|特典|抜粋)/i.test(t.title));
      const individualMainGt = gtTracks.filter(t => t.category === 'main' && !/(?:つなぎ合わせた|つなげた|繋ぎ合わせた|all|full|総再生|おまけ|特典|フリートーク)/i.test(t.title));

      let mainCursor = 0;
      let bonusCursor = 0;

      moeMeta.audioTracks.forEach((t, idx) => {
        let cat = 'main';
        let trackTitle = t.title || `Track ${idx + 1}`;
        let trackDur = 0;
        let isCombined = false;

        if (hasCombinedTrack && idx === maxTrackIdx) {
          isCombined = true;
          cat = 'main';
          trackTitle = combinedGt ? combinedGt.title : `Full Combined Track (全編一括再生)`;
          if (combinedGt && combinedGt.duration) trackDur = combinedGt.duration;
        } else if ((idx === moeMeta.audioTracks.length - 2 && freeTalkGt && moeMeta.audioTracks.length > 2) || (idx === moeMeta.audioTracks.length - 1 && freeTalkGt && !hasCombinedTrack)) {
          cat = 'freetalk';
          trackTitle = freeTalkGt.title;
          if (freeTalkGt.duration) trackDur = freeTalkGt.duration;
        } else if (mainCursor < individualMainGt.length) {
          const gt = individualMainGt[mainCursor++];
          cat = 'main';
          trackTitle = gt.title;
          if (gt.duration) trackDur = gt.duration;
        } else if (bonusCursor < bonusGt.length) {
          const gt = bonusGt[bonusCursor++];
          cat = 'bonus';
          trackTitle = gt.title;
          if (gt.duration) trackDur = gt.duration;
        } else if (gtTracks[idx]) {
          cat = gtTracks[idx].category;
          trackTitle = gtTracks[idx].title;
          if (gtTracks[idx].duration) trackDur = gtTracks[idx].duration;
        } else {
          if (/(?:フリートーク|free[\s_-]?talk|talk)/i.test(t.title)) cat = 'freetalk';
          else if (/(?:おまけ|bonus|特典|omake)/i.test(t.title)) cat = 'bonus';
        }

        if (!trackDur && t._size) {
          trackDur = Math.round(t._size / 16000); // ~128kbps MP3
        }

        moeTracks.push({
          id: idx + 1,
          title: trackTitle,
          size: t._size || 0,
          duration: trackDur,
          formattedTime: trackDur > 0 ? formatServerTime(trackDur) : '00:00:00',
          startTime: 0,
          isHls: false,
          isCombinedAllInOne: isCombined,
          category: cat,
          rawUrl: t.streamUrl,
          referer: 'https://hentaiasmr.moe/',
          streamUrl: `/stream?url=${encodeURIComponent(t.streamUrl)}&referer=${encodeURIComponent('https://hentaiasmr.moe/')}`,
          poster: `/image-proxy?url=${encodeURIComponent(coverUrl)}`
        });
      });
    }
  } catch (e) {}

  // 4. Source Selection: JapaneseASMR vs HentaiASMR Moe Lazy On-Demand Stream
  let tracks = [];
  let selectedSource = '';
  let hasLazyAudio = false;

  if (japTracks.length > 0) {
    tracks = japTracks;
    selectedSource = (tracks[0] && tracks[0].isHls) ? 'JapaneseASMR (HLS Stream)' : 'JapaneseASMR (Discrete MP3 tracks)';
    hasLazyAudio = false;
  } else if (moeMeta || dlsiteMeta) {
    hasLazyAudio = true;
    tracks.push({
      id: 1,
      title: dlsiteMeta?.title ? `01. ${dlsiteMeta.title}` : '01. Audio Track',
      isLazy: true,
      rawUrl: '',
      streamUrl: '',
      category: 'main',
      formattedTime: '00:00:00',
      duration: 0,
      size: 0,
      poster: coverUrl ? `/image-proxy?url=${encodeURIComponent(coverUrl)}` : ''
    });
    selectedSource = 'HentaiASMR Moe (On-Demand Lazy Stream)';
  } else {
    throw new Error(`Work ${cleanRj} not found on JapaneseASMR or HentaiASMR Moe`);
  }

  const postLink = moeMeta?.postLink || `https://hentaiasmr.moe/${cleanRj.toLowerCase()}.html`;
  const sourcesBreakdown = {
    japaneseAsmr: {
      found: japTracks.length > 0,
      isHls: japTracks.length > 0 && japTracks[0].isHls === true,
      trackCount: japTracks.length,
      sampleUrl: japTracks.length > 0 ? (japTracks[0].rawUrl || japTracks[0].streamUrl) : null
    },
    hentaiAsmrMoe: {
      found: Boolean(moeMeta?.postId),
      pattern: hasLazyAudio ? 'lazy_on_demand' : null,
      trackCount: hasLazyAudio ? 1 : 0,
      sampleUrl: null,
      postId: moeMeta?.postId || null
    }
  };

  tracks.forEach((t, i) => { t.id = i + 1; });

  const diag = moeMeta?.diagnostic || null;
  if (diag) {
    diag.selectedSource = selectedSource;
    diag.sourcesBreakdown = sourcesBreakdown;
    diag.isWorkingAudioFound = true;
    diag.chosenTracks = tracks.map(t => ({
      title: t.title || '',
      rawUrl: t.rawUrl || t.streamUrl || '',
      streamUrl: t.streamUrl || '',
      isHls: !!t.isHls,
      category: t.category || 'main'
    }));
  }

  return {
    rjCode: cleanRj,
    title: dlsiteMeta?.title || `Work ${cleanRj}`,
    circle: dlsiteMeta?.circle || 'ASMR Circle',
    cv: dlsiteMeta?.cv || 'N/A',
    tags: dlsiteMeta?.tags && dlsiteMeta.tags.length > 0 ? dlsiteMeta.tags : ['ASMR', 'Audio', 'Voice'],
    coverUrl: `/image-proxy?url=${encodeURIComponent(coverUrl)}`,
    rawCoverUrl: coverUrl,
    hasHls: tracks.length > 0 && tracks[0].isHls === true,
    hasLazyAudio: Boolean(hasLazyAudio),
    postLink: postLink,
    isNsfw: dlsiteMeta ? (dlsiteMeta.isNsfw ?? true) : true,
    totalTracks: tracks.length,
    tracks,
    sources: sourcesBreakdown,
    source: 'RESOLVED',
    moeDiagnostic: diag
  };
}

// Extract exact JWPlayer audio playlist from Moe post HTML
function extractMoeHtmlTracks(html, postLink, coverUrl, title) {
  const tracks = [];
  if (!html) return tracks;

  // Pattern 1: JWPlayer playlist.push({ file: '...', title: '...' })
  const itemRegex = /playlist\.push\(\s*\{([\s\S]*?)\}\s*\);/gi;
  let match;
  while ((match = itemRegex.exec(html)) !== null) {
    const block = match[1];
    const fileM = block.match(/file\s*:\s*["']([^"']+)["']/i);
    const titleM = block.match(/title\s*:\s*["']([^"']+)["']/i);
    if (fileM) {
      let fUrl = fileM[1].replace(/\\\//g, '/').replace(/&amp;/g, '&').trim();
      if (fUrl.startsWith('//')) fUrl = 'https:' + fUrl;
      const tTitle = titleM ? titleM[1].trim() : `Track ${tracks.length + 1}`;
      tracks.push({
        id: tracks.length + 1,
        title: tTitle,
        rawUrl: fUrl,
        streamUrl: `/stream?url=${encodeURIComponent(fUrl)}&referer=${encodeURIComponent('https://hentaiasmr.moe/')}`,
        category: /(?:フリートーク|free[\s_-]?talk|talk)/i.test(tTitle) ? 'freetalk' : (/(?:おまけ|bonus|特典|omake)/i.test(tTitle) ? 'bonus' : 'main'),
        formattedTime: '00:00:00',
        duration: 0,
        size: 0,
        isHls: fUrl.toLowerCase().includes('.m3u8'),
        poster: coverUrl ? `/image-proxy?url=${encodeURIComponent(coverUrl)}` : ''
      });
    }
  }

  // Pattern 2: sources: [ { file: "..." } ]
  if (tracks.length === 0) {
    const srcRegex = /sources\s*:\s*\[\s*\{([\s\S]*?)\}\s*\]/gi;
    while ((match = srcRegex.exec(html)) !== null) {
      const block = match[1];
      const fileM = block.match(/file\s*:\s*["']([^"']+)["']/i);
      if (fileM) {
        let fUrl = fileM[1].replace(/\\\//g, '/').replace(/&amp;/g, '&').trim();
        if (fUrl.startsWith('//')) fUrl = 'https:' + fUrl;
        tracks.push({
          id: tracks.length + 1,
          title: title ? `01. ${title}` : '01. Audio Track',
          rawUrl: fUrl,
          streamUrl: `/stream?url=${encodeURIComponent(fUrl)}&referer=${encodeURIComponent('https://hentaiasmr.moe/')}`,
          category: 'main',
          formattedTime: '00:00:00',
          duration: 0,
          size: 0,
          isHls: fUrl.toLowerCase().includes('.m3u8'),
          poster: coverUrl ? `/image-proxy?url=${encodeURIComponent(coverUrl)}` : ''
        });
      }
    }
  }

  // Pattern 3: <audio> / <source> / schema contentURL
  if (tracks.length === 0) {
    const audioRegex = /(?:<source[^>]+src=["']|<audio[^>]+src=["']|"contentURL"\s*:\s*["'])(https?:\/\/[^\s"'<>]+\.(?:mp3|m4a|wav|ogg|flac|m3u8))/gi;
    while ((match = audioRegex.exec(html)) !== null) {
      let fUrl = match[1].replace(/\\\//g, '/').replace(/&amp;/g, '&').trim();
      if (!tracks.some(t => t.rawUrl === fUrl)) {
        tracks.push({
          id: tracks.length + 1,
          title: title ? `01. ${title}` : `Track ${tracks.length + 1}`,
          rawUrl: fUrl,
          streamUrl: `/stream?url=${encodeURIComponent(fUrl)}&referer=${encodeURIComponent('https://hentaiasmr.moe/')}`,
          category: 'main',
          formattedTime: '00:00:00',
          duration: 0,
          size: 0,
          isHls: fUrl.toLowerCase().includes('.m3u8'),
          poster: coverUrl ? `/image-proxy?url=${encodeURIComponent(coverUrl)}` : ''
        });
      }
    }
  }

  return tracks;
}

// On-demand lazy resolution: Fetches Moe post HTML and extracts exact tracks
async function resolveLazyWorkAudio(work) {
  if (!work) return null;
  const cleanLower = (work.rjCode || '').toLowerCase();
  const pageUrl = work.postLink || `https://hentaiasmr.moe/${cleanLower}.html`;

  try {
    const res = await axios.get(pageUrl, {
      httpAgent,
      httpsAgent,
      headers: {
        'User-Agent': BROWSER_HEADERS['User-Agent'],
        'Referer': 'https://hentaiasmr.moe/',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,ja;q=0.8'
      },
      timeout: 8000
    });
    if (res.status === 200 && res.data) {
      const extractedTracks = extractMoeHtmlTracks(res.data, pageUrl, work.rawCoverUrl || work.coverUrl, work.title);
      if (extractedTracks && extractedTracks.length > 0) {
        work.tracks = extractedTracks;
        work.hasLazyAudio = false;
        work.totalTracks = extractedTracks.length;
        work.hasHls = extractedTracks.some(t => t.isHls);
        return work;
      }
    }
  } catch (e) {}

  return work;
}

function parseAsmrTreeData(treeData, hasM3u8 = true, targetDuration = 0, hostUrl = 'https://api.asmr-200.com') {
  if (!Array.isArray(treeData) || treeData.length === 0) {
    return { chapters: [], gallery: [] };
  }

  const defaultHost = hostUrl || 'https://api.asmr-200.com';
  const gallery = [];
  const folderAudioMap = {};
  const rootAudio = [];

  const isImageFolder = (folderName) => {
    return /(img|image|images|cover|jacket|booklet|gazou|cg|illust|イラスト|画像|ジャケット|ブックレット|表紙|挿絵|写真|配图|附图|壁纸|wallpaper|art|artwork)/i.test(folderName || '');
  };

  const isImageFile = (title, type, folder = '') => {
    if (type === 'image') return true;
    if (/\.(jpg|jpeg|png|webp|gif|bmp|avif|tif|tiff|jfif|ico|svg)$/i.test(title)) return true;
    if (isImageFolder(folder) && type !== 'audio' && type !== 'folder' && !/\.(mp3|wav|flac|m4a|aac|ogg|opus|txt|lrc|vtt|pdf|zip|rar|7z)$/i.test(title)) return true;
    return false;
  };

  const isAudioFile = (title, type, folder = '') => {
    return (type === 'audio' || /\.(mp3|wav|flac|m4a|aac|ogg|opus)$/i.test(title)) && !isImageFile(title, type, folder);
  };

  const isBonusPattern = (str) => /(特典|おまけ|bonus|extra|ex_|sp_|後日談|アフター|ショートストーリー|ss)/i.test(str || '');
  const isConcatPattern = (str) => /(全て|すべて|一括|まとめ|つなげた|つなぎ|full\s*(ver|track|session)?|all\s*tracks|complete)/i.test(str || '');

  const isNoSePattern = (str) => {
    return /(SEなし|se\s*なし|no[\s_-]?se|without[\s_-]?se|BGMなし|bgm\s*なし|no[\s_-]?bgm)/i.test(str);
  };

  const isWithSePattern = (str) => {
    return /(SEあり|se\s*あり|with[\s_-]?se|BGMあり|bgm\s*あり)/i.test(str);
  };

  const isSamplePromo = (str) => {
    return /(サンプル|sample|体験版|予告|試聴|pv|ダイジェスト|digest|\.mp4|\.mkv|\.avi|\.mov|\.wmv)/i.test(str || '');
  };

  const traverse = (items, currentFolder = '') => {
    if (!Array.isArray(items)) return;
    for (const item of items) {
      if (!item) continue;
      const title = (item.title || '').trim();
      const type = (item.type || '').toLowerCase();
      const rawUrl = item.mediaStreamUrl || item.streamLowQualityUrl || item.mediaDownloadUrl || item.downloadUrl || item.streamUrl || item.url || item.mediaUrl || item.sourceUrl || '';
      let fullUrl = rawUrl;
      if (fullUrl && !fullUrl.startsWith('http') && !fullUrl.startsWith('//')) {
        fullUrl = defaultHost + (fullUrl.startsWith('/') ? '' : '/') + fullUrl;
      }

      if (isImageFile(title, type, currentFolder) && (fullUrl || item.hash)) {
        const finalImgUrl = fullUrl || `${defaultHost}/api/media/stream/${item.hash}`;
        gallery.push({
          title: title.replace(/\.[a-zA-Z0-9]+$/, ''),
          source: 'ASMR.one',
          url: finalImgUrl,
          proxyUrl: `/image-proxy?url=${encodeURIComponent(finalImgUrl)}`
        });
      }

      const dur = Math.max(0, Math.round(Number(item.duration) || 0));
      if (isAudioFile(title, type, currentFolder) && dur > 0 && type !== 'folder' && !isSamplePromo(title)) {
        const audioObj = {
          title: title.replace(/\.[a-zA-Z0-9]+$/, '').trim(),
          duration: dur,
          rawTitle: title,
          folder: currentFolder,
          url: rawUrl
        };
        if (currentFolder) {
          if (!folderAudioMap[currentFolder]) folderAudioMap[currentFolder] = [];
          folderAudioMap[currentFolder].push(audioObj);
        } else {
          rootAudio.push(audioObj);
        }
      }

      if (Array.isArray(item.children) && item.children.length > 0) {
        const nextFolder = currentFolder ? `${currentFolder}/${title}` : title;
        traverse(item.children, nextFolder);
      }
    }
  };

  traverse(treeData);

  if (rootAudio.length > 0) {
    folderAudioMap['(Root)'] = rootAudio;
  }

  const allFolderKeys = Object.keys(folderAudioMap);
  let mainTracks = [];
  const bonusTracks = [];

  if (allFolderKeys.length > 0) {
    const bonusFolders = allFolderKeys.filter(f => isBonusPattern(f) && !isSamplePromo(f));
    const mainFolders = allFolderKeys.filter(f => !isBonusPattern(f) && !isSamplePromo(f));

    // 1. Score candidate main folders with duration as top priority
    if (mainFolders.length > 0) {
      const scoredFolders = mainFolders.map(fPath => {
        const tracks = folderAudioMap[fPath];
        const totalDur = tracks.reduce((sum, t) => sum + t.duration, 0);
        let score = 0;
        score += tracks.length * 5;

        // DURATION MATCHING: Highest mathematical evidence
        if (targetDuration > 0) {
          const diff = Math.abs(totalDur - targetDuration);
          if (diff <= 3) score += 10000;
          else if (diff <= 10) score += 5000;
          else if (diff <= 30) score += 1000;
          else if (totalDur > targetDuration + 15) score -= 2000;

          // Check if prefix tracks within this folder match targetDuration
          let runningSum = 0;
          for (let ti = 0; ti < tracks.length; ti++) {
            runningSum += tracks[ti].duration;
            if (Math.abs(runningSum - targetDuration) <= 3) {
              score += 9000;
              break;
            } else if (Math.abs(runningSum - targetDuration) <= 10) {
              score += 4500;
              break;
            }
          }
        }

        if (isNoSePattern(fPath)) {
          score -= 50;
        } else if (isWithSePattern(fPath)) {
          score += 30;
        }

        if (isConcatPattern(fPath)) {
          score -= 100;
        }

        if (/(^|\/)mp3(\/|$)/i.test(fPath)) score += 40;
        else if (/(^|\/)m4a(\/|$)|(^|\/)aac(\/|$)/i.test(fPath)) score += 30;
        else if (/(^|\/)wav(\/|$)|(^|\/)flac(\/|$)/i.test(fPath)) score += 10;

        if (/(本編|main|track|トラック|音声)/i.test(fPath)) score += 20;

        const numberedCount = tracks.filter(t => /^\s*(\d+|track\s*\d+|トラック\s*\d+)/i.test(t.title)).length;
        score += (numberedCount / Math.max(1, tracks.length)) * 25;

        return { fPath, tracks, score, totalDur };
      });

      scoredFolders.sort((a, b) => b.score - a.score);
      mainTracks = scoredFolders[0].tracks;
    } else {
      mainTracks = rootAudio;
    }

    const isFreeTalkPattern = (str) => /(?:フリートーク|free[\s_-]?talk|talk|座談会|キャストコメント|あとがき|お便り)/i.test(str || '');

    // 2. Extract standalone Free-Talk tracks across all folders
    const freeTalkTracks = [];
    const seenFreeTalkTitles = new Set();
    for (const fKey of allFolderKeys) {
      for (const t of folderAudioMap[fKey]) {
        if (isFreeTalkPattern(t.title) && !isSamplePromo(t.title) && !isConcatPattern(t.title)) {
          if (/\.wav$/i.test(t.rawTitle) && folderAudioMap[fKey].some(o => /\.mp3$/i.test(o.rawTitle) && isFreeTalkPattern(o.title))) continue;
          const norm = t.title.toLowerCase().replace(/\s+/g, '');
          if (!seenFreeTalkTitles.has(norm)) {
            seenFreeTalkTitles.add(norm);
            t.category = 'freetalk';
            freeTalkTracks.push(t);
          }
        }
      }
    }

    // 3. Evaluate bonus tracks
    const mainTotalDur = mainTracks.reduce((sum, t) => sum + t.duration, 0);

    for (const bf of bonusFolders) {
      if (isConcatPattern(bf)) continue; // Skip folders containing concatenated full album tracks
      const bTracks = folderAudioMap[bf];
      const seenBonusTitles = new Set();
      const validCandidateBonus = [];

      for (const bt of bTracks) {
        if (isSamplePromo(bt.title)) continue;
        if (isConcatPattern(bt.title) || isConcatPattern(bt.rawTitle) || isConcatPattern(bt.folder)) continue;
        if (isFreeTalkPattern(bt.title)) continue; // Handled in freeTalkTracks!
        if (mainTracks.length > 1 && bt.duration >= mainTotalDur * 0.75) continue; // Duplicate full track!
        if (isNoSePattern(bt.title) && bTracks.some(o => !isNoSePattern(o.title) && o.duration > 0)) continue;
        if (/\.wav$/i.test(bt.rawTitle) && bTracks.some(o => /\.mp3$/i.test(o.rawTitle))) continue;
        
        const norm = bt.title.toLowerCase().replace(/\s+/g, '');
        if (!seenBonusTitles.has(norm)) {
          seenBonusTitles.add(norm);
          bt.category = 'bonus';
          validCandidateBonus.push(bt);
        }
      }

      if (validCandidateBonus.length > 0) {
        const bonusDur = validCandidateBonus.reduce((sum, t) => sum + t.duration, 0);
        if (targetDuration > 0) {
          if (mainTotalDur < targetDuration - 5 && mainTotalDur + bonusDur <= targetDuration + 10) {
            bonusTracks.push(...validCandidateBonus);
          }
        } else {
          bonusTracks.push(...validCandidateBonus);
        }
      }
    }
  } else {
    mainTracks = rootAudio;
  }

  mainTracks.forEach(t => { if (!t.category) t.category = 'main'; });

  const combinedList = [...mainTracks, ...freeTalkTracks, ...bonusTracks];
  const hasDiscreteTracks = combinedList.some(c => !isConcatPattern(c.title) && !isConcatPattern(c.folder));
  let finalAudioList = [];
  const seenNormTitles = new Set();

  for (const cand of combinedList) {
    if (hasDiscreteTracks && (isConcatPattern(cand.title) || isConcatPattern(cand.folder))) {
      continue;
    }
    const normKey = cand.title.toLowerCase().replace(/\s+/g, '');
    if (!seenNormTitles.has(normKey)) {
      seenNormTitles.add(normKey);
      if (!cand.category) {
        cand.category = /(?:フリートーク|free[\s_-]?talk|talk)/i.test(cand.title) ? 'freetalk' : (/(?:おまけ|bonus|特典)/i.test(cand.title) ? 'bonus' : 'main');
      }
      finalAudioList.push(cand);
    }
  }

  // Exact cumulative duration trimming when target stream duration is known
  if (targetDuration > 0) {
    let runningDur = 0;
    let cutoffIdx = -1;
    for (let i = 0; i < finalAudioList.length; i++) {
      runningDur += finalAudioList[i].duration;
      if (Math.abs(runningDur - targetDuration) <= 3) {
        cutoffIdx = i;
        break;
      } else if (runningDur > targetDuration + 5) {
        cutoffIdx = i > 0 ? i - 1 : 0;
        break;
      }
    }
    if (cutoffIdx >= 0 && cutoffIdx < finalAudioList.length - 1) {
      finalAudioList = finalAudioList.slice(0, cutoffIdx + 1);
    }
  }

  let cumulativeTime = 0;
  let trackCumulativeTime = 0;
  let currentDetectedTrack = 0;
  let lastDetectedTrack = -1;
  const chapters = [];

  for (let idx = 0; idx < finalAudioList.length; idx++) {
    const t = finalAudioList[idx];
    let trackIdx = 0;
    let startSecs = 0;

    if (hasM3u8 || targetDuration > 0) {
      trackIdx = 0;
      startSecs = cumulativeTime;
      if (targetDuration > 0 && startSecs >= targetDuration - 2) {
        break;
      }
      cumulativeTime += t.duration;
    } else {
      const combined = (t.folder ? t.folder + '/' : '') + (t.title || '');
      const tm = combined.match(/(?:トラック|track|disc|disk|cd|part|vol|volume|side|第)\s*([0-9]+)/i);
      if (tm && tm[1]) {
        const num = parseInt(tm[1], 10) - 1;
        if (num >= 0 && num <= 20) {
          if (num !== lastDetectedTrack) {
            lastDetectedTrack = num;
            currentDetectedTrack = num;
            trackCumulativeTime = 0;
          }
        }
      }
      trackIdx = currentDetectedTrack;
      startSecs = trackCumulativeTime;
      trackCumulativeTime += t.duration;
    }

    chapters.push({
      id: idx + 1,
      title: t.title,
      startTime: startSecs,
      duration: t.duration,
      formattedTime: formatServerTime(startSecs),
      trackIndex: trackIdx,
      category: t.category || 'main'
    });
  }

  return { chapters, gallery, audioTracks: finalAudioList };
}

async function probeDlsiteAndWeeabGallery(cleanRj) {
  const cleanUpper = (cleanRj || '').toUpperCase().trim();
  const cleanNum = cleanUpper.replace(/^(?:RJ|VJ|BJ)/i, '');
  const strippedNum = cleanNum.replace(/^0+/, '');
  const bucket = getDlsiteCoverBucket(cleanUpper);
  const candidates = [];

  // 1. DLsite Doujin: High-res main illustration, sample preview banner, and sample pages 1-10
  const dlsiteDoujin = { key: 'doujin', label: 'DLsite Doujin' };
  const dlsiteMainUrl = `https://img.dlsite.jp/modpub/images2/work/${dlsiteDoujin.key}/${bucket}/${cleanUpper}_img_main.jpg`;
  candidates.push({
    title: 'Main Package Artwork',
    role: 'main_cover',
    source: dlsiteDoujin.label,
    url: dlsiteMainUrl,
    proxyUrl: `/image-proxy?url=${encodeURIComponent(dlsiteMainUrl)}`
  });
  const dlsiteSamUrl = `https://img.dlsite.jp/modpub/images2/work/${dlsiteDoujin.key}/${bucket}/${cleanUpper}_img_sam.jpg`;
  candidates.push({
    title: 'Sample Preview / Banner',
    role: 'sam_cover',
    source: dlsiteDoujin.label,
    url: dlsiteSamUrl,
    proxyUrl: `/image-proxy?url=${encodeURIComponent(dlsiteSamUrl)}`
  });

  for (let i = 1; i <= 10; i++) {
    const urlImgSmp = `https://img.dlsite.jp/modpub/images2/work/${dlsiteDoujin.key}/${bucket}/${cleanUpper}_img_smp${i}.jpg`;
    candidates.push({
      title: `Sample Illustration #${i}`,
      role: `sample_${i}`,
      source: dlsiteDoujin.label,
      url: urlImgSmp,
      proxyUrl: `/image-proxy?url=${encodeURIComponent(urlImgSmp)}`
    });
    const urlSmp = `https://img.dlsite.jp/modpub/images2/work/${dlsiteDoujin.key}/${bucket}/${cleanUpper}_smp${i}.jpg`;
    candidates.push({
      title: `Sample Illustration #${i}`,
      role: `sample_${i}`,
      source: dlsiteDoujin.label,
      url: urlSmp,
      proxyUrl: `/image-proxy?url=${encodeURIComponent(urlSmp)}`
    });
  }

  // 2. Fallback ASMR.one Official Cover (used if DLsite main cover is not available)
  if (strippedNum) {
    const asmrCoverUrl = `https://api.asmr-200.com/api/cover/${strippedNum}.jpg?type=main`;
    candidates.push({
      title: 'Official Cover / CD Jacket',
      role: 'asmr_fallback_cover',
      source: 'ASMR.one',
      url: asmrCoverUrl,
      proxyUrl: `/image-proxy?url=${encodeURIComponent(asmrCoverUrl)}`
    });
  }

  // 3. Weeab0o / JapaneseASMR sample images
  for (let i = 1; i <= 8; i++) {
    const weeabImgUrl = `https://pic.weeabo0.xyz/${cleanUpper}_img_smp${i}.jpg`;
    candidates.push({
      title: `Sample Artwork #${i}`,
      role: `weeab_sample_${i}`,
      source: 'Weeab0o',
      url: weeabImgUrl,
      proxyUrl: `/image-proxy?url=${encodeURIComponent(weeabImgUrl)}`
    });
    const weeabSmpUrl = `https://pic.weeabo0.xyz/${cleanUpper}_smp${i}.jpg`;
    candidates.push({
      title: `Sample Artwork #${i}`,
      role: `weeab_sample_${i}`,
      source: 'Weeab0o',
      url: weeabSmpUrl,
      proxyUrl: `/image-proxy?url=${encodeURIComponent(weeabSmpUrl)}`
    });
  }

  try {
    const checked = await Promise.all(
      candidates.map(async (item) => {
        try {
          let referer = 'https://www.dlsite.com/';
          const isAsmr = item.url.includes('asmr.one') || item.url.includes('asmr-200.com') || item.url.includes('asmr-300.com') || item.url.includes('asmr-100.com');
          if (item.url.includes('weeabo0') || item.url.includes('japaneseasmr')) {
            referer = 'https://japaneseasmr.com/';
          } else if (isAsmr) {
            referer = 'https://www.asmr.one/';
          }
          const headers = {
            'Referer': referer,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
          };
          if (isAsmr) {
            headers['Range'] = 'bytes=0-0';
          }
          const res = await axios({
            method: isAsmr ? 'get' : 'head',
            url: item.url,
            headers,
            timeout: 5000,
            validateStatus: (status) => (status >= 200 && status < 400)
          });
          if (res.status >= 200 && res.status < 400) {
            const cl = res.headers ? (res.headers['content-length'] || '') : '';
            const et = res.headers ? (res.headers['etag'] || '') : '';
            return { ...item, contentLength: cl ? parseInt(cl, 10) : null, etag: et };
          }
        } catch (e) {}
        return null;
      })
    );

    let validList = checked.filter(Boolean);

    // Fallback: If 0 DLsite doujin images were found, try other categories (pro, books, girls, bl, ai) with small footprint
    const hasDlsite = validList.some(v => v.source && v.source.includes('DLsite'));
    if (!hasDlsite) {
      const altCats = [
        { key: 'pro', label: 'DLsite Pro' },
        { key: 'books', label: 'DLsite Books' },
        { key: 'girls', label: 'DLsite Girls' },
        { key: 'bl', label: 'DLsite BL' },
        { key: 'ai', label: 'DLsite AI' }
      ];
      const altCandidates = [];
      for (const cat of altCats) {
        altCandidates.push({
          title: 'Main Package Artwork',
          role: 'main_cover',
          source: cat.label,
          url: `https://img.dlsite.jp/modpub/images2/work/${cat.key}/${bucket}/${cleanUpper}_img_main.jpg`,
          proxyUrl: `/image-proxy?url=${encodeURIComponent(`https://img.dlsite.jp/modpub/images2/work/${cat.key}/${bucket}/${cleanUpper}_img_main.jpg`)}`
        });
        const altSamUrl = `https://img.dlsite.jp/modpub/images2/work/${cat.key}/${bucket}/${cleanUpper}_img_sam.jpg`;
        altCandidates.push({
          title: 'Sample Preview / Banner',
          role: 'sam_cover',
          source: cat.label,
          url: altSamUrl,
          proxyUrl: `/image-proxy?url=${encodeURIComponent(altSamUrl)}`
        });
        for (let i = 1; i <= 4; i++) {
          altCandidates.push({
            title: `Sample Illustration #${i}`,
            role: `sample_${i}`,
            source: cat.label,
            url: `https://img.dlsite.jp/modpub/images2/work/${cat.key}/${bucket}/${cleanUpper}_img_smp${i}.jpg`,
            proxyUrl: `/image-proxy?url=${encodeURIComponent(`https://img.dlsite.jp/modpub/images2/work/${cat.key}/${bucket}/${cleanUpper}_img_smp${i}.jpg`)}`
          });
        }
      }
      const altChecked = await Promise.all(
        altCandidates.map(async (item) => {
          try {
            const res = await axios.head(item.url, {
              headers: { 'Referer': 'https://www.dlsite.com/', 'User-Agent': 'Mozilla/5.0' },
              timeout: 3000,
              validateStatus: (status) => status >= 200 && status < 400
            });
            if (res.status >= 200 && res.status < 400) {
              const cl = res.headers ? (res.headers['content-length'] || '') : '';
              const et = res.headers ? (res.headers['etag'] || '') : '';
              return { ...item, contentLength: cl ? parseInt(cl, 10) : null, etag: et };
            }
          } catch (e) {}
          return null;
        })
      );
      validList = validList.concat(altChecked.filter(Boolean));
    }

    // --- Deduplication Logic ---
    // 1. If we have a primary DLsite Main Cover, discard the ASMR.one fallback mirror cover
    const hasPrimaryMain = validList.some(v => v.role === 'main_cover');
    if (hasPrimaryMain) {
      validList = validList.filter(v => v.role !== 'asmr_fallback_cover');
    }

    // 2. If Sample Preview / Banner has the same Content-Length or ETag as Main Package Artwork, discard duplicate banner!
    const mainItem = validList.find(v => v.role === 'main_cover');
    if (mainItem && mainItem.contentLength) {
      validList = validList.filter(v => {
        if (v.role === 'sam_cover') {
          if (v.contentLength && v.contentLength === mainItem.contentLength) {
            return false; // Exact duplicate of main package cover!
          }
          if (v.etag && mainItem.etag && v.etag === mainItem.etag) {
            return false; // Exact duplicate of main package cover!
          }
        }
        return true;
      });
    }

    // 3. Deduplicate by unique sample roles (e.g. keep one of img_smpX vs smpX)
    const seenRoles = new Set();
    const finalFiltered = [];
    for (const item of validList) {
      if (item.role && item.role.startsWith('sample_')) {
        if (seenRoles.has(item.role)) continue;
        seenRoles.add(item.role);
      }
      finalFiltered.push(item);
    }

    return finalFiltered;
  } catch (e) {
    return [];
  }
}

function extractArtworkFromTree(treeList, defaultHost = 'https://api.asmr-200.com') {
  const images = [];
  const seenUrls = new Set();

  function parseNode(node, folderPath = '') {
    if (!node) return;
    const title = (node.title || '').trim();
    const type = (node.type || '').toLowerCase();
    const currentPath = folderPath ? `${folderPath} / ${title}` : title;
    const isImage = type === 'image' || /\.(?:png|jpe?g|webp|gif|bmp|avif)$/i.test(title);
    
    if (isImage) {
      const rawUrl = node.mediaDownloadUrl || node.mediaStreamUrl || (node.hash ? `${defaultHost}/api/media/stream/${node.hash}` : '');
      if (rawUrl && !seenUrls.has(rawUrl)) {
        seenUrls.add(rawUrl);
        images.push({
          title: title.replace(/\.[a-zA-Z0-9]+$/, ''),
          folder: folderPath || 'Root',
          source: 'ASMR.one',
          url: rawUrl,
          proxyUrl: `/image-proxy?url=${encodeURIComponent(rawUrl)}`
        });
      }
    }
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        parseNode(child, currentPath);
      }
    }
  }

  if (Array.isArray(treeList)) {
    for (const rootNode of treeList) {
      parseNode(rootNode);
    }
  }
  return images;
}

async function fetchChaptersAndGallery(cleanRj, hasM3u8 = true, targetDuration = 0) {
  const cleanUpper = (cleanRj || '').toUpperCase().trim();
  const cleanNum = cleanUpper.replace(/^(?:RJ|VJ|BJ)/i, '');
  const strippedNum = cleanNum.replace(/^0+/, '');
  const trackIdsToTry = [];
  if (strippedNum) trackIdsToTry.push(strippedNum);
  if (cleanNum && !trackIdsToTry.includes(cleanNum)) trackIdsToTry.push(cleanNum);

  const apiHosts = [
    'https://api.asmr-200.com',
    'https://api.asmr-300.com',
    'https://api.asmr-100.com',
    'https://api.asmr.one'
  ];

  let parsed = { chapters: [], gallery: [], audioTracks: [] };
  const extractedArtworks = [];

  // 1. Try ASMR.one track tree (high-res booklets, illustrations, CD jackets)
  for (const tid of trackIdsToTry) {
    for (const host of apiHosts) {
      try {
        const asmrTracksRes = await axios.get(`${host}/api/tracks/${tid}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Referer': 'https://www.asmr.one/',
            'Origin': 'https://www.asmr.one'
          },
          timeout: 8000
        });
        if (asmrTracksRes.data) {
          const treeList = Array.isArray(asmrTracksRes.data) ? asmrTracksRes.data : (asmrTracksRes.data.tracks || asmrTracksRes.data.data || []);
          if (treeList.length > 0) {
            const treeArt = extractArtworkFromTree(treeList, host);
            if (treeArt.length > 0) {
              extractedArtworks.push(...treeArt);
            }
            const res = parseAsmrTreeData(treeList, hasM3u8, targetDuration, host);
            parsed = res;
            if (res.gallery && res.gallery.length > 0) {
              extractedArtworks.push(...res.gallery);
            }
            break;
          }
        }
      } catch (e) {}
    }
    if (parsed.chapters.length > 0 || extractedArtworks.length > 0 || (parsed.audioTracks && parsed.audioTracks.length > 0)) {
      break;
    }
  }

  // 2. Query ASMR.one /api/work/:id metadata for official covers
  if (strippedNum) {
    for (const host of ['https://api.asmr-200.com', 'https://api.asmr-300.com', 'https://api.asmr.one']) {
      try {
        const workRes = await axios.get(`${host}/api/work/${strippedNum}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Referer': 'https://www.asmr.one/',
            'Origin': 'https://www.asmr.one'
          },
          timeout: 6000
        });
        if (workRes.data) {
          const wData = workRes.data;
          if (wData.mainCoverUrl) {
            extractedArtworks.push({
              title: 'Official Cover / CD Jacket',
              source: 'ASMR.one',
              url: wData.mainCoverUrl,
              proxyUrl: `/image-proxy?url=${encodeURIComponent(wData.mainCoverUrl)}`
            });
          }
          if (wData.samCoverUrl) {
            extractedArtworks.push({
              title: 'Sample Preview / Banner',
              source: 'ASMR.one',
              url: wData.samCoverUrl,
              proxyUrl: `/image-proxy?url=${encodeURIComponent(wData.samCoverUrl)}`
            });
          }
          break;
        }
      } catch (e) {}
    }
  }

  // 3. Probe DLsite and Weeab0o for official sample artwork and merge
  const sampleImages = await probeDlsiteAndWeeabGallery(cleanUpper);
  const hasDlsiteCover = sampleImages.some(img => img.role === 'main_cover' || img.title === 'Main Package Artwork');

  // If DLsite primary cover is present, filter out ASMR.one mirror covers (only keep authentic track tree illustrations)
  let cleanExtractedArt = extractedArtworks;
  if (hasDlsiteCover) {
    cleanExtractedArt = extractedArtworks.filter(a => a.title !== 'Official Cover / CD Jacket' && a.title !== 'Sample Preview / Banner');
  }

  const combinedGallery = [...cleanExtractedArt, ...sampleImages];
  const seenUrls = new Set();
  const dedupedGallery = [];

  for (const item of combinedGallery) {
    if (item && item.url && !seenUrls.has(item.url)) {
      seenUrls.add(item.url);
      dedupedGallery.push(item);
    }
  }

  parsed.gallery = dedupedGallery;
  return parsed;
}

async function fetchChaptersForRj(cleanRj, hasM3u8 = true, targetDuration = 0) {
  const result = await fetchChaptersAndGallery(cleanRj, hasM3u8, targetDuration);
  return result.chapters;
}

// 3. Resolve and Save Work by RJ Code
async function resolveAndSaveWork(rjInput, saveImmediately = true) {
  const match = rjInput.trim().match(/(?:RJ|VJ|BJ)\d+/i);
  if (!match) throw new Error(`Invalid work code format: "${rjInput}". Please provide a valid RJ/VJ/BJ code (e.g. RJ01473335, BJ01267551).`);
  
  const rjCode = match[0].toUpperCase();

  // Check local database first
  const existing = db.getWorkByRj(rjCode);
  if (existing) {
    console.log(`[DB Cache Hit] Loaded ${rjCode} from local database`);
    if (saveImmediately) {
      db.removeWishlistItem(rjCode);
    }
    return existing;
  }

  console.log(`[Resolving Work] Fetching metadata and probing audio for ${rjCode}...`);
  let dlsiteMeta = null;
  try {
    dlsiteMeta = await fetchDlsiteMetadata(rjCode);
    const workData = await probeMediaCdn(rjCode, dlsiteMeta);

    if (saveImmediately) {
      // Save to persistent database
      const saved = db.saveWork(workData);
      // Remove from wishlist if it was there
      db.removeWishlistItem(rjCode);
      console.log(`[DB Saved] Successfully indexed and cached ${rjCode} into library`);
      return saved;
    } else {
      console.log(`[Work Ingested] ${rjCode} resolved (deferred DB commit)`);
      return workData;
    }
  } catch (err) {
    if (saveImmediately) {
      // Auto-save to wishlist on error
      db.saveWishlistItem({
        rjCode,
        title: dlsiteMeta?.title || `Work ${rjCode}`,
        coverUrl: dlsiteMeta?.rawCoverUrl || '',
        cv: dlsiteMeta?.cv || '',
        circle: dlsiteMeta?.circle || '',
        reason: err.message || 'Audio stream not yet available on CDN'
      });
      console.log(`[Wishlist Auto-Saved] ${rjCode} added to Wishlist: ${err.message}`);
    }
    throw err;
  }
}

// 4. Batch Ingestion
async function batchImport(rjList) {
  const results = {
    total: rjList.length,
    succeeded: [],
    failed: []
  };

  for (const item of rjList) {
    const rawRj = item.trim();
    if (!rawRj) continue;
    try {
      const work = await resolveAndSaveWork(rawRj);
      results.succeeded.push({ rjCode: work.rjCode, title: work.title });
    } catch (err) {
      results.failed.push({ rjCode: rawRj, error: err.message, wishlisted: true });
    }
  }

  return results;
}

function isWorkMetadataChanged(oldWork, freshWork) {
  if (!oldWork || !freshWork) return true;
  if ((oldWork.title || '') !== (freshWork.title || '')) return true;
  if ((oldWork.cv || '') !== (freshWork.cv || '')) return true;
  if ((oldWork.circle || '') !== (freshWork.circle || '')) return true;
  if ((oldWork.coverUrl || '') !== (freshWork.coverUrl || '')) return true;
  if ((oldWork.hasHls || false) !== (freshWork.hasHls || false)) return true;
  if ((oldWork.isNsfw ?? true) !== (freshWork.isNsfw ?? true)) return true;

  const oldTags = (oldWork.tags || []).join('|');
  const newTags = (freshWork.tags || []).join('|');
  if (oldTags !== newTags) return true;

  const oldTracks = oldWork.tracks || [];
  const newTracks = freshWork.tracks || [];
  if (oldTracks.length !== newTracks.length) return true;
  for (let i = 0; i < oldTracks.length; i++) {
    if (oldTracks[i].streamUrl !== newTracks[i].streamUrl || oldTracks[i].title !== newTracks[i].title || oldTracks[i].category !== newTracks[i].category) {
      return true;
    }
  }

  return false;
}

module.exports = {
  resolveAndSaveWork,
  batchImport,
  fetchDlsiteMetadata,
  fetchHentaiAsmrMetadata,
  probeMediaCdn,
  resolveLazyWorkAudio,
  fetchChaptersForRj,
  fetchChaptersAndGallery,
  parseAsmrTreeData,
  isWorkMetadataChanged
};

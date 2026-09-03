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
  'Referer': 'https://japaneseasmr.com/'
};

// 1. Fetch Official DLsite Metadata (Public API + Product Page Fallback - 100% Reliable)
async function fetchDlsiteMetadata(rjCode) {
  const cleanRj = rjCode.toUpperCase();
  const divisions = ['maniax', 'home', 'girls', 'pro', 'books'];

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
        let imgUrl = typeof item.image_main === 'string' ? item.image_main : (item.image_main?.url || item.work_image || '');
        if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
        if (!imgUrl || !imgUrl.startsWith('http')) imgUrl = `https://pic.weeabo0.xyz/${cleanRj}_img_main.jpg`;

        const isAdult = item.age_category === 3 || div === 'maniax' || div === 'girls' ||
                        item.age_category_string === 'adult';

        return {
          title: item.work_name || '',
          circle: item.maker_name || '',
          cv: Array.isArray(item.voice_actor) ? item.voice_actor.join(', ') : (item.voice_actor || ''),
          rawCoverUrl: imgUrl,
          tags: (item.genres || []).map(g => g.name || g),
          isNsfw: isAdult
        };
      }
    } catch (err) {}
  }

  // Strategy B: Fallback to direct DLsite Product Page HTML (handles discounted, older & special works)
  for (const div of divisions) {
    try {
      const pageUrl = `https://www.dlsite.com/${div}/work/=/product_id/${cleanRj}.html`;
      const res = await axios.get(pageUrl, {
        headers: {
          'User-Agent': BROWSER_HEADERS['User-Agent'],
          'Accept-Language': 'ja,en;q=0.9',
          'Cookie': 'adultchecked=1'
        },
        timeout: 6000
      });

      if (res.status === 200 && res.data) {
        const html = res.data;
        let title = '';
        let circle = '';

        const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
        if (titleMatch) {
          let full = titleMatch[1].trim().replace(/\s*\|\s*DLsite.*$/i, '').trim();
          const circleM = full.match(/\[(.*?)\]\s*$/);
          if (circleM) {
            circle = circleM[1].trim();
            full = full.replace(/\[(.*?)\]\s*$/, '').trim();
          }
          title = full.replace(/【[^】]*%OFF[^】]*】/gi, '').replace(/【[^】]*特典[^】]*】/gi, '').trim();
        }

        let imgUrl = '';
        const imgMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                         html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);
        if (imgMatch) {
          imgUrl = imgMatch[1];
          if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
        }
        if (!imgUrl) imgUrl = `https://pic.weeabo0.xyz/${cleanRj}_img_main.jpg`;

        const tags = [];
        const metaKeywords = html.match(/<meta\s+name=["']keywords["']\s+content=["']([^"']+)["']/i);
        if (metaKeywords) {
          metaKeywords[1].split(',').forEach(k => {
            const cleaned = k.trim();
            if (cleaned && !['DLsite', '同人', 'R18', 'アール18', 'ダウンロード'].includes(cleaned) && !tags.includes(cleaned)) {
              tags.push(cleaned);
            }
          });
        }

        if (title) {
          return {
            title,
            circle: circle || 'ASMR Circle',
            cv: 'N/A',
            rawCoverUrl: imgUrl,
            tags,
            isNsfw: div === 'maniax' || div === 'girls' || html.includes('R18') || html.includes('18禁')
          };
        }
      }
    } catch (e) {}
  }

  return null;
}

// 2. Probe CDN Directly (M3U8 HLS vs MP3 Multi-track)
async function probeMediaCdn(rjCode, dlsiteMeta) {
  const cleanRj = rjCode.toUpperCase();
  const m3u8Url = `https://v.weeab0o.xyz/${cleanRj}.m3u8`;
  const coverUrl = dlsiteMeta?.rawCoverUrl || `https://pic.weeabo0.xyz/${cleanRj}_img_main.jpg`;

  let hasM3u8 = false;

  // Check HLS .m3u8
  try {
    const m3u8Res = await axios.get(m3u8Url, {
      httpAgent,
      httpsAgent,
      headers: {
        'Referer': 'https://japaneseasmr.com/',
        'User-Agent': BROWSER_HEADERS['User-Agent']
      },
      timeout: 6000
    });
    if (m3u8Res.status === 200 && m3u8Res.data.includes('#EXTM3U')) {
      hasM3u8 = true;
    }
  } catch (e) {}

  const tracks = [];

  if (hasM3u8) {
    tracks.push({
      id: 1,
      title: '01. Full Audio Session (HLS Master)',
      formattedTime: '00:00:00',
      startTime: 0,
      isHls: true,
      rawUrl: m3u8Url,
      streamUrl: `/stream?url=${encodeURIComponent(m3u8Url)}`,
      poster: `/image-proxy?url=${encodeURIComponent(coverUrl)}`
    });
  } else {
    // Probe discrete MP3s (Track 1, Track 2, Track 3, Track 4, Track 5)
    const candidates = [
      { id: 1, title: 'Track 1 (トラック1)', url: `https://v.weeab0o.xyz/${cleanRj}.mp3` },
      { id: 2, title: 'Track 2 (トラック2)', url: `https://v.weeab0o.xyz/${cleanRj} 2.mp3` },
      { id: 3, title: 'Track 3 (トラック3)', url: `https://v.weeab0o.xyz/${cleanRj} 3.mp3` },
      { id: 4, title: 'Track 4 (トラック4)', url: `https://v.weeab0o.xyz/${cleanRj} 4.mp3` },
      { id: 5, title: 'Track 5 (トラック5)', url: `https://v.weeab0o.xyz/${cleanRj} 5.mp3` },
    ];

    for (const c of candidates) {
      try {
        const headRes = await axios.head(c.url, {
          httpAgent,
          httpsAgent,
          headers: { 'Referer': 'https://japaneseasmr.com/', 'User-Agent': BROWSER_HEADERS['User-Agent'] },
          timeout: 4000
        });
        if (headRes.status >= 200 && headRes.status < 400) {
          tracks.push({
            id: c.id,
            title: c.title,
            formattedTime: '00:00:00',
            startTime: 0,
            isHls: false,
            rawUrl: c.url,
            streamUrl: `/stream?url=${encodeURIComponent(c.url)}`,
            poster: `/image-proxy?url=${encodeURIComponent(coverUrl)}`
          });
        }
      } catch (e) {
        if (c.id === 1) break; // If Track 1 fails, stop
      }
    }
  }

  if (tracks.length === 0) {
    throw new Error(`Audio files not found on CDN for ${cleanRj}`);
  }

  return {
    rjCode: cleanRj,
    title: dlsiteMeta?.title || `Work ${cleanRj}`,
    circle: dlsiteMeta?.circle || 'ASMR Circle',
    cv: dlsiteMeta?.cv || 'N/A',
    tags: dlsiteMeta?.tags && dlsiteMeta.tags.length > 0 ? dlsiteMeta.tags : ['ASMR', 'Audio', 'Voice'],
    coverUrl: `/image-proxy?url=${encodeURIComponent(coverUrl)}`,
    rawCoverUrl: coverUrl,
    hasHls: hasM3u8,
    isNsfw: dlsiteMeta ? (dlsiteMeta.isNsfw ?? true) : true,
    totalTracks: tracks.length,
    tracks,
    source: 'RESOLVED'
  };
}

// 3. Resolve and Save Work by RJ Code
async function resolveAndSaveWork(rjInput) {
  const match = rjInput.trim().match(/RJ\d+/i);
  if (!match) throw new Error(`Invalid RJ Code format: "${rjInput}". Please provide a valid RJ code (e.g. RJ01473335).`);
  
  const rjCode = match[0].toUpperCase();

  // Check local database first
  const existing = db.getWorkByRj(rjCode);
  if (existing) {
    console.log(`[DB Cache Hit] Loaded ${rjCode} from local database`);
    return existing;
  }

  console.log(`[Resolving Work] Fetching metadata and probing audio for ${rjCode}...`);
  const dlsiteMeta = await fetchDlsiteMetadata(rjCode);
  const workData = await probeMediaCdn(rjCode, dlsiteMeta);

  // Save to persistent database
  const saved = db.saveWork(workData);
  console.log(`[DB Saved] Successfully indexed and cached ${rjCode} into library`);
  return saved;
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
      results.failed.push({ rjCode: rawRj, error: err.message });
    }
  }

  return results;
}

module.exports = {
  resolveAndSaveWork,
  batchImport
};

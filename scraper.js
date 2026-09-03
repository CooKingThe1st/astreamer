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

// 1. Fetch Official DLsite Metadata (Universal Multi-Layer Extractor)
async function fetchDlsiteMetadata(rjCode) {
  const cleanRj = rjCode.toUpperCase();
  const divisions = ['maniax', 'home', 'girls', 'pro', 'books'];
  let dlsiteMeta = null;

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
        let cv = '';
        if (Array.isArray(item.voice_actor)) cv = item.voice_actor.join(', ');
        else if (typeof item.voice_actor === 'string') cv = item.voice_actor;
        else if (item.creators && item.creators.voice_actor) {
          cv = item.creators.voice_actor.map(v => v.name || v).join(', ');
        }

        let imgUrl = typeof item.image_main === 'string' ? item.image_main : (item.image_main?.url || item.work_image || '');
        if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
        if (!imgUrl || !imgUrl.startsWith('http')) imgUrl = `https://pic.weeabo0.xyz/${cleanRj}_img_main.jpg`;

        const isAdult = item.age_category === 3 || div === 'maniax' || div === 'girls' ||
                        item.age_category_string === 'adult';

        dlsiteMeta = {
          title: item.work_name || '',
          circle: item.maker_name || '',
          cv: cv || 'N/A',
          rawCoverUrl: imgUrl,
          tags: (item.genres || []).map(g => g.name || g),
          isNsfw: isAdult
        };
        break;
      }
    } catch (err) {}
  }

  // Strategy B: Deep HTML Product Page Scraper
  if (!dlsiteMeta || !dlsiteMeta.title || dlsiteMeta.tags.length === 0) {
    for (const div of divisions) {
      try {
        const pageUrl = `https://www.dlsite.com/${div}/work/=/product_id/${cleanRj}.html/?locale=ja_JP`;
        const res = await axios.get(pageUrl, {
          headers: {
            'User-Agent': BROWSER_HEADERS['User-Agent'],
            'Accept-Language': 'ja-JP,ja;q=0.9',
            'Cookie': 'adultchecked=1; age_checked=1; locale=ja_JP;'
          },
          timeout: 6000
        });

        if (res.status === 200 && res.data) {
          const html = res.data;
          let title = '';
          const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
          if (titleMatch) {
            let full = titleMatch[1].trim().replace(/\s*\|\s*DLsite.*$/i, '').trim();
            const circleBracketMatch = full.match(/\[(.*?)\]\s*$/);
            if (circleBracketMatch && !dlsiteMeta?.circle) {
              full = full.replace(/\[(.*?)\]\s*$/, '').trim();
            }
            title = full.replace(/【[^】]*%OFF[^】]*】/gi, '').replace(/【[^】]*特典[^】]*】/gi, '').trim();
          }

          let circle = dlsiteMeta?.circle || '';
          if (!circle) {
            const ldMatch = html.match(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
            if (ldMatch) {
              try {
                const ldData = JSON.parse(ldMatch[1]);
                if (ldData['@type'] === 'BreadcrumbList' && Array.isArray(ldData.itemListElement)) {
                  const circleObj = ldData.itemListElement.find(it => it.position === 3);
                  if (circleObj && circleObj.name) circle = circleObj.name;
                }
              } catch(e) {}
            }
          }
          if (!circle) {
            const makerLinkMatch = html.match(/href=["'][^"']*\/maker_id\/[^"']*["'][^>]*>([^<]+)<\/a>/i);
            if (makerLinkMatch) circle = makerLinkMatch[1].trim();
          }

          let cv = dlsiteMeta?.cv && dlsiteMeta.cv !== 'N/A' ? dlsiteMeta.cv : '';
          if (!cv) {
            const cvMatch = html.match(/CV[.:：\s]+([^()「」<]{2,60})/i);
            if (cvMatch) {
              const cvNames = [];
              cvMatch[1].split(/[/,、・\s]+/).forEach(c => {
                const clean = c.replace(/様|さん|氏/g, '').trim();
                if (clean && clean.length >= 2 && !cvNames.includes(clean)) cvNames.push(clean);
              });
              if (cvNames.length > 0) cv = cvNames.join(', ');
            }
          }

          const tags = dlsiteMeta?.tags && dlsiteMeta.tags.length > 0 ? [...dlsiteMeta.tags] : [];
          const genreMatches = html.matchAll(/\/(?:genre|keyword|taxonomy)\/[^"'>]+["'][^>]*>([^<]+)<\/a>/gi);
          for (const m of genreMatches) {
            const t = m[1].trim();
            if (t && !tags.includes(t) && !['DLsite', '同人', 'R18', 'サークル一覧'].includes(t)) tags.push(t);
          }

          const CANDIDATE_KEYWORDS = ['催眠', 'ASMR', 'バイノーラル', 'ダミヘ', '耳舐め', '囁き', 'ご奉仕', '奉仕', '甘やかし', '癒し', 'オナサポ', '手コキ', '中出し', '乳首', '巨乳', '爆乳', 'お姉さん', '後輩', '同級生', '幼馴染', 'メイド', '風紀委員'];
          CANDIDATE_KEYWORDS.forEach(kw => {
            if (html.includes(kw) && !tags.includes(kw)) tags.push(kw);
          });

          let imgUrl = dlsiteMeta?.rawCoverUrl || '';
          if (!imgUrl) {
            const ogImgMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
            if (ogImgMatch) imgUrl = ogImgMatch[1];
            if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
          }
          if (!imgUrl) imgUrl = `https://pic.weeabo0.xyz/${cleanRj}_img_main.jpg`;

          dlsiteMeta = {
            title: title || dlsiteMeta?.title || `Work ${cleanRj}`,
            circle: circle || dlsiteMeta?.circle || 'ASMR Circle',
            cv: cv || 'N/A',
            rawCoverUrl: imgUrl,
            tags: tags.length > 0 ? tags : ['ASMR', 'Audio'],
            isNsfw: div === 'maniax' || div === 'girls' || html.includes('R18') || html.includes('18禁')
          };
          break;
        }
      } catch (e) {}
    }
  }

  return dlsiteMeta;
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

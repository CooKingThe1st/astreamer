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

function getCanonicalDlsiteRj(rjCode) {
  const clean = (rjCode || '').toUpperCase().trim();
  const match = clean.match(/^(?:RJ|VJ|BJ)?(\d+)$/i);
  if (!match) return clean;
  const pref = (clean.match(/^(RJ|VJ|BJ)/i) || [])[1] || 'RJ';
  const num = parseInt(match[1], 10);
  if (isNaN(num) || num <= 0) return clean;
  const targetLen = num >= 1000000 ? 8 : 6;
  return pref.toUpperCase() + String(num).padStart(targetLen, '0');
}

function getDlsiteCoverBucket(rjCode) {
  const clean = (rjCode || '').toUpperCase().trim();
  const match = clean.match(/^(?:RJ|VJ|BJ)?(\d+)$/i);
  if (!match) return clean;
  const pref = (clean.match(/^(RJ|VJ|BJ)/i) || [])[1] || 'RJ';
  const num = parseInt(match[1], 10);
  if (isNaN(num) || num <= 0) return clean;
  const bucketNum = Math.ceil(num / 1000) * 1000;
  const targetLen = num >= 1000000 ? 8 : 6;
  return pref.toUpperCase() + String(bucketNum).padStart(targetLen, '0');
}

function normalizeReleaseDate(dateInput) {
  if (!dateInput) return '';
  const str = String(dateInput).trim();
  if (!str) return '';

  // 1. ISO format: 2024-09-14 or 2024-09-14 00:00:00 or 2024-09-14T00:00:00Z
  const isoMatch = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (isoMatch) {
    const y = isoMatch[1];
    const m = isoMatch[2].padStart(2, '0');
    const d = isoMatch[3].padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // 2. Japanese format: 2024年09月14日 or 2024年9月14日
  const jaMatch = str.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
  if (jaMatch) {
    const y = jaMatch[1];
    const m = jaMatch[2].padStart(2, '0');
    const d = jaMatch[3].padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // 3. Month Name format: Sep/14/2024, Sep 14, 2024, September 14, 2024, 14-Sep-2024
  const monthMap = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
  };
  const monthNameMatch = str.match(/([a-zA-Z]{3,9})[\s/.-]+(\d{1,2})[\s/.,-]+(\d{4})/);
  if (monthNameMatch) {
    const mKey = monthNameMatch[1].slice(0, 3).toLowerCase();
    if (monthMap[mKey]) {
      const m = monthMap[mKey];
      const d = monthNameMatch[2].padStart(2, '0');
      const y = monthNameMatch[3];
      return `${y}-${m}-${d}`;
    }
  }

  // 4. Day first Month Name: 14 Sep 2024, 14/Sep/2024
  const dayFirstMatch = str.match(/(\d{1,2})[\s/.-]+([a-zA-Z]{3,9})[\s/.,-]+(\d{4})/);
  if (dayFirstMatch) {
    const mKey = dayFirstMatch[2].slice(0, 3).toLowerCase();
    if (monthMap[mKey]) {
      const d = dayFirstMatch[1].padStart(2, '0');
      const m = monthMap[mKey];
      const y = dayFirstMatch[3];
      return `${y}-${m}-${d}`;
    }
  }

  // 5. Fallback Date.parse
  const ts = Date.parse(str);
  if (!isNaN(ts) && ts > 0) {
    const dt = new Date(ts);
    const y = dt.getUTCFullYear();
    const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
    const d = String(dt.getUTCDate()).padStart(2, '0');
    if (y >= 1990 && y <= 2099) {
      return `${y}-${m}-${d}`;
    }
  }

  return '';
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

  const cleanNum = cleanUpper.replace(/^(?:RJ|VJ|BJ)/i, '');
  const strippedNum = cleanNum.replace(/^0+/, '');
  const strippedLower = `rj${strippedNum}`;
  const strippedUpper = `RJ${strippedNum}`;

  // 1. Query WordPress REST API by slug & search (both 8-digit, stripped, and numeric)
  const apiUrls = [
    `https://hentaiasmr.moe/wp-json/wp/v2/posts?slug=${encodeURIComponent(cleanLower)}&_embed=1`,
    `https://hentaiasmr.moe/wp-json/wp/v2/posts?slug=${encodeURIComponent(strippedLower)}&_embed=1`,
    `https://hentaiasmr.moe/wp-json/wp/v2/posts?search=${encodeURIComponent(cleanUpper)}&per_page=10&_embed=1`,
    `https://hentaiasmr.moe/wp-json/wp/v2/posts?search=${encodeURIComponent(strippedUpper)}&per_page=10&_embed=1`,
    `https://hentaiasmr.moe/wp-json/wp/v2/posts?search=${encodeURIComponent(cleanNum)}&per_page=10&_embed=1`,
    `https://hentaiasmr.moe/wp-json/wp/v2/posts?search=${encodeURIComponent(strippedNum)}&per_page=10&_embed=1`
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
          const pSlug = decodeURIComponent(p.slug || '').toLowerCase();
          const pTitle = (p.title?.rendered || '').toUpperCase();
          const pContent = (p.content?.rendered || '').toUpperCase();
          const pLink = decodeURIComponent(p.link || '').toLowerCase();
          const validSlugs = [cleanLower, strippedLower, cleanNum, strippedNum];
          const validCodes = [cleanUpper, strippedUpper, cleanNum, strippedNum];
          if (validSlugs.some(s => pSlug === s || pSlug.includes(s) || pLink.includes(s))) return true;
          if (validCodes.some(c => pTitle.includes(c) || pContent.includes(c))) return true;
          return false;
        }) || (url.includes('search=') ? posts[0] : null);
        if (match) {
          post = match;
          break;
        }
      }
    } catch (e) {}
  }

  // Direct HTML page fallback if WP REST API did not return post
  if (!post) {
    const candidatePages = [
      `https://hentaiasmr.moe/${cleanLower}.html`,
      `https://hentaiasmr.moe/${strippedLower}.html`,
      `https://hentaiasmr.moe/${cleanUpper}.html`,
      `https://hentaiasmr.moe/${strippedUpper}.html`,
      `https://hentaiasmr.moe/?s=${encodeURIComponent(cleanUpper)}`,
      `https://hentaiasmr.moe/?s=${encodeURIComponent(strippedUpper)}`
    ];
    for (const pUrl of candidatePages) {
      try {
        const pRes = await axios.get(pUrl, {
          headers: {
            'User-Agent': BROWSER_HEADERS['User-Agent'],
            'Referer': 'https://hentaiasmr.moe/'
          },
          httpsAgent,
          timeout: 6000,
          validateStatus: s => s >= 200 && s < 400
        });
        if (pRes.status === 200 && pRes.data && typeof pRes.data === 'string') {
          const htmlText = pRes.data;
          // If search results page, find first matching post link and fetch it
          if (pUrl.includes('?s=')) {
            const postLinkMatch = htmlText.match(/href="(https:\/\/hentaiasmr\.moe\/[^"]*rj[^"]*\.html)"/i) || htmlText.match(/href="(https:\/\/hentaiasmr\.moe\/\?p=\d+)"/i) || htmlText.match(/href="(https:\/\/hentaiasmr\.moe\/[a-zA-Z0-9_-]+\.html)"/i);
            if (postLinkMatch) {
              const targetPostUrl = postLinkMatch[1];
              try {
                const subRes = await axios.get(targetPostUrl, {
                  headers: { 'User-Agent': BROWSER_HEADERS['User-Agent'], 'Referer': 'https://hentaiasmr.moe/' },
                  httpsAgent,
                  timeout: 6000
                });
                if (subRes.status === 200 && subRes.data) {
                  const subHtml = subRes.data;
                  const idMatch = subHtml.match(/\/posts\/(\d+)/) || subHtml.match(/postid-(\d+)/i) || subHtml.match(/post-(\d+)/i) || subHtml.match(/\?p=(\d+)/) || subHtml.match(/cdn(?:16|-otome)?\.hentaiasmr\.moe\/mf\/(\d+)\//);
                  const pId = idMatch ? parseInt(idMatch[1], 10) : 0;
                  const titleMatch = subHtml.match(/<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i) || subHtml.match(/<title>([\s\S]*?)<\/title>/i);
                  const pTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').replace(/ - .*$/, '').trim() : `Work ${cleanUpper}`;
                  const imgMatch = subHtml.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i) || subHtml.match(/<img[^>]+class="[^"]*(?:wp-post-image|featured-image)[^"]*"[^>]+src="([^"]+)"/i);
                  const pImg = imgMatch ? imgMatch[1] : '';
                  post = {
                    id: pId || 1,
                    slug: cleanLower,
                    link: targetPostUrl,
                    title: { rendered: pTitle },
                    content: { rendered: subHtml },
                    yoast_head: subHtml.slice(0, 3000),
                    _embedded: {
                      'wp:featuredmedia': pImg ? [{ source_url: pImg }] : []
                    }
                  };
                  break;
                }
              } catch (se) {}
            }
          } else {
            const idMatch = htmlText.match(/\/posts\/(\d+)/) || htmlText.match(/postid-(\d+)/i) || htmlText.match(/post-(\d+)/i) || htmlText.match(/\?p=(\d+)/) || htmlText.match(/cdn(?:16|-otome)?\.hentaiasmr\.moe\/mf\/(\d+)\//);
            const pId = idMatch ? parseInt(idMatch[1], 10) : 0;
            const titleMatch = htmlText.match(/<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i) || htmlText.match(/<title>([\s\S]*?)<\/title>/i);
            const pTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').replace(/ - .*$/, '').trim() : `Work ${cleanUpper}`;
            const imgMatch = htmlText.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i) || htmlText.match(/<img[^>]+class="[^"]*(?:wp-post-image|featured-image)[^"]*"[^>]+src="([^"]+)"/i);
            const pImg = imgMatch ? imgMatch[1] : '';

            post = {
              id: pId || 1,
              slug: cleanLower,
              link: pUrl,
              title: { rendered: pTitle },
              content: { rendered: htmlText },
              yoast_head: htmlText.slice(0, 3000),
              _embedded: {
                'wp:featuredmedia': pImg ? [{ source_url: pImg }] : []
              }
            };
            break;
          }
        }
      } catch (e) {}
    }
  }

  if (!post || !post.id) return null;

  const postId = post.id;
  let cleanTitle = (post.title?.rendered || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&#038;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/^\[(?:RJ|VJ|BJ)\d+\]\s*/i, '')
    .replace(/\((?:RJ|VJ|BJ)\d+\)\s*/i, '')
    .trim();

  let extractedCircle = '';
  // Check if title has circle in brackets: e.g. [Circle Name] Title or (Circle Name) Title or 【Circle Name】 Title
  const bracketCircleMatch = cleanTitle.match(/^(?:\[([^\]]+)\]|\(([^\)]+)\)|【([^】]+)】)\s*(.+)$/);
  if (bracketCircleMatch) {
    const candidateCircle = (bracketCircleMatch[1] || bracketCircleMatch[2] || bracketCircleMatch[3] || '').trim();
    const restTitle = (bracketCircleMatch[4] || '').trim();
    if (candidateCircle && !/^(?:cv|mp3|wav|flac|hls|rj\d+|vj\d+|bj\d+|dl版|特典)/i.test(candidateCircle) && restTitle.length > 2) {
      extractedCircle = candidateCircle;
      cleanTitle = restTitle;
    }
  }

  // Also check if circle is at the end: Title 【Circle Name】 or Title [Circle Name]
  if (!extractedCircle) {
    const endCircleMatch = cleanTitle.match(/^(.+?)\s*(?:\[([^\]]+)\]|【([^】]+)】)$/);
    if (endCircleMatch) {
      const restTitle = (endCircleMatch[1] || '').trim();
      const candidateCircle = (endCircleMatch[2] || endCircleMatch[3] || '').trim();
      if (candidateCircle && !/^(?:cv|mp3|wav|flac|hls|rj\d+|vj\d+|bj\d+|dl版|特典)/i.test(candidateCircle) && restTitle.length > 2) {
        extractedCircle = candidateCircle;
        cleanTitle = restTitle;
      }
    }
  }

  // Cover image
  let coverUrl = '';
  if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
    const media = post._embedded['wp:featuredmedia'][0];
    coverUrl = media.source_url || media.media_details?.sizes?.full?.source_url || '';
  }

  // Terms: tags, actors, categories, circles
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
        const taxonomy = (term.taxonomy || '').toLowerCase();
        
        let rawSlug = term.slug || '';
        try { rawSlug = decodeURIComponent(rawSlug); } catch (e) {}

        if (taxonomy === 'circle' || taxonomy === 'maker' || taxonomy === 'developer' || taxonomy === 'brand' || taxonomy === 'publisher' || taxonomy === 'group') {
          if (tName && !extractedCircle) {
            extractedCircle = tName;
          }
        } else if (taxonomy === 'actors' || taxonomy === 'cv') {
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

  // Unescape content HTML and extract embedded audio URLs & ground-truth duration
  const unescapedContent = (post.content?.rendered || '')
    .replace(/\\\//g, '/')
    .replace(/&#8217;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
  const excerptText = (post.excerpt?.rendered || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&');
  const combinedPostText = unescapedContent + ' ' + excerptText + ' ' + (post.yoast_head || '');

  if (!extractedCircle) {
    const circleTextMatch = combinedPostText.match(/(?:Circle|サークル|Maker|ブランド|メーカー|Developer|Brand)[\s:：]+([^\n<,]+)/i);
    if (circleTextMatch && circleTextMatch[1]) {
      const cStr = circleTextMatch[1].trim();
      if (cStr && cStr.length >= 2 && cStr.length < 50 && !/^(?:https?:|none|n\/a)/i.test(cStr)) {
        extractedCircle = cStr;
      }
    }
  }

  let parsedDuration = 0;
  // Match ISO 8601 duration format (e.g. PT02H21M44S, PT2H3M, PT45M12S)
  const isoDurMatch = combinedPostText.match(/itemprop=["']duration["']\s+content=["']PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?["']/i) ||
                      combinedPostText.match(/"duration"\s*:\s*["']PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?["']/i) ||
                      combinedPostText.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i);
  if (isoDurMatch && (isoDurMatch[1] || isoDurMatch[2] || isoDurMatch[3])) {
    const h = parseInt(isoDurMatch[1] || '0', 10);
    const m = parseInt(isoDurMatch[2] || '0', 10);
    const s = parseInt(isoDurMatch[3] || '0', 10);
    parsedDuration = h * 3600 + m * 60 + s;
  }
  if (!parsedDuration) {
    const durMatch = combinedPostText.match(/(?:Duration|収録時間|再生時間|時間|長さ|length)[\s:：]+([0-9a-zA-Z\s分時間秒hms:]+)/i);
    if (durMatch && durMatch[1]) {
      const dStr = durMatch[1].trim();
      // Match "2h 3m", "2h3m", "2h 30min", "120m", "90分", "01:25:30", "45:12"
      const hmsMatch = dStr.match(/(?:(\d+)\s*(?:h|hours?|時間|hr))?\s*(?:(\d+)\s*(?:m|mins?|minutes?|分))?\s*(?:(\d+)\s*(?:s|secs?|seconds?|秒))?/i);
      if (hmsMatch && (hmsMatch[1] || hmsMatch[2])) {
        const h = parseInt(hmsMatch[1] || '0', 10);
        const m = parseInt(hmsMatch[2] || '0', 10);
        const s = parseInt(hmsMatch[3] || '0', 10);
        if (h > 0 || m > 0 || s > 0) parsedDuration = h * 3600 + m * 60 + s;
      }
      if (!parsedDuration) {
        const colonMatch = dStr.match(/\b(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\b/);
        if (colonMatch) {
          if (colonMatch[1]) {
            parsedDuration = parseInt(colonMatch[1], 10) * 3600 + parseInt(colonMatch[2], 10) * 60 + parseInt(colonMatch[3], 10);
          } else {
            parsedDuration = parseInt(colonMatch[2], 10) * 60 + parseInt(colonMatch[3], 10);
          }
        }
      }
    }
  }

  let parsedReleaseDate = '';
  const releaseMatch = combinedPostText.match(/(?:Release|発売日|公開日|販売日|配信日)[\s:：]+([A-Za-z0-9/.\s,-]+?)(?:Age|Ratings|Series|Circle|Voice|File|Size|Duration|<|\n|$)/i);
  if (releaseMatch && releaseMatch[1]) {
    parsedReleaseDate = normalizeReleaseDate(releaseMatch[1].trim());
  }
  if (!parsedReleaseDate && (post.date || post.date_gmt)) {
    parsedReleaseDate = normalizeReleaseDate(post.date || post.date_gmt);
  }

  const contentUrls = unescapedContent.match(/https?:\/\/[^\s"'<>]+\.(?:mp3|m4a|wav|ogg|flac|m3u8)/gi) || [];
  contentUrls.forEach(u => {
    if (u && !singleTrackCandidates.includes(u)) singleTrackCandidates.push(u);
  });

  // Discovered Single-Track Patterns across CDN endpoints
  const singlePatterns = [
    `https://cdn.hentaiasmr.moe/mf/${postId}/merge/${cleanUpper}.mp3`,
    `https://cdn16.hentaiasmr.moe/mf/${postId}/merge/${cleanUpper}.mp3`,
    `https://cdn-otome.hentaiasmr.moe/mf/${postId}/merge/${cleanUpper}.mp3`,
    `https://cdn.hentaiasmr.moe/mf/${postId}/merge/${strippedUpper}.mp3`,
    `https://cdn.hentaiasmr.moe/mf/${postId}/merge/${cleanLower}.mp3`,
    `https://cdn.hentaiasmr.moe/mf/${postId}/merge/${strippedLower}.mp3`,
    `https://cdn.hentaiasmr.moe/mf/${postId}/${cleanUpper}.mp3`,
    `https://cdn.hentaiasmr.moe/mf/${postId}/${strippedUpper}.mp3`,
    `https://cdn.hentaiasmr.moe/mf/${postId}/1.mp3`,
    `https://cdn16.hentaiasmr.moe/audio/${postId}.mp3`,
    `https://cdn.hentaiasmr.moe/audio/${postId}.mp3`,
    `https://cdn-otome.hentaiasmr.moe/audio/${postId}.mp3`,
    `https://cdn.hentaiasmr.moe/mp4/${postId}.mp3`,
    `https://cdn16.hentaiasmr.moe/mp4/${postId}.mp3`,
    `https://cdn-otome.hentaiasmr.moe/mp4/${postId}.mp3`,
    `https://cdn.hentaiasmr.moe/audio/${cleanUpper}.mp3`,
    `https://cdn16.hentaiasmr.moe/audio/${cleanUpper}.mp3`,
    `https://cdn.hentaiasmr.moe/audio/${strippedUpper}.mp3`
  ];
  singlePatterns.forEach(u => {
    if (!singleTrackCandidates.includes(u)) singleTrackCandidates.push(u);
  });

  const probeReferers = [
    post.link,
    `https://hentaiasmr.moe/${cleanLower}.html`,
    `https://hentaiasmr.moe/${strippedLower}.html`,
    'https://hentaiasmr.moe/'
  ].filter(Boolean);

  async function probeMediaCandidate(targetUrl) {
    if (!targetUrl) return null;
    for (const ref of probeReferers) {
      const probeHeaders = {
        'User-Agent': BROWSER_HEADERS['User-Agent'],
        'Referer': ref,
        'Origin': 'https://hentaiasmr.moe',
        'Accept': '*/*'
      };
      // Try HEAD first (fastest and cleanest)
      try {
        const headRes = await axios.head(encodeURI(targetUrl), {
          headers: probeHeaders,
          httpsAgent,
          httpAgent,
          timeout: 4000,
          maxRedirects: 5,
          validateStatus: s => (s >= 200 && s < 400)
        });
        if (headRes && headRes.status >= 200 && headRes.status < 400) {
          const cType = String(headRes.headers && headRes.headers['content-type'] || '').toLowerCase();
          if (!cType.includes('text/html') && !cType.includes('text/plain') && !cType.includes('application/json')) {
            let size = parseInt(headRes.headers && headRes.headers['content-length'] || '0', 10);
            return { ok: true, size };
          }
        }
      } catch (he) {}

      // Fallback to GET with Range: bytes=0-0 and responseType: 'stream'
      try {
        const getRes = await axios.get(encodeURI(targetUrl), {
          headers: {
            ...probeHeaders,
            'Range': 'bytes=0-0'
          },
          httpsAgent,
          httpAgent,
          responseType: 'stream',
          timeout: 5000,
          maxRedirects: 5,
          validateStatus: s => (s >= 200 && s < 400) || s === 206
        });
        if (getRes && ((getRes.status >= 200 && getRes.status < 400) || getRes.status === 206)) {
          const cType = String(getRes.headers && getRes.headers['content-type'] || '').toLowerCase();
          if (!cType.includes('text/html') && !cType.includes('text/plain') && !cType.includes('application/json')) {
            let size = 0;
            const cr = getRes.headers && getRes.headers['content-range'];
            if (cr) {
              const m = cr.match(/\/(\d+)/);
              if (m) size = parseInt(m[1], 10);
            }
            if (!size && getRes.headers) size = parseInt(getRes.headers['content-length'] || '0', 10);
            if (getRes.data && typeof getRes.data.destroy === 'function') {
              getRes.data.destroy();
            }
            return { ok: true, size };
          }
          if (getRes.data && typeof getRes.data.destroy === 'function') {
            getRes.data.destroy();
          }
        }
      } catch (ge) {}
    }
    return null;
  }

  const audioTracks = [];
  let foundPattern = null;
  const triedUrls = [];

  if (!skipAudioProbe) {
    // 1. Direct HTML JWPlayer Playlist scraping
    try {
      const pageUrl = post.link || `https://hentaiasmr.moe/${cleanLower}.html`;
      const pageRes = await axios.get(pageUrl, {
        headers: {
          'User-Agent': BROWSER_HEADERS['User-Agent'],
          'Referer': 'https://hentaiasmr.moe/'
        },
        httpsAgent,
        httpAgent,
        timeout: 6000,
        validateStatus: s => s >= 200 && s < 400
      });
      if (pageRes && pageRes.data && typeof pageRes.data === 'string') {
        const htmlTracks = extractMoeHtmlTracks(pageRes.data, pageUrl, coverUrl, cleanTitle, cleanUpper);
        if (htmlTracks && htmlTracks.length > 0) {
          const seenPathKeys = new Set();
          htmlTracks.forEach((t) => {
            const raw = t.rawUrl || t.streamUrl || '';
            const pathKey = raw.replace(/^https?:\/\/[^\/]+/i, '').replace(/[#?].*$/, '').toLowerCase().trim();
            if (pathKey && !seenPathKeys.has(pathKey)) {
              seenPathKeys.add(pathKey);
              audioTracks.push({
                index: audioTracks.length + 1,
                title: t.title || `Track ${audioTracks.length + 1}`,
                rawTitle: `${audioTracks.length + 1}.mp3`,
                streamUrl: t.rawUrl || t.streamUrl,
                category: t.category || (audioTracks.length === 0 ? 'main' : (audioTracks.length === 1 ? 'freetalk' : 'bonus')),
                _size: t.size || 0,
                isHls: Boolean(t.isHls)
              });
            }
          });
          if (audioTracks.length > 0) {
            foundPattern = 'html_jwplayer_playlist';
          }
        }
      }
    } catch (e) {}

    // 2. Probing single-track candidates if no HTML playlist was found
    if (audioTracks.length === 0) {
      for (const mergeUrl of singleTrackCandidates) {
        triedUrls.push(mergeUrl);
        const probe = await probeMediaCandidate(mergeUrl);
        if (probe && probe.ok) {
          audioTracks.push({
            index: 1,
            title: `${cleanTitle || cleanUpper} (Full)`,
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

  // If work exists on Moe (valid postId) but CDN probe was blocked by Cloudflare/WAF, synthesize default single-track merge URL
  if (postId && audioTracks.length === 0) {
    const defaultMergeUrl = `https://cdn.hentaiasmr.moe/mf/${postId}/merge/${cleanUpper}.mp3`;
    audioTracks.push({
      index: 1,
      title: cleanTitle ? `${cleanTitle} (Full)` : `${cleanUpper} (Full)`,
      rawTitle: `${cleanUpper}.mp3`,
      streamUrl: defaultMergeUrl,
      category: 'main',
      _size: 0,
      isHls: false
    });
    foundPattern = 'inferred_merge_postid';
  }

  const isAudioFound = audioTracks.length > 0;
  const diagnostic = (!isAudioFound && postId) ? {
    rjCode: cleanUpper,
    postId,
    slug: post.slug,
    postLink: post.link || `https://hentaiasmr.moe/${cleanLower}.html`,
    title: cleanTitle || `Work ${cleanUpper}`,
    triedUrls
  } : null;

  return {
    postId,
    title: cleanTitle || `Work ${cleanUpper}`,
    circle: extractedCircle || 'ASMR Circle',
    cv: cvJa ? (cvRomaji ? `${cvJa} (${cvRomaji})` : cvJa) : (cv || 'N/A'),
    cvJa,
    cvRomaji,
    releaseDate: parsedReleaseDate || '',
    series: '',
    duration: parsedDuration || 0,
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
  const cleanRj = (rjCode || '').toUpperCase().trim();
  const canonicalRj = getCanonicalDlsiteRj(cleanRj);
  const cleanNum = cleanRj.replace(/^(?:RJ|VJ|BJ)/i, '');
  const strippedNum = cleanNum.replace(/^0+/, '');
  const divisions = ['maniax', 'home', 'girls', 'pro', 'books', 'comic', 'soft', 'bl', 'touch', 'gay', 'eng'];
  let dlsiteMeta = null;

  // Strategy 0: ASMR.one Public API across multiple hosts
  const asmrHosts = ['https://api.asmr-200.com', 'https://api.asmr-300.com', 'https://api.asmr.one', 'https://api.asmr-100.com'];
  const idsToTry = Array.from(new Set([strippedNum, cleanNum, cleanRj, canonicalRj])).filter(Boolean);
  for (const tid of idsToTry) {
    for (const host of asmrHosts) {
      try {
        const asmrRes = await axios.get(`${host}/api/work/${tid}`, {
          headers: { 'User-Agent': BROWSER_HEADERS['User-Agent'] },
          timeout: 2500
        });
        if (asmrRes.data && asmrRes.data.title) {
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

          dlsiteMeta = {
            title: data.title,
            circle: data.circle?.name || '',
            cv: cv || 'N/A',
            releaseDate: normalizeReleaseDate(data.release || data.release_date || data.regist_date || ''),
            rawCoverUrl: imgUrl,
            tags: tags,
            tagTranslations: tagTranslations,
            isNsfw: isAdult ?? true
          };
          break;
        }
      } catch (err) {}
    }
    if (dlsiteMeta && dlsiteMeta.title) break;
  }

  // Strategy A: JSON APIs across divisions in parallel
  try {
    const divResults = await Promise.all(
      divisions.map(async (div) => {
        try {
          const url = `https://www.dlsite.com/${div}/api/=/product.json?workno=${cleanRj}`;
          const res = await axios.get(url, {
            headers: {
              'User-Agent': BROWSER_HEADERS['User-Agent'],
              'Accept-Language': 'ja,en;q=0.9'
            },
            timeout: 2500
          });
          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            return { div, item: res.data[0] };
          }
        } catch (e) {}
        return null;
      })
    );

    const validDiv = divResults.find(r => r && r.item);
    if (validDiv) {
      const item = validDiv.item;
      const div = validDiv.div;
      let cv = dlsiteMeta?.cv || '';
      if (!cv || cv === 'N/A') {
        if (Array.isArray(item.voice_actor)) {
          const names = item.voice_actor.map(v => typeof v === 'string' ? v : (v?.name || '')).filter(Boolean);
          if (names.length > 0) cv = names.join(', ');
        } else if (typeof item.voice_actor === 'string' && item.voice_actor.trim()) {
          cv = item.voice_actor.trim();
        }
        if ((!cv || cv === 'N/A') && item.creators && typeof item.creators === 'object') {
          const creatorKeys = ['voice_actor', 'actor', 'cv', 'cast', 'voice', '声優', '出演'];
          for (const key of creatorKeys) {
            const val = item.creators[key];
            if (Array.isArray(val)) {
              const names = val.map(v => typeof v === 'string' ? v : (v?.name || '')).filter(Boolean);
              if (names.length > 0) { cv = names.join(', '); break; }
            } else if (typeof val === 'string' && val.trim()) {
              cv = val.trim(); break;
            }
          }
        }
        if ((!cv || cv === 'N/A') && Array.isArray(item.creators)) {
          const vas = item.creators.filter(c => c && (c.type === 'voice_actor' || c.role === 'voice_actor' || c.type === 'cv' || c.role === 'cv' || c.type === 'actor'));
          if (vas.length > 0) {
            const names = vas.map(v => v.name || v.val || '').filter(Boolean);
            if (names.length > 0) cv = names.join(', ');
          }
        }

        // HTML product page fallback if CV not found in JSON
        if (!cv || cv === 'N/A') {
          try {
            const htmlUrl = `https://www.dlsite.com/${div}/work/=/product_id/${cleanRj}.html`;
            const htmlRes = await axios.get(htmlUrl, {
              headers: {
                'User-Agent': BROWSER_HEADERS['User-Agent'],
                'Accept-Language': 'ja,en;q=0.9',
                'Cookie': 'adultchecked=1'
              },
              timeout: 4000
            });
            if (htmlRes.status === 200 && typeof htmlRes.data === 'string') {
              const htmlMatch = htmlRes.data.match(/<th>(?:声優|出演|ボイス|キャスト|声の出演)<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
              if (htmlMatch && htmlMatch[1]) {
                const cvNames = htmlMatch[1].replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, '$1, ')
                  .replace(/<[^>]+>/g, '')
                  .split(/[,/、\n]/)
                  .map(s => s.trim())
                  .filter(s => s && s.length > 0 && !s.includes('http'));
                if (cvNames.length > 0) {
                  cv = Array.from(new Set(cvNames)).join(', ');
                }
              }
            }
          } catch (e) {}
        }
      }

      let imgUrl = dlsiteMeta?.rawCoverUrl || (typeof item.image_main === 'string' ? item.image_main : (item.image_main?.url || item.work_image || ''));
      if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;

      const isAdult = (item.age_category === 1 || item.age_category_string === 'general') ? false : true;

      const genres = (item.genres || []).map(g => g.name || g);
      const tags = Array.from(new Set([...(dlsiteMeta?.tags || []), ...genres]));
      const relDate = normalizeReleaseDate(item.regist_date || item.sales_date || item.release_date || dlsiteMeta?.releaseDate || '');

      dlsiteMeta = {
        title: item.work_name || dlsiteMeta?.title || '',
        circle: item.maker_name || dlsiteMeta?.circle || '',
        cv: cv || 'N/A',
        releaseDate: relDate,
        rawCoverUrl: imgUrl,
        tags: tags,
        isNsfw: isAdult
      };
    }
  } catch (err) {}

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
          releaseDate: normalizeReleaseDate(dlsiteMeta?.releaseDate || moeMeta.releaseDate || ''),
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
  const cleanRj = (rjCode || '').toUpperCase().trim();
  const cleanNum = cleanRj.replace(/^(?:RJ|VJ|BJ)/i, '');
  const strippedNum = cleanNum.replace(/^0+/, '');
  const title = (dlsiteMeta && dlsiteMeta.title) || '';
  const circle = (dlsiteMeta && dlsiteMeta.circle) || '';
  const cv = (dlsiteMeta && dlsiteMeta.cv) || '';
  const tags = (dlsiteMeta && Array.isArray(dlsiteMeta.tags)) ? [...dlsiteMeta.tags] : [];
  const tagTranslations = (dlsiteMeta && dlsiteMeta.tagTranslations) ? { ...dlsiteMeta.tagTranslations } : {};
  const m3u8Url = `https://v.weeab0o.xyz/${cleanRj}.m3u8`;
  const bucket = getDlsiteCoverBucket(cleanRj);
  const coverUrl = dlsiteMeta?.rawCoverUrl || `https://img.dlsite.jp/modpub/images2/work/doujin/${bucket}/${cleanRj}_img_main.jpg`;

  // 1. Probe JapaneseASMR (weeab0o.xyz): First check primary MP3 & M3U8 in parallel (both 8-digit and stripped)
  const weeabCandidates = [
    { mp3: `https://v.weeab0o.xyz/${cleanRj}.mp3`, m3u8: `https://v.weeab0o.xyz/${cleanRj}.m3u8`, code: cleanRj },
    { mp3: `https://v.weeab0o.xyz/RJ${strippedNum}.mp3`, m3u8: `https://v.weeab0o.xyz/RJ${strippedNum}.m3u8`, code: `RJ${strippedNum}` }
  ];
  let hasM3u8 = false;
  const japTracks = [];

  const isWeeabValid = (res) => {
    if (!res || !res.status || res.status < 200 || res.status >= 400) return false;
    const ct = (res.headers['content-type'] || '').toLowerCase();
    if (ct.includes('text/html') || ct.includes('text/plain') || ct.includes('application/json')) return false;
    const sz = parseInt(res.headers['content-length'] || '0', 10);
    return sz > 50 * 1024 || ct.includes('audio') || ct.includes('video') || ct.includes('octet-stream');
  };

  for (const cand of weeabCandidates) {
    if (japTracks.length > 0) break;
    const [mainMp3Res, m3u8Res] = await Promise.all([
      axios.head(encodeURI(cand.mp3), {
        httpAgent,
        httpsAgent,
        headers: { 'Referer': 'https://japaneseasmr.com/', 'User-Agent': BROWSER_HEADERS['User-Agent'] },
        timeout: 3000,
        validateStatus: s => s >= 200 && s < 400
      }).catch(() => null),
      axios.get(cand.m3u8, {
        httpAgent,
        httpsAgent,
        headers: { 'Referer': 'https://japaneseasmr.com/', 'User-Agent': BROWSER_HEADERS['User-Agent'] },
        timeout: 3000,
        validateStatus: s => s >= 200 && s < 400
      }).catch(() => null)
    ]);

    if (isWeeabValid(mainMp3Res)) {
      const sz = parseInt(mainMp3Res.headers['content-length'] || '0', 10);
      japTracks.push({
        id: 1,
        title: 'Track 1 (トラック1)',
        size: sz,
        formattedTime: '00:00:00',
        startTime: 0,
        isHls: false,
        category: 'main',
        rawUrl: cand.mp3,
        referer: 'https://japaneseasmr.com/',
        streamUrl: `/stream?url=${encodeURIComponent(cand.mp3)}&referer=${encodeURIComponent('https://japaneseasmr.com/')}&rj=${encodeURIComponent(cleanRj)}`,
        poster: `/image-proxy?url=${encodeURIComponent(coverUrl)}`
      });

      // Only probe bonus & extra tracks if the primary MP3 actually exists
      const bonusCandidates = [
        { type: 'freetalk', title: 'Free Talk (フリートーク)', url: `https://v.weeab0o.xyz/${cand.code} freetalk.mp3` },
        { type: 'freetalk', title: 'Free Talk (フリートーク)', url: `https://v.weeab0o.xyz/${cand.code}_freetalk.mp3` },
        { type: 'freetalk', title: 'Free Talk (フリートーク)', url: `https://v.weeab0o.xyz/${cand.code}-freetalk.mp3` },
        { type: 'freetalk', title: 'Free Talk (フリートーク)', url: `https://v.weeab0o.xyz/${cand.code}freetalk.mp3` },
        { type: 'bonus', title: 'Omake (おまけ)', url: `https://v.weeab0o.xyz/${cand.code}omake.mp3` },
        { type: 'bonus', title: 'Omake (おまけ)', url: `https://v.weeab0o.xyz/${cand.code} omake.mp3` },
        { type: 'bonus', title: 'Omake (おまけ)', url: `https://v.weeab0o.xyz/${cand.code}_omake.mp3` },
        { type: 'bonus', title: 'Omake (おまけ)', url: `https://v.weeab0o.xyz/${cand.code}-omake.mp3` },
        { type: 'bonus', title: 'Bonus (特典)', url: `https://v.weeab0o.xyz/${cand.code} bonus.mp3` },
        { type: 'bonus', title: 'Bonus (特典)', url: `https://v.weeab0o.xyz/${cand.code}bonus.mp3` },
        { type: 'bonus', title: 'Bonus (特典)', url: `https://v.weeab0o.xyz/${cand.code}_bonus.mp3` },
        { type: 'main', title: 'Track 2 (トラック2)', url: `https://v.weeab0o.xyz/${cand.code} 2.mp3` },
        { type: 'main', title: 'Track 3 (トラック3)', url: `https://v.weeab0o.xyz/${cand.code} 3.mp3` },
        { type: 'main', title: 'Track 4 (トラック4)', url: `https://v.weeab0o.xyz/${cand.code} 4.mp3` },
        { type: 'main', title: 'Track 5 (トラック5)', url: `https://v.weeab0o.xyz/${cand.code} 5.mp3` },
        { type: 'main', title: 'Track 6 (トラック6)', url: `https://v.weeab0o.xyz/${cand.code} 6.mp3` },
        { type: 'main', title: 'Track 7 (トラック7)', url: `https://v.weeab0o.xyz/${cand.code} 7.mp3` },
        { type: 'main', title: 'Track 8 (トラック8)', url: `https://v.weeab0o.xyz/${cand.code} 8.mp3` },
        { type: 'main', title: 'Track 2 (トラック2)', url: `https://v.weeab0o.xyz/${cand.code}_2.mp3` },
        { type: 'main', title: 'Track 3 (トラック3)', url: `https://v.weeab0o.xyz/${cand.code}_3.mp3` },
        { type: 'main', title: 'Track 2 (トラック2)', url: `https://v.weeab0o.xyz/${cand.code}-2.mp3` },
        { type: 'main', title: 'Track 3 (トラック3)', url: `https://v.weeab0o.xyz/${cand.code}-3.mp3` }
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
            streamUrl: `/stream?url=${encodeURIComponent(b.url)}&referer=${encodeURIComponent('https://japaneseasmr.com/')}&rj=${encodeURIComponent(cleanRj)}`,
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
        rawUrl: cand.m3u8,
        referer: 'https://japaneseasmr.com/',
        streamUrl: `/stream?url=${encodeURIComponent(cand.m3u8)}&referer=${encodeURIComponent('https://japaneseasmr.com/')}&rj=${encodeURIComponent(cleanRj)}`,
        poster: `/image-proxy?url=${encodeURIComponent(coverUrl)}`
      });
    }
  }

  // 2. Fetch Ground-Truth Reference Tracks from ASMR.one
  let gtTracks = [];
  if (japTracks.length === 0) {
    try {
      const cleanNum = cleanRj.replace(/^(?:RJ|VJ|BJ)/i, '');
      const strippedNum = cleanNum.replace(/^0+/, '');
      const trackIdsToTry = Array.from(new Set([strippedNum, cleanNum])).filter(Boolean);
      const apiHosts = ['https://api.asmr-200.com', 'https://api.asmr-300.com', 'https://api.asmr.one'];
      for (const tid of trackIdsToTry) {
        for (const host of apiHosts) {
          try {
            const asmrRes = await axios.get(`${host}/api/tracks/${tid}`, {
              httpAgent,
              httpsAgent,
              headers: { 'User-Agent': BROWSER_HEADERS['User-Agent'], 'Accept': 'application/json' },
              timeout: 3000
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
                  const streamCandidateUrl = item.mediaStreamUrl || item.streamLowQualityUrl || item.mediaDownloadUrl || item.downloadUrl || item.streamUrl || item.url || (item.hash ? `${host}/api/media/stream/${item.hash}` : '');
                  if ((type === 'audio' || /\.(mp3|wav|flac|m4a|aac|ogg|opus)$/i.test(title)) && dur > 0 && !isSamp(title)) {
                    let cat = 'main';
                    if (isTalk(title) || isTalk(folder)) cat = 'freetalk';
                    else if (isBonus(title) || isBonus(folder)) cat = 'bonus';
                    audioList.push({
                      title: title.replace(/\.[a-zA-Z0-9]+$/, '').trim(),
                      duration: dur,
                      formattedTime: formatServerTime(dur),
                      category: cat,
                      folder: folder,
                      url: streamCandidateUrl
                    });
                  }
                  if (Array.isArray(item.children) && item.children.length > 0) {
                    trav(item.children, folder ? `${folder}/${title}` : title);
                  }
                }
              };
              trav(asmrRes.data);
              if (audioList.length > 0) {
                const hasMp3 = audioList.some(a => (a.folder || '').includes('MP3') || /\.(mp3)$/i.test(a.url || ''));
                let filteredAudioList = audioList;
                if (hasMp3) {
                  filteredAudioList = audioList.filter(a => (a.folder || '').includes('MP3') || !((a.folder || '').includes('WAV') || (a.folder || '').includes('FLAC')));
                }
                const isConcat = (str) => /(全て|すべて|一括|まとめ|つなげた|つなぎ|full\s*(ver|track|session)?|all\s*tracks|complete)/i.test(str || '');
                const hasDiscrete = filteredAudioList.some(a => !isConcat(a.title) && !isConcat(a.folder));
                const uniqueMap = new Map();
                for (const item of filteredAudioList) {
                  if (hasDiscrete && (isConcat(item.title) || isConcat(item.folder))) continue;
                  const key = item.title.toLowerCase().replace(/\s+/g, '');
                  if (!uniqueMap.has(key)) {
                    uniqueMap.set(key, item);
                  }
                }
                gtTracks = Array.from(uniqueMap.values());
                break;
              }
            }
          } catch (e) {}
          if (gtTracks.length > 0) break;
        }
        if (gtTracks.length > 0) break;
      }
    } catch (e) {}
  }

  // 3. Concurrently Probe HentaiASMR Moe Audio Tracks (Pure API + Direct Media CDN)
  const moeTracks = [];
  let moeMeta = null;
  try {
    const skipMoeAudio = false;
    moeMeta = await fetchHentaiAsmrMetadata(cleanRj, { skipAudioProbe: skipMoeAudio });
    if (moeMeta && Array.isArray(moeMeta.audioTracks) && moeMeta.audioTracks.length > 0) {
      await Promise.all(moeMeta.audioTracks.map(async (t) => {
        try {
          const probeRef = moeMeta.postLink || 'https://hentaiasmr.moe/';
          let mHead = null;
          try {
            mHead = await axios.get(t.streamUrl, {
              headers: {
                ...BROWSER_HEADERS,
                'Referer': probeRef,
                'Origin': 'https://hentaiasmr.moe',
                'Range': 'bytes=0-0'
              },
              timeout: 4000,
              maxRedirects: 3,
              validateStatus: s => s >= 200 && s < 400
            });
          } catch (e) {
            try {
              mHead = await axios.head(t.streamUrl, {
                headers: { ...BROWSER_HEADERS, 'Referer': probeRef, 'Origin': 'https://hentaiasmr.moe' },
                timeout: 3000,
                maxRedirects: 3
              });
            } catch (e2) {}
          }
          if (mHead && mHead.headers) {
            const cr = mHead.headers['content-range'] || '';
            if (cr) {
              const m = cr.match(/\/(\d+)/);
              if (m) t._size = parseInt(m[1], 10);
            }
            if (!t._size) {
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

        if (!trackDur && moeMeta.duration > 0 && moeMeta.audioTracks.length === 1) {
          trackDur = moeMeta.duration;
        } else if (!trackDur && t._size) {
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
          referer: moeMeta.postLink || `https://hentaiasmr.moe/${cleanRj.toLowerCase()}.html`,
          streamUrl: `/stream?url=${encodeURIComponent(t.streamUrl)}&referer=${encodeURIComponent(moeMeta.postLink || `https://hentaiasmr.moe/${cleanRj.toLowerCase()}.html`)}&rj=${encodeURIComponent(cleanRj)}`,
          poster: `/image-proxy?url=${encodeURIComponent(coverUrl)}`
        });
      });

      // Filter out redundant combined/all-in-one track if discrete split tracks exist
      if (hasCombinedTrack || moeTracks.some(t => t.isCombinedAllInOne)) {
        const discreteMoeTracks = moeTracks.filter(t => !t.isCombinedAllInOne);
        if (discreteMoeTracks.length > 0) {
          discreteMoeTracks.forEach((t, i) => {
            t.id = i + 1;
          });
          moeTracks.length = 0;
          moeTracks.push(...discreteMoeTracks);
        }
      }

      // Post-processing deduplication for mirror CDN links
      if (moeTracks.length > 1) {
        const distinctKeys = new Set(moeTracks.map(t => (t.rawUrl || '').replace(/^https?:\/\/[^\/]+/i, '').replace(/[#?].*$/, '').toLowerCase().trim()));
        if (distinctKeys.size === 1) {
          moeTracks.splice(1);
          moeTracks[0].id = 1;
          moeTracks[0].title = title ? `${cleanRj || title} (Full)` : 'Track 1';
        }
      }
    }
  } catch (e) {}

  // Probe DLsite Chobit official preview audio
  const chobitTracks = await fetchChobitSampleTracks(cleanRj);

  // Ground-truth and ASMR.one track tree audio streams
  const asmrTracks = gtTracks.filter(t => Boolean(t.url)).map((t, idx) => ({
    id: idx + 1,
    title: t.title || `Track ${idx + 1}`,
    duration: t.duration || 0,
    formattedTime: formatServerTime(t.duration || 0),
    startTime: 0,
    isHls: false,
    category: t.category || 'main',
    rawUrl: t.url,
    referer: 'https://www.asmr.one/',
    streamUrl: `/stream?url=${encodeURIComponent(t.url)}&referer=${encodeURIComponent('https://www.asmr.one/')}&rj=${encodeURIComponent(cleanRj)}`,
    poster: `/image-proxy?url=${encodeURIComponent(coverUrl)}`
  }));

  // 4. Source Selection: Multi-track JapaneseASMR > Multi-track Moe > Multi-track ASMR.one > Single-track JapaneseASMR > Single-track Moe > Single-track ASMR.one > Chobit Preview
  let tracks = [];
  let selectedSource = '';
  let hasLazyAudio = false;

  if (japTracks.length > 1) {
    tracks = japTracks;
    selectedSource = (tracks[0] && tracks[0].isHls) ? 'JapaneseASMR (HLS Stream)' : 'JapaneseASMR (Multi-Track MP3)';
    hasLazyAudio = false;
  } else if (moeTracks.length > 1) {
    tracks = moeTracks;
    selectedSource = 'HentaiASMR Moe (Multi-Track MP3)';
    hasLazyAudio = false;
    hasHls = false;
  } else if (asmrTracks.length > 1) {
    tracks = asmrTracks;
    selectedSource = 'ASMR.one (Multi-Track Audio Stream)';
    hasLazyAudio = false;
    hasHls = false;
  } else if (japTracks.length === 1) {
    tracks = japTracks;
    selectedSource = (tracks[0] && tracks[0].isHls) ? 'JapaneseASMR (HLS Stream)' : 'JapaneseASMR (Discrete MP3 track)';
    hasLazyAudio = false;
  } else if (moeTracks.length === 1) {
    tracks = moeTracks;
    selectedSource = 'HentaiASMR Moe (Discrete MP3 track)';
    hasLazyAudio = false;
    hasHls = false;
  } else if (asmrTracks.length === 1) {
    tracks = asmrTracks;
    selectedSource = 'ASMR.one (Discrete Audio Stream)';
    hasLazyAudio = false;
    hasHls = false;
  } else if (moeMeta?.isAudioFound) {
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
  } else if (chobitTracks.length > 0) {
    tracks = [];
    selectedSource = 'DLsite Official Sample Audio (Chobit CDN)';
    hasLazyAudio = false;
  } else if (title && !isPlaceholderTitle(title, cleanRj)) {
    tracks = [];
    selectedSource = 'DLsite Official Metadata (Preview / Sample Clips Only)';
    hasLazyAudio = false;
  } else {
    throw new Error(`Work ${cleanRj} not found on JapaneseASMR, HentaiASMR Moe, ASMR.one, or DLsite Chobit`);
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
      sampleUrl: hasLazyAudio ? null : (moeTracks.length > 0 ? moeTracks[0].rawUrl : null)
    },
    dlsiteChobit: {
      found: chobitTracks.length > 0,
      trackCount: chobitTracks.length,
      sampleUrl: chobitTracks.length > 0 ? chobitTracks[0].rawUrl : null
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
    title,
    circle,
    cv,
    releaseDate: dlsiteMeta?.releaseDate || '',
    tags,
    tagTranslations,
    coverUrl,
    rawCoverUrl: coverUrl,
    hasHls,
    hasLazyAudio,
    totalTracks: tracks.length,
    selectedSource,
    tracks,
    sampleTracks: chobitTracks,
    sources: sourcesBreakdown,
    source: 'RESOLVED',
    moeDiagnostic: diag
  };
}

// Extract exact JWPlayer audio playlist from Moe post HTML
function extractMoeHtmlTracks(html, postLink, coverUrl, title, rjCode = '') {
  const tracks = [];
  if (!html) return tracks;
  const cleanRj = (rjCode || '').toUpperCase();
  const cleanLower = (rjCode || '').toLowerCase();
  const pageReferer = postLink || (cleanLower ? `https://hentaiasmr.moe/${cleanLower}.html` : 'https://hentaiasmr.moe/');

  // Ground-truth ISO 8601 duration in page HTML (e.g. PT02H21M44S)
  let htmlDuration = 0;
  const isoDurMatch = html.match(/itemprop=["']duration["']\s+content=["']PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?["']/i) ||
                      html.match(/"duration"\s*:\s*["']PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?["']/i) ||
                      html.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i);
  if (isoDurMatch && (isoDurMatch[1] || isoDurMatch[2] || isoDurMatch[3])) {
    const h = parseInt(isoDurMatch[1] || '0', 10);
    const m = parseInt(isoDurMatch[2] || '0', 10);
    const s = parseInt(isoDurMatch[3] || '0', 10);
    htmlDuration = h * 3600 + m * 60 + s;
  }

  const normalizeMoeAudioKey = (u) => {
    if (!u || typeof u !== 'string') return '';
    return u
      .replace(/^https?:\/\/[^\/]+/i, '') // strip protocol & host domain (cdn, cdn16, cdn-otome)
      .replace(/[#?].*$/, '')              // strip query params & hashes
      .toLowerCase()
      .trim();
  };

  const isDuplicateTrack = (candidateUrl) => {
    const candidateKey = normalizeMoeAudioKey(candidateUrl);
    if (!candidateKey) return true;
    return tracks.some(t => normalizeMoeAudioKey(t.rawUrl) === candidateKey);
  };

  // Pattern 1: JWPlayer setup direct file or playlist
  const jwSetupRegex = /jwplayer\([^)]*\)\.setup\(\s*\{[\s\S]*?file\s*:\s*["']([^"']+)["']/gi;
  let match;
  while ((match = jwSetupRegex.exec(html)) !== null) {
    let fUrl = match[1].replace(/\\\//g, '/').replace(/&amp;/g, '&').trim();
    if (fUrl.startsWith('//')) fUrl = 'https:' + fUrl;
    if (/\.(?:mp3|m4a|wav|ogg|flac|m3u8)(?:\?.*)?$/i.test(fUrl)) {
      if (!isDuplicateTrack(fUrl)) {
        const trkNum = tracks.length + 1;
        const trkTitle = title ? `${cleanRj || title} (Full)` : `Track ${trkNum}`;
        tracks.push({
          id: trkNum,
          title: trkTitle,
          rawUrl: fUrl,
          streamUrl: `/stream?url=${encodeURIComponent(fUrl)}&referer=${encodeURIComponent(pageReferer)}&rj=${encodeURIComponent(cleanRj)}`,
          category: 'main',
          formattedTime: htmlDuration > 0 ? formatServerTime(htmlDuration) : '00:00:00',
          duration: htmlDuration,
          size: 0,
          isHls: fUrl.toLowerCase().includes('.m3u8'),
          poster: coverUrl ? `/image-proxy?url=${encodeURIComponent(coverUrl)}` : ''
        });
      }
    }
  }

  // Pattern 2: Any JWPlayer file object { file: "...", title: "..." }
  const fileObjRegex = /\{\s*(?:file|src)\s*:\s*["']([^"']+)["'](?:[^{}]*?title\s*:\s*["']([^"']+)["'])?[^}]*\}/gi;
  while ((match = fileObjRegex.exec(html)) !== null) {
    let fUrl = match[1].replace(/\\\//g, '/').replace(/&amp;/g, '&').trim();
    if (fUrl.startsWith('//')) fUrl = 'https:' + fUrl;
    if (/\.(?:mp3|m4a|wav|ogg|flac|m3u8)(?:\?.*)?$/i.test(fUrl)) {
      if (!isDuplicateTrack(fUrl)) {
        const trkNum = tracks.length + 1;
        const trkTitle = match[2] ? match[2].trim() : (title ? `${String(trkNum).padStart(2, '0')}. Track ${trkNum}` : `Track ${trkNum}`);
        tracks.push({
          id: trkNum,
          title: trkTitle,
          rawUrl: fUrl,
          streamUrl: `/stream?url=${encodeURIComponent(fUrl)}&referer=${encodeURIComponent(pageReferer)}&rj=${encodeURIComponent(cleanRj)}`,
          category: /(?:フリートーク|free[\s_-]?talk|talk)/i.test(trkTitle) ? 'freetalk' : (/(?:おまけ|bonus|特典|omake)/i.test(trkTitle) ? 'bonus' : 'main'),
          formattedTime: htmlDuration > 0 && tracks.length === 0 ? formatServerTime(htmlDuration) : '00:00:00',
          duration: tracks.length === 0 ? htmlDuration : 0,
          size: 0,
          isHls: fUrl.toLowerCase().includes('.m3u8'),
          poster: coverUrl ? `/image-proxy?url=${encodeURIComponent(coverUrl)}` : ''
        });
      }
    }
  }

  // Pattern 3: playlist.push({ file: '...', title: '...' })
  const itemRegex = /playlist\.push\(\s*\{([\s\S]*?)\}\s*\);/gi;
  while ((match = itemRegex.exec(html)) !== null) {
    const block = match[1];
    const fileM = block.match(/file\s*:\s*["']([^"']+)["']/i);
    const titleM = block.match(/title\s*:\s*["']([^"']+)["']/i);
    if (fileM) {
      let fUrl = fileM[1].replace(/\\\//g, '/').replace(/&amp;/g, '&').trim();
      if (fUrl.startsWith('//')) fUrl = 'https:' + fUrl;
      if (!isDuplicateTrack(fUrl)) {
        const trkNum = tracks.length + 1;
        const tTitle = titleM ? titleM[1].trim() : `Track ${trkNum}`;
        tracks.push({
          id: trkNum,
          title: tTitle,
          rawUrl: fUrl,
          streamUrl: `/stream?url=${encodeURIComponent(fUrl)}&referer=${encodeURIComponent(pageReferer)}&rj=${encodeURIComponent(cleanRj)}`,
          category: /(?:フリートーク|free[\s_-]?talk|talk)/i.test(tTitle) ? 'freetalk' : (/(?:おまけ|bonus|特典|omake)/i.test(tTitle) ? 'bonus' : 'main'),
          formattedTime: '00:00:00',
          duration: 0,
          size: 0,
          isHls: fUrl.toLowerCase().includes('.m3u8'),
          poster: coverUrl ? `/image-proxy?url=${encodeURIComponent(coverUrl)}` : ''
        });
      }
    }
  }

  // Pattern 4: Button tracking link: <a class="button-track" ... href="...">
  const buttonTrackRegex = /<a\b[^>]*class=["'][^"']*button-track[^"']*["'][^>]*href=["']([^"']+)["']/gi;
  while ((match = buttonTrackRegex.exec(html)) !== null) {
    let fUrl = match[1].replace(/\\\//g, '/').replace(/&amp;/g, '&').trim();
    if (fUrl.startsWith('//')) fUrl = 'https:' + fUrl;
    if (/\.(?:mp3|m4a|wav|ogg|flac|m3u8)(?:\?.*)?$/i.test(fUrl)) {
      if (!isDuplicateTrack(fUrl)) {
        const trkNum = tracks.length + 1;
        const trkTitle = title ? `${cleanRj || title} (Full)` : `Track ${trkNum}`;
        tracks.push({
          id: trkNum,
          title: trkTitle,
          rawUrl: fUrl,
          streamUrl: `/stream?url=${encodeURIComponent(fUrl)}&referer=${encodeURIComponent(pageReferer)}&rj=${encodeURIComponent(cleanRj)}`,
          category: 'main',
          formattedTime: htmlDuration > 0 ? formatServerTime(htmlDuration) : '00:00:00',
          duration: htmlDuration,
          size: 0,
          isHls: fUrl.toLowerCase().includes('.m3u8'),
          poster: coverUrl ? `/image-proxy?url=${encodeURIComponent(coverUrl)}` : ''
        });
      }
    }
  }

  // Pattern 5: Direct CDN audio links in script/content (e.g. cdn.hentaiasmr.moe/mf/...)
  const directAudioRegex = /https?:\/\/cdn(?:16|-otome)?\.hentaiasmr\.moe\/[^\s"'<>]+\.(?:mp3|m4a|wav|ogg|flac|m3u8)/gi;
  let dMatch;
  while ((dMatch = directAudioRegex.exec(html)) !== null) {
    let fUrl = dMatch[0].replace(/\\\//g, '/').replace(/&amp;/g, '&').trim();
    if (!isDuplicateTrack(fUrl)) {
      const trkNum = tracks.length + 1;
      const trkTitle = title ? `${String(trkNum).padStart(2, '0')}. Track ${trkNum}` : `Track ${trkNum}`;
      tracks.push({
        id: trkNum,
        title: trkTitle,
        rawUrl: fUrl,
        streamUrl: `/stream?url=${encodeURIComponent(fUrl)}&referer=${encodeURIComponent(pageReferer)}&rj=${encodeURIComponent(cleanRj)}`,
        category: trkNum === 1 ? 'main' : (trkNum === 2 ? 'freetalk' : 'bonus'),
        formattedTime: htmlDuration > 0 && tracks.length === 0 ? formatServerTime(htmlDuration) : '00:00:00',
        duration: tracks.length === 0 ? htmlDuration : 0,
        size: 0,
        isHls: fUrl.toLowerCase().includes('.m3u8'),
        poster: coverUrl ? `/image-proxy?url=${encodeURIComponent(coverUrl)}` : ''
      });
    }
  }

  // Pattern 6: <audio> / <source> / schema contentURL / contentUrl
  const audioRegex = /(?:<source[^>]+src=["']|<audio[^>]+src=["']|"(?:contentURL|contentUrl)"\s*:\s*["']|itemprop=["']contentURL["']\s+content=["'])(https?:\/\/[^\s"'<>]+\.(?:mp3|m4a|wav|ogg|flac|m3u8))/gi;
  while ((match = audioRegex.exec(html)) !== null) {
    let fUrl = match[1].replace(/\\\//g, '/').replace(/&amp;/g, '&').trim();
    if (!isDuplicateTrack(fUrl)) {
      const trkNum = tracks.length + 1;
      tracks.push({
        id: trkNum,
        title: title ? `${String(trkNum).padStart(2, '0')}. Track ${trkNum}` : `Track ${trkNum}`,
        rawUrl: fUrl,
        streamUrl: `/stream?url=${encodeURIComponent(fUrl)}&referer=${encodeURIComponent(pageReferer)}&rj=${encodeURIComponent(cleanRj)}`,
        category: 'main',
        formattedTime: htmlDuration > 0 && tracks.length === 0 ? formatServerTime(htmlDuration) : '00:00:00',
        duration: tracks.length === 0 ? htmlDuration : 0,
        size: 0,
        isHls: fUrl.toLowerCase().includes('.m3u8'),
        poster: coverUrl ? `/image-proxy?url=${encodeURIComponent(coverUrl)}` : ''
      });
    }
  }

  // Post-processing: If multiple single-track full audio URLs were extracted (e.g. /audio/ID.mp3 vs /mp4/ID.mp3)
  if (tracks.length > 1) {
    const allAreFullTracks = tracks.every(t => {
      const u = (t.rawUrl || '').toLowerCase();
      return u.includes('/audio/') || u.includes('/mp4/') || u.includes('/merge/') || (t.title && t.title.toLowerCase().includes('(full)'));
    });
    if (allAreFullTracks) {
      const distinctFilenames = new Set(tracks.map(t => {
        const parts = (t.rawUrl || '').split('/');
        return parts[parts.length - 1].toLowerCase();
      }));
      if (distinctFilenames.size === 1) {
        tracks.splice(1);
        tracks[0].id = 1;
        tracks[0].title = title ? `${cleanRj || title} (Full)` : 'Track 1';
      }
    }
  }

  if (tracks.length === 1 && htmlDuration > 0 && (!tracks[0].duration || tracks[0].duration === 0)) {
    tracks[0].duration = htmlDuration;
    tracks[0].formattedTime = formatServerTime(htmlDuration);
  }

  return tracks;
}

// On-demand lazy resolution: Fetches Moe post HTML and extracts exact tracks
async function resolveLazyWorkAudio(work) {
  if (!work) return null;
  const cleanRj = (work.rjCode || '').toUpperCase();
  const cleanLower = (work.rjCode || '').toLowerCase();
  const cleanNum = cleanRj.replace(/^(?:RJ|VJ|BJ)/i, '');
  const strippedNum = cleanNum.replace(/^0+/, '');
  const strippedLower = `rj${strippedNum}`;

  const candidatePages = [
    work.postLink,
    `https://hentaiasmr.moe/${cleanLower}.html`,
    `https://hentaiasmr.moe/${strippedLower}.html`,
    `https://hentaiasmr.moe/${cleanRj}.html`,
    `https://hentaiasmr.moe/RJ${strippedNum}.html`
  ].filter(Boolean);

  for (const pageUrl of candidatePages) {
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
        const extractedTracks = extractMoeHtmlTracks(res.data, pageUrl, work.rawCoverUrl || work.coverUrl, work.title, cleanRj);
        if (extractedTracks && extractedTracks.length > 0) {
          work.tracks = extractedTracks;
          work.hasLazyAudio = false;
          work.totalTracks = extractedTracks.length;
          work.hasHls = extractedTracks.some(t => t.isHls);
          return work;
        }
      }
    } catch (e) {}
  }

  // Fallback to ASMR.one / Chapters if Moe page didn't have tracks
  try {
    const chapData = await fetchChaptersAndGallery(cleanRj, false, work.totalDuration || 0);
    if (chapData && Array.isArray(chapData.audioTracks) && chapData.audioTracks.length > 0) {
      work.tracks = chapData.audioTracks.map((t, idx) => ({
        id: idx + 1,
        title: t.title || ('Track ' + (idx + 1)),
        duration: t.duration || 0,
        formattedTime: formatServerTime(t.duration || 0),
        startTime: 0,
        isHls: false,
        rawUrl: t.url,
        referer: 'https://www.asmr.one/',
        streamUrl: `/stream?url=${encodeURIComponent(t.url)}&referer=${encodeURIComponent('https://www.asmr.one/')}&rj=${encodeURIComponent(cleanRj)}`,
        poster: work.coverUrl || ''
      }));
      work.hasLazyAudio = false;
      work.totalTracks = work.tracks.length;
      work.hasHls = false;
      if (Array.isArray(chapData.chapters) && chapData.chapters.length > 0) {
        work.chapters = chapData.chapters;
      }
      return work;
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
          url: fullUrl || (item.hash ? `${defaultHost}/api/media/stream/${item.hash}` : (rawUrl || ''))
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

async function fetchChobitSampleTracks(cleanRj) {
  const cleanUpper = (cleanRj || '').toUpperCase().trim();
  if (!cleanUpper) return [];
  try {
    const apiUrl = `https://chobit.cc/api/v1/dlsite/embed?workno=${cleanUpper}`;
    const apiRes = await axios.get(apiUrl, {
      httpAgent,
      httpsAgent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://www.dlsite.com/',
        'Accept': 'application/json, text/plain, */*'
      },
      timeout: 6000,
      validateStatus: s => s >= 200 && s < 400
    });
    if (!apiRes.data || !Array.isArray(apiRes.data.works) || apiRes.data.works.length === 0) return [];
    const workInfo = apiRes.data.works[0];
    if (!workInfo || !workInfo.embed_url) return [];

    const embedRes = await axios.get(workInfo.embed_url, {
      httpAgent,
      httpsAgent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://www.dlsite.com/',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 6000,
      validateStatus: s => s >= 200 && s < 400
    });
    const html = embedRes.data || '';
    const tracks = [];

    // Audio preview tracks: <li data-title="..." data-src="..." data-playtime="...">
    const liRegex = /<li\s+[^>]*data-title="([^"]+)"[^>]*data-src="([^"]+)"[^>]*data-playtime="([^"]+)"[^>]*>/gi;
    let match;
    let idx = 1;
    while ((match = liRegex.exec(html)) !== null) {
      const rawTitle = match[1].trim();
      const rawSrc = match[2].trim();
      const playtimeStr = match[3].trim();

      let durSecs = 0;
      const parts = playtimeStr.split(':').map(p => parseInt(p, 10) || 0);
      if (parts.length === 2) durSecs = parts[0] * 60 + parts[1];
      else if (parts.length === 3) durSecs = parts[0] * 3600 + parts[1] * 60 + parts[2];

      tracks.push({
        id: idx++,
        title: rawTitle,
        duration: durSecs,
        formattedTime: playtimeStr,
        startTime: 0,
        isHls: false,
        isSamplePreview: true,
        category: 'sample',
        rawUrl: rawSrc,
        referer: 'https://chobit.cc/',
        streamUrl: `/stream?url=${encodeURIComponent(rawSrc)}&referer=${encodeURIComponent('https://chobit.cc/')}`,
        poster: workInfo.thumb || ''
      });
    }

    // Fallback: video sample
    if (tracks.length === 0) {
      const videoM = html.match(/contentUrl"\s+content="([^"]+\.mp4)"/i) || html.match(/data-src="([^"]+\.mp4)"/i);
      if (videoM && videoM[1]) {
        tracks.push({
          id: 1,
          title: workInfo.work_name ? `01. ${workInfo.work_name} (Sample Preview)` : '01. Sample Preview',
          duration: 0,
          formattedTime: '00:00',
          startTime: 0,
          isHls: false,
          isSamplePreview: true,
          category: 'sample',
          rawUrl: videoM[1],
          referer: 'https://chobit.cc/',
          streamUrl: `/stream?url=${encodeURIComponent(videoM[1])}&referer=${encodeURIComponent('https://chobit.cc/')}`,
          poster: workInfo.thumb || ''
        });
      }
    }

    return tracks;
  } catch (e) {
    return [];
  }
}

async function probeDlsiteAndWeeabGallery(cleanRj) {
  const cleanUpper = (cleanRj || '').toUpperCase().trim();
  const canonicalRj = getCanonicalDlsiteRj(cleanUpper);
  const cleanNum = cleanUpper.replace(/^(?:RJ|VJ|BJ)/i, '');
  const strippedNum = cleanNum.replace(/^0+/, '');
  const bucket = getDlsiteCoverBucket(canonicalRj);
  const candidates = [];

  // 1. DLsite Doujin: High-res main illustration
  const dlsiteDoujin = { key: 'doujin', label: 'DLsite Doujin' };
  const dlsiteMainUrl = `https://img.dlsite.jp/modpub/images2/work/${dlsiteDoujin.key}/${bucket}/${canonicalRj}_img_main.jpg`;
  candidates.push({
    title: 'Main Package Artwork',
    role: 'main_cover',
    source: dlsiteDoujin.label,
    url: dlsiteMainUrl,
    proxyUrl: `/image-proxy?url=${encodeURIComponent(dlsiteMainUrl)}`
  });

  // DLsite Doujin: sample pages 1-8 (standard primary format: _img_smpX.jpg)
  for (let i = 1; i <= 8; i++) {
    candidates.push({
      title: `Sample Illustration #${i}`,
      role: `sample_${i}`,
      source: dlsiteDoujin.label,
      url: `https://img.dlsite.jp/modpub/images2/work/${dlsiteDoujin.key}/${bucket}/${canonicalRj}_img_smp${i}.jpg`,
      proxyUrl: `/image-proxy?url=${encodeURIComponent(`https://img.dlsite.jp/modpub/images2/work/${dlsiteDoujin.key}/${bucket}/${canonicalRj}_img_smp${i}.jpg`)}`
    });
  }

  try {
    let validList = [];
    const chunkSize = 4;

    for (let i = 0; i < candidates.length; i += chunkSize) {
      const chunk = candidates.slice(i, i + chunkSize);
      const results = await Promise.all(
        chunk.map(async (item) => {
          try {
            const headers = {
              'Referer': 'https://www.dlsite.com/',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              'Range': 'bytes=0-0',
              'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
            };
            const res = await axios({
              method: 'get',
              url: item.url,
              headers,
              httpAgent,
              httpsAgent,
              timeout: 4000,
              validateStatus: (status) => (status >= 200 && status < 400)
            });
            if (res.status >= 200 && res.status < 400) {
              const cl = res.headers ? (res.headers['content-range'] ? (res.headers['content-range'].match(/\/(\d+)/) || [])[1] : (res.headers['content-length'] || '')) : '';
              const et = res.headers ? (res.headers['etag'] || '') : '';
              return { ...item, contentLength: cl ? parseInt(cl, 10) : null, etag: et };
            }
          } catch (e) {}
          return null;
        })
      );
      results.filter(Boolean).forEach(r => validList.push(r));
    }

    const hasDlsite = validList.some(v => v.source && v.source.includes('DLsite'));

    // If 0 DLsite doujin images were found, try other DLsite categories (pro, books, girls, bl, ai)
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
          url: `https://img.dlsite.jp/modpub/images2/work/${cat.key}/${bucket}/${canonicalRj}_img_main.jpg`,
          proxyUrl: `/image-proxy?url=${encodeURIComponent(`https://img.dlsite.jp/modpub/images2/work/${cat.key}/${bucket}/${canonicalRj}_img_main.jpg`)}`
        });
        for (let i = 1; i <= 4; i++) {
          altCandidates.push({
            title: `Sample Illustration #${i}`,
            role: `sample_${i}`,
            source: cat.label,
            url: `https://img.dlsite.jp/modpub/images2/work/${cat.key}/${bucket}/${canonicalRj}_img_smp${i}.jpg`,
            proxyUrl: `/image-proxy?url=${encodeURIComponent(`https://img.dlsite.jp/modpub/images2/work/${cat.key}/${bucket}/${canonicalRj}_img_smp${i}.jpg`)}`
          });
        }
      }
      const altChecked = await Promise.all(
        altCandidates.map(async (item) => {
          try {
            const res = await axios({
              method: 'get',
              url: item.url,
              headers: { 'Referer': 'https://www.dlsite.com/', 'User-Agent': 'Mozilla/5.0', 'Range': 'bytes=0-0', 'Accept': 'image/*,*/*' },
              timeout: 3000,
              validateStatus: (status) => status >= 200 && status < 400
            });
            if (res.status >= 200 && res.status < 400) {
              const cl = res.headers ? (res.headers['content-range'] ? (res.headers['content-range'].match(/\/(\d+)/) || [])[1] : (res.headers['content-length'] || '')) : '';
              const et = res.headers ? (res.headers['etag'] || '') : '';
              return { ...item, contentLength: cl ? parseInt(cl, 10) : null, etag: et };
            }
          } catch (e) {}
          return null;
        })
      );
      validList = validList.concat(altChecked.filter(Boolean));
    }

    // Only probe Weeab0o mirrors if no DLsite samples were found
    const hasDlsiteSamples = validList.some(v => v.role && v.role.startsWith('sample_'));
    if (!hasDlsiteSamples) {
      const weeabCandidates = [];
      for (let i = 1; i <= 4; i++) {
        weeabCandidates.push({
          title: `Sample Artwork #${i}`,
          role: `sample_${i}`,
          source: 'Weeab0o',
          url: `https://pic.weeabo0.xyz/${canonicalRj}_img_smp${i}.jpg`,
          proxyUrl: `/image-proxy?url=${encodeURIComponent(`https://pic.weeabo0.xyz/${canonicalRj}_img_smp${i}.jpg`)}`
        });
      }
      const weeabChecked = await Promise.all(
        weeabCandidates.map(async (item) => {
          try {
            const res = await axios({
              method: 'get',
              url: item.url,
              headers: { 'Referer': 'https://japaneseasmr.com/', 'User-Agent': 'Mozilla/5.0', 'Range': 'bytes=0-0', 'Accept': 'image/*,*/*' },
              timeout: 3000,
              validateStatus: (status) => status >= 200 && status < 400
            });
            if (res.status >= 200 && res.status < 400) {
              const cl = res.headers ? (res.headers['content-range'] ? (res.headers['content-range'].match(/\/(\d+)/) || [])[1] : (res.headers['content-length'] || '')) : '';
              const et = res.headers ? (res.headers['etag'] || '') : '';
              return { ...item, contentLength: cl ? parseInt(cl, 10) : null, etag: et };
            }
          } catch (e) {}
          return null;
        })
      );
      validList = validList.concat(weeabChecked.filter(Boolean));
    }

    // Deduplicate by role (keep 1 item per role)
    const seenRoles = new Set();
    const roleFiltered = [];
    for (const item of validList) {
      if (item.role) {
        if (seenRoles.has(item.role)) continue;
        seenRoles.add(item.role);
      }
      roleFiltered.push(item);
    }

    return dedupeGalleryByImageSize(roleFiltered);
  } catch (e) {
    return [];
  }
}

function dedupeGalleryByImageSize(galleryList) {
  if (!Array.isArray(galleryList) || galleryList.length === 0) return [];
  const result = [];
  const seenUrls = new Set();
  const seenTitles = new Set();
  const keptSizes = [];

  for (const item of galleryList) {
    if (!item || !item.url) continue;
    if (seenUrls.has(item.url)) continue;

    const normTitle = (item.title || '').trim().toLowerCase();
    if (normTitle && seenTitles.has(normTitle) && (item.role === 'main_cover' || item.source === 'DLsite Doujin')) {
      continue;
    }

    const size = (typeof item.contentLength === 'number' && item.contentLength > 0) ? item.contentLength : null;

    if (size !== null) {
      const isDuplicate = keptSizes.some(k => {
        const diff = Math.abs(k.size - size);
        const max = Math.max(k.size, size);
        return max > 0 && (diff / max) <= 0.0001;
      });

      if (isDuplicate) {
        continue;
      }

      keptSizes.push({ size, item });
    }

    seenUrls.add(item.url);
    if (normTitle) seenTitles.add(normTitle);
    result.push(item);
  }

  return result;
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
      const size = (typeof node.size === 'number' && node.size > 0) ? node.size : ((typeof node.fileSize === 'number' && node.fileSize > 0) ? node.fileSize : null);
      if (rawUrl && !seenUrls.has(rawUrl)) {
        seenUrls.add(rawUrl);
        images.push({
          title: title.replace(/\.[a-zA-Z0-9]+$/, ''),
          folder: folderPath || 'Root',
          source: 'ASMR.one',
          url: rawUrl,
          proxyUrl: `/image-proxy?url=${encodeURIComponent(rawUrl)}`,
          contentLength: size
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
            break;
          }
        }
      } catch (e) {}
    }
    if (parsed.chapters.length > 0 || extractedArtworks.length > 0 || (parsed.audioTracks && parsed.audioTracks.length > 0)) {
      break;
    }
  }

  // 2. Query ASMR.one /api/work/:id metadata for fallback official cover if needed
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
          if (wData && wData.mainCoverUrl) {
            extractedArtworks.push({
              title: 'Official Cover / CD Jacket',
              source: 'ASMR.one',
              url: wData.mainCoverUrl,
              proxyUrl: `/image-proxy?url=${encodeURIComponent(wData.mainCoverUrl)}`
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
    cleanExtractedArt = extractedArtworks.filter(a => a.title !== 'Official Cover / CD Jacket');
  }

  // Filter out any stray blurry sample preview banners
  const combinedGallery = [...cleanExtractedArt, ...sampleImages].filter(item => {
    if (!item) return false;
    const t = (item.title || '').toLowerCase();
    const u = (item.url || '').toLowerCase();
    if (t.includes('sample preview') || t.includes('banner') || u.includes('_img_sam') || u.includes('_sam.')) return false;
    return true;
  });

  parsed.gallery = dedupeGalleryByImageSize(combinedGallery);

  // 4. Probe DLsite Chobit official preview audio tracks
  try {
    const chobitSampleTracks = await fetchChobitSampleTracks(cleanUpper);
    parsed.sampleTracks = chobitSampleTracks;
  } catch (e) {
    parsed.sampleTracks = [];
  }

  return parsed;
}

async function fetchChaptersForRj(cleanRj, hasM3u8 = true, targetDuration = 0) {
  const result = await fetchChaptersAndGallery(cleanRj, hasM3u8, targetDuration);
  return result.chapters;
}

// 3. Resolve and Save Work by RJ Code
async function resolveAndSaveWork(rjInput, saveImmediately = true, forceRefresh = false) {
  const match = rjInput.trim().match(/(?:RJ|VJ|BJ)\d+/i);
  if (!match) throw new Error(`Invalid work code format: "${rjInput}". Please provide a valid RJ/VJ/BJ code (e.g. RJ01473335, BJ01267551).`);
  
  const rjCode = match[0].toUpperCase();

  // Check local database first (if not forcing fresh probe)
  if (!forceRefresh) {
    const existing = db.getWorkByRj(rjCode);
    if (existing) {
      console.log(`[DB Cache Hit] Loaded ${rjCode} from local database`);
      if (saveImmediately) {
        db.removeWishlistItem(rjCode);
      }
      return existing;
    }
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
  if ((oldWork.releaseDate || '') !== (freshWork.releaseDate || '')) return true;
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

function isPlaceholderTitle(t, rj) {
  if (!t || typeof t !== 'string') return true;
  const s = t.trim().toUpperCase();
  const r = (rj || '').toUpperCase().trim();
  const num = r.replace(/^(?:RJ|VJ|BJ)/, '');
  return s === '' || s === r || s === `WORK ${r}` || s === `RJ${num}` || s === `WORK RJ${num}` || s === 'UNKNOWN TITLE' || s === 'UNKNOWN WORK' || s === 'UNTITLED' || s === 'LOADING...' || s.startsWith('WORK RJ') || s.startsWith('RJ0');
}

function isPlaceholderCircle(c) {
  if (!c || typeof c !== 'string') return true;
  const s = c.trim().toLowerCase();
  return s === '' || s === 'unknown circle' || s === 'asmr circle' || s === 'unknown' || s === 'n/a' || s === 'none' || s === 'null' || s === 'undefined' || s === 'asmr';
}

function isPlaceholderCv(v) {
  if (!v || typeof v !== 'string') return true;
  const s = v.trim().toLowerCase();
  return s === '' || s === 'n/a' || s === 'none' || s === 'unknown' || s === 'null' || s === 'undefined';
}

async function resolveRjMetadataOnly(cleanRj, oldWork) {
  const cleanUpper = (cleanRj || '').toUpperCase().trim();
  const cleanNum = cleanUpper.replace(/^(?:RJ|VJ|BJ)/i, '');
  const canonicalRj = getCanonicalDlsiteRj(cleanUpper);
  const bucket = getDlsiteCoverBucket(canonicalRj);

  let title = (oldWork && !isPlaceholderTitle(oldWork.title, cleanUpper)) ? oldWork.title : '';
  let circle = (oldWork && !isPlaceholderCircle(oldWork.circle)) ? oldWork.circle : '';
  let cv = (oldWork && !isPlaceholderCv(oldWork.cv)) ? oldWork.cv : '';
  let tags = (oldWork && Array.isArray(oldWork.tags)) ? [...oldWork.tags] : [];
  const tagTranslations = Object.assign({}, oldWork?.tagTranslations || {});
  let coverUrl = oldWork?.rawCoverUrl || oldWork?.coverUrl || '';
  let isAdult = oldWork ? (oldWork.isNsfw ?? true) : true;
  let series = oldWork?.series || '';
  let releaseDate = oldWork?.releaseDate || '';

  // 1. Step 1: DLsite API (Fastest & most authoritative)
  if (isPlaceholderTitle(title, cleanUpper) || isPlaceholderCircle(circle) || tags.length < 3) {
    try {
      const dlsiteMeta = await fetchDlsiteMetadata(cleanUpper);
      if (dlsiteMeta) {
        if (dlsiteMeta.title && !isPlaceholderTitle(dlsiteMeta.title, cleanUpper)) title = dlsiteMeta.title;
        if (dlsiteMeta.circle && !isPlaceholderCircle(dlsiteMeta.circle)) circle = dlsiteMeta.circle;
        if (dlsiteMeta.cv && !isPlaceholderCv(dlsiteMeta.cv)) cv = dlsiteMeta.cv;
        if (dlsiteMeta.series && !series) series = dlsiteMeta.series;
        if (dlsiteMeta.releaseDate && !releaseDate) releaseDate = dlsiteMeta.releaseDate;
        if (dlsiteMeta.rawCoverUrl && (!coverUrl || coverUrl.includes('placeholder'))) coverUrl = dlsiteMeta.rawCoverUrl;
        if (Array.isArray(dlsiteMeta.tags)) {
          dlsiteMeta.tags.forEach(t => { if (t && !tags.includes(t)) tags.push(t); });
        }
        if (dlsiteMeta.tagTranslations) Object.assign(tagTranslations, dlsiteMeta.tagTranslations);
        if (dlsiteMeta.isNsfw !== undefined) isAdult = dlsiteMeta.isNsfw;
      }
    } catch (e) {}
  }

  // Early skip check after DLsite
  if (!isPlaceholderTitle(title, cleanUpper) && !isPlaceholderCircle(circle) && tags.length >= 3) {
    return assembleMetadataResult();
  }

  // 2. Step 2: ASMR.one Public API Mirror
  if (isPlaceholderTitle(title, cleanUpper) || isPlaceholderCircle(circle) || tags.length < 3) {
    const asmrHosts = ['https://api.asmr.one', 'https://api.asmr-200.com', 'https://api.asmr-300.com'];
    for (const host of asmrHosts) {
      try {
        const asmrRes = await axios.get(`${host}/api/work/${cleanNum}`, {
          headers: {
            'User-Agent': BROWSER_HEADERS['User-Agent'],
            'Accept': 'application/json, text/plain, */*',
            'Referer': 'https://www.asmr.one/'
          },
          httpsAgent,
          httpAgent,
          timeout: 4000
        });
        if (asmrRes.status === 200 && asmrRes.data) {
          const data = asmrRes.data;
          if (data.title && isPlaceholderTitle(title, cleanUpper)) title = data.title;
          if (data.circle?.name && isPlaceholderCircle(circle)) circle = data.circle.name;
          if (data.series?.name && !series) series = data.series.name;
          if (data.release && !releaseDate) releaseDate = data.release;
          if (data.mainCoverUrl && (!coverUrl || coverUrl.includes('placeholder'))) coverUrl = data.mainCoverUrl;
          if (Array.isArray(data.vas) && data.vas.length > 0 && isPlaceholderCv(cv)) {
            cv = data.vas.map(v => (v.name || v)).filter(Boolean).join(', ');
          }
          if (Array.isArray(data.tags)) {
            data.tags.forEach(t => {
              const name = t.name || t;
              if (name && !tags.includes(name)) tags.push(name);
            });
          }
          if (data.tag_translations && typeof data.tag_translations === 'object') {
            Object.assign(tagTranslations, data.tag_translations);
          }
          if (data.age_category === 1 || data.rating === 'general') isAdult = false;
          break;
        }
      } catch (e) {}
    }
  }

  // Early skip check after ASMR.one
  if (!isPlaceholderTitle(title, cleanUpper) && !isPlaceholderCircle(circle) && tags.length >= 3) {
    return assembleMetadataResult();
  }

  // 3. Step 3: HentaiASMR Moe REST API (Zero audio probe)
  if (isPlaceholderTitle(title, cleanUpper) || isPlaceholderCircle(circle) || isPlaceholderCv(cv) || tags.length < 3) {
    try {
      const moeMeta = await fetchHentaiAsmrMetadata(cleanUpper, { skipAudioProbe: true });
      if (moeMeta) {
        if (moeMeta.title && isPlaceholderTitle(title, cleanUpper)) title = moeMeta.title;
        if (moeMeta.circle && isPlaceholderCircle(circle)) circle = moeMeta.circle;
        if (moeMeta.cv && isPlaceholderCv(cv)) cv = moeMeta.cv;
        if (moeMeta.series && !series) series = moeMeta.series;
        if (moeMeta.releaseDate && !releaseDate) releaseDate = moeMeta.releaseDate;
        if (moeMeta.rawCoverUrl && (!coverUrl || coverUrl.includes('placeholder'))) coverUrl = moeMeta.rawCoverUrl;
        if (Array.isArray(moeMeta.tags)) {
          moeMeta.tags.forEach(t => { if (t && !tags.includes(t)) tags.push(t); });
        }
        if (moeMeta.tagTranslations) Object.assign(tagTranslations, moeMeta.tagTranslations);
      }
    } catch (e) {}
  }

  function assembleMetadataResult() {
    if (!coverUrl || coverUrl.includes('placeholder')) {
      coverUrl = `https://img.dlsite.jp/modpub/images2/work/doujin/${bucket}/${canonicalRj}_img_main.jpg`;
    }

    // Filter CV names from tags
    const rawCvForDedupe = cv || (oldWork && oldWork.cv) || '';
    const cvNamesList = [];
    if (rawCvForDedupe && !isPlaceholderCv(rawCvForDedupe)) {
      rawCvForDedupe.split(/[,、/&＋+;・\n|]/).forEach(c => {
        const clean = (db && db.cleanCVName) ? db.cleanCVName(c) : c.trim();
        if (clean) cvNamesList.push(clean.toLowerCase());
      });
    }
    const cleanTags = tags.filter(t => {
      const clean = String(t || '').trim();
      if (!clean) return false;
      if (cvNamesList.includes(clean.toLowerCase())) return false;
      const entry = (db && db.BASE_TAG_DICT) ? db.BASE_TAG_DICT[clean] : null;
      if (entry && entry.isCV) return false;
      return true;
    });

    return {
      ...(oldWork || {}),
      rjCode: cleanUpper,
      title: title || (oldWork && oldWork.title) || `Work ${cleanUpper}`,
      circle: circle || (oldWork && oldWork.circle) || 'ASMR Circle',
      cv: cv || (oldWork && oldWork.cv) || 'N/A',
      series: series || oldWork?.series || '',
      releaseDate: releaseDate || oldWork?.releaseDate || '',
      tags: cleanTags.length > 0 ? cleanTags : ['ASMR', 'Audio'],
      tagTranslations: Object.keys(tagTranslations).length > 0 ? tagTranslations : {},
      coverUrl: coverUrl ? (coverUrl.startsWith('/image-proxy') ? coverUrl : `/image-proxy?url=${encodeURIComponent(coverUrl)}`) : (oldWork?.coverUrl || ''),
      rawCoverUrl: coverUrl || oldWork?.rawCoverUrl || '',
      hasHls: oldWork?.hasHls || false,
      isNsfw: isAdult,
      totalTracks: oldWork?.tracks?.length || oldWork?.totalTracks || 1,
      tracks: oldWork?.tracks || [],
      sampleTracks: oldWork?.sampleTracks || [],
      gallery: oldWork?.gallery,
      chapters: oldWork?.chapters || [],
      addedAt: oldWork?.addedAt || new Date().toISOString(),
      favorite: oldWork?.favorite || false
    };
  }

  return assembleMetadataResult();
}

module.exports = {
  resolveAndSaveWork,
  resolveRjMetadataOnly,
  batchImport,
  fetchDlsiteMetadata,
  fetchHentaiAsmrMetadata,
  probeMediaCdn,
  resolveLazyWorkAudio,
  fetchChaptersForRj,
  fetchChaptersAndGallery,
  parseAsmrTreeData,
  isWorkMetadataChanged,
  normalizeReleaseDate
};


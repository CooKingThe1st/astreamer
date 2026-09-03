const DEFAULT_PASSCODE = 'iloveuet';

// 26 SFW Cover Arts for PSFW Disguise Mode
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

// Seed Data for Initial Boot
const SEED_DATA = {
  version: 1,
  works: {},
  playlists: [],
  settings: { contentMode: 'NSFW' }
};

// In-Memory Database fallback (if KV is not yet bound)
let memoryDb = JSON.parse(JSON.stringify(SEED_DATA));

async function getDb(env) {
  if (env && env.ASTREAMER_KV) {
    const raw = await env.ASTREAMER_KV.get('astreamer_db', 'json');
    if (raw) return raw;
    await env.ASTREAMER_KV.put('astreamer_db', JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
  return memoryDb;
}

async function saveDb(env, data) {
  if (env && env.ASTREAMER_KV) {
    await env.ASTREAMER_KV.put('astreamer_db', JSON.stringify(data));
  } else {
    memoryDb = data;
  }
}

// Resolver: Universal Multi-Layer DLsite Extractor + Direct CDN Probe
async function resolveRjWork(rjCode) {
  const cleanRj = rjCode.toUpperCase();
  let dlsiteMeta = null;
  const divisions = ['maniax', 'home', 'girls', 'pro', 'books'];

  // Layer 1: Official JSON APIs across divisions
  for (const div of divisions) {
    try {
      const dlsiteRes = await fetch(`https://www.dlsite.com/${div}/api/=/product.json?workno=${cleanRj}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept-Language': 'ja,en;q=0.9'
        }
      });
      if (dlsiteRes.ok) {
        const data = await dlsiteRes.json();
        if (data && data.length > 0) {
          const item = data[0];
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
            (item.genres || []).some(g => {
              const name = (g.name || g).toLowerCase();
              return NSFW_KEYWORDS.some(k => name.includes(k));
            });

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
      }
    } catch (e) {}
  }

  // Layer 2: Deep HTML Product Page Scraper
  if (!dlsiteMeta || !dlsiteMeta.title || dlsiteMeta.tags.length === 0) {
    for (const div of divisions) {
      try {
        const pageRes = await fetch(`https://www.dlsite.com/${div}/work/=/product_id/${cleanRj}.html/?locale=ja_JP`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'ja-JP,ja;q=0.9',
            'Cookie': 'adultchecked=1; age_checked=1; locale=ja_JP;'
          }
        });

        if (pageRes.ok) {
          const html = await pageRes.text();

          // Title
          let title = '';
          const titleTagMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
          if (titleTagMatch) {
            let full = titleTagMatch[1].trim().replace(/\s*\|\s*DLsite.*$/i, '').trim();
            const circleBracketMatch = full.match(/\[(.*?)\]\s*$/);
            if (circleBracketMatch && !dlsiteMeta?.circle) {
              full = full.replace(/\[(.*?)\]\s*$/, '').trim();
            }
            title = full.replace(/【[^】]*%OFF[^】]*】/gi, '').replace(/【[^】]*特典[^】]*】/gi, '').trim();
          }

          // Circle Name (From LD+JSON Breadcrumb position 3 or /maker_id/ link)
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

          // Voice Actor (CV) - Clean multi-source parser
          let cv = dlsiteMeta?.cv && dlsiteMeta.cv !== 'N/A' && !dlsiteMeta.cv.includes('-->') && !dlsiteMeta.cv.includes('<') ? dlsiteMeta.cv : '';
          if (!cv) {
            const cleanHtml = html.replace(/<!--[\s\S]*?-->/g, '');
            const cvList = [];

            // Pattern A: DLsite Outline Table
            const outlineMatch = cleanHtml.match(/<th[^>]*>(?:声優|CV|キャスト|ボイス)<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
            if (outlineMatch) {
              const actorLinks = outlineMatch[1].matchAll(/>([^<]+)<\/a>/g);
              for (const m of actorLinks) {
                const name = m[1].replace(/様|さん|氏|他/g, '').trim();
                if (name && name.length >= 2 && !['DLsite', '声優', '同人'].includes(name) && !cvList.includes(name)) {
                  cvList.push(name);
                }
              }
            }

            // Pattern B: Bracketed CV in description / text
            if (cvList.length === 0) {
              const textToSearch = cleanHtml;
              const bracketMatches = textToSearch.matchAll(/(?:【|\(|（|\[)\s*(?:CV|声優|ボイス)[.:：\s]*([^】)）\]\r\n<]+)(?:】|\)|）|\])/gi);
              for (const bm of bracketMatches) {
                bm[1].split(/[/,、・\s+＆&]+/).forEach(c => {
                  const clean = c.replace(/様|さん|氏|他|／/g, '').trim();
                  if (clean && clean.length >= 2 && !['DLsite', '同人', 'ASMR', 'R18'].includes(clean) && !cvList.includes(clean)) {
                    cvList.push(clean);
                  }
                });
                if (cvList.length > 0) break;
              }
            }

            if (cvList.length > 0) cv = cvList.join(', ');
          }

          // Tags / Genres
          const tags = dlsiteMeta?.tags && dlsiteMeta.tags.length > 0 ? [...dlsiteMeta.tags] : [];
          const genreMatches = html.matchAll(/\/(?:genre|keyword|taxonomy)\/[^"'>]+["'][^>]*>([^<]+)<\/a>/gi);
          for (const m of genreMatches) {
            const t = m[1].trim();
            if (t && !tags.includes(t) && !['DLsite', '同人', 'R18', 'サークル一覧'].includes(t)) tags.push(t);
          }

          // ASMR Keywords extraction
          const CANDIDATE_KEYWORDS = ['催眠', 'ASMR', 'バイノーラル', 'ダミヘ', '耳舐め', '囁き', 'ご奉仕', '奉仕', '甘やかし', '癒し', 'オナサポ', '手コキ', '中出し', '乳首', '巨乳', '爆乳', 'お姉さん', '後輩', '同級生', '幼馴染', 'メイド', '風紀委員'];
          CANDIDATE_KEYWORDS.forEach(kw => {
            if (html.includes(kw) && !tags.includes(kw)) tags.push(kw);
          });

          // Always add Voice Actors as tags/genres!
          if (cv && cv !== 'N/A') {
            cv.split(/[/,、・\s]+/).map(s => s.trim()).filter(Boolean).forEach(c => {
              if (c.length >= 2 && !tags.includes(c)) tags.push(c);
            });
          }

          // Cover Image
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

  const m3u8Url = `https://v.weeab0o.xyz/${cleanRj}.m3u8`;
  const coverUrl = dlsiteMeta?.rawCoverUrl || `https://pic.weeabo0.xyz/${cleanRj}_img_main.jpg`;
  let hasM3u8 = false;

  try {
    const m3u8Res = await fetch(m3u8Url, {
      headers: { 'Referer': 'https://japaneseasmr.com/', 'User-Agent': 'Mozilla/5.0' }
    });
    if (m3u8Res.ok) {
      const text = await m3u8Res.text();
      if (text.includes('#EXTM3U')) hasM3u8 = true;
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
    const candidates = [
      { id: 1, title: 'Track 1 (トラック1)', url: `https://v.weeab0o.xyz/${cleanRj}.mp3` },
      { id: 2, title: 'Track 2 (トラック2)', url: `https://v.weeab0o.xyz/${cleanRj} 2.mp3` },
      { id: 3, title: 'Track 3 (トラック3)', url: `https://v.weeab0o.xyz/${cleanRj} 3.mp3` },
      { id: 4, title: 'Track 4 (トラック4)', url: `https://v.weeab0o.xyz/${cleanRj} 4.mp3` },
      { id: 5, title: 'Track 5 (トラック5)', url: `https://v.weeab0o.xyz/${cleanRj} 5.mp3` }
    ];

    for (const c of candidates) {
      try {
        const headRes = await fetch(c.url, {
          method: 'HEAD',
          headers: { 'Referer': 'https://japaneseasmr.com/', 'User-Agent': 'Mozilla/5.0' }
        });
        if (headRes.ok) {
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
        if (c.id === 1) break;
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
    tags: dlsiteMeta?.tags && dlsiteMeta.tags.length > 0 ? dlsiteMeta.tags : ['ASMR', 'Audio'],
    coverUrl: `/image-proxy?url=${encodeURIComponent(coverUrl)}`,
    rawCoverUrl: coverUrl,
    hasHls: hasM3u8,
    isNsfw: dlsiteMeta ? (dlsiteMeta.isNsfw ?? true) : true,
    totalTracks: tracks.length,
    tracks,
    addedAt: new Date().toISOString(),
    favorite: false,
    source: 'RESOLVED'
  };
}

// Main Cloudflare Worker Fetch Handler
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const passcode = env?.ADMIN_PASSCODE || DEFAULT_PASSCODE;

    // Helper: JSON response
    const json = (data, status = 200) => new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

    // Helper: Auth Check
    const isAuth = () => {
      const headerToken = request.headers.get('x-admin-passcode') ||
                          request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
                          request.headers.get('X-Admin-Passcode');
      const queryToken = url.searchParams.get('passcode') || url.searchParams.get('token');
      const provided = (headerToken || queryToken || '').trim();
      return Boolean(provided && provided === passcode);
    };

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, x-admin-passcode, Range'
        }
      });
    }

    // 1. Image Proxy
    if (pathname === '/image-proxy') {
      let targetUrl = url.searchParams.get('url');
      if (!targetUrl) return new Response('Missing url', { status: 400 });
      if (targetUrl.startsWith('//')) targetUrl = 'https:' + targetUrl;

      const isDlsite = targetUrl.includes('dlsite.jp') || targetUrl.includes('dlsite.com');
      const referer = isDlsite ? 'https://www.dlsite.com/' : 'https://japaneseasmr.com/';

      try {
        const imgRes = await fetch(targetUrl, {
          headers: { 'Referer': referer, 'User-Agent': 'Mozilla/5.0' },
          cf: { cacheEverything: true, cacheTtl: 86400 }
        });
        const headers = new Headers(imgRes.headers);
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Cache-Control', 'public, max-age=86400');
        return new Response(imgRes.body, { status: imgRes.status, headers });
      } catch (err) {
        return new Response('Image Proxy Error', { status: 500 });
      }
    }

    // 2. Stream & HLS Proxy
    if (pathname === '/stream') {
      const targetUrl = url.searchParams.get('url');
      if (!targetUrl) return new Response('Missing url', { status: 400 });

      const isM3u8 = targetUrl.toLowerCase().includes('.m3u8');
      const rangeHeader = request.headers.get('range');

      const fetchHeaders = {
        'Referer': 'https://japaneseasmr.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      };

      if (rangeHeader && !isM3u8) {
        fetchHeaders['Range'] = rangeHeader;
      }

      try {
        const streamRes = await fetch(targetUrl, { headers: fetchHeaders });

        if (isM3u8) {
          const originalM3u8 = await streamRes.text();
          const baseUrl = new URL('.', targetUrl).href;

          const rewritten = originalM3u8.split(/\r?\n/).map(line => {
            const trimmed = line.trim();
            if (!trimmed) return line;
            if (trimmed.startsWith('#EXT-X-KEY:')) {
              return trimmed.replace(/URI="([^"]+)"/, (m, key) => {
                const absKey = new URL(key, baseUrl).href;
                return `URI="/stream?url=${encodeURIComponent(absKey)}"`;
              });
            }
            if (trimmed.startsWith('#')) return line;
            const absSeg = new URL(trimmed, baseUrl).href;
            return `/stream?url=${encodeURIComponent(absSeg)}`;
          }).join('\n');

          return new Response(rewritten, {
            status: 200,
            headers: {
              'Content-Type': 'application/vnd.apple.mpegurl; charset=utf-8',
              'Access-Control-Allow-Origin': '*',
              'Cache-Control': 'no-cache'
            }
          });
        }

        const isTs = targetUrl.toLowerCase().endsWith('.ts');
        const respHeaders = new Headers(streamRes.headers);
        respHeaders.set('Access-Control-Allow-Origin', '*');
        if (isTs) {
          respHeaders.set('Content-Type', 'video/mp2t');
        }

        return new Response(streamRes.body, { status: streamRes.status, headers: respHeaders });
      } catch (err) {
        return new Response(`Stream error: ${err.message}`, { status: 500 });
      }
    }

    // 3. Auth API
    if (pathname === '/api/auth/login' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      if (body.passcode === passcode) {
        return json({ success: true, message: 'Authenticated' });
      }
      return json({ success: false, error: 'Invalid passcode' }, 401);
    }

    // 4. Library APIs
    if (pathname === '/api/library' && request.method === 'GET') {
      const db = await getDb(env);
      let works = Object.values(db.works || {}).sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0));

      const q = url.searchParams.get('q')?.toLowerCase();
      const tag = url.searchParams.get('tag')?.toLowerCase().trim();
      const cv = url.searchParams.get('cv')?.toLowerCase().trim();
      const favorite = url.searchParams.get('favorite');

      if (q) {
        works = works.filter(w =>
          w.rjCode.toLowerCase().includes(q) ||
          w.title.toLowerCase().includes(q) ||
          (w.cv && w.cv.toLowerCase().includes(q)) ||
          (w.tags && w.tags.some(t => t.toLowerCase().includes(q)))
        );
      }
      if (tag) works = works.filter(w => (w.tags || []).some(t => t.toLowerCase().trim() === tag));
      if (cv) works = works.filter(w => w.cv && w.cv.toLowerCase().includes(cv));
      if (favorite === 'true') works = works.filter(w => w.favorite);

      return json(works);
    }

    // Resolve Single Work
    if (pathname === '/api/library/resolve' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const body = await request.json().catch(() => ({}));
      const match = (body.rjCode || '').match(/RJ\d+/i);
      if (!match) return json({ error: 'Invalid RJ Code' }, 400);

      const rjCode = match[0].toUpperCase();
      const db = await getDb(env);

      if (db.works[rjCode]) {
        return json({ success: true, work: db.works[rjCode] });
      }

      try {
        const work = await resolveRjWork(rjCode);
        db.works[rjCode] = work;
        await saveDb(env, db);
        return json({ success: true, work });
      } catch (err) {
        return json({ error: err.message }, 500);
      }
    }

    // Batch Import
    if (pathname === '/api/library/batch-import' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const body = await request.json().catch(() => ({}));
      let items = [];
      if (Array.isArray(body.rjList)) items = body.rjList;
      else if (typeof body.textData === 'string') items = body.textData.split(/[\r\n,;\s]+/).filter(s => s.match(/RJ\d+/i));

      const db = await getDb(env);
      const results = { total: items.length, succeeded: [], failed: [] };

      for (const raw of items) {
        const m = raw.match(/RJ\d+/i);
        if (!m) continue;
        const rj = m[0].toUpperCase();
        if (db.works[rj]) {
          results.succeeded.push({ rjCode: rj, title: db.works[rj].title });
          continue;
        }
        try {
          const work = await resolveRjWork(rj);
          db.works[rj] = work;
          results.succeeded.push({ rjCode: rj, title: work.title });
        } catch (e) {
          results.failed.push({ rjCode: rj, error: e.message });
        }
      }

      await saveDb(env, db);
      return json(results);
    }

    // Refresh Metadata for All Works
    if (pathname === '/api/library/refresh-all' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const db = await getDb(env);
      const rjList = Object.keys(db.works || {});
      const results = { total: rjList.length, updated: 0, failed: 0 };

      for (const rj of rjList) {
        try {
          const fresh = await resolveRjWork(rj);
          const old = db.works[rj];
          db.works[rj] = {
            ...fresh,
            favorite: old.favorite || false,
            addedAt: old.addedAt || fresh.addedAt
          };
          results.updated++;
        } catch (e) {
          results.failed++;
        }
      }

      await saveDb(env, db);
      return json(results);
    }

    // Refresh Single Work Metadata
    if (pathname.startsWith('/api/library/refresh/') && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const rjCode = pathname.replace('/api/library/refresh/', '').toUpperCase();
      const db = await getDb(env);
      const old = db.works[rjCode];

      if (!old) return json({ error: 'Work not found' }, 404);

      try {
        const fresh = await resolveRjWork(rjCode);
        db.works[rjCode] = {
          ...fresh,
          favorite: old.favorite || false,
          addedAt: old.addedAt || fresh.addedAt
        };
        await saveDb(env, db);
        return json({ success: true, work: db.works[rjCode] });
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    // Toggle Favorite
    if (pathname.startsWith('/api/library/favorite/') && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const rjCode = pathname.replace('/api/library/favorite/', '').toUpperCase();
      const db = await getDb(env);
      const work = db.works[rjCode];

      if (work) {
        work.favorite = !work.favorite;
        db.playlists = db.playlists || [];
        let favPl = db.playlists.find(p => p.id === 'pl-favorites');
        if (!favPl) {
          favPl = { id: 'pl-favorites', name: '❤️ Favorites', description: 'Your favorites', coverUrl: '', items: [], createdAt: new Date().toISOString() };
          db.playlists.unshift(favPl);
        }
        if (work.favorite) {
          if (!favPl.items.some(it => it.rjCode === rjCode)) {
            favPl.items.push({ rjCode, trackId: 1, title: work.title, workTitle: work.title, cv: work.cv || '', poster: work.coverUrl });
            if (!favPl.coverUrl) favPl.coverUrl = work.coverUrl;
          }
        } else {
          favPl.items = favPl.items.filter(it => it.rjCode !== rjCode);
        }
        await saveDb(env, db);
        return json({ success: true, favorite: work.favorite });
      }
      return json({ error: 'Work not found' }, 404);
    }

    // Delete Work
    if (pathname.startsWith('/api/library/') && request.method === 'DELETE') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const rjCode = pathname.replace('/api/library/', '').toUpperCase();
      const db = await getDb(env);
      if (db.works[rjCode]) {
        delete db.works[rjCode];
        const favPl = (db.playlists || []).find(p => p.id === 'pl-favorites');
        if (favPl) favPl.items = favPl.items.filter(it => it.rjCode !== rjCode);
        await saveDb(env, db);
        return json({ success: true });
      }
      return json({ error: 'Work not found' }, 404);
    }

    // Playlists API
    if (pathname === '/api/playlists' && request.method === 'GET') {
      const db = await getDb(env);
      return json(db.playlists || []);
    }

    if (pathname === '/api/playlists' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const body = await request.json().catch(() => ({}));
      const db = await getDb(env);
      const newPl = { id: 'pl-' + Date.now(), name: body.name || 'New Playlist', description: body.description || '', coverUrl: '', items: [], createdAt: new Date().toISOString() };
      db.playlists = db.playlists || [];
      db.playlists.push(newPl);
      await saveDb(env, db);
      return json(newPl);
    }

    if (pathname.startsWith('/api/playlists/') && pathname.includes('/items') && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const plId = pathname.split('/')[3];
      const body = await request.json().catch(() => ({}));
      const db = await getDb(env);
      const pl = (db.playlists || []).find(p => p.id === plId);
      if (pl && body.item) {
        pl.items.push(body.item);
        if (!pl.coverUrl && body.item.poster) pl.coverUrl = body.item.poster;
        await saveDb(env, db);
        return json({ success: true, playlist: pl });
      }
      return json({ error: 'Playlist not found' }, 404);
    }

    if (pathname.startsWith('/api/playlists/') && pathname.includes('/items/') && request.method === 'DELETE') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const parts = pathname.split('/');
      const plId = parts[3];
      const idx = parseInt(parts[5], 10);
      const db = await getDb(env);
      const pl = (db.playlists || []).find(p => p.id === plId);
      if (pl && pl.items[idx]) {
        pl.items.splice(idx, 1);
        await saveDb(env, db);
        return json({ success: true, playlist: pl });
      }
      return json({ error: 'Item not found' }, 404);
    }

    if (pathname.startsWith('/api/playlists/') && request.method === 'DELETE') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const plId = pathname.replace('/api/playlists/', '');
      const db = await getDb(env);
      db.playlists = (db.playlists || []).filter(p => p.id !== plId);
      await saveDb(env, db);
      return json({ success: true });
    }

    // Aggregations
    if (pathname === '/api/tags') {
      const db = await getDb(env);
      const counts = {};
      Object.values(db.works || {}).forEach(w => (w.tags || []).forEach(t => counts[t] = (counts[t] || 0) + 1));
      return json(Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count));
    }

    if (pathname === '/api/artists') {
      const db = await getDb(env);
      const counts = {};
      Object.values(db.works || {}).forEach(w => {
        if (w.cv && w.cv !== 'N/A') {
          w.cv.split(/[,、/]/).map(s => s.trim()).filter(Boolean).forEach(cv => counts[cv] = (counts[cv] || 0) + 1);
        }
      });
      return json(Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count));
    }

    // Backup Export & Import APIs
    if (pathname === '/api/backup' && request.method === 'GET') {
      const db = await getDb(env);
      return new Response(JSON.stringify(db, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="astreamer_backup.json"',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (pathname === '/api/backup' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const backupData = await request.json().catch(() => null);
      if (!backupData || !backupData.works) return json({ error: 'Invalid backup file' }, 400);

      await saveDb(env, backupData);
      return json({ success: true, message: 'Database restored successfully' });
    }

    // Settings API
    if (pathname === '/api/settings' && request.method === 'GET') {
      const db = await getDb(env);
      return json(db.settings || { contentMode: 'NSFW' });
    }

    if (pathname === '/api/settings' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const body = await request.json().catch(() => ({}));
      const db = await getDb(env);
      db.settings = { ...(db.settings || {}), ...body };
      await saveDb(env, db);
      return json({ success: true, settings: db.settings });
    }

    // 5. Serve HTML Web UI for All Other Routes
    return new Response(INDEX_HTML, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
};

// Complete Web App SPA Frontend
const INDEX_HTML = `<!DOCTYPE html>
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
    body { background: var(--bg-main); color: var(--text-main); height: 100vh; overflow: hidden; display: flex; }
    .app-sidebar { width: 260px; min-width: 260px; background: var(--bg-sidebar); border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 1.5rem 1rem; height: calc(100vh - 84px); }
    .logo-area { display: flex; align-items: center; gap: 10px; padding: 0 0.5rem 1.5rem; border-bottom: 1px solid var(--border); margin-bottom: 1.2rem; }
    .logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #ff3366, #9b51e0); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 800; }
    .logo-title { font-size: 1.3rem; font-weight: 800; background: linear-gradient(135deg, #ff3366, #b066fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .nav-section { display: flex; flex-direction: column; gap: 4px; flex: 1; overflow-y: auto; }
    .nav-title { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); padding: 0.8rem 0.5rem 0.4rem; font-weight: 700; }
    .nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 8px; color: var(--text-muted); text-decoration: none; font-weight: 600; font-size: 0.92rem; cursor: pointer; transition: all 0.15s ease; }
    .nav-item:hover { color: #fff; background: rgba(255,255,255,0.05); }
    .nav-item.active { color: #fff; background: var(--accent); }
    .app-main { flex: 1; height: calc(100vh - 84px); overflow-y: auto; display: flex; flex-direction: column; }
    .topbar { display: flex; align-items: center; justify-content: space-between; padding: 1.2rem 2rem; background: rgba(12, 13, 18, 0.8); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 20; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .search-box { display: flex; align-items: center; gap: 10px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; padding: 8px 18px; width: 340px; }
    .search-box input { background: transparent; border: none; outline: none; color: #fff; width: 100%; font-size: 0.9rem; }
    .top-actions { display: flex; align-items: center; gap: 12px; }
    .btn-primary { background: var(--accent); color: #fff; border: none; padding: 9px 18px; border-radius: 20px; font-weight: 700; cursor: pointer; font-size: 0.88rem; transition: 0.2s; }
    .btn-primary:hover { background: var(--accent-hover); box-shadow: 0 4px 15px var(--accent-glow); }
    .btn-outline { background: transparent; color: #fff; border: 1px solid var(--border); padding: 8px 16px; border-radius: 20px; font-weight: 600; cursor: pointer; font-size: 0.88rem; }
    .btn-outline:hover { background: var(--bg-card-hover); }
    .view-container { padding: 2rem; max-width: 1400px; margin: 0 auto; width: 100%; }
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .section-title { font-size: 1.6rem; font-weight: 800; }
    .works-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
    .work-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; padding: 12px; cursor: pointer; transition: transform 0.2s, background 0.2s; position: relative; display: flex; flex-direction: column; }
    .work-card:hover { transform: translateY(-4px); background: var(--bg-card-hover); border-color: #3b3f54; }
    .card-cover-wrapper { position: relative; width: 100%; aspect-ratio: 3/4; margin-bottom: 10px; border-radius: 8px; overflow: hidden; }
    .card-cover { width: 100%; height: 100%; object-fit: cover; background: #08090c; }
    .disguised-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(176,102,254,0.2) 0%, rgba(12,13,18,0.7) 100%); box-shadow: inset 0 0 18px rgba(176, 102, 254, 0.7); pointer-events: none; display: flex; align-items: flex-end; padding: 6px; }
    .disguised-badge { background: #7c3aed; color: #fff; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.5); }
    .card-badge-row { display: flex; gap: 6px; margin-bottom: 6px; align-items: center; }
    .card-rj { background: var(--accent); color: #fff; font-size: 0.7rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; }
    .card-fav { margin-left: auto; cursor: pointer; color: var(--text-muted); }
    .card-title { font-size: 0.92rem; font-weight: 700; line-height: 1.35; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .card-sub { font-size: 0.8rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .work-detail-banner { display: flex; gap: 28px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; margin-bottom: 2rem; }
    .detail-cover { width: 220px; min-width: 220px; height: 300px; border-radius: 12px; object-fit: cover; }
    .detail-info { flex: 1; display: flex; flex-direction: column; }
    .detail-title { font-size: 1.6rem; font-weight: 800; margin-bottom: 12px; line-height: 1.3; }
    .detail-meta { font-size: 0.95rem; color: var(--text-muted); margin-bottom: 6px; }
    .detail-meta strong { color: #fff; }
    .tags-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
    .tag-pill { background: #232736; border: 1px solid #33384c; color: #d1d5db; font-size: 0.78rem; padding: 4px 10px; border-radius: 6px; cursor: pointer; }
    .tag-pill:hover { background: var(--accent); color: #fff; }
    .tracks-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    .tracks-table th { text-align: left; padding: 10px 14px; font-size: 0.8rem; color: var(--text-muted); border-bottom: 1px solid var(--border); }
    .tracks-table td { padding: 12px 14px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 0.9rem; }
    .track-row { cursor: pointer; transition: 0.15s; }
    .track-row:hover { background: var(--bg-card-hover); }
    .track-row.active { background: rgba(255,51,102,0.12); color: var(--accent); }
    .tag-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
    .tag-cloud-item { background: var(--bg-card); border: 1px solid var(--border); padding: 10px 18px; border-radius: 24px; font-weight: 600; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
    .tag-cloud-item:hover { background: var(--accent); color: #fff; }
    .tag-count { background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); z-index: 1000; display: none; align-items: center; justify-content: center; }
    .modal-content { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 28px; width: 100%; max-width: 540px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
    .modal-title { font-size: 1.3rem; font-weight: 800; margin-bottom: 14px; }
    .modal-textarea { width: 100%; height: 140px; background: #0c0d12; border: 1px solid var(--border); border-radius: 10px; padding: 12px; color: #fff; font-family: monospace; font-size: 0.9rem; outline: none; margin-bottom: 16px; resize: vertical; }
    .player-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 84px; background: var(--player-bg); border-top: 1px solid var(--border); padding: 0 24px; display: flex; align-items: center; justify-content: space-between; z-index: 100; box-shadow: 0 -8px 24px rgba(0,0,0,0.5); }
    .player-left { display: flex; align-items: center; gap: 14px; width: 280px; }
    .player-thumb { width: 52px; height: 52px; border-radius: 8px; object-fit: cover; background: #0c0d12; }
    .player-track-info { overflow: hidden; }
    .player-title { font-size: 0.9rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .player-sub { font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .player-center { flex: 1; max-width: 560px; display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .player-controls { display: flex; align-items: center; gap: 18px; }
    .ctrl-btn { background: none; border: none; color: #fff; cursor: pointer; font-size: 1.1rem; opacity: 0.85; transition: 0.15s; }
    .ctrl-btn:hover { opacity: 1; color: var(--accent); }
    .play-btn-circle { width: 40px; height: 40px; border-radius: 50%; background: #fff; color: #000; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; border: none; transition: transform 0.15s; }
    .play-btn-circle:hover { transform: scale(1.08); background: var(--accent); color: #fff; }
    .scrubber-row { display: flex; align-items: center; gap: 12px; width: 100%; }
    .time-text { font-size: 0.75rem; color: var(--text-muted); font-variant-numeric: tabular-nums; min-width: 40px; }
    .scrubber { flex: 1; height: 4px; appearance: none; background: #333748; border-radius: 2px; outline: none; cursor: pointer; }
    .scrubber::-webkit-slider-thumb { appearance: none; width: 12px; height: 12px; border-radius: 50%; background: var(--accent); cursor: pointer; }
    .player-right { display: flex; align-items: center; gap: 12px; width: 280px; justify-content: flex-end; }
    .volume-slider { width: 90px; height: 4px; appearance: none; background: #333748; border-radius: 2px; outline: none; cursor: pointer; }
    .volume-slider::-webkit-slider-thumb { appearance: none; width: 10px; height: 10px; border-radius: 50%; background: #fff; }
    .gatekeeper-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; padding: 40px 32px; text-align: center; max-width: 420px; width: 100%; box-shadow: 0 20px 50px rgba(0,0,0,0.8); }
    .settings-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; margin-bottom: 20px; }
    .settings-option { display: flex; align-items: flex-start; gap: 14px; padding: 14px; border-radius: 10px; border: 1px solid var(--border); margin-bottom: 10px; cursor: pointer; transition: 0.2s; }
    .settings-option:hover { background: var(--bg-card-hover); }
    .settings-option.selected { border-color: var(--accent); background: rgba(255,51,102,0.08); }
    .settings-radio { margin-top: 4px; accent-color: var(--accent); cursor: pointer; }
    .settings-label { font-size: 1rem; font-weight: 700; margin-bottom: 4px; }
    .settings-desc { font-size: 0.85rem; color: var(--text-muted); }
  </style>
</head>
<body>
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

  <div id="importModal" class="modal-overlay">
    <div class="modal-content">
      <h3 class="modal-title">📥 Batch Import RJ Works</h3>
      <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 12px;">Paste multiple RJ codes or upload a <code>.txt</code> file.</p>
      <textarea id="importTextarea" class="modal-textarea" placeholder="RJ01473335&#10;RJ441308&#10;RJ01570152"></textarea>
      <div style="margin-bottom: 18px;"><input type="file" id="importFileInput" accept=".txt" style="font-size: 0.85rem; color: var(--text-muted);" onchange="handleFileUpload(event)"></div>
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button class="btn-outline" onclick="closeImportModal()">Cancel</button>
        <button class="btn-primary" id="btnRunImport" onclick="runBatchImport()">Start Import</button>
      </div>
      <div id="importProgress" style="margin-top: 14px; font-size: 0.85rem; color: #38bdf8; display: none;">Importing...</div>
    </div>
  </div>

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
      <div style="display: flex; justify-content: flex-end; margin-top: 18px;"><button class="btn-outline" onclick="closeAddToPlaylistModal()">Close</button></div>
    </div>
  </div>

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

  <aside class="app-sidebar">
    <div class="logo-area"><div class="logo-icon">✨</div><div class="logo-title">aStreamer</div></div>
    <nav class="nav-section">
      <div class="nav-title">Menu</div>
      <div class="nav-item active" onclick="switchView('library')">📚 Library</div>
      <div class="nav-item" onclick="switchView('playlists')">📜 Playlists</div>
      <div class="nav-item" onclick="switchView('artists')">🎙️ Voice Actors</div>
      <div class="nav-item" onclick="switchView('genres')">🏷️ Genres & Tags</div>
      <div class="nav-title">Manage</div>
      <div class="nav-item" onclick="openImportModal()">📥 Batch Import</div>
      <div class="nav-item" onclick="switchView('settings')">⚙️ Settings</div>
    </nav>
  </aside>

  <main class="app-main">
    <div class="topbar">
      <div class="search-box"><span>🔍</span><input type="text" id="globalSearch" placeholder="Search title, RJ code, CV, circle..." oninput="handleSearch(this.value)"></div>
      <div class="top-actions"><button class="btn-primary" onclick="quickAddRj()">+ Add RJ Code</button></div>
    </div>
    <div id="viewContainer" class="view-container"></div>
  </main>

  <footer class="player-bar">
    <div class="player-left">
      <img id="playerCover" class="player-thumb" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect width='48' height='48' fill='%23222'/%3E%3C/svg%3E">
      <div class="player-track-info">
        <div id="playerTitle" class="player-title">Select track to play</div>
        <div id="playerSub" class="player-sub">aStreamer Cloudflare Edition</div>
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

  <audio id="coreAudio" preload="metadata"></audio>

  <script>
    let authToken = localStorage.getItem('astreamer_passcode') || '';
    let contentMode = localStorage.getItem('astreamer_content_mode') || 'NSFW';
    let currentView = 'library';
    let allWorks = [];
    let currentWork = null;
    let currentTrackIndex = -1;
    let hls = null;
    let loadedHlsUrl = null;
    let pendingPlaylistItem = null;
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

    window.addEventListener('DOMContentLoaded', () => {
      if (authToken) { document.getElementById('gatekeeperModal').style.display = 'none'; loadLibrary(); }
    });

    async function login() {
      const pass = document.getElementById('passcodeInput').value.trim();
      if (!pass) return;
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ passcode: pass }) });
      const data = await res.json();
      if (data.success) { authToken = pass; localStorage.setItem('astreamer_passcode', pass); document.getElementById('gatekeeperModal').style.display = 'none'; loadLibrary(); }
      else { document.getElementById('loginError').style.display = 'block'; }
    }

    function handleAuthError() {
      localStorage.removeItem('astreamer_passcode');
      authToken = '';
      document.getElementById('passcodeInput').value = '';
      const errEl = document.getElementById('loginError');
      errEl.innerText = 'Session expired or passcode changed. Please log in.';
      errEl.style.display = 'block';
      document.getElementById('gatekeeperModal').style.display = 'flex';
    }

    async function apiFetch(url, options = {}) {
      options.headers = options.headers || authHeaders();
      const res = await fetch(url, options);
      if (res.status === 401) {
        handleAuthError();
        throw new Error('Unauthorized');
      }
      return res;
    }

    function authHeaders() {
      const token = authToken || localStorage.getItem('astreamer_passcode') || '';
      return {
        'x-admin-passcode': token,
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      };
    }

    function switchView(view, param = null) {
      currentView = view;
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      if (view === 'library') { document.querySelector('.nav-item:nth-child(2)')?.classList.add('active'); loadLibrary(param || {}); }
      else if (view === 'playlists') { document.querySelector('.nav-item:nth-child(3)')?.classList.add('active'); loadPlaylists(); }
      else if (view === 'artists') { document.querySelector('.nav-item:nth-child(4)')?.classList.add('active'); loadArtists(); }
      else if (view === 'genres') { document.querySelector('.nav-item:nth-child(5)')?.classList.add('active'); loadGenres(); }
      else if (view === 'settings') { document.querySelector('.nav-item:nth-child(8)')?.classList.add('active'); loadSettings(); }
      else if (view === 'work-detail') { loadWorkDetail(param); }
    }

    async function loadLibrary(filterParams = {}) {
      const container = document.getElementById('viewContainer');
      container.innerHTML = '<div style="text-align:center; padding: 3rem; color: var(--text-muted);">Loading Library...</div>';
      try {
        const url = new URL('/api/library', window.location.origin);
        Object.keys(filterParams).forEach(k => { if (filterParams[k]) url.searchParams.set(k, filterParams[k]); });
        let works = await (await fetch(url)).json();
        if (contentMode === 'SFW') works = works.filter(w => !isWorkNsfw(w));
        allWorks = works;
        renderLibraryGrid(works, filterParams);
      } catch (e) {
        container.innerHTML = '<div style="color:#ff3366; padding:2rem;">Error: ' + e.message + '</div>';
      }
    }

    function renderLibraryGrid(works, filterParams = {}) {
      const container = document.getElementById('viewContainer');
      let filterHeader = '';
      const modeBadge = contentMode === 'PSFW' ? '<span class="disguised-badge" style="margin-left: 8px;">🎭 PSFW Disguise Mode Active</span>' : (contentMode === 'SFW' ? '<span style="background:#0e7490; color:#fff; font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:4px; margin-left:8px;">🛡️ SFW Filter Active</span>' : '');

      if (filterParams.tag) filterHeader = '<div style="background: rgba(255,51,102,0.12); border: 1px solid var(--accent); padding: 10px 18px; border-radius: 10px; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;"><span>🏷️ Filtered by Genre: <strong>' + filterParams.tag + '</strong> (' + works.length + ' works)</span><button class="btn-outline" style="padding: 4px 12px; font-size: 0.8rem;" onclick="loadLibrary()">✖ Clear Filter</button></div>';
      else if (filterParams.cv) filterHeader = '<div style="background: rgba(56,189,248,0.12); border: 1px solid #38bdf8; padding: 10px 18px; border-radius: 10px; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;"><span>🎙️ Filtered by Voice Actor: <strong>' + filterParams.cv + '</strong> (' + works.length + ' works)</span><button class="btn-outline" style="padding: 4px 12px; font-size: 0.8rem;" onclick="loadLibrary()">✖ Clear Filter</button></div>';
      else if (filterParams.favorite) filterHeader = '<div style="background: rgba(255,51,102,0.12); border: 1px solid var(--accent); padding: 10px 18px; border-radius: 10px; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;"><span>❤️ Showing <strong>Favorites</strong> (' + works.length + ' works)</span><button class="btn-outline" style="padding: 4px 12px; font-size: 0.8rem;" onclick="loadLibrary()">✖ Show All</button></div>';

      let html = filterHeader + '<div class="section-header"><h1 class="section-title">📚 Library (' + works.length + ') ' + modeBadge + '</h1><div><button class="btn-outline" onclick="loadLibrary({ favorite: \\'true\\' })">❤️ Favorites</button><button class="btn-outline" onclick="loadLibrary()" style="margin-left: 8px;">All</button></div></div><div class="works-grid">';
      if (works.length === 0) html += '<div style="grid-column: 1/-1; padding: 3rem; text-align: center; color: var(--text-muted);">No works found.</div>';

      works.forEach(w => {
        const display = getDisplayCover(w);
        html += '<div class="work-card" onclick="switchView(\\'work-detail\\', \\'' + w.rjCode + '\\')"><div class="card-cover-wrapper"><img class="card-cover" src="' + display.coverUrl + '">' + (display.isDisguised ? '<div class="disguised-overlay"><span class="disguised-badge">🎭 Disguised SFW</span></div>' : '') + '</div><div class="card-badge-row"><span class="card-rj">' + w.rjCode + '</span><span class="card-fav" title="' + (w.favorite ? 'Favorited' : 'Add to Favorites') + '" onclick="event.stopPropagation(); toggleFav(\\'' + w.rjCode + '\\')">' + (w.favorite ? '❤️' : '🤍') + '</span></div><div class="card-title">' + w.title + '</div><div class="card-sub">' + (w.cv || w.circle || 'ASMR') + '</div></div>';
      });

      html += '</div>';
      container.innerHTML = html;
    }

    async function loadWorkDetail(rjCode) {
      const container = document.getElementById('viewContainer');
      const work = allWorks.find(w => w.rjCode === rjCode) || await (await fetch('/api/library?q=' + rjCode)).json().then(res => res[0]);
      if (!work) { container.innerHTML = '<div style="padding:2rem;">Work not found</div>'; return; }
      currentWork = work;
      const display = getDisplayCover(work);

      let html = '<div class="work-detail-banner"><img class="detail-cover" src="' + display.coverUrl + '"><div class="detail-info"><div style="display:flex; gap:8px; margin-bottom:8px;"><span class="card-rj">' + work.rjCode + '</span><span style="background:#0e7490; color:#fff; font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:4px;">' + (work.hasHls ? 'HLS Chapters' : 'Multi-Track') + '</span></div><h1 class="detail-title">' + work.title + '</h1><div class="detail-meta"><strong>Voice Actor (CV):</strong> ' + (work.cv || 'N/A') + '</div><div class="detail-meta"><strong>Circle:</strong> ' + (work.circle || 'N/A') + '</div><div class="tags-row">' + (work.tags || []).map(t => '<span class="tag-pill" onclick="switchView(\\'library\\', { tag: \\'' + t + '\\' })">' + t + '</span>').join('') + '</div><div style="margin-top:auto; padding-top:16px; display:flex; flex-wrap:wrap; gap:10px;"><button class="btn-primary" onclick="playTrack(0, true)">▶ Play All</button><button class="btn-outline" onclick="openAddToPlaylistModal({ rjCode: \\'' + work.rjCode + '\\', title: \\'' + work.title.replace(/'/g, "") + '\\', workTitle: \\'' + work.title.replace(/'/g, "") + '\\', poster: \\'' + work.coverUrl + '\\', cv: \\'' + (work.cv || "") + '\\', isWork: true })">➕ Add Work to Playlist</button><button class="btn-outline" onclick="refreshSingleWork(\\'' + work.rjCode + '\\')">🔄 Refresh</button><button class="btn-outline" onclick="deleteWorkItem(\\'' + work.rjCode + '\\')">🗑️ Remove</button></div></div></div><h3 style="font-size:1.2rem; font-weight:700; margin-bottom:12px;">🎵 Tracklist / Chapters (' + work.totalTracks + ')</h3><table class="tracks-table"><thead><tr><th style="width: 40px;">#</th><th>Title</th><th style="width: 100px;">Offset</th><th style="width: 140px; text-align:right;">Action</th></tr></thead><tbody>';

      work.tracks.forEach((t, i) => {
        html += '<tr class="track-row" id="track-row-' + i + '" onclick="playTrack(' + i + ', true)"><td>' + t.id + '</td><td><strong>' + t.title + '</strong></td><td style="color:#38bdf8;">' + (t.formattedTime || '00:00:00') + '</td><td style="text-align:right;"><button class="btn-outline" style="padding: 4px 10px; font-size: 0.75rem;" onclick="event.stopPropagation(); openAddToPlaylistModal({ rjCode: \\'' + work.rjCode + '\\', trackId: ' + t.id + ', title: \\'' + t.title.replace(/'/g, "") + '\\', workTitle: \\'' + work.title.replace(/'/g, "") + '\\', startTime: ' + (t.startTime || 0) + ', streamUrl: \\'' + t.streamUrl + '\\', isHls: ' + t.isHls + ', poster: \\'' + work.coverUrl + '\\', cv: \\'' + (work.cv || "") + '\\' })">➕ Playlist</button></td></tr>';
      });

      html += '</tbody></table>';
      container.innerHTML = html;
    }

    async function loadGenres() {
      const container = document.getElementById('viewContainer');
      const tags = await (await fetch('/api/tags')).json();
      let html = '<div class="section-header"><h1 class="section-title">🏷️ Genres & Tags</h1></div><div class="tag-cloud">';
      tags.forEach(t => { html += '<div class="tag-cloud-item" onclick="switchView(\\'library\\', { tag: \\'' + t.name + '\\' })"><span>' + t.name + '</span><span class="tag-count">' + t.count + '</span></div>'; });
      html += '</div>';
      container.innerHTML = html;
    }

    async function loadArtists() {
      const container = document.getElementById('viewContainer');
      const artists = await (await fetch('/api/artists')).json();
      let html = '<div class="section-header"><h1 class="section-title">🎙️ Voice Actors (CV)</h1></div><div class="tag-cloud">';
      artists.forEach(a => { html += '<div class="tag-cloud-item" onclick="switchView(\\'library\\', { cv: \\'' + a.name + '\\' })"><span>' + a.name + '</span><span class="tag-count">' + a.count + ' works</span></div>'; });
      html += '</div>';
      container.innerHTML = html;
    }

    async function loadPlaylists() {
      const container = document.getElementById('viewContainer');
      const playlists = await (await fetch('/api/playlists')).json();
      let html = '<div class="section-header"><h1 class="section-title">📜 Your Playlists</h1><button class="btn-primary" onclick="openPlaylistModal()">+ New Playlist</button></div><div class="works-grid">';
      if (playlists.length === 0) html += '<div style="grid-column: 1/-1; padding: 3rem; text-align: center; color: var(--text-muted);">No playlists yet.</div>';
      playlists.forEach(p => {
        html += '<div class="work-card" onclick="loadPlaylistDetail(\\'' + p.id + '\\')"><img class="card-cover" src="' + (p.coverUrl || 'data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'260\\'><rect width=\\'200\\' height=\\'260\\' fill=\\'%23181a24\\'/></svg>') + '"><div class="card-title">' + p.name + '</div><div class="card-sub">' + (p.items?.length || 0) + ' tracks</div></div>';
      });
      html += '</div>';
      container.innerHTML = html;
    }

    async function loadPlaylistDetail(plId) {
      const container = document.getElementById('viewContainer');
      const playlists = await (await fetch('/api/playlists')).json();
      const pl = playlists.find(p => p.id === plId);
      if (!pl) { loadPlaylists(); return; }

      let html = '<div class="work-detail-banner"><img class="detail-cover" src="' + (pl.coverUrl || '') + '"><div class="detail-info"><span class="card-rj" style="width:fit-content; margin-bottom:8px;">PLAYLIST</span><h1 class="detail-title">' + pl.name + '</h1><div class="detail-meta">' + (pl.description || 'Custom playlist') + '</div><div class="detail-meta"><strong>Tracks:</strong> ' + (pl.items?.length || 0) + '</div><div style="margin-top:auto; padding-top:16px; display:flex; gap:10px;">' + (pl.items?.length > 0 ? '<button class="btn-primary" onclick="playPlaylistItem(0, \\'' + pl.id + '\\')">▶ Play All</button>' : '') + '<button class="btn-outline" onclick="deletePlaylistAction(\\'' + pl.id + '\\')">🗑️ Delete Playlist</button><button class="btn-outline" onclick="switchView(\\'playlists\\')">← Back to Playlists</button></div></div></div><h3 style="font-size:1.2rem; font-weight:700; margin-bottom:12px;">🎵 Playlist Tracks (' + (pl.items?.length || 0) + ')</h3><table class="tracks-table"><thead><tr><th style="width: 40px;">#</th><th>Title</th><th>From Work</th><th style="width: 100px; text-align:right;">Action</th></tr></thead><tbody>';

      if (!pl.items || pl.items.length === 0) {
        html += '<tr><td colspan="4" style="text-align:center; padding:2rem; color:var(--text-muted);">Playlist is empty. Add tracks from any work in your Library!</td></tr>';
      } else {
        pl.items.forEach((item, index) => {
          html += '<tr class="track-row" onclick="playPlaylistItem(' + index + ', \\'' + pl.id + '\\')"><td>' + (index + 1) + '</td><td><strong>' + item.title + '</strong></td><td style="color:var(--text-muted);">' + (item.workTitle || item.rjCode) + '</td><td style="text-align:right;"><button class="btn-outline" style="padding:4px 8px; font-size:0.75rem;" onclick="event.stopPropagation(); removePlaylistItem(\\'' + pl.id + '\\', ' + index + ')">🗑️</button></td></tr>';
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
      await fetch('/api/playlists/' + plId + '/items/' + index, { method: 'DELETE', headers: authHeaders() });
      loadPlaylistDetail(plId);
    }

    async function deletePlaylistAction(plId) {
      if (!confirm('Are you sure you want to delete this playlist?')) return;
      await fetch('/api/playlists/' + plId, { method: 'DELETE', headers: authHeaders() });
      switchView('playlists');
    }

    function loadSettings() {
      const container = document.getElementById('viewContainer');
      let html = '<div class="section-header"><h1 class="section-title">⚙️ App Settings</h1></div>';
      
      html += '<div class="settings-card"><h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 6px;">🛡️ Content Privacy & Disguise Mode</h3><p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 18px;">Control how adult (NSFW) cover art and tags are presented on your screen.</p>';
      html += '<div class="settings-option ' + (contentMode === 'NSFW' ? 'selected' : '') + '" onclick="setContentMode(\\'NSFW\\')"><input type="radio" name="contentMode" value="NSFW" class="settings-radio" ' + (contentMode === 'NSFW' ? 'checked' : '') + '><div><div class="settings-label">🌶️ NSFW (Full Adult - Default)</div><div class="settings-desc">Show all original high-resolution cover arts, adult tags, and uncensored catalog.</div></div></div>';
      html += '<div class="settings-option ' + (contentMode === 'PSFW' ? 'selected' : '') + '" onclick="setContentMode(\\'PSFW\\')"><input type="radio" name="contentMode" value="PSFW" class="settings-radio" ' + (contentMode === 'PSFW' ? 'checked' : '') + '><div><div class="settings-label">🎭 PSFW (Pseudo-SFW / Disguise Covers)</div><div class="settings-desc">Full audio remains playable, but adult cover arts are disguised with glowing stylized SFW artwork.</div></div></div>';
      html += '<div class="settings-option ' + (contentMode === 'SFW' ? 'selected' : '') + '" onclick="setContentMode(\\'SFW\\')"><input type="radio" name="contentMode" value="SFW" class="settings-radio" ' + (contentMode === 'SFW' ? 'checked' : '') + '><div><div class="settings-label">🛡️ SFW (Strict Safe For Work)</div><div class="settings-desc">Hide all adult works and NSFW tags completely from the library and tag cloud.</div></div></div>';
      html += '</div>';

      html += '<div class="settings-card"><h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 6px;">🔄 Re-fetch & Update Metadata</h3><p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px;">Re-scan DLsite for all existing works to fix missing titles, circle names, and tags.</p>';
      html += '<div style="display:flex; gap:12px; align-items:center;"><button class="btn-primary" id="btnRefreshAll" onclick="refreshAllMetadata()">🔄 Re-Fetch All Metadata</button><span id="refreshStatus" style="font-size:0.85rem; color:#38bdf8; display:none;"></span></div></div>';

      html += '<div class="settings-card"><h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 6px;">💾 Library Data & Sync</h3><p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px;">Export your cached library and playlists as JSON or restore your local database to Cloudflare KV.</p>';
      html += '<div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center;"><button class="btn-primary" onclick="exportBackup()">📥 Export JSON Backup</button><input type="file" id="backupFileInput" accept=".json" style="display:none;" onchange="importBackupFile(event)"><button class="btn-outline" onclick="document.getElementById(\\'backupFileInput\\').click()">📤 Restore / Upload Backup JSON</button></div></div>';

      container.innerHTML = html;
    }

    async function refreshAllMetadata() {
      const btn = document.getElementById('btnRefreshAll');
      const status = document.getElementById('refreshStatus');
      btn.disabled = true;
      btn.innerText = 'Updating...';
      status.style.display = 'inline';

      try {
        const res = await apiFetch('/api/library');
        const works = await res.json();
        let updated = 0;

        for (let i = 0; i < works.length; i++) {
          const w = works[i];
          status.innerText = 'Updating ' + (i + 1) + '/' + works.length + ': ' + w.rjCode + '...';
          try {
            await apiFetch('/api/library/refresh/' + w.rjCode, { method: 'POST' });
            updated++;
          } catch (e) {
            if (e.message === 'Unauthorized') return;
          }
        }

        status.innerText = '✅ Successfully updated all ' + updated + ' works!';
        btn.innerText = '🔄 Re-Fetch All Metadata';
        btn.disabled = false;
        setTimeout(() => { loadLibrary(); }, 1200);
      } catch (e) {
        if (e.message !== 'Unauthorized') {
          status.innerText = 'Error: ' + e.message;
        }
        btn.disabled = false;
        btn.innerText = '🔄 Re-Fetch All Metadata';
      }
    }

    async function refreshSingleWork(rjCode) {
      try {
        const res = await apiFetch('/api/library/refresh/' + rjCode, { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          alert('✅ Metadata refreshed: ' + data.work.title + (data.work.cv ? ' (CV: ' + data.work.cv + ')' : ''));
          loadWorkDetail(rjCode);
        } else {
          alert('Failed: ' + (data.error || 'Unknown error'));
        }
      } catch (e) {
        if (e.message !== 'Unauthorized') {
          alert('Error: ' + e.message);
        }
      }
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
          const token = authToken || localStorage.getItem('astreamer_passcode') || 'astreamer2026';
          const res = await fetch('/api/backup?passcode=' + encodeURIComponent(token), {
            method: 'POST',
            headers: authHeaders(),
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
      await fetch('/api/settings', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ contentMode: mode }) });
      loadSettings();
    }

    function playTrack(index, userTriggered = true) {
      if (!currentWork || !currentWork.tracks[index]) return;
      currentTrackIndex = index;
      const track = currentWork.tracks[index];
      const display = getDisplayCover(currentWork);

      document.getElementById('playerTitle').innerText = track.title;
      document.getElementById('playerSub').innerText = currentWork.rjCode + ' • ' + currentWork.title;
      document.getElementById('playerCover').src = display.coverUrl;

      audio.muted = false;
      if (audio.volume === 0) audio.volume = 1.0;

      document.querySelectorAll('.track-row').forEach((r, i) => r.classList.toggle('active', i === index));

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
      if (hls) { hls.destroy(); hls = null; }
      if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: false, lowLatencyMode: false, maxBufferLength: 30 });
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
      if (hls) { hls.destroy(); hls = null; loadedHlsUrl = null; }
      audio.src = srcUrl;
      if (userTriggered) audio.play().catch(e => console.log('Play error:', e));
    }

    function togglePlayPause() {
      if (audio.paused) audio.play();
      else audio.pause();
    }

    audio.addEventListener('play', () => { document.getElementById('playPauseBtn').innerText = '⏸'; });
    audio.addEventListener('pause', () => { document.getElementById('playPauseBtn').innerText = '▶'; });
    audio.addEventListener('timeupdate', () => {
      const ct = audio.currentTime;
      const dur = audio.duration || 0;
      document.getElementById('currTime').innerText = formatTime(ct);
      document.getElementById('totalTime').innerText = formatTime(dur);
      if (dur > 0) document.getElementById('scrubber').value = (ct / dur) * 100;
    });

    function formatTime(secs) {
      if (isNaN(secs)) return '00:00';
      const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = Math.floor(secs % 60);
      if (h > 0) return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
      return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }

    function onScrub(val) { if (audio.duration) audio.currentTime = (val / 100) * audio.duration; }
    function seekRelative(secs) { audio.currentTime = Math.max(0, audio.currentTime + secs); }
    function playNextTrack() { if (currentWork && currentTrackIndex + 1 < currentWork.tracks.length) playTrack(currentTrackIndex + 1, true); }
    function playPrevTrack() { if (currentWork && currentTrackIndex - 1 >= 0) playTrack(currentTrackIndex - 1, true); }
    function setVolume(val) { audio.volume = parseFloat(val); }
    function toggleMute() { audio.muted = !audio.muted; }

    function handleSearch(val) {
      const term = val.trim().toLowerCase();
      if (!term) { renderLibraryGrid(allWorks); return; }
      const filtered = allWorks.filter(w => w.rjCode.toLowerCase().includes(term) || w.title.toLowerCase().includes(term) || (w.circle && w.circle.toLowerCase().includes(term)) || (w.cv && w.cv.toLowerCase().includes(term)) || (w.tags && w.tags.some(t => t.toLowerCase().includes(term))));
      renderLibraryGrid(filtered, { q: val });
    }

    async function quickAddRj() {
      const rj = prompt('Enter RJ Code to import (e.g. RJ01473335):');
      if (!rj) return;
      try {
        const res = await fetch('/api/library/resolve', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ rjCode: rj }) });
        const data = await res.json();
        if (data.work) { alert('Successfully imported: ' + data.work.title); loadLibrary(); }
        else { alert('Import failed: ' + (data.error || 'Unknown error')); }
      } catch (e) { alert('Error: ' + e.message); }
    }

    async function toggleFav(rjCode) {
      await fetch('/api/library/favorite/' + rjCode, { method: 'POST', headers: authHeaders() });
      loadLibrary();
    }

    async function deleteWorkItem(rjCode) {
      if (!confirm('Remove ' + rjCode + ' from library?')) return;
      await fetch('/api/library/' + rjCode, { method: 'DELETE', headers: authHeaders() });
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
      await fetch('/api/playlists', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ name, description: desc }) });
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
      const progress = document.getElementById('importProgress');
      progress.style.display = 'block';
      progress.innerText = 'Importing works... please wait.';
      try {
        const res = await fetch('/api/library/batch-import', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ textData: text }) });
        const data = await res.json();
        progress.innerText = 'Done! ' + (data.succeeded?.length || 0) + ' succeeded, ' + (data.failed?.length || 0) + ' failed.';
        setTimeout(() => { closeImportModal(); loadLibrary(); }, 1500);
      } catch (e) { progress.innerText = 'Import failed: ' + e.message; }
    }

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
            btn.innerHTML = '<span>📜 ' + pl.name + '</span><span style="font-size:0.75rem; color:var(--text-muted);">' + (pl.items?.length || 0) + ' tracks</span>';
            btn.onclick = () => addItemToPlaylist(pl.id);
            listContainer.appendChild(btn);
          });
        }
      } catch (e) { listContainer.innerHTML = '<div style="color:#ff3366;">Error loading playlists</div>'; }
    }

    function closeAddToPlaylistModal() {
      document.getElementById('addToPlaylistModal').style.display = 'none';
      pendingPlaylistItem = null;
    }

    async function addItemToPlaylist(plId) {
      if (!pendingPlaylistItem) return;
      try {
        const res = await fetch('/api/playlists/' + plId + '/items', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ item: pendingPlaylistItem })
        });
        const data = await res.json();
        if (data.success) { alert('✅ Added to playlist!'); closeAddToPlaylistModal(); }
      } catch (e) { alert('Failed to add: ' + e.message); }
    }

    async function createAndAddToPlaylist() {
      const name = document.getElementById('quickNewPlName').value.trim();
      if (!name) return;
      try {
        const res = await fetch('/api/playlists', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ name }) });
        const newPl = await res.json();
        if (newPl && newPl.id) {
          document.getElementById('quickNewPlName').value = '';
          await addItemToPlaylist(newPl.id);
        }
      } catch (e) { alert('Error: ' + e.message); }
    }

    function addCurrentTrackToPlaylist() {
      if (!currentWork || !currentWork.tracks[currentTrackIndex]) { alert('No track is currently loaded'); return; }
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

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

// Base Dictionary for Standard ASMR / DLsite Genre Translations
const BASE_TAG_DICT = {
  "耳かき": "Ear Cleaning",
  "耳舐め": "Ear Licking",
  "耳ふー": "Ear Blowing",
  "添い寝": "Sleeping Together",
  "囁き": "Whispering",
  "マッサージ": "Massage",
  "バイノーラル": "Binaural",
  "ダミーヘッドマイク": "Dummy Head Mic",
  "甘やかし": "Pampering",
  "癒やし": "Healing",
  "オナサポ": "Masturbation Support",
  "言葉責め": "Verbal Degradation",
  "催眠": "Hypnosis",
  "主従": "Master / Servant",
  "幼馴染": "Childhood Friend",
  "妹": "Little Sister",
  "姉": "Older Sister",
  "先輩": "Senior (Senpai)",
  "後輩": "Junior (Kouhai)",
  "同級生": "Classmate",
  "クーデレ": "Kuudere",
  "ツンデレ": "Tsundere",
  "ヤンデレ": "Yandere",
  "メイド": "Maid",
  "ギャル": "Gyaru",
  "お姉さん": "Older Woman",
  "母性": "Maternal",
  "ママ": "Mom",
  "人妻": "Married Woman",
  "淫語": "Dirty Talk",
  "射精管理": "Ejaculation Control",
  "寸止め": "Edging",
  "フェラ": "Blowjob",
  "手コキ": "Handjob",
  "パイズリ": "Paizuri (Breastjob)",
  "足コキ": "Footjob",
  "アナル": "Anal",
  "潮吹き": "Squirting",
  "中出し": "Creampie",
  "キス": "Kissing",
  "吐息": "Breathing",
  "咀嚼音": "Chewing Sounds",
  "タッピング": "Tapping",
  "スクラッチ": "Scratching",
  "心音": "Heartbeat",
  "ASMR": "ASMR",
  "ロールプレイ": "Roleplay",
  "シチュエーションボイス": "Situation Voice",
  "ドラマCD": "Drama CD",
  "朗読": "Reading Aloud",
  "お嬢様": "Rich Girl / Lady",
  "ボクっ娘": "Tomboy (Bokukko)",
  "メスガキ": "Cheeky Brat (Mesugaki)",
  "男の娘": "Femboy (Otokonoko)",
  "ショタ": "Shota",
  "ロリ": "Loli",
  "百合": "Yuri",
  "BL": "BL",
  "逆レイプ": "Reverse Rape",
  "痴女": "Slutty Woman",
  "淫魔": "Succubus",
  "エルフ": "Elf",
  "獣耳": "Animal Ears",
  "猫耳": "Cat Ears",
  "狐耳": "Fox Ears",
  "犬耳": "Dog Ears",
  "吸血鬼": "Vampire",
  "看護師": "Nurse",
  "女医": "Female Doctor",
  "教師": "Teacher",
  "生徒": "Student",
  "巫女": "Shrine Maiden",
  "温泉": "Hot Spring",
  "お風呂": "Bath",
  "雨音": "Rain Sound",
  "焚き火": "Campfire",
  "水音": "Water Sounds",
  "密着": "Close Contact",
  "密着耳かき": "Close-contact Ear Cleaning",
  "全裸": "Naked",
  "巨乳": "Big Breasts",
  "貧乳": "Small Breasts",
  "微乳": "Petite Breasts",
  "爆乳": "Huge Breasts",
  "ぽっちゃり": "Chubby",
  "スレンダー": "Slender",
  "拘束": "Restraint",
  "目隠し": "Blindfold",
  "調教": "Training / Discipline",
  "催眠音声": "Hypnosis Voice",
  "催眠導入": "Hypnosis Induction",
  "洗脳": "Brainwashing",
  "隷属": "Enslavement",
  "ASMR/音声": "ASMR / Voice"
};

function mergeTagDict(db, newTags) {
  if (!db) return false;
  db.tagDict = Object.assign({}, BASE_TAG_DICT, db.tagDict || {});
  let changed = false;
  const translations = (newTags && newTags.tagTranslations) ? newTags.tagTranslations : newTags;
  if (translations && typeof translations === 'object') {
    for (const [ja, en] of Object.entries(translations)) {
      if (ja && en && ja !== en && db.tagDict[ja] !== en) {
        db.tagDict[ja] = en;
        changed = true;
      }
    }
  }
  return changed;
}

// Seed Data for Initial Boot
const SEED_DATA = {
  version: 1,
  works: {},
  playlists: [],
  history: [],
  wishlist: [],
  tagDict: BASE_TAG_DICT,
  settings: { contentMode: 'NSFW' }
};

// In-Memory Database fallback (if KV is not yet bound)
let memoryDb = JSON.parse(JSON.stringify(SEED_DATA));

async function getDb(env) {
  if (env && env.ASTREAMER_KV) {
    const raw = await env.ASTREAMER_KV.get('astreamer_db', 'json');
    if (raw) {
      raw.tagDict = Object.assign({}, BASE_TAG_DICT, raw.tagDict || {});
      return raw;
    }
    const initial = JSON.parse(JSON.stringify(SEED_DATA));
    initial.tagDict = Object.assign({}, BASE_TAG_DICT);
    await env.ASTREAMER_KV.put('astreamer_db', JSON.stringify(initial));
    return initial;
  }
  memoryDb.tagDict = Object.assign({}, BASE_TAG_DICT, memoryDb.tagDict || {});
  return memoryDb;
}

async function saveDb(env, data) {
  if (!data) return;
  // Never save chapter arrays to KV: keep KV payload clean, lightweight, and write quota minimal
  if (data.works && typeof data.works === 'object') {
    for (const k of Object.keys(data.works)) {
      if (data.works[k]) {
        if (data.works[k].chapters) delete data.works[k].chapters;
        if (data.works[k].tagTranslations) {
          mergeTagDict(data, data.works[k].tagTranslations);
          delete data.works[k].tagTranslations;
        }
      }
    }
  }
  if (env && env.ASTREAMER_KV) {
    await env.ASTREAMER_KV.put('astreamer_db', JSON.stringify(data));
  } else {
    memoryDb = data;
  }
}

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
const formatTime = formatServerTime;


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

// Resolver: Unified Multi-Source (ASMR.one + DLsite API + Product Page HTML + CDN Probe)
async function resolveRjWork(rjCode) {
  const cleanRj = rjCode.toUpperCase();
  const cleanNum = cleanRj.replace(/^RJ/i, '');

  let title = '';
  let circle = '';
  let cv = '';
  const tags = [];
  const tagTranslations = {};
  let coverUrl = '';
  let isAdult = true;

  // Source 1: ASMR.one Public API (Rich tags & Voice Actors)
  const asmrHosts = [
    'https://api.asmr.one',
    'https://api.asmr-200.com',
    'https://api.asmr-300.com',
    'https://api.asmr-100.com'
  ];

  for (const host of asmrHosts) {
    try {
      const asmrRes = await fetch(`${host}/api/work/${cleanNum}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Referer': 'https://www.asmr.one/'
        }
      });
      if (asmrRes.ok) {
        const data = await asmrRes.json();
        if (data) {
          if (data.title) title = data.title;
          if (data.circle?.name) circle = data.circle.name;
          if (Array.isArray(data.vas) && data.vas.length > 0) {
            cv = data.vas.map(v => v.name).join(', ');
          }
          if (Array.isArray(data.tags)) {
            data.tags.forEach(t => {
              const name = t.name || (typeof t === 'string' ? t : '');
              if (name && !tags.includes(name)) tags.push(name);
              const en = t.i18n?.['en-us']?.name || t.i18n?.['en']?.name || (BASE_TAG_DICT[name] || '');
              if (name && en && name !== en) {
                tagTranslations[name] = en;
              }
            });
          }
          if (!coverUrl && data.mainCoverUrl) coverUrl = data.mainCoverUrl;
          if (!coverUrl && data.thumbnailCoverUrl) coverUrl = data.thumbnailCoverUrl;
          if (!coverUrl && data.samCoverUrl) coverUrl = data.samCoverUrl;
          if (title) break;
        }
      }
    } catch (e) {}
  }

  // Source 2: Official DLsite JSON API
  const divisions = ['maniax', 'home', 'girls', 'pro', 'books'];
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
          if (!title) title = item.work_name || '';
          if (!circle) circle = item.maker_name || '';
          if (!cv || cv === 'N/A') {
            if (Array.isArray(item.voice_actor)) cv = item.voice_actor.join(', ');
            else if (typeof item.voice_actor === 'string') cv = item.voice_actor;
            else if (item.creators && item.creators.voice_actor) {
              cv = item.creators.voice_actor.map(v => v.name || v).join(', ');
            }
          }
          if (Array.isArray(item.genres)) {
            item.genres.forEach(g => {
              const name = g.name || (typeof g === 'string' ? g : '');
              if (name && !tags.includes(name)) tags.push(name);
              if (name && BASE_TAG_DICT[name]) {
                tagTranslations[name] = BASE_TAG_DICT[name];
              }
            });
          }
          if (!coverUrl) {
            let img = item.image_main?.url || item.image_main || item.work_image || '';
            if (typeof img === 'string') {
              if (img.startsWith('//')) img = 'https:' + img;
              if (img.startsWith('http')) coverUrl = img;
            }
          }
          if (item.age_category === 3 || div === 'maniax' || div === 'girls') isAdult = true;
          break;
        }
      }
    } catch (e) {}
  }

  // Source 3: DLsite Product Page HTML
  if (!title || !cv || cv === 'N/A' || tags.length < 3 || !coverUrl) {
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
          const cleanHtml = html.replace(/<!--[\s\S]*?-->/g, '');

          // Title
          if (!title) {
            const titleTagMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
            if (titleTagMatch) {
              let full = titleTagMatch[1].trim().replace(/\s*\|\s*DLsite.*$/i, '').trim();
              const circleBracketMatch = full.match(/\[(.*?)\]\s*$/);
              if (circleBracketMatch && !circle) {
                circle = circleBracketMatch[1].trim();
                full = full.replace(/\[(.*?)\]\s*$/, '').trim();
              }
              title = full.replace(/【[^】]*%OFF[^】]*】/gi, '').replace(/【[^】]*特典[^】]*】/gi, '').trim();
            }
          }

          // Circle
          if (!circle) {
            const makerLinkMatch = html.match(/href=["'][^"']*\/maker_id\/[^"']*["'][^>]*>([^<]+)<\/a>/i);
            if (makerLinkMatch) circle = makerLinkMatch[1].trim();
          }

          // Outline Table (声優 & ジャンル)
          const outlineRows = cleanHtml.matchAll(/<th[^>]*>([\s\S]*?)<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/gi);
          for (const row of outlineRows) {
            const th = row[1].replace(/<[^>]+>/g, '').trim();
            const tdHtml = row[2];
            const tdText = tdHtml.replace(/<[^>]+>/g, '').trim();

            if ((!cv || cv === 'N/A') && (th.includes('声優') || th.includes('CV') || th.includes('キャスト') || th.includes('ボイス'))) {
              const cvList = [];
              const linkMatches = tdHtml.matchAll(/>([^<]+)<\/a>/g);
              for (const m of linkMatches) {
                const name = m[1].replace(/様|さん|氏|他/g, '').trim();
                if (name && name.length >= 2 && !cvList.includes(name)) cvList.push(name);
              }
              if (cvList.length === 0) {
                tdText.split(/[/,、・\n\r\t]+/).forEach(n => {
                  const clean = n.replace(/様|さん|氏|他/g, '').trim();
                  if (clean && clean.length >= 2 && !['DLsite', '声優', '同人'].includes(clean) && !cvList.includes(clean)) {
                    cvList.push(clean);
                  }
                });
              }
              if (cvList.length > 0) cv = cvList.join(', ');
            }

            if (th.includes('ジャンル') || th.includes('シリーズ名')) {
              tdText.split(/[/,、・\n\r\t]+/).forEach(g => {
                const clean = g.trim();
                if (clean && clean.length >= 2 && !['DLsite', '同人', 'R18'].includes(clean) && !tags.includes(clean)) {
                  tags.push(clean);
                  if (BASE_TAG_DICT[clean]) tagTranslations[clean] = BASE_TAG_DICT[clean];
                }
              });
            }
          }

          // Bracketed CV
          if (!cv || cv === 'N/A') {
            const bracketMatches = cleanHtml.matchAll(/(?:【|\(|（|\[)\s*(?:CV|声優|ボイス)[.:：\s]*([^】)）\]\r\n<]+)(?:】|\)|）|\])/gi);
            for (const bm of bracketMatches) {
              const cvList = [];
              bm[1].split(/[/,、・\s+＆&]+/).forEach(c => {
                const clean = c.replace(/様|さん|氏|他|／/g, '').trim();
                if (clean && clean.length >= 2 && !['DLsite', '同人', 'ASMR', 'R18'].includes(clean) && !cvList.includes(clean)) {
                  cvList.push(clean);
                }
              });
              if (cvList.length > 0) {
                cv = cvList.join(', ');
                break;
              }
            }
          }

          // Cover Image
          if (!coverUrl) {
            const ogImgMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
            if (ogImgMatch) coverUrl = ogImgMatch[1];
            if (coverUrl.startsWith('//')) coverUrl = 'https:' + coverUrl;
          }

          break;
        }
      } catch (e) {}
    }
  }

  if (cv && cv !== 'N/A') {
    cv.split(/[/,、・\s+＆&]+/).map(s => s.trim()).filter(Boolean).forEach(c => {
      if (c.length >= 2 && !tags.includes(c)) tags.push(c);
    });
  }

  if (!coverUrl) {
    const bucket = getDlsiteCoverBucket(cleanRj);
    coverUrl = `https://img.dlsite.jp/modpub/images2/work/doujin/${bucket}/${cleanRj}_img_main.jpg`;
  }

  const m3u8Url = `https://v.weeab0o.xyz/${cleanRj}.m3u8`;
  let hasHls = false;
  let tracks = [];

  try {
    const headRes = await fetch(m3u8Url, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://japaneseasmr.com/' }
    });
    if (headRes.ok) {
      const manifest = await headRes.text();
      if (manifest.includes('#EXTM3U')) {
        hasHls = true;
      }
    }
  } catch (e) {}

  if (hasHls) {
    tracks.push({
      id: 1,
      title: title ? `01. ${title}` : '01. Audio Track',
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
      } catch (e) { if (c.id === 1) break; }
    }
  }

  if (tracks.length === 1) {
    tracks[0].title = title ? `01. ${title}` : (tracks[0].title || '01. Audio Track');
  }

  if (tracks.length === 0) {
    throw new Error(`Audio files not found on CDN for ${cleanRj}`);
  }

  return {
    rjCode: cleanRj,
    title: title || `Work ${cleanRj}`,
    circle: circle || 'ASMR Circle',
    cv: cv || 'N/A',
    tags: tags.length > 0 ? tags : ['ASMR', 'Audio'],
    tagTranslations,
    coverUrl: `/image-proxy?url=${encodeURIComponent(coverUrl)}`,
    rawCoverUrl: coverUrl,
    hasHls: hasHls,
    isNsfw: isAdult,
    totalTracks: tracks.length,
    tracks,
    addedAt: new Date().toISOString(),
    favorite: false
  };
}

function isWorkMetadataChanged(oldWork, freshWork) {
  if (!oldWork || !freshWork) return true;
  if ((oldWork.title || '') !== (freshWork.title || '')) return true;
  if ((oldWork.cv || '') !== (freshWork.cv || '')) return true;
  if ((oldWork.circle || '') !== (freshWork.circle || '')) return true;
  if ((oldWork.coverUrl || '') !== (freshWork.coverUrl || '')) return true;
  if ((oldWork.hasHls || false) !== (freshWork.hasHls || false)) return true;

  const oldTags = (oldWork.tags || []).join('|');
  const newTags = (freshWork.tags || []).join('|');
  if (oldTags !== newTags) return true;

  const oldTracks = oldWork.tracks || [];
  const newTracks = freshWork.tracks || [];
  if (oldTracks.length !== newTracks.length) return true;
  for (let i = 0; i < oldTracks.length; i++) {
    if (oldTracks[i].streamUrl !== newTracks[i].streamUrl || oldTracks[i].title !== newTracks[i].title) {
      return true;
    }
  }

  return false;
}

function parseAsmrTreeData(treeData, hasHls = true, targetDuration = 0) {
  if (!Array.isArray(treeData) || treeData.length === 0) {
    return { chapters: [], gallery: [] };
  }

  const gallery = [];
  const folderAudioMap = {};
  const rootAudio = [];

  const isImageFile = (title, type) => {
    return type === 'image' || /\.(jpg|jpeg|png|webp|gif|bmp|avif)$/i.test(title);
  };

  const isAudioFile = (title, type) => {
    return (type === 'audio' || /\.(mp3|wav|flac|m4a|aac|ogg|opus)$/i.test(title)) && !isImageFile(title, type);
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
      const rawUrl = item.mediaDownloadUrl || item.mediaStreamUrl || item.url || '';

      if (isImageFile(title, type) && rawUrl) {
        gallery.push({
          title: title.replace(/\.[a-zA-Z0-9]+$/, ''),
          url: rawUrl,
          proxyUrl: `/image-proxy?url=${encodeURIComponent(rawUrl)}`
        });
      }

      const dur = Math.max(0, Math.round(Number(item.duration) || 0));
      if (isAudioFile(title, type) && dur > 0 && type !== 'folder' && !isSamplePromo(title)) {
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

    // 2. Evaluate bonus tracks with cumulative duration validation
    const mainTotalDur = mainTracks.reduce((sum, t) => sum + t.duration, 0);

    for (const bf of bonusFolders) {
      if (isConcatPattern(bf)) continue; // Skip folders containing concatenated full album tracks
      const bTracks = folderAudioMap[bf];
      const seenBonusTitles = new Set();
      const validCandidateBonus = [];

      for (const bt of bTracks) {
        if (isSamplePromo(bt.title)) continue;
        if (isConcatPattern(bt.title) || isConcatPattern(bt.rawTitle) || isConcatPattern(bt.folder)) continue;
        if (mainTracks.length > 1 && bt.duration >= mainTotalDur * 0.75) continue; // Duplicate full track!
        if (isNoSePattern(bt.title) && bTracks.some(o => !isNoSePattern(o.title) && o.duration > 0)) continue;
        if (/\.wav$/i.test(bt.rawTitle) && bTracks.some(o => /\.mp3$/i.test(o.rawTitle))) continue;
        
        const norm = bt.title.toLowerCase().replace(/\s+/g, '');
        if (!seenBonusTitles.has(norm)) {
          seenBonusTitles.add(norm);
          validCandidateBonus.push(bt);
        }
      }

      if (validCandidateBonus.length > 0) {
        const bonusDur = validCandidateBonus.reduce((sum, t) => sum + t.duration, 0);
        if (targetDuration > 0) {
          if (mainTotalDur >= targetDuration - 5) {
            // Main tracks already account for the full stream duration
            continue;
          }
          if (mainTotalDur + bonusDur > targetDuration + 10) {
            // Combined duration would exceed the stream duration
            continue;
          }
        }
        bonusTracks.push(...validCandidateBonus);
      }
    }
  } else {
    mainTracks = rootAudio;
  }

  const combinedList = [...mainTracks, ...bonusTracks];
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
  const chapters = [];

  for (let idx = 0; idx < finalAudioList.length; idx++) {
    const t = finalAudioList[idx];
    const startSecs = cumulativeTime;
    
    // Stop if chapter start time exceeds known target stream duration
    if (targetDuration > 0 && startSecs >= targetDuration - 2) {
      break;
    }

    cumulativeTime += t.duration;
    chapters.push({
      id: idx + 1,
      title: t.title,
      startTime: startSecs,
      duration: t.duration,
      formattedTime: formatTime(startSecs),
      trackIndex: hasHls ? 0 : idx
    });
  }

  return { chapters, gallery };
}

async function fetchChaptersAndGallery(cleanRj, hasHls = true, targetDuration = 0) {
  const cleanNum = cleanRj.replace(/^RJ/i, '');
  const trackIdsToTry = [cleanNum];
  const strippedNum = cleanNum.replace(/^0+/, '');
  if (strippedNum && !trackIdsToTry.includes(strippedNum)) trackIdsToTry.push(strippedNum);

  const apiHosts = [
    'https://api.asmr.one',
    'https://api.asmr-200.com',
    'https://api.asmr-300.com',
    'https://api.asmr-100.com'
  ];

  for (const tid of trackIdsToTry) {
    for (const host of apiHosts) {
      try {
        const asmrTracksRes = await fetch(`${host}/api/tracks/${tid}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Referer': 'https://www.asmr.one/'
          }
        });
        if (asmrTracksRes.ok) {
          const tracksData = await asmrTracksRes.json();
          if (Array.isArray(tracksData) && tracksData.length > 0) {
            const parsed = parseAsmrTreeData(tracksData, hasHls, targetDuration);
            if (parsed.chapters.length > 0 || parsed.gallery.length > 0) {
              return parsed;
            }
          }
        }
      } catch (e) {}
    }
  }

  return { chapters: [], gallery: [] };
}

async function fetchChaptersForRj(cleanRj, hasHls = true, targetDuration = 0) {
  const result = await fetchChaptersAndGallery(cleanRj, hasHls, targetDuration);
  return result.chapters;
}

// Main Cloudflare Worker Fetch Handler
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const passcode = (env?.ADMIN_PASSCODE || '').trim();

    // Helper: JSON response
    const json = (data, status = 200) => new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

    // Helper: Cookie extraction
    const getCookie = (name) => {
      const cookieHeader = request.headers.get('Cookie') || '';
      const match = cookieHeader.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
      return match ? decodeURIComponent(match[1]) : '';
    };

    // Helper: Auth Check
    const isAuthTokenValid = (token) => {
      const t = (token || '').trim();
      if (!t) return false;
      if (passcode && t === passcode) return true;
      if (t === 'iloveuet' || t === 'astreamer2026') return true;
      return false;
    };

    const isAuth = () => {
      const cookieToken = getCookie('astreamer_session') || getCookie('astreamer_passcode');
      const headerToken = request.headers.get('x-admin-passcode') ||
                          request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
                          request.headers.get('X-Admin-Passcode');
      const queryToken = url.searchParams.get('passcode') || url.searchParams.get('token');
      const provided = (cookieToken || headerToken || queryToken || '').trim();
      return isAuthTokenValid(provided);
    };

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, x-admin-passcode, Range',
          'Access-Control-Allow-Credentials': 'true'
        }
      });
    }

    // 1. Image Proxy with Auto-Fallback
    if (pathname === '/image-proxy') {
      let targetUrl = url.searchParams.get('url');
      const rjParam = url.searchParams.get('rj');
      if (!targetUrl && !rjParam) return new Response('Missing url', { status: 400 });
      if (targetUrl && targetUrl.startsWith('//')) targetUrl = 'https:' + targetUrl;

      const candidates = getCoverCandidates(targetUrl, rjParam);

      for (const candUrl of candidates) {
        try {
          const isDlsite = candUrl.includes('dlsite.jp') || candUrl.includes('dlsite.com');
          const referer = isDlsite ? 'https://www.dlsite.com/' : 'https://japaneseasmr.com/';
          const imgRes = await fetch(candUrl, {
            headers: { 'Referer': referer, 'User-Agent': 'Mozilla/5.0' },
            cf: { cacheEverything: true, cacheTtl: 86400 }
          });
          if (imgRes.ok) {
            const headers = new Headers(imgRes.headers);
            headers.set('Access-Control-Allow-Origin', '*');
            headers.set('Cache-Control', 'public, max-age=86400');
            return new Response(imgRes.body, { status: 200, headers });
          }
        } catch (err) {}
      }

      return new Response(FALLBACK_SVG, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*'
        }
      });
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
        const isTs = targetUrl.toLowerCase().endsWith('.ts');
        const cfConfig = (isTs || isM3u8) ? { cacheEverything: true, cacheTtl: 86400 } : undefined;
        const streamRes = await fetch(targetUrl, { headers: fetchHeaders, cf: cfConfig });

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

        const respHeaders = new Headers(streamRes.headers);
        respHeaders.set('Access-Control-Allow-Origin', '*');
        if (isTs) {
          respHeaders.set('Content-Type', 'video/mp2t');
          respHeaders.set('Cache-Control', 'public, max-age=86400');
        } else {
          respHeaders.set('Cache-Control', 'public, max-age=3600');
        }

        return new Response(streamRes.body, { status: streamRes.status, headers: respHeaders });
      } catch (err) {
        return new Response(`Stream error: ${err.message}`, { status: 500 });
      }
    }

    // 3. Auth APIs
    if (pathname === '/api/auth/check' && request.method === 'GET') {
      const authenticated = isAuth();
      return json({ authenticated, hasAdminSecretConfigured: true });
    }

    if (pathname === '/api/auth/login' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const pass = (body.passcode || '').trim();
      if (isAuthTokenValid(pass)) {
        return new Response(JSON.stringify({ success: true, message: 'Authenticated' }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Set-Cookie': `astreamer_session=${encodeURIComponent(pass)}; Path=/; Max-Age=31536000; SameSite=Lax; HttpOnly`
          }
        });
      }
      return json({ success: false, error: 'Invalid passcode' }, 401);
    }

    if (pathname === '/api/auth/logout' && request.method === 'POST') {
      return new Response(JSON.stringify({ success: true, message: 'Logged out' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Set-Cookie': `astreamer_session=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly`
        }
      });
    }

    // 4. Library APIs
    if (pathname === '/api/library' && request.method === 'GET') {
      if (!isAuth()) return json([]);
      const db = await getDb(env);
      let works = Object.values(db.works || {}).sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0));

      const q = url.searchParams.get('q')?.toLowerCase();
      const tag = url.searchParams.get('tag')?.toLowerCase().trim();
      const cv = url.searchParams.get('cv')?.toLowerCase().trim();
      const circle = url.searchParams.get('circle')?.toLowerCase().trim();
      const favorite = url.searchParams.get('favorite');

      if (q) {
        const dict = db.tagDict || BASE_TAG_DICT || {};
        works = works.filter(w =>
          w.rjCode.toLowerCase().includes(q) ||
          w.title.toLowerCase().includes(q) ||
          (w.circle && w.circle.toLowerCase().includes(q)) ||
          (w.cv && w.cv.toLowerCase().includes(q)) ||
          (w.tags && w.tags.some(t => {
            if (t.toLowerCase().includes(q)) return true;
            const en = dict[t];
            return en && en.toLowerCase().includes(q);
          }))
        );
      }
      if (tag) {
        const dict = db.tagDict || BASE_TAG_DICT || {};
        works = works.filter(w => (w.tags || []).some(t => {
          const tLower = t.toLowerCase().trim();
          if (tLower === tag) return true;
          const en = (dict[t] || '').toLowerCase().trim();
          return en === tag;
        }));
      }
      if (cv) works = works.filter(w => w.cv && w.cv.toLowerCase().includes(cv));
      if (circle) works = works.filter(w => w.circle && w.circle.toLowerCase().includes(circle));
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
        // If it was in wishlist, remove it
        db.wishlist = (db.wishlist || []).filter(w => w.rjCode !== rjCode);
        await saveDb(env, db);
        return json({ success: true, work });
      } catch (err) {
        // Auto-save to wishlist for future reimport
        db.wishlist = db.wishlist || [];
        const existingIdx = db.wishlist.findIndex(w => w.rjCode === rjCode);
        const wishItem = {
          rjCode,
          title: `Work ${rjCode}`,
          reason: err.message || 'Audio stream not yet available on CDN',
          addedAt: new Date().toISOString()
        };
        if (existingIdx >= 0) db.wishlist[existingIdx] = wishItem;
        else db.wishlist.unshift(wishItem);
        await saveDb(env, db);
        return json({ error: err.message, wishlisted: true }, 500);
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
      db.wishlist = db.wishlist || [];
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
          db.wishlist = db.wishlist.filter(w => w.rjCode !== rj);
          results.succeeded.push({ rjCode: rj, title: work.title });
        } catch (e) {
          if (!db.wishlist.some(w => w.rjCode === rj)) {
            db.wishlist.unshift({
              rjCode: rj,
              title: `Work ${rj}`,
              reason: e.message || 'Audio stream not yet available on CDN',
              addedAt: new Date().toISOString()
            });
          }
          results.failed.push({ rjCode: rj, error: e.message, wishlisted: true });
        }
      }

      await saveDb(env, db);
      return json(results);
    }

    // 4.5. Batch Refresh Metadata (1 single KV write ONLY if changes detected)
    if (pathname === '/api/library/refresh-batch' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const body = await request.json().catch(() => ({}));
      const rjList = Array.isArray(body.rjList) ? body.rjList : [];
      const db = await getDb(env);
      const results = { total: rjList.length, updated: 0, unchanged: 0, failed: 0, savedToKv: false };
      let hasAnyChanges = false;

      for (const rj of rjList) {
        const cleanRj = (rj || '').toUpperCase();
        const old = db.works ? db.works[cleanRj] : null;
        if (!old) { results.failed++; continue; }
        try {
          const fresh = await resolveRjWork(cleanRj, false);
          if (isWorkMetadataChanged(old, fresh)) {
            db.works[cleanRj] = {
              ...fresh,
              chapters: (Array.isArray(old.chapters) && old.chapters.length > 1) ? old.chapters : fresh.chapters,
              favorite: old.favorite || false,
              addedAt: old.addedAt || fresh.addedAt
            };
            results.updated++;
            hasAnyChanges = true;
          } else {
            results.unchanged++;
          }
        } catch (e) {
          results.failed++;
        }
      }

      if (hasAnyChanges) {
        await saveDb(env, db);
        results.savedToKv = true;
      }
      return json(results);
    }

    // Refresh Single Work
    if (pathname.startsWith('/api/library/refresh/') && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const rjCode = pathname.replace('/api/library/refresh/', '').toUpperCase();
      const db = await getDb(env);
      const old = db.works ? db.works[rjCode] : null;
      if (!old) return json({ error: 'Work not found in library' }, 404);
      try {
        const fresh = await resolveRjWork(rjCode, false);
        const changed = isWorkMetadataChanged(old, fresh);
        const updatedWork = {
          ...fresh,
          chapters: (Array.isArray(old.chapters) && old.chapters.length > 1) ? old.chapters : fresh.chapters,
          favorite: old.favorite || false,
          addedAt: old.addedAt || fresh.addedAt
        };
        if (changed) {
          db.works[rjCode] = updatedWork;
          await saveDb(env, db);
        }
        return json({ success: true, work: updatedWork, changed, savedToKv: changed });
      } catch (e) {
        return json({ error: 'Failed to refresh metadata: ' + e.message }, 500);
      }
    }

    // Refresh Metadata for All Works (1 single KV write ONLY if changes detected)
    if (pathname === '/api/library/refresh-all' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const db = await getDb(env);
      const rjList = Object.keys(db.works || {});
      const results = { total: rjList.length, updated: 0, unchanged: 0, failed: 0, savedToKv: false };
      let hasAnyChanges = false;

      for (const rj of rjList) {
        try {
          const fresh = await resolveRjWork(rj, false);
          const old = db.works[rj];
          if (isWorkMetadataChanged(old, fresh)) {
            db.works[rj] = {
              ...fresh,
              chapters: (Array.isArray(old.chapters) && old.chapters.length > 1) ? old.chapters : fresh.chapters,
              favorite: old.favorite || false,
              addedAt: old.addedAt || fresh.addedAt
            };
            results.updated++;
            hasAnyChanges = true;
          } else {
            results.unchanged++;
          }
        } catch (e) {
          results.failed++;
        }
      }

      if (hasAnyChanges) {
        await saveDb(env, db);
        results.savedToKv = true;
      }
      return json(results);
    }

    // On-Demand Lazy Chapters API (Never writes to KV - purely response stream)
    if (pathname.startsWith('/api/library/chapters/')) {
      const rjCode = pathname.replace('/api/library/chapters/', '').toUpperCase();
      let targetDur = parseInt(url.searchParams.get('duration') || '0', 10);
      const db = await getDb(env);
      const work = db.works ? (db.works[rjCode] || Object.values(db.works).find(w => (w.rjCode || '').replace(/^RJ0+/, 'RJ') === rjCode.replace(/^RJ0+/, 'RJ'))) : null;
      const hasHls = work ? Boolean(work.hasHls) : true;

      if (targetDur <= 0 && work) {
        if (work.tracks && work.tracks[0] && work.tracks[0].duration > 0) targetDur = Math.round(work.tracks[0].duration);
        else if (work.totalDuration > 0) targetDur = Math.round(work.totalDuration);
      }

      const result = await fetchChaptersAndGallery(rjCode, hasHls, targetDur);
      return json({ success: true, chapters: result.chapters, gallery: result.gallery });
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
      if (!isAuth()) return json([]);
      const db = await getDb(env);
      db.playlists = db.playlists || [];
      if (!db.playlists.some(p => p.id === 'pl-favorites')) {
        db.playlists.unshift({ id: 'pl-favorites', name: '❤️ Favorites', description: 'Your favorited works & tracks', coverUrl: '', items: [], createdAt: new Date().toISOString() });
        await saveDb(env, db);
      }
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
      const match = pathname.match(/^\/api\/playlists\/([^/]+)\/items(?:\/|$)/);
      const rawId = match ? match[1] : pathname.split('/')[3];
      const plId = decodeURIComponent(rawId || '');
      const body = await request.json().catch(() => ({}));
      const db = await getDb(env);
      db.playlists = db.playlists || [];
      let pl = db.playlists.find(p => String(p.id).trim() === String(plId).trim() || String(p.id) === rawId);
      if (!pl && (plId === 'pl-favorites' || plId.includes('favorites'))) {
        pl = { id: 'pl-favorites', name: '❤️ Favorites', description: 'Your favorites', coverUrl: '', items: [], createdAt: new Date().toISOString() };
        db.playlists.unshift(pl);
      }
      if (!pl) return json({ error: 'Playlist not found (' + plId + ')' }, 404);
      if (!body.item) return json({ error: 'No item data provided' }, 400);
      pl.items = pl.items || [];
      pl.items.push(body.item);
      if (!pl.coverUrl && body.item.poster) pl.coverUrl = body.item.poster;
      if (plId === 'pl-favorites' && body.item.rjCode && db.works && db.works[body.item.rjCode]) {
        db.works[body.item.rjCode].favorite = true;
      }
      await saveDb(env, db);
      return json({ success: true, playlist: pl });
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

    // History API (Cloudflare KV Synced)
    if (pathname === '/api/history' && request.method === 'GET') {
      if (!isAuth()) return json([]);
      const db = await getDb(env);
      return json(db.history || []);
    }

    if (pathname === '/api/history' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const body = await request.json().catch(() => ({}));
      if (!body || !body.rjCode) return json({ error: 'Missing rjCode' }, 400);
      const db = await getDb(env);
      db.history = db.history || [];
      const entry = {
        rjCode: body.rjCode,
        title: body.title || '',
        trackTitle: body.trackTitle || '',
        trackIndex: body.trackIndex || 0,
        coverUrl: body.coverUrl || '',
        cv: body.cv || '',
        circle: body.circle || '',
        playedAt: body.playedAt || new Date().toISOString()
      };
      db.history = db.history.filter(item => item.rjCode !== body.rjCode);
      db.history.unshift(entry);
      if (db.history.length > 20) {
        db.history = db.history.slice(0, 20);
      }
      await saveDb(env, db);
      return json({ success: true, history: db.history });
    }

    if (pathname === '/api/history' && request.method === 'DELETE') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const db = await getDb(env);
      db.history = [];
      await saveDb(env, db);
      return json({ success: true });
    }

    // Wishlist APIs (Cloudflare KV Synced)
    if (pathname === '/api/wishlist' && request.method === 'GET') {
      if (!isAuth()) return json([]);
      const db = await getDb(env);
      return json(db.wishlist || []);
    }

    if (pathname === '/api/wishlist' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const body = await request.json().catch(() => ({}));
      const match = (body.rjCode || '').match(/RJ\d+/i);
      if (!match) return json({ error: 'Invalid RJ Code' }, 400);

      const rjCode = match[0].toUpperCase();
      const db = await getDb(env);
      db.wishlist = db.wishlist || [];

      if (db.works && db.works[rjCode]) {
        return json({ success: true, alreadyInLibrary: true, message: 'Work is already in your library.' });
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

      const existingIdx = db.wishlist.findIndex(w => w.rjCode === rjCode);
      if (existingIdx >= 0) db.wishlist[existingIdx] = { ...db.wishlist[existingIdx], ...entry };
      else db.wishlist.unshift(entry);

      await saveDb(env, db);
      return json({ success: true, wishlist: db.wishlist });
    }

    if (pathname.startsWith('/api/wishlist/retry/') && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const rjCode = pathname.replace('/api/wishlist/retry/', '').toUpperCase().trim();
      const db = await getDb(env);
      try {
        const work = await resolveRjWork(rjCode);
        db.works = db.works || {};
        db.works[rjCode] = work;
        db.wishlist = (db.wishlist || []).filter(w => w.rjCode !== rjCode);
        await saveDb(env, db);
        return json({ success: true, work });
      } catch (err) {
        if (db.wishlist) {
          const it = db.wishlist.find(w => w.rjCode === rjCode);
          if (it) it.reason = err.message;
          await saveDb(env, db);
        }
        return json({ success: false, error: err.message }, 500);
      }
    }

    if (pathname === '/api/wishlist/retry-all' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const db = await getDb(env);
      const list = [...(db.wishlist || [])];
      const results = { total: list.length, succeeded: [], failed: [] };

      for (const item of list) {
        try {
          const work = await resolveRjWork(item.rjCode);
          db.works = db.works || {};
          db.works[item.rjCode] = work;
          db.wishlist = (db.wishlist || []).filter(w => w.rjCode !== item.rjCode);
          results.succeeded.push({ rjCode: item.rjCode, title: work.title });
        } catch (e) {
          item.reason = e.message;
          results.failed.push({ rjCode: item.rjCode, error: e.message });
        }
      }

      await saveDb(env, db);
      return json(results);
    }

    if (pathname.startsWith('/api/wishlist/') && request.method === 'DELETE') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const rjCode = pathname.replace('/api/wishlist/', '').toUpperCase().trim();
      const db = await getDb(env);
      if (rjCode === 'CLEAR_ALL' || rjCode === 'CLEAR') {
        db.wishlist = [];
      } else {
        db.wishlist = (db.wishlist || []).filter(w => w.rjCode !== rjCode);
      }
      await saveDb(env, db);
      return json({ success: true, wishlist: db.wishlist });
    }

    // Aggregations
    if (pathname === '/api/tags') {
      if (!isAuth()) return json([]);
      const db = await getDb(env);
      const counts = {};
      Object.values(db.works || {}).forEach(w => (w.tags || []).forEach(t => counts[t] = (counts[t] || 0) + 1));
      const tagList = Object.entries(counts).map(([name, count]) => ({
        name,
        count,
        en: db.tagDict?.[name] || BASE_TAG_DICT[name] || ''
      })).sort((a, b) => b.count - a.count);
      return json({ tags: tagList, tagDict: db.tagDict || BASE_TAG_DICT });
    }

    if (pathname === '/api/artists') {
      if (!isAuth()) return json([]);
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
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
};

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
          <h4 style="color: #38bdf8; font-weight: 700; margin-bottom: 4px;">🏷️ Self-Learning Bilingual Tag Dictionary</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem;">JapaneseASMR-style dynamic tag formatting (e.g. <code>耳かき (Ear Cleaning)</code>). Automatically extracts and learns translations from ASMR.one into Cloudflare KV with diff protection. Enables full English and Japanese keyword searching.</p>
        </div>

        <div style="background: rgba(255, 51, 102, 0.08); border: 1px solid rgba(255, 51, 102, 0.2); padding: 14px; border-radius: 10px;">
          <h4 style="color: var(--accent); font-weight: 700; margin-bottom: 4px;">🖼️ Adaptive Artwork Gallery & Touch Carousel</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem;">Fluid touch-friendly horizontal swipe reader mode with snap-to-card and full uncropped display for 100+ manga/doujin scans. Includes one-tap <code>⊞ Grid / ↔ Carousel</code> mode switcher and Lightbox viewer.</p>
        </div>

        <div style="background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.2); padding: 14px; border-radius: 10px;">
          <h4 style="color: #22c55e; font-weight: 700; margin-bottom: 4px;">📱 Mobile UI Overhaul (Compact 2-Row Cards)</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem;">Re-architected Chapter Lists, Audio Tracks, Playlist Views, Library List View, and Playback History into consistent ~58px tall responsive mobile cards, eliminating ugly table wrapping.</p>
        </div>

        <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid var(--border); padding: 14px; border-radius: 10px;">
          <h4 style="color: #fff; font-weight: 700; margin-bottom: 4px;">🔔 Floating Toast Notifications & UI Polish</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem;">Replaced browser alerts with clean YouTube-style floating bottom toasts for playlist additions and metadata refreshes.</p>
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
        <span style="font-size: 0.65rem; color: #38bdf8; font-weight: 700; background: rgba(56,189,248,0.15); padding: 1px 6px; border-radius: 4px; border: 1px solid rgba(56,189,248,0.3);">v1.1 Official</span>
      </div>
    </div>

    <!-- Sidebar Search -->
    <div class="search-box" style="margin-bottom: 12px; width: 100%; max-width: 100%;">
      <span>🔍</span>
      <input type="text" id="globalSearch" placeholder="Search library..." oninput="handleSearch(this.value)">
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
      <div class="search-box" style="width: 100%; max-width: 100%;"><span>🔍</span><input type="text" id="mobileSearchInput" placeholder="Search title, RJ code, CV..." oninput="handleSearch(this.value)"></div>
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

  <audio id="coreAudio" preload="metadata"></audio>

  <script>
    const CLIENT_BASE_TAG_DICT = ${JSON.stringify(BASE_TAG_DICT)};
    window.BASE_TAG_DICT = CLIENT_BASE_TAG_DICT;
    window.tagDict = Object.assign({}, CLIENT_BASE_TAG_DICT);

    function formatTag(t) {
      if (!t) return '';
      const dict = window.tagDict || window.BASE_TAG_DICT || {};
      const en = dict[t];
      if (en && en !== t) {
        return t + ' (' + en + ')';
      }
      return t;
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

      // 2. Cloudflare KV cross-device sync
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

    let savedScrollPositions = { library: 0 };

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
    window.navGenre = function(tag) { savedScrollPositions['library'] = 0; shuffledLibraryWorks = null; switchView('library', { tag: tag }, true, 1); };
    window.navCv = function(cv) { savedScrollPositions['library'] = 0; shuffledLibraryWorks = null; switchView('library', { cv: cv }, true, 1); };
    window.navCircle = function(circle) { savedScrollPositions['library'] = 0; shuffledLibraryWorks = null; switchView('library', { circle: circle }, true, 1); };
    window.navPlaylist = function(id) { switchView('playlist-detail', id); };
    window.navFavs = function() { savedScrollPositions['library'] = 0; shuffledLibraryWorks = null; switchView('library', { favorite: 'true' }, true, 1); };
    window.navAll = function() { savedScrollPositions['library'] = 0; shuffledLibraryWorks = null; switchView('library', {}, true, 1); };
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
          const metaLine = (w.cv ? '<span style="color:#38bdf8; font-weight:600;">' + w.cv + '</span>' : '') + (w.cv && w.circle ? ' • ' : '') + (w.circle ? '<span>' + w.circle + '</span>' : '') + ' • <span class="card-rj" style="padding:1px 5px; font-size:0.7rem;">' + w.rjCode + '</span>';
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
          html += '<div class="work-card" data-rj="' + w.rjCode + '" onclick="navWork(this.dataset.rj)">';
          html += '<div class="card-cover-wrapper"><img class="card-cover" src="' + display.coverUrl + '">' + (display.isDisguised ? '<div class="disguised-overlay"><span class="disguised-badge">🎭 Disguised SFW</span></div>' : '') + '</div>';
          html += '<div class="card-badge-row"><span class="card-rj">' + w.rjCode + '</span><span class="card-fav card-fav-' + w.rjCode + '" data-rj="' + w.rjCode + '" title="' + (w.favorite ? 'Favorited' : 'Add to Favorites') + '" onclick="toggleFav(this.dataset.rj, event)" style="transition: transform 0.15s ease-out; display: inline-block;">' + (w.favorite ? '❤️' : '🤍') + '</span></div>';
          html += '<div class="card-title" title="' + w.title.replace(/"/g, '&quot;') + '">' + w.title + '</div>';
          html += '<div class="card-sub">' + (w.cv || w.circle || 'ASMR') + '</div>';
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

      const cvList = work.cv && work.cv !== 'N/A'
        ? work.cv.split(/[\/,、・\s+＆&]+/).map(function(s) { return s.trim(); }).filter(Boolean)
        : [];
      
      const cvPills = cvList.length > 0
        ? cvList.map(function(c) {
            return '<span class="tag-pill" style="display:inline-flex; align-items:center; gap:4px; margin-right:4px; background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.3); font-weight:700;" data-cv="' + c.replace(/"/g, '&quot;') + '" onclick="navCv(this.dataset.cv)">🎙️ ' + c + '</span>';
          }).join('')
        : '<span style="color:var(--text-muted);">N/A</span>';

      const circlePill = work.circle && work.circle !== 'N/A'
        ? '<span class="tag-pill" style="display:inline-flex; align-items:center; gap:4px; background:rgba(255,255,255,0.06); border:1px solid var(--border); font-weight:700;" data-circle="' + work.circle.replace(/"/g, '&quot;') + '" onclick="navCircle(this.dataset.circle)">🏢 ' + work.circle + '</span>'
        : '<span style="color:var(--text-muted);">N/A</span>';

      const tagPills = (work.tags || []).map(function(t) {
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

      if (Array.isArray(work.chapters) && work.chapters.length > 0) {
        chaptersList = work.chapters;
      } else if (rawTracks.length > 0) {
        chaptersList = rawTracks.map((t, idx) => ({
          id: t.id || (idx + 1),
          title: t.title,
          startTime: t.startTime || 0,
          formattedTime: t.formattedTime || formatTime(t.startTime || 0),
          trackIndex: idx
        }));
      }

      if (maxDuration > 0 && chaptersList.length > 0) {
        chaptersList = chaptersList.filter(c => (c.startTime || 0) < maxDuration - 2);
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
        html += '<h3 style="font-size:1.2rem; font-weight:700; margin-top:36px; margin-bottom:8px; display:flex; align-items:center; gap:8px;"><span>📑 Chapters & Scene Timestamps (' + chaptersList.length + ')</span></h3>';
        html += '<p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:12px;">Click any timestamp or Jump button to seek the audio player directly to that scene cue point.</p>';
        html += '<table class="tracks-table chapters-table"><thead><tr><th style="width: 40px;">#</th><th>Scene / Chapter Title</th><th style="width: 140px;">Timestamp Offset</th><th style="width: 160px; text-align:right;">Action</th></tr></thead><tbody>';

        chaptersList.forEach(function(c, i) {
          const startTime = c.startTime || 0;
          const trackIdx = c.trackIndex || 0;
          const timeStr = c.formattedTime || formatTime(startTime);
          html += '<tr class="chapter-row" id="chapter-row-' + i + '" data-idx="' + i + '" data-start="' + startTime + '" data-track="' + trackIdx + '" onclick="jumpToChapter(' + startTime + ', ' + trackIdx + ')">';
          html += '<td>' + (c.id || (i + 1)) + '</td>';
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

      // Silently check and fetch lazy chapters in background if not rich yet
      if (!work.chapters || work.chapters.length <= 1 || (work.chapters[0] && work.chapters[0].title.startsWith('Full Audio Session'))) {
        fetchChaptersLazy(work.rjCode);
      }
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

      const isDifferentWork = !currentPlayingWork || normRj(currentPlayingWork.rjCode) !== normRj(targetWork.rjCode);
      const isDifferentTrack = currentTrackIndex !== trackIdx;
      const isUnloaded = !audio.src || audio.src === '' || audio.src === window.location.href;

      if (isDifferentWork || isDifferentTrack || isUnloaded) {
        playTrack(trackIdx, true, targetWork, startTime);
      } else {
        try { audio.currentTime = startTime; } catch(e) {}
        if (audio.paused) audio.play().catch(() => {});
      }
      highlightActiveChapter(startTime);
      if (currentPlayingWork) updatePopupPlayerUI();
    };

    function highlightActiveChapter(ct) {
      const rows = document.querySelectorAll('.chapter-row');
      if (!rows || rows.length === 0) return;
      let activeIdx = -1;
      rows.forEach((r, i) => {
        const st = parseFloat(r.dataset.start || 0);
        if (ct >= st) activeIdx = i;
      });
      rows.forEach((r, i) => {
        r.classList.toggle('active', i === activeIdx);
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
        tags.forEach(function(t) {
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
          html += '<div class="tag-cloud-item" data-cv="' + a.name.replace(/"/g, '&quot;') + '" onclick="navCv(this.dataset.cv)"><span>' + a.name + '</span><span class="tag-count">' + a.count + ' works</span></div>';
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
            const isRowActive = currentPlaylistItemIndex === index && currentWork && currentWork.rjCode === item.rjCode;
            html += '<div class="work-card playlist-card-row ' + (isRowActive ? 'active' : '') + '" data-pl-idx="' + index + '" data-pl="' + pl.id + '" onclick="playPlaylistItem(parseInt(this.dataset.plIdx), this.dataset.pl)">';
            html += '<div class="card-cover-wrapper"><img class="card-cover" src="' + itemPoster + '" data-rj="' + (item.rjCode || '') + '" onerror="handleImgError(this)"></div>';
            html += '<div class="card-badge-row"><span class="card-rj">' + (item.rjCode || '#' + (index + 1)) + '</span><div style="display:flex; gap:6px; align-items:center;"><span data-rj="' + (item.rjCode || '') + '" onclick="event.stopPropagation(); navWork(this.dataset.rj)" title="View Work Details" style="cursor:pointer; font-size:0.9rem;">👁️</span><span data-pl="' + pl.id + '" data-idx="' + index + '" onclick="event.stopPropagation(); removePlaylistItem(this.dataset.pl, parseInt(this.dataset.idx))" title="Remove Track" style="cursor:pointer; font-size:0.9rem;">🗑️</span></div></div>';
            html += '<div class="card-title">' + item.title + '</div>';
            html += '<div class="card-sub">' + (item.workTitle || item.cv || 'Track ' + (index + 1)) + '</div>';
            html += '</div>';
          });
          html += '</div>';
        } else {
          html += '<table class="tracks-table playlist-tracks-table"><thead><tr><th style="width: 40px;">#</th><th style="width: 50px;">Art</th><th>Track Title</th><th>Work / RJ</th><th>CV</th><th style="width: 120px; text-align:right;">Actions</th></tr></thead><tbody>';
          items.forEach(function(item, index) {
            const itemPoster = item.poster || cover;
            const isRowActive = currentPlaylistItemIndex === index && currentWork && currentWork.rjCode === item.rjCode;
            const workCvText = (item.workTitle || item.rjCode) + (item.cv ? ' • ' + item.cv : '');
            html += '<tr class="playlist-track-row ' + (isRowActive ? 'active' : '') + '" data-pl-idx="' + index + '" data-pl="' + pl.id + '" onclick="playPlaylistItem(parseInt(this.dataset.plIdx), this.dataset.pl)">';
            html += '<td>' + (index + 1) + '</td>';
            html += '<td><img src="' + itemPoster + '" data-rj="' + (item.rjCode || '') + '" onerror="handleImgError(this)" style="width:44px; height:44px; border-radius:8px; object-fit:cover;"></td>';
            html += '<td class="pl-track-title"><strong>' + item.title + '</strong></td>';
            html += '<td class="pl-work-title" style="color:var(--text-muted);">' + workCvText + '</td>';
            html += '<td class="pl-cv-col" style="color:#38bdf8;">' + (item.cv || '—') + '</td>';
            html += '<td class="pl-actions-col" style="text-align:right;"><button class="btn-outline" style="padding: 4px 8px; font-size: 0.75rem; margin-right: 4px;" title="View Work Details" data-rj="' + (item.rjCode || '') + '" onclick="event.stopPropagation(); navWork(this.dataset.rj)">👁️ Work</button><button class="btn-outline" style="padding: 4px 8px; font-size: 0.75rem;" title="Remove Track" data-pl="' + pl.id + '" data-idx="' + index + '" onclick="event.stopPropagation(); removePlaylistItem(this.dataset.pl, parseInt(this.dataset.idx))">🗑️</button></td>';
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
        let work = allWorks.find(w => w.rjCode === item.rjCode);
        if (!work) {
          try {
            const wRes = await apiFetch('/api/library?q=' + encodeURIComponent(item.rjCode));
            const list = await wRes.json();
            work = Array.isArray(list) ? list[0] : null;
          } catch(e) {}
        }
        if (work) {
          currentWork = work;
          currentPlaylistItemIndex = index;
          highlightActivePlaylistRows(index);
          const targetTrackIdx = work.tracks.findIndex(t => t.id === item.trackId) >= 0 ? work.tracks.findIndex(t => t.id === item.trackId) : 0;
          playTrack(targetTrackIdx, true);
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
      html += '<h1 class="section-title">🕒 Playback History (' + sorted.length + ' / 20)</h1>';
      if (sorted.length > 0) {
        html += '<button class="btn-outline" style="color:#ff3366; border-color:rgba(255,51,102,0.3); font-size:0.82rem;" onclick="clearPlaybackHistory()">🗑️ Clear History</button>';
      }
      html += '</div>';

      // Toolbar for sorting
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
        const metaLine = (item.cv ? '<span style="color:#38bdf8; font-weight:600;">' + item.cv + '</span>' : '') + (item.cv && item.circle ? ' • ' : '') + (item.circle ? '<span>' + item.circle + '</span>' : '') + ' • <span class="card-rj" style="padding:1px 5px; font-size:0.7rem;">' + item.rjCode + '</span>';
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
      if (currentWork.cv && currentWork.cv !== 'N/A') {
        const cvs = currentWork.cv.split(/[\/,、・\s+＆&]+/).map(s => s.trim()).filter(Boolean);
        cvContainer.innerHTML = cvs.map(c => '<span class="tag-pill" style="font-size:0.75rem; background:rgba(56,189,248,0.15); color:#38bdf8; border-color:rgba(56,189,248,0.3); font-weight:700;" data-cv="' + c.replace(/"/g, '&quot;') + '" onclick="closePopupPlayer(); navCv(this.dataset.cv)">🎙️ ' + c + '</span>').join('');
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
        if (maxDuration > 0) {
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

        chapters.forEach((c, i) => {
          const item = document.createElement('div');
          item.className = 'popup-chapter-item chapter-row';
          item.dataset.start = c.startTime || 0;
          item.innerHTML = '<span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + (c.id || (i+1)) + '. ' + c.title + '</span><span style="color:#38bdf8; font-variant-numeric:tabular-nums; flex-shrink:0; margin-left:8px;">⏱️ ' + (c.formattedTime || '00:00') + '</span>';
          item.onclick = () => { jumpToChapter(c.startTime || 0, c.trackIndex || 0); };
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
        if (targetDur > 0) {
          apiUrl += '?duration=' + Math.round(targetDur);
        } else if (audio && audio.duration && !isNaN(audio.duration) && audio.duration > 0 && currentPlayingWork && normRj(currentPlayingWork.rjCode) === normRj(rjCode)) {
          apiUrl += '?duration=' + Math.round(audio.duration);
        } else if (currentWork && normRj(currentWork.rjCode) === normRj(rjCode) && currentWork.tracks && currentWork.tracks[0] && currentWork.tracks[0].duration > 0) {
          apiUrl += '?duration=' + Math.round(currentWork.tracks[0].duration);
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
      if (!currentPlayingWork || !currentPlayingWork.tracks || !currentPlayingWork.tracks[index]) return;
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

      // Lazy Chapter Fetching after 20s of active playback
      clearTimeout(lazyChapterTimer);
      lazyChapterTimer = setTimeout(() => {
        if (currentPlayingWork && currentPlayingWork.rjCode) {
          fetchChaptersLazy(currentPlayingWork.rjCode);
        }
      }, 20000);

      const seekTime = (startTime > 0) ? startTime : (track.startTime || 0);

      if (track.isHls) {
        playHlsStream(track.streamUrl, seekTime, userTriggered);
      } else {
        playDirectAudio(track.streamUrl, userTriggered, seekTime);
      }
    };

    function playHlsStream(m3u8Url, startTime = 0, userTriggered = true) {
      if (hls && loadedHlsUrl === m3u8Url) {
        if (startTime > 0) {
          try { audio.currentTime = startTime; } catch(e) {}
        }
        if (userTriggered) audio.play().catch(e => console.log('Play error:', e));
        return;
      }
      if (hls) { hls.destroy(); hls = null; }
      loadedHlsUrl = m3u8Url;
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          maxBufferLength: 30,
          startPosition: startTime > 0 ? startTime : -1
        });
        hls.loadSource(m3u8Url);
        hls.attachMedia(audio);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (startTime > 0) {
            try { audio.currentTime = startTime; } catch(e) {}
          }
          if (userTriggered) audio.play().catch(e => console.log('Autoplay handled:', e));
        });
      } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
        audio.src = m3u8Url;
        audio.addEventListener('loadedmetadata', () => {
          if (startTime > 0) {
            try { audio.currentTime = startTime; } catch(e) {}
          }
          if (userTriggered) audio.play().catch(e => console.log('Play:', e));
        }, { once: true });
        if (userTriggered) audio.play().catch(e => console.log('Play:', e));
      }
    }

    function playDirectAudio(srcUrl, userTriggered = true, startTime = 0) {
      if (hls) { hls.destroy(); hls = null; loadedHlsUrl = null; }
      const isSameSrc = audio.src && (audio.src === srcUrl || audio.src.endsWith(srcUrl) || (new URL(srcUrl, window.location.origin).href === audio.src));
      if (isSameSrc && !audio.error) {
        if (startTime >= 0) {
          try { audio.currentTime = startTime; } catch(e) {}
        }
        if (userTriggered) audio.play().catch(e => console.log('Play error:', e));
        return;
      }
      audio.src = srcUrl;
      let seekDone = false;
      const onReady = () => {
        if (seekDone) return;
        seekDone = true;
        if (startTime > 0) {
          try { audio.currentTime = startTime; } catch(e) {}
        }
        if (userTriggered) {
          audio.play().catch(e => console.log('Play error:', e));
        }
      };
      audio.addEventListener('loadedmetadata', onReady, { once: true });
      audio.addEventListener('canplay', onReady, { once: true });
      if (userTriggered) audio.play().catch(e => console.log('Play error:', e));
    }

    function togglePlayPause() {
      if (audio.paused) audio.play();
      else audio.pause();
    }

    audio.addEventListener('loadedmetadata', () => {
      const dur = audio.duration;
      if (dur && !isNaN(dur) && dur > 0 && currentPlayingWork) {
        if (Array.isArray(currentPlayingWork.chapters) && currentPlayingWork.chapters.some(c => c.startTime >= dur - 2)) {
          currentPlayingWork.chapters = currentPlayingWork.chapters.filter(c => c.startTime < dur - 2);
          if (currentWork && currentWork.rjCode === currentPlayingWork.rjCode) {
            currentWork.chapters = currentPlayingWork.chapters;
            currentWorkChapters = currentPlayingWork.chapters;
            if (currentView === 'work-detail') loadWorkDetail(currentPlayingWork.rjCode);
          }
          updatePopupPlayerUI();
        }
        fetchChaptersLazy(currentPlayingWork.rjCode, false, Math.round(dur));
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

      highlightActiveChapter(ct);

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

    function handleSearch(val) {
      const gSearch = document.getElementById('globalSearch');
      const mSearch = document.getElementById('mobileSearchInput');
      if (gSearch && gSearch.value !== val) gSearch.value = val;
      if (mSearch && mSearch.value !== val) mSearch.value = val;
      if (currentView !== 'library') {
        switchView('library', { q: val });
        return;
      }
      const term = val.trim().toLowerCase();
      if (!term) {
        libraryCurrentPage = 1;
        renderLibraryGrid(allWorks, {});
        return;
      }
      const dict = window.tagDict || window.BASE_TAG_DICT || {};
      const filtered = allWorks.filter(w =>
        w.rjCode.toLowerCase().includes(term) ||
        w.title.toLowerCase().includes(term) ||
        (w.circle && w.circle.toLowerCase().includes(term)) ||
        (w.cv && w.cv.toLowerCase().includes(term)) ||
        (w.tags && w.tags.some(t => {
          if (t.toLowerCase().includes(term)) return true;
          const en = dict[t];
          return en && en.toLowerCase().includes(term);
        }))
      );
      libraryCurrentPage = 1;
      renderLibraryGrid(filtered, { q: val });
    }

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
        const res = await apiFetch('/api/playlists', { method: 'POST', body: JSON.stringify({ name: name }) });
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

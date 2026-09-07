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
  const match = clean.match(/^RJ(\d+)$/i);
  if (!match) return clean;
  const digits = match[1];
  const num = parseInt(digits, 10);
  const bucketNum = Math.ceil(num / 1000) * 1000;
  return 'RJ' + String(bucketNum).padStart(digits.length, '0');
}

// 1. Fetch Official DLsite Metadata (Universal Multi-Layer Extractor)
async function fetchDlsiteMetadata(rjCode) {
  const cleanRj = rjCode.toUpperCase();
  const cleanNum = cleanRj.replace(/^RJ/i, '');
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

      if (data.title) {
        dlsiteMeta = {
          title: data.title,
          circle: data.circle?.name || '',
          cv: cv || 'N/A',
          rawCoverUrl: imgUrl,
          tags: tags,
          tagTranslations: tagTranslations,
          isNsfw: true
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

        const isAdult = item.age_category === 3 || div === 'maniax' || div === 'girls' ||
                        item.age_category_string === 'adult';

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
          if (!imgUrl) {
            const bucket = getDlsiteCoverBucket(cleanRj);
            imgUrl = `https://img.dlsite.jp/modpub/images2/work/doujin/${bucket}/${cleanRj}_img_main.jpg`;
          }

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

  return dlsiteMeta;
}

// 2. Probe CDN Directly (M3U8 HLS vs MP3 Multi-track)
async function probeMediaCdn(rjCode, dlsiteMeta) {
  const cleanRj = rjCode.toUpperCase();
  const m3u8Url = `https://v.weeab0o.xyz/${cleanRj}.m3u8`;
  const bucket = getDlsiteCoverBucket(cleanRj);
  const coverUrl = dlsiteMeta?.rawCoverUrl || `https://img.dlsite.jp/modpub/images2/work/doujin/${bucket}/${cleanRj}_img_main.jpg`;

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
      title: dlsiteMeta?.title ? `01. ${dlsiteMeta.title}` : '01. Audio Track',
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

  if (tracks.length === 1) {
    tracks[0].title = dlsiteMeta?.title ? `01. ${dlsiteMeta.title}` : (tracks[0].title || '01. Audio Track');
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

function parseAsmrTreeData(treeData, hasM3u8 = true, targetDuration = 0) {
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
      formattedTime: formatServerTime(startSecs),
      trackIndex: hasM3u8 ? 0 : idx
    });
  }

  return { chapters, gallery };
}

async function fetchChaptersAndGallery(cleanRj, hasM3u8 = true, targetDuration = 0) {
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
        const asmrTracksRes = await axios.get(`${host}/api/tracks/${tid}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Referer': 'https://www.asmr.one/'
          },
          timeout: 8000
        });
        if (asmrTracksRes.data && Array.isArray(asmrTracksRes.data) && asmrTracksRes.data.length > 0) {
          const parsed = parseAsmrTreeData(asmrTracksRes.data, hasM3u8, targetDuration);
          if (parsed.chapters.length > 0 || parsed.gallery.length > 0) {
            return parsed;
          }
        }
      } catch (e) {}
    }
  }

  return { chapters: [], gallery: [] };
}

async function fetchChaptersForRj(cleanRj, hasM3u8 = true, targetDuration = 0) {
  const result = await fetchChaptersAndGallery(cleanRj, hasM3u8, targetDuration);
  return result.chapters;
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
  let dlsiteMeta = null;
  try {
    dlsiteMeta = await fetchDlsiteMetadata(rjCode);
    const workData = await probeMediaCdn(rjCode, dlsiteMeta);

    // Save to persistent database
    const saved = db.saveWork(workData);
    // Remove from wishlist if it was there
    db.removeWishlistItem(rjCode);
    console.log(`[DB Saved] Successfully indexed and cached ${rjCode} into library`);
    return saved;
  } catch (err) {
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

module.exports = {
  resolveAndSaveWork,
  batchImport,
  fetchChaptersForRj,
  fetchChaptersAndGallery,
  parseAsmrTreeData,
  isWorkMetadataChanged
};

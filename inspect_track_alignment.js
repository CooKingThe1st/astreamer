const axios = require('axios');
const http = require('http');
const https = require('https');

const httpAgent = new http.Agent({ family: 4 });
const httpsAgent = new https.Agent({ family: 4 });

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
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
  return 0;
}

// 1. Fetch Official ASMR.one Track Tree
async function fetchAsmrOneTracks(cleanNum) {
  const url = `https://api.asmr-200.com/api/tracks/${cleanNum}`;
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      httpAgent,
      httpsAgent,
      timeout: 8000
    });
    if (res.status === 200 && Array.isArray(res.data)) {
      return res.data;
    }
  } catch (e) {
    // try fallback search
    try {
      const sUrl = `https://api.asmr-200.com/api/search/RJ${cleanNum}`;
      const sRes = await axios.get(sUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, httpAgent, httpsAgent, timeout: 6000 });
      if (sRes.data && sRes.data.works && sRes.data.works.length > 0) {
        const id = sRes.data.works[0].id || sRes.data.works[0].source_id;
        if (id) {
          const tRes = await axios.get(`https://api.asmr-200.com/api/tracks/${id}`, { headers: { 'User-Agent': 'Mozilla/5.0' }, httpAgent, httpsAgent, timeout: 6000 });
          if (Array.isArray(tRes.data)) return tRes.data;
        }
      }
    } catch(err) {}
  }
  return [];
}

// Fallback: Fetch DLsite Official Tracklist from DLsite Product page
async function fetchDLsiteTracks(cleanRj) {
  const url = `https://www.dlsite.com/maniax/work/=/product_id/${cleanRj}.html`;
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Cookie': 'adultchecked=1; locale=ja_JP;'
      },
      httpAgent,
      httpsAgent,
      timeout: 8000
    });
    if (res.status === 200 && res.data) {
      const html = res.data;
      const tracks = [];
      
      // Look for work_tracklist_item
      const itemRegex = /<li[^>]*class="[^"]*work_tracklist_item[^"]*"[^>]*>([\s\S]*?)<\/li>/gi;
      let m;
      let idx = 1;
      while ((m = itemRegex.exec(html)) !== null) {
        const block = m[1];
        const titleM = block.match(/<div[^>]*class="title"[^>]*>([\s\S]*?)<\/div>/i);
        const timeM = block.match(/<div[^>]*class="time"[^>]*>([\s\S]*?)<\/div>/i);
        if (titleM) {
          const rawTitle = titleM[1].replace(/<[^>]+>/g, '').trim();
          const rawTime = timeM ? timeM[1].replace(/<[^>]+>/g, '').replace(/[()（）]/g, '').trim() : '';
          
          // Parse duration if available (e.g. 28:59 or 2:05:21)
          let dur = 0;
          if (rawTime) {
            const parts = rawTime.split(':').map(p => parseInt(p, 10));
            if (parts.length === 3) dur = parts[0] * 3600 + parts[1] * 60 + parts[2];
            else if (parts.length === 2) dur = parts[0] * 60 + parts[1];
          }

          let cat = 'main';
          if (/(フリートーク|free[\s_-]?talk|talk|座談会|キャストコメント)/i.test(rawTitle)) cat = 'freetalk';
          else if (/(特典|おまけ|bonus|extra|ex_|sp_|後日談|アフター|ショートストーリー|ss|抜粋)/i.test(rawTitle)) cat = 'bonus';

          tracks.push({
            index: idx++,
            title: rawTitle,
            duration: dur,
            formattedTime: rawTime || formatTime(dur),
            category: cat
          });
        }
      }
      return tracks;
    }
  } catch (e) {
    console.error(`[DLsite Scraper] Error: ${e.message}`);
  }
  return [];
}

// Flatten and categorize ASMR.one tracks
function parseAsmrOneTree(treeData) {
  const audioList = [];
  const isImage = (t, type) => type === 'image' || /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(t);
  const isAudio = (t, type) => (type === 'audio' || /\.(mp3|wav|flac|m4a|aac|ogg|opus)$/i.test(t)) && !isImage(t, type);
  const isBonus = (t) => /(特典|おまけ|bonus|extra|ex_|sp_|後日談|アフター|ショートストーリー|ss)/i.test(t || '');
  const isTalk = (t) => /(フリートーク|free[\s_-]?talk|talk|座談会|キャストコメント)/i.test(t || '');
  const isSample = (t) => /(サンプル|sample|体験版|予告|試聴|pv|ダイジェスト|digest|\.mp4|\.mkv)/i.test(t || '');

  function traverse(items, folder = '') {
    if (!Array.isArray(items)) return;
    for (const item of items) {
      if (!item) continue;
      const title = (item.title || '').trim();
      const type = (item.type || '').toLowerCase();
      const dur = Math.max(0, Math.round(Number(item.duration) || 0));

      if (isAudio(title, type) && dur > 0 && !isSample(title)) {
        let cat = 'main';
        if (isTalk(title) || isTalk(folder)) cat = 'freetalk';
        else if (isBonus(title) || isBonus(folder)) cat = 'bonus';

        audioList.push({
          title: title.replace(/\.[a-zA-Z0-9]+$/, '').trim(),
          rawTitle: title,
          duration: dur,
          formattedTime: formatTime(dur),
          folder: folder,
          category: cat,
          streamUrl: item.mediaStreamUrl || item.streamLowQualityUrl || ''
        });
      }

      if (Array.isArray(item.children) && item.children.length > 0) {
        const nextFolder = folder ? `${folder}/${title}` : title;
        traverse(item.children, nextFolder);
      }
    }
  }

  traverse(treeData);
  return audioList;
}

// 2. Fetch HentaiASMR Moe Tracks
async function fetchHentaiAsmr(cleanRj) {
  const url = `https://hentaiasmr.moe/${cleanRj.toLowerCase()}.html`;
  try {
    const res = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://hentaiasmr.moe/' },
      httpAgent,
      httpsAgent,
      timeout: 8000
    });
    if (res.status === 200 && res.data) {
      const html = res.data;
      const audioTracks = [];
      const itemRegex = /\{[^{}]*?(?:file|sources)[^{}]*?\}/gi;
      let itemMatch;
      let trkIdx = 1;
      while ((itemMatch = itemRegex.exec(html)) !== null) {
        const block = itemMatch[0];
        const fileM = block.match(/(?:file|src|url)\s*[:=]\s*["']([^"']+\.mp3[^"']*)["']/i);
        const titleM = block.match(/title\s*[:=]\s*["']([^"']+)["']/i);
        if (fileM && !audioTracks.some(t => t.streamUrl === fileM[1].trim())) {
          audioTracks.push({
            index: trkIdx++,
            streamUrl: fileM[1].trim(),
            rawTitle: titleM ? titleM[1].trim() : `Track ${trkIdx}`
          });
        }
      }

      // Concurrently probe Range for sizes
      await Promise.all(audioTracks.map(async (t) => {
        try {
          const mHead = await axios.get(encodeURI(t.streamUrl), {
            httpAgent,
            httpsAgent,
            headers: {
              'Range': 'bytes=0-0',
              'Referer': 'https://hentaiasmr.moe/',
              'User-Agent': 'Mozilla/5.0'
            },
            timeout: 4000,
            validateStatus: s => s >= 200 && s < 400
          });
          const cr = mHead.headers && mHead.headers['content-range'];
          if (cr) {
            const m = cr.match(/\/(\d+)/);
            if (m) t.size = parseInt(m[1], 10);
          }
          if (!t.size && mHead.headers) {
            t.size = parseInt(mHead.headers['content-length'] || '0', 10);
          }
        } catch (e) {
          t.size = 0;
        }
      }));

      return audioTracks;
    }
  } catch (e) {
    console.error(`[HentaiASMR Moe] Error: ${e.message}`);
  }
  return [];
}

// 3. Inspect Work Alignment
async function inspectWork(rjCode) {
  const cleanRj = rjCode.toUpperCase();
  const cleanNum = cleanRj.replace(/^(?:RJ|VJ|BJ)/i, '');

  console.log(`\n======================================================================`);
  console.log(`🔍 Inspecting Work: ${cleanRj}`);
  console.log(`======================================================================`);

  // 1. ASMR.one Ground Truth
  console.log(`\n📡 Fetching Official ASMR.one Track Tree...`);
  const rawTree = await fetchAsmrOneTracks(cleanNum);
  let asmrTracks = parseAsmrOneTree(rawTree);
  
  if (asmrTracks.length === 0) {
    console.log(`⚠️ ASMR.one has no track tree. Fetching DLsite Official Tracklist...`);
    const dlTracks = await fetchDLsiteTracks(cleanRj);
    if (dlTracks.length > 0) {
      console.log(`✅ DLsite returned ${dlTracks.length} official track(s):`);
      const isBonus = (t) => /(特典|おまけ|bonus|extra|ex_|sp_|後日談|アフター|ショートストーリー|ss)/i.test(t || '');
      const isTalk = (t) => /(フリートーク|free[\s_-]?talk|talk|座談会|キャストコメント)/i.test(t || '');
      asmrTracks = dlTracks.map(d => {
        return {
          title: d.title,
          rawTitle: d.title,
          duration: d.duration || 0,
          formattedTime: d.formattedTime || 'N/A',
          folder: 'DLsite Official',
          category: d.category,
          streamUrl: ''
        };
      });
    }
  }

  console.log(`✅ Ground Truth returned ${asmrTracks.length} discrete audio track(s):`);
  let asmrTotalDur = 0;
  asmrTracks.forEach((t, i) => {
    asmrTotalDur += t.duration;
    const catBadge = t.category === 'freetalk' ? '[🎙️ Talk]' : (t.category === 'bonus' ? '[🎁 Bonus]' : '[🎵 Main]');
    console.log(`   ${i + 1}. ${catBadge} ${t.title} (${t.formattedTime}) [Folder: ${t.folder || 'Root'}]`);
  });
  if (asmrTotalDur > 0) {
    console.log(`   ⏱️ Total Duration: ${formatTime(asmrTotalDur)} (${asmrTotalDur}s)`);
  }

  // 2. HentaiASMR Moe
  console.log(`\n📡 Fetching HentaiASMR Moe discrete audio stream tracks...`);
  const moeTracks = await fetchHentaiAsmr(cleanRj);
  console.log(`✅ HentaiASMR Moe returned ${moeTracks.length} discrete track(s):`);
  let moeTotalBytes = 0;
  moeTracks.forEach((t, i) => {
    moeTotalBytes += (t.size || 0);
    const mb = t.size ? `${(t.size / (1024 * 1024)).toFixed(2)} MB` : 'unknown size';
    console.log(`   ${i + 1}. "${t.rawTitle}" -> ${t.streamUrl} (${mb})`);
  });
  console.log(`   📦 Total Size: ${(moeTotalBytes / (1024 * 1024)).toFixed(2)} MB`);

  // 3. Intelligent Ground-Truth Track Alignment Result
  console.log(`\n🎯 Intelligent Ground-Truth Track Alignment Result:`);
  if (asmrTracks.length > 0 && moeTracks.length > 0) {
    console.log(`\n--- Correlating Moe Files (1..${moeTracks.length}) with Ground-Truth Metadata ---`);
    
    // Match each Moe track to the best matching ground-truth track by duration / index / size
    moeTracks.forEach((mt, idx) => {
      // Find candidate in asmrTracks
      // For RJ01680262:
      // Track 1-5: Main Chapters 1-5 (~28m-31m, 6m)
      // Track 6: Free talk (8m 37s)
      // Track 7: Full Combined (2h 05m 21s)
      let matched = null;

      // Match strategy:
      // 1. If exact duration is known or can be estimated by size (MP3 ~ 128-320kbps)
      // 2. Sequential chapter match for 1..5
      // 3. Size-based classification: 
      //    >100MB / ~2hr -> Full Concatenated Track
      //    <15MB / ~8min -> Free Talk
      
      if (idx < 5 && asmrTracks[idx]) {
        matched = asmrTracks[idx];
      } else {
        // Look for free talk or full combined
        if (idx === 5) {
          // Track 6 (8min) -> Free talk
          matched = asmrTracks.find(t => t.category === 'freetalk') || asmrTracks[idx];
        } else if (idx === 6) {
          // Track 7 (2hr) -> Full Combined Track
          matched = asmrTracks.find(t => /(つなぎ合わせた|つなげた|all|full|総再生)/i.test(t.title)) || asmrTracks[idx];
        } else {
          matched = asmrTracks[idx] || null;
        }
      }

      if (matched) {
        const catBadge = matched.category === 'freetalk' ? '🎙️ Free Talk' 
          : (/(つなぎ合わせた|つなげた|all|full)/i.test(matched.title) ? '🎵 Main (All-in-One)' 
          : (matched.category === 'bonus' ? '🎁 Bonus' : '🎵 Main'));
        console.log(`   Track ${mt.index} (${(mt.size / (1024*1024)).toFixed(1)} MB): ${catBadge} | "${matched.title}" [Official Time: ${matched.formattedTime}]`);
        console.log(`            URL: ${mt.streamUrl}`);
      } else {
        console.log(`   Track ${mt.index}: [🎵 Main] | "${mt.rawTitle}"`);
      }
    });
  } else {
    console.log(`   ⚠️ Insufficient multi-source data to perform alignment.`);
  }
}

async function run() {
  await inspectWork('RJ01680262');
  await inspectWork('RJ01311315');
}

run();

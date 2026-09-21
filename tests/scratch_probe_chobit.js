const https = require('https');

function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, text: data }));
    }).on('error', reject);
  });
}

async function fetchChobitSampleTracks(rjCode) {
  const cleanRj = (rjCode || '').toUpperCase().trim();
  if (!cleanRj) return [];
  try {
    const apiUrl = `https://chobit.cc/api/v1/dlsite/embed?workno=${cleanRj}`;
    const apiRes = await fetchUrl(apiUrl, {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://www.dlsite.com/',
      'Accept': 'application/json, text/plain, */*'
    });
    if (apiRes.status !== 200) return [];
    const data = JSON.parse(apiRes.text);
    if (!data || !Array.isArray(data.works) || data.works.length === 0) return [];
    const workInfo = data.works[0];
    if (!workInfo || !workInfo.embed_url) return [];

    const embedRes = await fetchUrl(workInfo.embed_url, {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://www.dlsite.com/',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    });
    if (embedRes.status !== 200) return [];
    const html = embedRes.text;
    const tracks = [];
    
    // 1. Audio track extraction: <li data-title="..." data-src="..." data-playtime="...">
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
        poster: workInfo.thumb || ''
      });
    }

    // 2. Video preview extraction if file_type === 'video' or contentUrl present
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
          poster: workInfo.thumb || ''
        });
      }
    }

    return tracks;
  } catch (e) {
    return [];
  }
}

async function run() {
  const codes = ['RJ01089507', 'RJ01142278', 'RJ01384156', 'RJ01600344', 'RJ01624439'];
  for (const c of codes) {
    const res = await fetchChobitSampleTracks(c);
    console.log(`[${c}] -> Found ${res.length} Chobit sample tracks`);
    if (res.length > 0) {
      console.log(`   First track: ${res[0].title} (${res[0].rawUrl})`);
    }
  }
}

run();

const axios = require('axios');

async function checkHtml() {
  const url = 'https://hentaiasmr.moe/rj296130.html';
  const res = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Referer': 'https://hentaiasmr.moe/' }
  });
  console.log('--- HTML Match for audio links ---');
  const urls = res.data.match(/https?:\/\/[^\s"'<>]+\.(?:mp3|m4a|wav|ogg|flac|m3u8)/gi);
  console.log(urls);

  console.log('--- JWPlayer / Script blocks ---');
  const scripts = res.data.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi) || [];
  scripts.forEach((s, idx) => {
    if (s.includes('mp3') || s.includes('jwplayer') || s.includes('playlist')) {
      console.log(`\nScript #${idx}:`, s);
    }
  });
}

checkHtml().catch(console.error);

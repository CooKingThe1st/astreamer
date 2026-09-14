const axios = require('axios');
const https = require('https');

async function inspectHtml() {
  const url = 'https://hentaiasmr.moe/rj01668482.html';
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  const res = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    httpsAgent,
    timeout: 10000
  });
  console.log('Status:', res.status);
  const html = res.data;
  console.log('HTML length:', html.length);
  
  // Find all <script> or iframe or audio tags
  const jwMatch = html.match(/jwplayer\([^)]*\)\.setup\(([\s\S]*?)\);/i);
  if (jwMatch) {
    console.log('JWPlayer found:', jwMatch[1].slice(0, 500));
  } else {
    console.log('No jwplayer setup found.');
  }

  const scripts = html.match(/<script[\s\S]*?<\/script>/gi) || [];
  console.log('Scripts count:', scripts.length);
  scripts.forEach((s, idx) => {
    if (s.includes('player') || s.includes('playlist') || s.includes('.mp3') || s.includes('.m3u8') || s.includes('sources') || s.includes('file')) {
      console.log(`\nScript #${idx}:`, s);
    }
  });

  const iframes = html.match(/<iframe[\s\S]*?<\/iframe>/gi) || [];
  console.log('\nIframes:', iframes);

  const audioTags = html.match(/<audio[\s\S]*?<\/audio>/gi) || [];
  console.log('\nAudio tags:', audioTags);
}

inspectHtml().catch(console.error);

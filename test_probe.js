const axios = require('axios');
const http = require('http');
const https = require('https');

const httpAgent = new http.Agent({ family: 4 });
const httpsAgent = new https.Agent({ family: 4 });

async function testDirectProbe(rjCode) {
  console.log(`\n=== Testing Direct Probe & DLsite for ${rjCode} ===`);
  
  // 1. Probe v.weeab0o.xyz for HLS or MP3 directly (Bypasses japaneseasmr.com entirely!)
  const m3u8Url = `https://v.weeab0o.xyz/${rjCode}.m3u8`;
  const mp3Url = `https://v.weeab0o.xyz/${rjCode}.mp3`;
  const coverUrl = `https://pic.weeabo0.xyz/${rjCode}_img_main.jpg`;

  console.log(`Checking HLS: ${m3u8Url}`);
  try {
    const res = await axios.head(m3u8Url, {
      httpAgent,
      httpsAgent,
      headers: { 'Referer': 'https://japaneseasmr.com/', 'User-Agent': 'Mozilla/5.0' },
      timeout: 5000
    });
    console.log(`✅ HLS Found! Status: ${res.status}`);
  } catch (e) {
    console.log(`HLS probe: ${e.response?.status || e.message}`);
  }

  // 2. Check DLsite / ASMR metadata for Title, CV, Circle
  console.log(`Fetching DLsite metadata for ${rjCode}...`);
  try {
    const dlsiteRes = await axios.get(`https://www.dlsite.com/maniax/api/=/product.json?workno=${rjCode}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'ja,en;q=0.9'
      },
      timeout: 5000
    });
    if (dlsiteRes.data && dlsiteRes.data.length > 0) {
      const item = dlsiteRes.data[0];
      console.log(`✅ DLsite Metadata Found:`);
      console.log(`  Title: ${item.work_name}`);
      console.log(`  Maker/Circle: ${item.maker_name}`);
      console.log(`  CV/Voice: ${item.voice_actor}`);
      console.log(`  Image: ${item.image_main?.url}`);
    }
  } catch (e) {
    console.log(`DLsite probe: ${e.response?.status || e.message}`);
  }
}

async function run() {
  await testDirectProbe('RJ01473335');
  await testDirectProbe('RJ441308');
  await testDirectProbe('RJ01570152');
}

run();

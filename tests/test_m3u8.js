const axios = require('axios');
const http = require('http');
const https = require('https');

const httpAgent = new http.Agent({ family: 4 });
const httpsAgent = new https.Agent({ family: 4 });

async function testM3u8() {
  const url = 'https://v.weeab0o.xyz/RJ01473335.m3u8';
  console.log(`Fetching ${url}...`);
  try {
    const res = await axios.get(url, {
      httpAgent,
      httpsAgent,
      headers: {
        'Referer': 'https://japaneseasmr.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    console.log(`Status: ${res.status}, Type: ${res.headers['content-type']}`);
    console.log('M3U8 Manifest Contents:\n' + res.data.slice(0, 1000));
  } catch (e) {
    console.error(`Error:`, e.message);
  }
}

testM3u8();

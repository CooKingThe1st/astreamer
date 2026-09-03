const axios = require('axios');
const http = require('http');
const https = require('https');

const httpAgent = new http.Agent({ family: 4 });
const httpsAgent = new https.Agent({ family: 4 });

async function testTs() {
  const tsUrl = 'https://v.weeab0o.xyz/RJ01473335/RJ01473335_1903424407_000000.ts';
  console.log(`Testing TS segment fetch: ${tsUrl}`);
  try {
    const res = await axios.get(tsUrl, {
      httpAgent,
      httpsAgent,
      headers: {
        'Referer': 'https://japaneseasmr.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      responseType: 'stream'
    });
    console.log(`Status: ${res.status}, Type: ${res.headers['content-type']}, Length: ${res.headers['content-length']}`);

    await new Promise(resolve => {
      res.data.once('data', chunk => {
        console.log(`✅ Successfully received TS segment chunk: ${chunk.length} bytes`);
        res.data.destroy();
        resolve();
      });
    });
  } catch (e) {
    console.error('TS segment error:', e.message);
  }
}

testTs();

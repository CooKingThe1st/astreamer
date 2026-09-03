const axios = require('axios');
const http = require('http');
const https = require('https');

const httpAgent = new http.Agent({ family: 4 });
const httpsAgent = new https.Agent({ family: 4 });

async function inspectTsChunk() {
  const tsUrl = 'https://v.weeab0o.xyz/RJ01473335/RJ01473335_1903424407_000000.ts';
  console.log('Downloading first TS chunk of RJ01473335...');
  try {
    const res = await axios.get(tsUrl, {
      httpAgent,
      httpsAgent,
      headers: {
        'Referer': 'https://japaneseasmr.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      responseType: 'arraybuffer'
    });

    const buf = Buffer.from(res.data);
    console.log(`Downloaded ${buf.length} bytes`);

    // Check TS packet sync bytes (0x47)
    console.log('First 16 bytes (hex):', buf.slice(0, 16).toString('hex'));
    console.log('Sync byte at 0 is 0x47:', buf[0] === 0x47);
    console.log('Sync byte at 188 is 0x47:', buf[188] === 0x47);
    console.log('Sync byte at 376 is 0x47:', buf[376] === 0x47);

    // Let's check Elementary Stream PIDs
    // Look for AAC (0x0F) or AVC (0x1B) in PMT
  } catch (e) {
    console.error('Error downloading TS chunk:', e.message);
  }
}

inspectTsChunk();

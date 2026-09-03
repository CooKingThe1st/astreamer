const axios = require('axios');

const TARGET_URL = 'https://v.weeab0o.xyz/RJ441308.mp3';

async function testDirectWithoutHeaders() {
  console.log('\n--- Test 1: Direct Request without Spoofed Headers ---');
  try {
    const res = await axios.get(TARGET_URL, {
      responseType: 'stream',
      timeout: 5000,
    });
    console.log(`❌ Unexpected: Direct request succeeded with status ${res.status}`);
  } catch (err) {
    if (err.response) {
      console.log(`✅ Expected Result: Origin blocked request with Status ${err.response.status} (${err.response.statusText})`);
    } else {
      console.log(`Error: ${err.message}`);
    }
  }
}

async function testWithSpoofedHeaders() {
  console.log('\n--- Test 2: Request WITH Spoofed Referer Header ---');
  try {
    const res = await axios.get(TARGET_URL, {
      headers: {
        'Referer': 'https://japaneseasmr.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
      responseType: 'stream',
      timeout: 10000,
    });

    console.log(`✅ Success! Origin accepted request with Status: ${res.status} ${res.statusText}`);
    console.log(`Content-Type: ${res.headers['content-type']}`);
    console.log(`Content-Length: ${res.headers['content-length']} bytes (~${(res.headers['content-length'] / (1024 * 1024)).toFixed(2)} MB)`);
    console.log(`Accept-Ranges: ${res.headers['accept-ranges']}`);

    // Read first chunk to verify audio stream data
    await new Promise((resolve) => {
      res.data.once('data', (chunk) => {
        console.log(`✅ Successfully received audio binary chunk: ${chunk.length} bytes`);
        res.data.destroy(); // stop stream
        resolve();
      });
    });

  } catch (err) {
    console.error(`❌ Failed:`, err.message);
    if (err.response) {
      console.error(`Status: ${err.response.status} ${err.response.statusText}`);
    }
  }
}

async function testRangeRequest() {
  console.log('\n--- Test 3: Range Request (Seeking / Timeline Scrubbing) ---');
  try {
    const res = await axios.get(TARGET_URL, {
      headers: {
        'Referer': 'https://japaneseasmr.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Range': 'bytes=1000000-2000000', // Request 1MB starting from 1MB offset
      },
      responseType: 'stream',
      timeout: 10000,
    });

    console.log(`✅ Success! Partial Content Status: ${res.status} ${res.statusText}`);
    console.log(`Content-Range: ${res.headers['content-range']}`);
    console.log(`Content-Length: ${res.headers['content-length']} bytes`);

    await new Promise((resolve) => {
      res.data.once('data', (chunk) => {
        console.log(`✅ Successfully received range chunk: ${chunk.length} bytes`);
        res.data.destroy();
        resolve();
      });
    });

  } catch (err) {
    console.error(`❌ Failed Range Test:`, err.message);
  }
}

async function run() {
  console.log(`Testing Hotlink Protection Bypass for target: ${TARGET_URL}`);
  await testDirectWithoutHeaders();
  await testWithSpoofedHeaders();
  await testRangeRequest();
  console.log('\n--- Tests Complete ---\n');
}

run();

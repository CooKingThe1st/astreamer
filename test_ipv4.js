const axios = require('axios');
const http = require('http');
const https = require('https');

const httpAgent = new http.Agent({ family: 4 });
const httpsAgent = new https.Agent({ family: 4 });

async function test() {
  console.log('Testing IPv4 request to post 72715...');
  const start = Date.now();
  try {
    const res = await axios.get('https://japaneseasmr.com/72715/', {
      httpAgent,
      httpsAgent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://japaneseasmr.com/',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 10000
    });
    console.log(`Status: ${res.status}, Length: ${res.data.length}, Time: ${Date.now() - start}ms`);
  } catch (e) {
    console.error(`Error (${Date.now() - start}ms):`, e.message);
  }

  console.log('Testing search request...');
  const start2 = Date.now();
  try {
    const res = await axios.get('https://japaneseasmr.com/?s=RJ441308', {
      httpAgent,
      httpsAgent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://japaneseasmr.com/',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 10000
    });
    console.log(`Search Status: ${res.status}, Length: ${res.data.length}, Time: ${Date.now() - start2}ms`);
  } catch (e) {
    console.error(`Search Error (${Date.now() - start2}ms):`, e.message);
  }
}

test();

const axios = require('axios');
const http = require('http');
const https = require('https');

const httpAgent = new http.Agent({ family: 4 });
const httpsAgent = new https.Agent({ family: 4 });

async function testImg() {
  const url = 'https://pic.weeabo0.xyz/RJ441308_img_main.jpg';
  console.log('Testing image fetch without headers...');
  try {
    const res = await axios.get(url, { httpAgent, httpsAgent, timeout: 5000 });
    console.log(`Image direct status: ${res.status}, Type: ${res.headers['content-type']}, Length: ${res.headers['content-length']}`);
  } catch (e) {
    console.log(`Direct image failed: ${e.response?.status || e.message}`);
  }

  console.log('Testing image fetch with Referer header...');
  try {
    const res = await axios.get(url, {
      httpAgent,
      httpsAgent,
      headers: {
        'Referer': 'https://japaneseasmr.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 5000
    });
    console.log(`Image with referer status: ${res.status}, Type: ${res.headers['content-type']}, Length: ${res.headers['content-length']}`);
  } catch (e) {
    console.log(`Image with referer failed: ${e.response?.status || e.message}`);
  }
}

testImg();

const axios = require('axios');

async function test() {
  try {
    console.log('Fetching rewritten M3U8 from proxy...');
    const res = await axios.get('http://localhost:3001/stream?url=https://v.weeab0o.xyz/RJ01473335.m3u8');
    console.log('Status:', res.status);
    console.log('Headers:', res.headers);
    console.log('First 10 lines of rewritten M3U8:\n', res.data.split('\n').slice(0, 10).join('\n'));

    // Test fetching the first rewritten segment
    const lines = res.data.split('\n');
    const firstSegmentLine = lines.find(l => l.startsWith('/stream?url='));
    if (firstSegmentLine) {
      console.log('\nTesting first rewritten segment fetch:', firstSegmentLine);
      const segRes = await axios.get('http://localhost:3001' + firstSegmentLine, { responseType: 'stream' });
      console.log('Segment Status:', segRes.status, 'Type:', segRes.headers['content-type'], 'Length:', segRes.headers['content-length']);
    }
  } catch (e) {
    console.error('Error:', e.message, e.response?.data);
  }
}

test();

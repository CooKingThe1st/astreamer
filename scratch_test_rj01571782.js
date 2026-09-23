const axios = require('axios');

async function testRJ() {
  const rj = 'RJ01571782';
  const num = '01571782';
  const stripped = '1571782';
  console.log('--- Testing RJ01571782 ---');

  // 1. ASMR.one mirror
  for (const host of ['https://api.asmr-200.com', 'https://api.asmr-300.com', 'https://api.asmr.one']) {
    for (const id of [num, stripped, rj]) {
      try {
        const res = await axios.get(`${host}/api/work/${id}`, { timeout: 3000 });
        console.log(`[ASMR.one ${host} id=${id}] success:`, {
          title: res.data.title,
          mainCoverUrl: res.data.mainCoverUrl,
          thumbnailCoverUrl: res.data.thumbnailCoverUrl,
          samCoverUrl: res.data.samCoverUrl,
          images: res.data.images ? res.data.images.length : 0
        });
        return;
      } catch (e) {
        console.log(`[ASMR.one ${host} id=${id}] failed:`, e.message);
      }
    }
  }

  // 2. DLsite API
  const bucket = 'RJ0158000'; // RJ01571782 -> Math.ceil((1571782+1)/1000)*1000 = 1572000? Let's check bucket formula
  console.log('Bucket check:');
  const dlsiteNum = parseInt(num, 10);
  const b = Math.ceil((dlsiteNum + 1) / 1000) * 1000;
  const bStr = 'RJ' + String(b).padStart(dlsiteNum < 1000000 ? 6 : 8, '0');
  console.log('Bucket for', num, 'is', bStr);
  const dlsiteUrl = `https://img.dlsite.jp/modpub/images2/work/doujin/${bStr}/RJ01571782_img_main.jpg`;
  console.log('DLsite cover URL:', dlsiteUrl);
  try {
    const head = await axios.head(dlsiteUrl);
    console.log('DLsite cover status:', head.status);
  } catch (e) {
    console.log('DLsite cover status error:', e.message);
  }

  // 3. DLsite product API
  for (const div of ['maniax', 'home', 'girls', 'pro', 'books']) {
    try {
      const res = await axios.get(`https://www.dlsite.com/${div}/api/=/product.json?workno=RJ01571782`);
      console.log(`[DLsite API ${div}]`, res.data);
    } catch (e) {
      console.log(`[DLsite API ${div}] error:`, e.message);
    }
  }
}

testRJ();

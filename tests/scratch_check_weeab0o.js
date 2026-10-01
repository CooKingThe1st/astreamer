const axios = require('axios');

async function test() {
  const rj = 'RJ01668062';
  const stripped = 'RJ1668062';
  const num = '01668062';
  const strippedNum = '1668062';

  console.log(`Checking URLs for ${rj}...`);

  // 1. Direct probe of candidate image URLs
  const hosts = ['https://pic.weeabo0.xyz', 'https://pic1.weeabo0.xyz', 'https://pic2.weeabo0.xyz'];
  const codes = [rj, stripped, num, strippedNum];
  const patterns = [
    '',
    '_img_main',
    '_img_smp1', '_img_smp2', '_img_smp3', '_img_smp4', '_img_smp5',
    '(1)', '(2)', '(3)', '(4)', '(5)', '(6)', '(7)', '(8)',
    '_1', '_2', '_3', '_4',
    '-1', '-2', '-3', '-4',
    ' (1)', ' (2)', ' (3)'
  ];

  console.log('\n--- Probing direct pic URLs ---');
  for (const h of hosts) {
    for (const c of codes) {
      for (const p of patterns) {
        for (const ext of ['.jpg', '.png', '.webp']) {
          const url = `${h}/${c}${p}${ext}`;
          try {
            const res = await axios.get(url, {
              headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://japaneseasmr.com/', 'Range': 'bytes=0-0' },
              timeout: 2500,
              validateStatus: s => s >= 200 && s < 400
            });
            const cl = res.headers['content-range'] || res.headers['content-length'];
            console.log(`✅ [FOUND] ${url} (Length: ${cl})`);
          } catch (e) {
            // not found
          }
        }
      }
    }
  }

  // 2. Search JapaneseASMR HTML page
  try {
    const searchUrls = [
      `https://japaneseasmr.com/?s=${rj}`,
      `https://japaneseasmr.com/?s=${stripped}`
    ];
    for (const u of searchUrls) {
      const res = await axios.get(u, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Referer': 'https://japaneseasmr.com/'
        },
        timeout: 8000
      });
      console.log(`\n--- Response from ${u} (Status: ${res.status}) ---`);
      const html = res.data;
      const postLinks = [...html.matchAll(/href="(https:\/\/[^"]*\/(?:\d+|rj[^"]+)\/)"/gi)].map(m => m[1]);
      console.log('Post links:', Array.from(new Set(postLinks)));

      if (postLinks.length > 0) {
        const postUrl = postLinks[0];
        console.log(`Fetching post page: ${postUrl}`);
        const pRes = await axios.get(postUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://japaneseasmr.com/' }
        });
        const pHtml = pRes.data;
        const pImgs = [...pHtml.matchAll(/(?:src|data-src|href)="([^"]*(?:weeabo0|pic\d*|img|\.jpg|\.png|\.webp)[^"]*)"/gi)].map(m => m[1]);
        console.log('Images in post page:', Array.from(new Set(pImgs)));
      }
    }
  } catch (e) {
    console.error('HTML search error:', e.message);
  }
}

test();

async function testStream() {
  const urls = [
    'https://v.weeab0o.xyz/RJ01473335.m3u8',
    'https://v.weeab0o.xyz/RJ441308.mp3',
    'https://v.weeab0o.xyz/RJ01267551.m3u8',
    'https://v.weeab0o.xyz/BJ01267551.m3u8'
  ];
  for (const u of urls) {
    for (const ref of ['https://japaneseasmr.com/', 'https://www.asmr.one/', 'https://hentaiasmr.moe/', 'https://v.weeab0o.xyz/', '']) {
      try {
        const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' };
        if (ref) headers['Referer'] = ref;
        const res = await fetch(u, { headers });
        console.log(u, '| Ref:', ref || 'none', '-> Status:', res.status, res.headers.get('content-type'));
      } catch (e) {
        console.log(u, '| Ref:', ref || 'none', '-> Err:', e.message);
      }
    }
  }
}
testStream();

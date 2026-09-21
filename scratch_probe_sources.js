const axios = require('axios');
const fs = require('fs');

async function testWorks() {
  const rjList = ['RJ01433932', 'RJ01474140'];

  for (const rj of rjList) {
    console.log(`\n===========================================================`);
    console.log(`🔬 INSPECTING WORK: ${rj}`);
    console.log(`===========================================================`);

    const cleanNum = rj.replace(/^RJ/i, '');
    const strippedNum = cleanNum.replace(/^0+/, '');

    // 1. JapaneseASMR (Weeab0o)
    const weeUrls = [
      `https://v.weeab0o.xyz/${rj}.mp3`,
      `https://v.weeab0o.xyz/RJ${strippedNum}.mp3`,
      `https://v.weeab0o.xyz/${rj}.m3u8`,
      `https://v.weeab0o.xyz/RJ${strippedNum}.m3u8`
    ];
    for (const u of weeUrls) {
      try {
        const res = await axios.head(u, {
          headers: { 'Referer': 'https://japaneseasmr.com/', 'User-Agent': 'Mozilla/5.0' },
          timeout: 4000,
          validateStatus: () => true
        });
        console.log(`[Weeab0o] HEAD ${u} -> HTTP ${res.status} (Type: ${res.headers['content-type']}, Size: ${res.headers['content-length']})`);
      } catch (e) {
        console.log(`[Weeab0o] HEAD ${u} -> ERR: ${e.message}`);
      }
    }

    // 2. ASMR.one tracks & work
    for (const host of ['https://api.asmr-200.com', 'https://api.asmr.one']) {
      for (const id of [strippedNum, cleanNum, rj]) {
        try {
          const res = await axios.get(`${host}/api/work/${id}`, {
            headers: { 'Referer': 'https://www.asmr.one/', 'User-Agent': 'Mozilla/5.0' },
            timeout: 4000,
            validateStatus: () => true
          });
          if (res.status === 200) {
            console.log(`[ASMR.one] GET ${host}/api/work/${id} -> 200 OK (Title: ${res.data?.title})`);
          }
        } catch(e) {}

        try {
          const res = await axios.get(`${host}/api/tracks/${id}`, {
            headers: { 'Referer': 'https://www.asmr.one/', 'User-Agent': 'Mozilla/5.0' },
            timeout: 4000,
            validateStatus: () => true
          });
          if (res.status === 200) {
            const list = Array.isArray(res.data) ? res.data : (res.data?.tracks || []);
            console.log(`[ASMR.one] GET ${host}/api/tracks/${id} -> 200 OK (Tracks count: ${list.length})`);
            if (list.length > 0) {
              console.log('Sample node:', list[0]);
            }
          }
        } catch(e) {}
      }
    }

    // 3. HentaiASMR Moe REST API
    try {
      const moeRes = await axios.get(`https://hentaiasmr.moe/wp-json/wp/v2/posts?slug=${rj.toLowerCase()}&_embed=1`, {
        headers: { 'Referer': 'https://hentaiasmr.moe/', 'User-Agent': 'Mozilla/5.0' },
        timeout: 6000,
        validateStatus: () => true
      });
      console.log(`[HentaiASMR Moe API] status: ${moeRes.status}, data length: ${Array.isArray(moeRes.data) ? moeRes.data.length : 0}`);
      if (moeRes.status === 200 && Array.isArray(moeRes.data) && moeRes.data[0]) {
        const p = moeRes.data[0];
        console.log(`  Post ID: ${p.id}, Title: ${p.title?.rendered}, Link: ${p.link}`);
      }
    } catch (e) {
      console.log(`[HentaiASMR Moe API] ERR: ${e.message}`);
    }

    // 4. HentaiASMR Moe HTML Page
    try {
      const pageUrl = `https://hentaiasmr.moe/${rj.toLowerCase()}.html`;
      const res = await axios.get(pageUrl, {
        headers: { 'Referer': 'https://hentaiasmr.moe/', 'User-Agent': 'Mozilla/5.0' },
        timeout: 6000,
        validateStatus: () => true
      });
      console.log(`[HentaiASMR Moe HTML] GET ${pageUrl} -> HTTP ${res.status}`);
      if (res.status === 200) {
        const html = res.data;
        const mp3s = [...html.matchAll(/https?:\/\/[^"'\s<>]+\.mp3/gi)].map(m => m[0]);
        console.log(`  MP3 matches in HTML:`, mp3s);

        for (const mp3 of mp3s) {
          console.log(`  Testing audio URL directly: ${mp3}`);
          const hRes = await axios.head(mp3, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Referer': pageUrl,
              'Origin': 'https://hentaiasmr.moe'
            },
            timeout: 5000,
            validateStatus: () => true
          });
          console.log(`    HEAD with Referer: ${pageUrl} -> HTTP ${hRes.status} (Type: ${hRes.headers['content-type']}, Size: ${hRes.headers['content-length']})`);
        }
      }
    } catch (e) {
      console.log(`[HentaiASMR Moe HTML] ERR: ${e.message}`);
    }

    // 5. DLsite Chobit / official samples
    const chobitUrls = [
      `https://chobit.cc/api/v1/download?workno=${rj}`,
      `https://chobit.cc/api/v1/download?workno=RJ${strippedNum}`,
      `https://sample.dlsite.com/sound/${rj.slice(0,6)}/${rj}/${rj}_sample.mp3`,
      `https://sample.dlsite.com/sound/RJ${strippedNum.slice(0,4)}/RJ${strippedNum}/RJ${strippedNum}_sample.mp3`
    ];
    for (const u of chobitUrls) {
      try {
        const res = await axios.head(u, {
          headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.dlsite.com/' },
          timeout: 4000,
          validateStatus: () => true
        });
        console.log(`[Chobit/DLsite Sample] HEAD ${u} -> HTTP ${res.status}`);
      } catch (e) {
        console.log(`[Chobit/DLsite Sample] HEAD ${u} -> ERR: ${e.message}`);
      }
    }
  }
}

testWorks();


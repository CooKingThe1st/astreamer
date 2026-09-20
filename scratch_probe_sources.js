const axios = require('axios');
const fs = require('fs');

async function testRJ01254167() {
  const rj = 'RJ01254167';
  const cleanNum = '01254167';
  const strippedNum = '1254167';
  const padded6 = '1254167';

  console.log(`===========================================================`);
  console.log(`🔬 DEEP DIAGNOSTIC INSPECTION FOR WORK: ${rj}`);
  console.log(`===========================================================\n`);

  const results = {};

  // 1. Test ASMR.one /api/work/:id & /api/tracks/:id across all hosts
  const asmrHosts = [
    'https://api.asmr-200.com',
    'https://api.asmr-300.com',
    'https://api.asmr.one',
    'https://api.asmr-100.com'
  ];

  for (const host of asmrHosts) {
    console.log(`\n-----------------------------------------------------------`);
    console.log(`🌐 Testing ASMR Host: ${host}`);
    console.log(`-----------------------------------------------------------`);

    for (const id of [strippedNum, cleanNum, rj]) {
      // /api/work/:id
      const workUrl = `${host}/api/work/${id}`;
      try {
        const res = await axios.get(workUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Referer': 'https://www.asmr.one/'
          },
          timeout: 8000,
          validateStatus: () => true
        });
        console.log(`  • GET ${workUrl} -> HTTP ${res.status}`);
        if (res.status === 200) {
          results[`${host}_work_${id}`] = res.data;
          console.log(`    Data keys:`, Object.keys(res.data));
          if (res.data.mainCoverUrl || res.data.coverUrl || res.data.images || res.data.vas || res.data.tags) {
            console.log(`    Found Work metadata:`, {
              title: res.data.title,
              mainCoverUrl: res.data.mainCoverUrl,
              circle: res.data.circle,
              tags: res.data.tags ? res.data.tags.map(t => t.name || t) : []
            });
          }
        }
      } catch (e) {
        console.log(`  • GET ${workUrl} -> ERR: ${e.message}`);
      }

      // /api/tracks/:id
      const tracksUrl = `${host}/api/tracks/${id}`;
      try {
        const res = await axios.get(tracksUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Referer': 'https://www.asmr.one/'
          },
          timeout: 8000,
          validateStatus: () => true
        });
        console.log(`  • GET ${tracksUrl} -> HTTP ${res.status}`);
        if (res.status === 200) {
          results[`${host}_tracks_${id}`] = res.data;
          const dataList = Array.isArray(res.data) ? res.data : (res.data.tracks || res.data.data || []);
          console.log(`    Track nodes count: ${dataList.length}`);

          function dumpTree(nodes, indent = '      ') {
            for (const n of nodes) {
              console.log(`${indent}├─ [${n.type || 'unknown'}] "${n.title || ''}" (hash: ${n.hash || 'none'}, mediaStreamUrl: ${n.mediaStreamUrl || 'none'})`);
              if (n.children && n.children.length > 0) {
                dumpTree(n.children, indent + '│  ');
              }
            }
          }
          dumpTree(dataList);
        }
      } catch (e) {
        console.log(`  • GET ${tracksUrl} -> ERR: ${e.message}`);
      }
    }
  }

  // 2. Test HentaiASMR Moe REST API
  console.log(`\n-----------------------------------------------------------`);
  console.log(`🌐 Testing HentaiASMR Moe API for ${rj}`);
  console.log(`-----------------------------------------------------------`);
  try {
    const moeUrl = `https://hentaiasmr.moe/wp-json/wp/v2/posts?slug=${rj.toLowerCase()}`;
    const moeRes = await axios.get(moeUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://hentaiasmr.moe/'
      },
      timeout: 8000,
      validateStatus: () => true
    });
    console.log(`  • GET ${moeUrl} -> HTTP ${moeRes.status}`);
    if (moeRes.status === 200 && Array.isArray(moeRes.data) && moeRes.data[0]) {
      const p = moeRes.data[0];
      results['moe_post'] = p;
      console.log(`    Post title:`, p.title?.rendered);
      console.log(`    Featured media ID:`, p.featured_media);
      if (p.content?.rendered) {
        const imgMatches = p.content.rendered.match(/https?:\/\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi);
        console.log(`    Content embedded images:`, imgMatches || 'none');
      }
    }
  } catch (e) {
    console.log(`  • HentaiASMR ERR: ${e.message}`);
  }

  // Save dump for review
  fs.writeFileSync('scratch_probe_dump.json', JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n💾 Saved detailed response data to scratch_probe_dump.json`);
}

testRJ01254167();

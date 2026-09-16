const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function probeAsmrOne(targetRj) {
  const rj = (targetRj || process.argv[2] || 'RJ01254167').toUpperCase();
  const rawNum = rj.replace(/^[A-Za-z]+/, '');
  const strippedNum = rawNum.replace(/^0+/, '');

  console.log(`\n===========================================================`);
  console.log(`🔍 Probing ASMR.one API for Work: ${rj} (Numeric ID: ${strippedNum})`);
  console.log(`===========================================================`);

  const primaryHost = 'https://api.asmr-200.com';
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Referer': 'https://www.asmr.one/',
    'Origin': 'https://www.asmr.one'
  };

  const output = {
    rj,
    id: strippedNum,
    timestamp: new Date().toISOString(),
    host: primaryHost,
    workMetadata: null,
    artworkImages: [],
    audioTracksCount: 0,
    audioTracks: []
  };

  // 1. Probe /api/work/:id
  try {
    const workUrl = `${primaryHost}/api/work/${strippedNum}`;
    const res = await axios.get(workUrl, { headers, timeout: 10000, validateStatus: () => true });
    if (res.status === 200 && res.data && !res.data.error) {
      const data = res.data;
      output.workMetadata = {
        title: data.title,
        circle: data.circle?.name || data.circle || data.name,
        vas: Array.isArray(data.vas) ? data.vas.map(v => v.name || v) : [],
        tags: Array.isArray(data.tags) ? data.tags.map(t => t.name || t) : [],
        mainCoverUrl: data.mainCoverUrl || `${primaryHost}/api/cover/${strippedNum}.jpg?type=main`,
        releaseDate: data.release
      };
      console.log(`✅ [1/2] Work Metadata Retrieved:`);
      console.log(`   • Title: ${output.workMetadata.title}`);
      console.log(`   • Circle: ${output.workMetadata.circle}`);
      console.log(`   • Voice Actors: ${output.workMetadata.vas.join(', ') || 'N/A'}`);
      console.log(`   • Main Cover: ${output.workMetadata.mainCoverUrl}`);
    } else {
      console.log(`⚠️ [1/2] /api/work/${strippedNum} returned HTTP ${res.status}`);
    }
  } catch (err) {
    console.log(`❌ [1/2] Error fetching /api/work: ${err.message}`);
  }

  // 2. Probe /api/tracks/:id
  try {
    const tracksUrl = `${primaryHost}/api/tracks/${strippedNum}`;
    const res = await axios.get(tracksUrl, { headers, timeout: 10000, validateStatus: () => true });
    if (res.status === 200 && res.data) {
      const treeList = Array.isArray(res.data) ? res.data : (res.data.tracks || res.data.data || []);
      
      function parseNode(node, folderPath = '') {
        const currentPath = folderPath ? `${folderPath} / ${node.title || ''}` : (node.title || '');
        const isImage = node.type === 'image' || /\.(?:png|jpe?g|webp|gif|bmp)$/i.test(node.title || '');
        const isAudio = node.type === 'audio' || /\.(?:mp3|wav|flac|m4a|aac|ogg)$/i.test(node.title || '');
        
        if (isImage) {
          const imgUrl = node.mediaDownloadUrl || node.mediaStreamUrl || (node.hash ? `${primaryHost}/api/media/stream/${node.hash}` : null);
          if (imgUrl) {
            output.artworkImages.push({
              title: node.title,
              folder: folderPath || 'Root',
              url: imgUrl,
              source: 'ASMR.one Track Tree'
            });
          }
        } else if (isAudio) {
          output.audioTracksCount++;
          output.audioTracks.push({
            title: node.title,
            folder: folderPath || 'Root',
            streamUrl: node.mediaStreamUrl || (node.hash ? `${primaryHost}/api/media/stream/${node.hash}` : null)
          });
        }

        if (Array.isArray(node.children)) {
          for (const child of node.children) {
            parseNode(child, currentPath);
          }
        }
      }

      for (const rootNode of treeList) {
        parseNode(rootNode);
      }

      console.log(`\n✅ [2/2] Track Tree Parsed:`);
      console.log(`   • Audio Tracks Found: ${output.audioTracksCount}`);
      console.log(`   • Artwork/Illustrations Found: ${output.artworkImages.length}`);
      
      if (output.artworkImages.length > 0) {
        console.log(`\n🖼️ Artwork Images Extracted from ASMR.one:`);
        output.artworkImages.forEach((img, idx) => {
          console.log(`   ${idx + 1}. [${img.folder}] ${img.title}`);
          console.log(`      ↳ ${img.url}`);
        });
      }
    } else {
      console.log(`⚠️ [2/2] /api/tracks/${strippedNum} returned HTTP ${res.status}`);
    }
  } catch (err) {
    console.log(`❌ [2/2] Error fetching /api/tracks: ${err.message}`);
  }

  // 3. Auto-save result to output files
  const outputFile = path.join(__dirname, `asmrone_probe_${rj}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf8');
  console.log(`\n💾 Results successfully saved to: ${outputFile}`);
  console.log(`===========================================================\n`);
  return output;
}

// Run probe for RJ01254167 and RJ297871
async function run() {
  const targetRj = process.argv[2] || 'RJ01254167';
  await probeAsmrOne(targetRj);
}

run();

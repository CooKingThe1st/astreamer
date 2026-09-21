const axios = require('axios');
const scraper = require('./scraper.js');

async function inspectWork(rjCode) {
  console.log(`\n===========================================================`);
  console.log(`🔍 PROBING WORK: ${rjCode}`);
  console.log(`===========================================================`);

  // 1. DLsite product metadata
  console.log(`--- [1] DLsite official metadata ---`);
  try {
    const meta = await scraper.fetchDlsiteMetadata(rjCode);
    console.log(`DLsite Title: ${meta?.title}`);
    console.log(`DLsite Total Duration: ${meta?.totalDuration}s (${Math.round(meta?.totalDuration / 60)} mins)`);
    console.log(`DLsite CV: ${meta?.cv}`);
  } catch (e) {
    console.log(`DLsite error: ${e.message}`);
  }

  // 2. HentaiASMR Moe
  console.log(`\n--- [2] HentaiASMR Moe metadata ---`);
  try {
    const moe = await scraper.fetchHentaiAsmrMetadata(rjCode);
    console.log(`Moe Title: ${moe?.title}`);
    console.log(`Moe PostLink: ${moe?.postLink}`);
    console.log(`Moe AudioFound: ${moe?.isAudioFound}`);
    console.log(`Moe AudioTracks count: ${moe?.audioTracks?.length || 0}`);
    if (moe?.audioTracks) {
      moe.audioTracks.forEach((t, i) => {
        console.log(`  Track [${i+1}]: ${t.title} -> ${t.streamUrl} (size: ${t.fileSize || t.size || 'unknown'})`);
      });
    }
  } catch (e) {
    console.log(`Moe error: ${e.message}`);
  }

  // 3. Full Resolver
  console.log(`\n--- [3] Full Work Resolver ---`);
  try {
    const work = await scraper.resolveAndSaveWork(rjCode);
    console.log(`Resolved Title: ${work?.title}`);
    console.log(`Resolved Source: ${work?.source}`);
    console.log(`Has Lazy Audio: ${work?.hasLazyAudio}`);
    console.log(`Has HLS: ${work?.hasHls}`);
    console.log(`Tracks count: ${work?.tracks?.length || 0}`);
    if (work?.tracks) {
      work.tracks.forEach((t, i) => {
        console.log(`  Track [${i+1}]: title="${t.title}" dur=${t.duration}s formatTime="${t.formattedTime}" rawUrl="${t.rawUrl}" streamUrl="${t.streamUrl}"`);
      });
    }

    const chap = await scraper.fetchChaptersAndGallery(rjCode, work);
    console.log(`\n--- Chapters count: ${chap?.chapters?.length || 0}, SampleTracks: ${chap?.sampleTracks?.length || 0}`);
    if (chap?.sampleTracks) {
      chap.sampleTracks.forEach((st, i) => {
        console.log(`  SampleTrack [${i+1}]: ${st.title} dur=${st.duration}s formatted="${st.formattedTime}" rawUrl="${st.rawUrl}"`);
      });
    }
  } catch (e) {
    console.log(`Resolve error: ${e.message}`);
  }
}

async function run() {
  await inspectWork('RJ01716858');
  await inspectWork('RJ01707098');
}

run().catch(console.error);

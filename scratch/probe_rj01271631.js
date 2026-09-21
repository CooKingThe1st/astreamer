const scraper = require('./scraper.js');

async function testRJ() {
  const rjCode = 'RJ01271631';
  console.log('--- Probing work:', rjCode);
  
  const result = await scraper.fetchWorkDetails(rjCode);
  console.log('Metadata title:', result?.title);
  console.log('Source:', result?.source);
  console.log('Tracks count:', result?.tracks?.length || 0);
  console.log('Sample tracks count:', result?.sampleTracks?.length || 0);
  
  if (result?.tracks) {
    console.log('\n--- Sample of Tracks:');
    result.tracks.slice(0, 5).forEach((t, i) => {
      console.log(`[${i}] Title: ${t.title}`);
      console.log(`    Stream: ${t.streamUrl || t.url}`);
      console.log(`    MediaStreamUrl: ${t.mediaStreamUrl}`);
      console.log(`    Type: ${t.type}`);
    });
  }

  const chaptersResult = await scraper.fetchChaptersAndGallery(rjCode, result);
  console.log('\n--- Chapters & Gallery result:');
  console.log('Chapters/Tracks count:', chaptersResult?.tracks?.length || 0);
  if (chaptersResult?.tracks) {
    chaptersResult.tracks.slice(0, 5).forEach((t, i) => {
      console.log(`[${i}] Title: ${t.title}`);
      console.log(`    Stream: ${t.streamUrl || t.url}`);
      console.log(`    MediaStreamUrl: ${t.mediaStreamUrl}`);
      console.log(`    Type: ${t.type}`);
    });
  }
}

testRJ().catch(console.error);

const { scrapeWork } = require('./scraper');

async function test() {
  console.log('--- Testing scrape with RJ Code: RJ441308 ---');
  const result1 = await scrapeWork('RJ441308');
  console.log('Result 1:');
  console.log({
    title: result1.title,
    rjCode: result1.rjCode,
    cv: result1.cv,
    circle: result1.circle,
    totalTracks: result1.totalTracks,
    tracks: result1.tracks
  });

  console.log('\n--- Testing scrape with direct URL: https://japaneseasmr.com/72715/ ---');
  const result2 = await scrapeWork('https://japaneseasmr.com/72715/');
  console.log(`Result 2 Title: ${result2.title}, Tracks: ${result2.totalTracks}`);
}

test().catch(console.error);

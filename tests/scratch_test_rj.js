const { probeMediaCdn, fetchHentaiAsmrMetadata } = require('../scraper');

async function test() {
  console.log('=== Testing RJ01189109 ===');
  const res1 = await probeMediaCdn('RJ01189109');
  console.log('Selected Source:', res1.source);
  console.log('Track Count:', res1.tracks.length);
  console.log('Tracks:');
  res1.tracks.forEach(t => console.log(`  [${t.id}] ${t.title} (${t.formattedTime || t.duration + 's'}) [cat: ${t.category}]`));

  console.log('\n=== Testing RJ296130 ===');
  const res2 = await probeMediaCdn('RJ296130');
  console.log('Selected Source:', res2.source);
  console.log('Track Count:', res2.tracks.length);
  console.log('Tracks:');
  res2.tracks.forEach(t => console.log(`  [${t.id}] ${t.title} (${t.formattedTime || t.duration + 's'}) [cat: ${t.category}]`));
}

test().catch(console.error);

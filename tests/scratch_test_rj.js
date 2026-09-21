const { fetchDlsiteMetadata, fetchHentaiAsmrMetadata, resolveRjMetadataOnly } = require('./scraper');

async function test() {
  for (const rj of ['RJ01706082', 'RJ01433932']) {
    console.log(`\n========================================`);
    console.log(`🔍 Probing ${rj}`);
    console.log(`========================================`);

    console.log(`\n--- 1. DLsite Metadata ---`);
    const dlsite = await fetchDlsiteMetadata(rj);
    console.log(dlsite);

    console.log(`\n--- 2. HentaiASMR Metadata ---`);
    const moe = await fetchHentaiAsmrMetadata(rj);
    console.log(moe);

    console.log(`\n--- 3. resolveRjMetadataOnly ---`);
    const resolved = await resolveRjMetadataOnly(rj);
    console.log(resolved);
  }
}

test();

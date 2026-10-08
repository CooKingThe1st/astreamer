const fs = require('fs');
const path = require('path');

let backupPath = path.join(__dirname, 'astreamer_backup.json');
if (!fs.existsSync(backupPath)) {
  backupPath = 'C:\\Users\\minhd\\Downloads\\astreamer_backup.json';
}

if (!fs.existsSync(backupPath)) {
  console.error('❌ Could not find astreamer_backup.json');
  process.exit(1);
}

console.log(`===========================================================`);
console.log(`📂 Extracting standalone collections from: ${backupPath}`);
const rawData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

const wishlist = Array.isArray(rawData.wishlist) ? rawData.wishlist : [];
const tagDict = rawData.tagDict && typeof rawData.tagDict === 'object' ? rawData.tagDict : {};
const playlists = Array.isArray(rawData.playlists) ? rawData.playlists : [];
const history = Array.isArray(rawData.history) ? rawData.history : [];

fs.writeFileSync(path.join(__dirname, 'scratch_wishlist.json'), JSON.stringify(wishlist), 'utf8');
fs.writeFileSync(path.join(__dirname, 'scratch_tag_dict.json'), JSON.stringify(tagDict), 'utf8');
fs.writeFileSync(path.join(__dirname, 'scratch_playlists.json'), JSON.stringify(playlists), 'utf8');
fs.writeFileSync(path.join(__dirname, 'scratch_history.json'), JSON.stringify(history), 'utf8');

console.log(`✅ Wishlist (${wishlist.length} items) -> scratch_wishlist.json`);
console.log(`✅ Tag Dictionary (${Object.keys(tagDict).length} entries) -> scratch_tag_dict.json`);
console.log(`✅ Playlists (${playlists.length} items) -> scratch_playlists.json`);
console.log(`✅ History (${history.length} items) -> scratch_history.json`);

console.log(`\n🚀 Run these 4 commands in your terminal to populate standalone KV keys:`);
console.log(`   npx wrangler kv key put --binding=ASTREAMER_KV ASTREAMER_WISHLIST --path=scratch_wishlist.json --remote`);
console.log(`   npx wrangler kv key put --binding=ASTREAMER_KV ASTREAMER_TAG_DICT --path=scratch_tag_dict.json --remote`);
console.log(`   npx wrangler kv key put --binding=ASTREAMER_KV ASTREAMER_PLAYLISTS --path=scratch_playlists.json --remote`);
console.log(`   npx wrangler kv key put --binding=ASTREAMER_KV ASTREAMER_HISTORY --path=scratch_history.json --remote`);
console.log(`===========================================================`);

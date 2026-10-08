const fs = require('fs');
const path = require('path');

let backupPath = path.join(__dirname, 'astreamer_backup.json');
if (!fs.existsSync(backupPath)) {
  backupPath = 'C:\\Users\\minhd\\Downloads\\astreamer_backup.json';
}

if (!fs.existsSync(backupPath)) {
  console.error('❌ Could not find astreamer_backup.json in project root or Downloads folder.');
  process.exit(1);
}

console.log(`===========================================================`);
console.log(`📂 Reading backup file from: ${backupPath}`);
const rawData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
const worksMap = rawData.works || {};
const worksList = Object.values(worksMap).filter(Boolean);

console.log(`📦 Found ${worksList.length} works in backup file.`);

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'boolean') return str ? '1' : '0';
  if (typeof str === 'number') return isNaN(str) ? '0' : String(str);
  if (typeof str === 'object') str = JSON.stringify(str);
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function pruneWorkRecord(work) {
  if (!work) return null;
  const cleanRj = (work.rjCode || '').toUpperCase().trim();
  if (!cleanRj) return null;

  const cleanTracks = Array.isArray(work.tracks) ? work.tracks.map((t, idx) => ({
    id: t.id || (idx + 1),
    title: t.title || (`Track ${idx + 1}`),
    duration: parseFloat(t.duration) || 0,
    startTime: parseFloat(t.startTime) || 0,
    isHls: Boolean(t.isHls),
    streamUrl: t.streamUrl || t.rawUrl || '',
    rawUrl: t.rawUrl || t.streamUrl || ''
  })) : [];

  const cleanSamples = Array.isArray(work.sampleTracks) ? work.sampleTracks.map((st, idx) => ({
    id: st.id || (idx + 1),
    title: st.title || (`Sample ${idx + 1}`),
    streamUrl: st.streamUrl || st.rawUrl || '',
    rawUrl: st.rawUrl || st.streamUrl || ''
  })) : [];

  return {
    rjCode: cleanRj,
    title: work.title || cleanRj,
    circle: work.circle || '',
    cv: work.cv || '',
    tags: Array.isArray(work.tags) ? work.tags.filter(Boolean) : [],
    coverUrl: work.coverUrl || '',
    nsfw: work.nsfw !== false ? 1 : 0,
    favorite: work.favorite ? 1 : 0,
    rating: parseFloat(work.rating) || 0,
    releaseDate: work.releaseDate || '',
    addedAt: work.addedAt || new Date().toISOString(),
    tracks: cleanTracks,
    sampleTracks: cleanSamples,
    hasHls: work.hasHls ? 1 : 0
  };
}

const sqlStatements = [];

let count = 0;
for (const rawWork of worksList) {
  const w = pruneWorkRecord(rawWork);
  if (!w || !w.rjCode) continue;

  const sql = `INSERT INTO works (
    rj_code, title, circle, cv, tags, cover_url, nsfw, favorite, rating, release_date, added_at, tracks, sample_tracks, has_hls
  ) VALUES (
    ${escapeSql(w.rjCode)}, ${escapeSql(w.title)}, ${escapeSql(w.circle)}, ${escapeSql(w.cv)},
    ${escapeSql(w.tags)}, ${escapeSql(w.coverUrl)}, ${w.nsfw}, ${w.favorite}, ${w.rating},
    ${escapeSql(w.releaseDate)}, ${escapeSql(w.addedAt)}, ${escapeSql(w.tracks)}, ${escapeSql(w.sampleTracks)}, ${w.hasHls}
  ) ON CONFLICT(rj_code) DO UPDATE SET
    title = excluded.title, circle = excluded.circle, cv = excluded.cv, tags = excluded.tags,
    cover_url = excluded.cover_url, nsfw = excluded.nsfw, favorite = excluded.favorite,
    rating = excluded.rating, release_date = excluded.release_date, tracks = excluded.tracks,
    sample_tracks = excluded.sample_tracks, has_hls = excluded.has_hls;`;

  sqlStatements.push(sql);
  count++;
}

const sqlFile = path.join(__dirname, 'scratch_d1_migration.sql');
fs.writeFileSync(sqlFile, sqlStatements.join('\n'), 'utf8');
console.log(`✅ Generated SQL migration file: scratch_d1_migration.sql (${count} INSERT statements).`);
console.log(`🚀 Run this command in your terminal to populate Cloudflare D1:`);
console.log(`   npx wrangler d1 execute astreamer-db --remote --file=scratch_d1_migration.sql`);
console.log(`===========================================================`);

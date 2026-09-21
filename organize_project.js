const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const testsDir = path.join(rootDir, 'tests');
const fixturesDir = path.join(testsDir, 'fixtures');

if (!fs.existsSync(testsDir)) fs.mkdirSync(testsDir, { recursive: true });
if (!fs.existsSync(fixturesDir)) fs.mkdirSync(fixturesDir, { recursive: true });

function safeMove(src, dest) {
  try {
    if (fs.existsSync(src)) {
      fs.renameSync(src, dest);
      return true;
    }
  } catch (err) {
    console.error(`[Error moving] ${src} -> ${dest}:`, err.message);
  }
  return false;
}

const rootFiles = fs.readdirSync(rootDir);

// 1. Organize root files
rootFiles.forEach(file => {
  const fullPath = path.join(rootDir, file);
  if (!fs.existsSync(fullPath)) return;
  if (fs.statSync(fullPath).isDirectory()) return;

  // Skip core production and configuration files
  if (
    file === 'organize_project.js' ||
    file === 'worker.js' ||
    file === 'server.js' ||
    file === 'scraper.js' ||
    file === 'db.js' ||
    file === 'llm_resolver.js' ||
    file === 'ehtag_resolver.js' ||
    file === 'vndb_resolver.js' ||
    file === 'seiyuu_jikan_resolver.js' ||
    file === 'sync_html_from_server.js' ||
    file === 'sync_html_from_worker.js' ||
    file === 'advance_validate_syntax.js' ||
    file === 'package.json' ||
    file === 'package-lock.json' ||
    file === 'wrangler.toml' ||
    file === '.env' ||
    file === '.env.example' ||
    file === '.gitignore' ||
    file === 'README.md' ||
    file === 'RELEASE_NOTES.md' ||
    file === 'ARCHITECTURE.md' ||
    file === 'CLOUDFLARE_DEPLOY.md'
  ) {
    return;
  }

  // Dump payloads, samples, mock txt/json files
  if (
    file.endsWith('.txt') ||
    file.endsWith('.json') && (file.includes('probe') || file.includes('dump') || file.includes('example')) ||
    file === 'plan.md'
  ) {
    const dest = path.join(fixturesDir, file);
    if (safeMove(fullPath, dest)) {
      console.log(`[Moved Fixture] ${file} -> tests/fixtures/${file}`);
    }
  }
  // Test, scratch, and probe scripts
  else if (
    file.startsWith('test_') ||
    file.startsWith('scratch_') ||
    file.startsWith('probe_') ||
    file.startsWith('inspect_') ||
    file === 'validate_syntax.js' ||
    file === 'update_readme.js' ||
    file === 'write_clean_readme.js'
  ) {
    const dest = path.join(testsDir, file);
    if (safeMove(fullPath, dest)) {
      console.log(`[Moved Script] ${file} -> tests/${file}`);
    }
  }
});

// 2. Move any files inside scratch/ directory to tests/
const scratchDir = path.join(rootDir, 'scratch');
if (fs.existsSync(scratchDir)) {
  const scratchFiles = fs.readdirSync(scratchDir);
  scratchFiles.forEach(file => {
    const fullPath = path.join(scratchDir, file);
    if (!fs.existsSync(fullPath)) return;
    if (fs.statSync(fullPath).isDirectory()) return;

    if (file.endsWith('.txt') || (file.endsWith('.json') && !file.includes('package'))) {
      const dest = path.join(fixturesDir, file);
      if (safeMove(fullPath, dest)) {
        console.log(`[Moved Fixture] scratch/${file} -> tests/fixtures/${file}`);
      }
    } else {
      const dest = path.join(testsDir, file);
      if (safeMove(fullPath, dest)) {
        console.log(`[Moved Scratch] scratch/${file} -> tests/${file}`);
      }
    }
  });

  try {
    const remaining = fs.readdirSync(scratchDir);
    if (remaining.length === 0) {
      fs.rmdirSync(scratchDir);
      console.log('[Cleaned] Removed empty scratch/ directory');
    }
  } catch (e) {}
}

console.log('✅ Project organization completed successfully!');

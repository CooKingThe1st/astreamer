const fs = require('fs');
const path = require('path');
const vm = require('vm');

function checkFile(filename) {
  const filePath = path.join(__dirname, '..', filename);
  console.log(`\n========================================\nChecking ${filename}...`);
  const content = fs.readFileSync(filePath, 'utf-8');

  // If ES Module (like worker.js), validate with module simulation
  let testContent = content;
  if (filename === 'worker.js') {
    testContent = content.replace('export default {', 'const _export = {');
  }

  try {
    new vm.Script(testContent, { filename });
    console.log(`[PASS] Overall file syntax is valid for ${filename}`);
  } catch (err) {
    console.error(`[FAIL] Overall file syntax error in ${filename}:`, err);
    return false;
  }

  // If file contains embedded INDEX_HTML
  const htmlMatch = content.match(/const INDEX_HTML = `([\s\S]*?)`;\s*(?:\n|\r)/);
  if (htmlMatch) {
    const html = htmlMatch[1];
    console.log(`[PASS] INDEX_HTML found (${html.length} chars).`);
    
    // Extract script tags inside INDEX_HTML
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
    let sMatch;
    let scriptIdx = 0;
    while ((sMatch = scriptRegex.exec(html)) !== null) {
      scriptIdx++;
      const jsCode = sMatch[1];
      if (!jsCode.trim()) continue;
      
      // Accurately replace template interpolations
      const sanitized = jsCode.replace(/\$\{JSON\.stringify\([^)]*(?:\([^)]*\))*[^)]*\)\}/g, '{}');
      try {
        new vm.Script(sanitized, { filename: `${filename} <script #${scriptIdx}>` });
        console.log(`[PASS] Client <script #${scriptIdx}> syntax is valid.`);
      } catch (scriptErr) {
        console.error(`[FAIL] Client <script #${scriptIdx}> in ${filename} has ${scriptErr.name}: ${scriptErr.message}`);
        
        // Print lines around error
        const lines = sanitized.split('\n');
        const matchLine = scriptErr.stack.match(/:(\d+):(\d+)/);
        if (matchLine) {
          const errLine = parseInt(matchLine[1], 10);
          console.log(`Error context near line ${errLine}:`);
          for (let i = Math.max(0, errLine - 5); i < Math.min(lines.length, errLine + 5); i++) {
            console.log(`${i + 1}: ${lines[i]}`);
          }
        }
        return false;
      }
    }
  }

  return true;
}

const files = ['llm_resolver.js', 'db.js', 'server.js', 'worker.js'];
let allOk = true;
for (const f of files) {
  if (!checkFile(f)) allOk = false;
}

if (allOk) {
  console.log('\n✨ ALL FILES PASSED VALIDATION WITH 0 SYNTAX ERRORS! ✨');
} else {
  process.exit(1);
}

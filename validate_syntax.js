const fs = require('fs');
const vm = require('vm');
const path = require('path');

const files = ['db.js', 'scraper.js', 'llm_resolver.js', 'server.js', 'worker.js'];
let totalErrors = 0;

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) continue;
  
  console.log(`\n========================================`);
  console.log(`Checking ${file}...`);
  const code = fs.readFileSync(filePath, 'utf8');

  // Check top-level syntax
  try {
    const sanitized = file === 'worker.js' 
      ? code.replace(/\bexport\s+default\b/, 'const __worker_export =') 
      : code;
    new vm.Script(sanitized, { filename: file });
    console.log(`[PASS] Overall file syntax is valid for ${file}`);
  } catch (err) {
    console.error(`[FAIL] Syntax error in ${file}:`, err.message);
    totalErrors++;
  }

  // If file contains INDEX_HTML, evaluate the template literal in a safe context to get actual browser HTML
  let evaluatedHtml = '';
  const htmlMatch = code.match(/const\s+INDEX_HTML\s*=\s*`([\s\S]*?)`;/);
  if (htmlMatch) {
    try {
      const context = vm.createContext({
        db: { BASE_TAG_DICT: {} },
        BASE_TAG_DICT: {},
        JSON: JSON
      });
      evaluatedHtml = vm.runInContext('`' + htmlMatch[1] + '`', context);
      console.log(`[PASS] INDEX_HTML successfully evaluated (${evaluatedHtml.length} chars).`);
    } catch (err) {
      console.error(`[FAIL] INDEX_HTML template evaluation error in ${file}:`, err.message);
      totalErrors++;
    }
  }

  const htmlSource = evaluatedHtml || code;
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let scriptIndex = 0;
  while ((match = scriptRegex.exec(htmlSource)) !== null) {
    scriptIndex++;
    const scriptBody = match[1];
    if (!scriptBody.trim()) continue;

    try {
      new vm.Script(scriptBody, { filename: `${file} <script #${scriptIndex}>` });
      console.log(`[PASS] Client <script #${scriptIndex}> in ${file} syntax OK (${scriptBody.length} chars).`);
    } catch (err) {
      console.error(`[FAIL] Client <script #${scriptIndex}> in ${file} has SyntaxError:`, err.message);
      
      const lineMatch = err.stack.match(/<script #\d+>:(\d+)/);
      if (lineMatch) {
        const lineNo = parseInt(lineMatch[1], 10);
        const lines = scriptBody.split('\n');
        console.error(`Error context near line ${lineNo}:`);
        for (let l = Math.max(1, lineNo - 4); l <= Math.min(lines.length, lineNo + 4); l++) {
          console.error(`${l === lineNo ? '->' : '  '} ${l}: ${lines[l - 1]}`);
        }
      }
      totalErrors++;
    }
  }
}

console.log(`\n========================================`);
if (totalErrors > 0) {
  console.error(`❌ Validation FAILED with ${totalErrors} error(s).`);
  process.exit(1);
} else {
  console.log(`✅ ALL files & client scripts validated with ZERO syntax errors!`);
}

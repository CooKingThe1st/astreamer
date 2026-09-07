const fs = require('fs');
const vm = require('vm');

function validateWorkerFile(filePath) {
  console.log(`\n========================================`);
  console.log(`Checking ${filePath}...`);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return false;
  }
  const content = fs.readFileSync(filePath, 'utf8');

  // 1. Overall Worker / Server file syntax check
  try {
    const wrapped = content.replace(/\bexport\s+default\b/, 'const __default_export__ = ');
    new vm.Script(wrapped, { filename: filePath });
    console.log(`[PASS] Overall file syntax is valid for ${filePath}`);
  } catch (err) {
    console.error(`[FAIL] File syntax error in ${filePath}:`, err.message);
    return false;
  }

  // 2. Extract and evaluate INDEX_HTML if present
  const startMarker = 'const INDEX_HTML = `';
  const startIdx = content.indexOf(startMarker);
  if (startIdx === -1) {
    console.log(`No INDEX_HTML found in ${filePath} (Pure JS/Node module).`);
    return true;
  }

  const afterStart = content.slice(startIdx + 'const INDEX_HTML = '.length);
  // Find matching backtick + semicolon
  const endMatch = afterStart.match(/`;\s*(?:\n|\r|\/\/|$)/);
  if (!endMatch) {
    console.error(`[FAIL] Could not locate closing \`; for INDEX_HTML in ${filePath}`);
    return false;
  }

  const htmlLiteral = afterStart.slice(0, endMatch.index + 1);

  let evaluatedHtml = '';
  try {
    const sandbox = {
      Response: class {},
      Request: class {},
      Headers: class {},
      URL: global.URL,
      fetch: () => {},
      console: console,
      BASE_TAG_DICT: {},
      db: { BASE_TAG_DICT: {} }
    };
    const ctx = vm.createContext(sandbox);
    evaluatedHtml = vm.runInContext('(' + htmlLiteral + ')', ctx);
    console.log(`[PASS] INDEX_HTML successfully evaluated (${evaluatedHtml.length} chars).`);
  } catch (err) {
    console.error(`[FAIL] INDEX_HTML template evaluation error in ${filePath}:`, err.message);
    return false;
  }

  // 3. Extract and validate all client <script> tags from evaluated HTML
  const scriptRegex = /<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi;
  let match;
  let count = 0;
  let hasErrors = false;
  while ((match = scriptRegex.exec(evaluatedHtml)) !== null) {
    count++;
    const scriptBody = match[1];
    if (!scriptBody.trim()) continue;
    try {
      new vm.Script(scriptBody, { filename: `${filePath} -> <script #${count}>` });
      console.log(`[PASS] Client <script #${count}> in ${filePath} parsed with ZERO syntax errors!`);
    } catch (err) {
      hasErrors = true;
      console.error(`[FAIL] Client <script #${count}> in ${filePath} has SyntaxError:`, err.message);
      const lineNum = err.stack.match(/<script #\d+>:(\d+)/);
      if (lineNum) {
        const ln = parseInt(lineNum[1], 10);
        const lines = scriptBody.split('\n');
        console.error(`Error context near line ${ln}:`);
        for (let i = Math.max(0, ln - 4); i < Math.min(lines.length, ln + 4); i++) {
          console.error(`${i + 1}: ${lines[i]}`);
        }
      }
    }
  }
  return !hasErrors;
}

const wOk = validateWorkerFile('worker.js');
const sOk = validateWorkerFile('server.js');
const scOk = validateWorkerFile('scraper.js');

if (wOk && sOk && scOk) {
  console.log(`\n🎉 ALL CHECKS PASSED: worker.js, server.js, and scraper.js have 0 syntax errors!\n`);
  process.exit(0);
} else {
  console.error(`\n❌ SYNTAX VALIDATION FAILED! Check error logs above.\n`);
  process.exit(1);
}

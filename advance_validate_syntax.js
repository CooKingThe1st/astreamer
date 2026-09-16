const fs = require('fs');
const vm = require('vm');
const path = require('path');

const files = ['db.js', 'scraper.js', 'llm_resolver.js', 'server.js', 'worker.js'];
let totalErrors = 0;
let totalPassedFiles = 0;

console.log('===========================================================');
console.log('🔍 aStreamer Advanced Syntax & AST Validator');
console.log('===========================================================');

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) continue;

  console.log(`\n-----------------------------------------------------------`);
  console.log(`📂 Inspecting: ${file}`);
  const rawCode = fs.readFileSync(filePath, 'utf8');
  let fileErrorCount = 0;

  // 1. Backend Script Validation
  const backendSanitized = file === 'worker.js'
    ? rawCode.replace(/\bexport\s+default\b/, 'const __worker_export =')
    : rawCode;

  try {
    new vm.Script(backendSanitized, { filename: file });
    console.log(`   ✅ Top-level backend syntax valid.`);
  } catch (err) {
    fileErrorCount++;
    totalErrors++;
    console.error(`\n❌ [Backend Script Error] ${file}:`);
    console.error(`   Message: ${err.message}`);
  }

  // 1.5. Check duplicate top-level function / variable names in ES module / scripts
  const topLevelDeclarations = new Map();
  const lines = rawCode.split('\n');
  lines.forEach((l, idx) => {
    const fnMatch = l.match(/^(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z0-9_$]+)\s*\(/);
    if (fnMatch) {
      const sym = fnMatch[1];
      if (topLevelDeclarations.has(sym)) {
        fileErrorCount++;
        totalErrors++;
        console.error(`\n❌ [Duplicate Declaration Error] ${file}: Symbol "${sym}" declared on line ${idx + 1}, already declared on line ${topLevelDeclarations.get(sym)}`);
      } else {
        topLevelDeclarations.set(sym, idx + 1);
      }
    }
  });

  // 2. Embedded INDEX_HTML Template Evaluation
  let evaluatedHtml = '';
  const htmlMatch = rawCode.match(/const\s+INDEX_HTML\s*=\s*`([\s\S]*?)`;/);
  if (htmlMatch) {
    try {
      const context = vm.createContext({
        db: { BASE_TAG_DICT: {} },
        BASE_TAG_DICT: {},
        JSON: JSON
      });
      evaluatedHtml = vm.runInContext('`' + htmlMatch[1] + '`', context);
      console.log(`   ✅ INDEX_HTML template evaluated successfully (${evaluatedHtml.length} chars).`);
    } catch (err) {
      fileErrorCount++;
      totalErrors++;
      console.error(`\n❌ [Template Evaluation Error] INDEX_HTML in ${file}:`);
      console.error(`   Message: ${err.message}`);
    }

    // 3. Client <script> Validation
    if (evaluatedHtml) {
      const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
      let match;
      let scriptIndex = 0;

      while ((match = scriptRegex.exec(evaluatedHtml)) !== null) {
        scriptIndex++;
        const scriptBody = match[1];
        if (!scriptBody.trim()) continue;

        try {
          new vm.Script(scriptBody, { filename: `${file} <script #${scriptIndex}>` });
          console.log(`   ✅ Client <script #${scriptIndex}> syntax valid (${scriptBody.length} chars).`);
        } catch (err) {
          fileErrorCount++;
          totalErrors++;
          console.error(`\n❌ [Client Script Error] <script #${scriptIndex}> in ${file}:`);
          console.error(`   Message: ${err.message}`);
          const lineMatch = err.stack && err.stack.match(/<script #\d+>:(\d+)/);
          if (lineMatch) {
            const lineNo = parseInt(lineMatch[1], 10);
            const lines = scriptBody.split('\n');
            console.error(`   Error context near line ${lineNo}:`);
            for (let l = Math.max(1, lineNo - 3); l <= Math.min(lines.length, lineNo + 3); l++) {
              console.error(`   ${l === lineNo ? '->' : '  '} ${l}: ${lines[l - 1]}`);
            }
          }
        }
      }
    }
  }

  if (fileErrorCount === 0) {
    totalPassedFiles++;
  }
}

// Final Report
console.log(`\n===========================================================`);
if (totalErrors > 0) {
  console.error(`💥 Validation finished: Found ${totalErrors} syntax error(s) across codebase.`);
  process.exit(1);
} else {
  console.log(`🎉 ALL ${totalPassedFiles}/${files.length} files & embedded client scripts passed with 0 errors!`);
  console.log(`===========================================================`);
  process.exit(0);
}

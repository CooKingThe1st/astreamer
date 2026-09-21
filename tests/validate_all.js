const fs = require('fs');
const path = require('path');
const vm = require('vm');

const files = ['db.js', 'scraper.js', 'llm_resolver.js', 'server.js', 'worker.js'];
let totalErrors = 0;

for (const file of files) {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) continue;

  const rawCode = fs.readFileSync(filePath, 'utf8');
  const backendSanitized = file === 'worker.js'
    ? rawCode.replace(/\bexport\s+default\b/, 'const __worker_export =')
    : rawCode;

  try {
    new vm.Script(backendSanitized, { filename: file });
  } catch (err) {
    totalErrors++;
    console.error(`❌ [Backend Script Error] ${file}:`, err.message);
  }

  const htmlMatch = rawCode.match(/const\s+INDEX_HTML\s*=\s*`([\s\S]*?)`;/);
  if (htmlMatch) {
    try {
      const context = vm.createContext({
        db: { BASE_TAG_DICT: {} },
        BASE_TAG_DICT: {},
        JSON: JSON
      });
      const evaluatedHtml = vm.runInContext('`' + htmlMatch[1] + '`', context);
      const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
      let match;
      let scriptIndex = 0;

      while ((match = scriptRegex.exec(evaluatedHtml)) !== null) {
        scriptIndex++;
        const scriptBody = match[1];
        if (!scriptBody.trim()) continue;
        try {
          new vm.Script(scriptBody, { filename: `${file} <script #${scriptIndex}>` });
        } catch (err) {
          totalErrors++;
          console.error(`❌ [Client Script Error] <script #${scriptIndex}> in ${file}:`, err.message);
        }
      }
    } catch (err) {
      totalErrors++;
      console.error(`❌ [Template Eval Error] ${file}:`, err.message);
    }
  }
}

if (totalErrors === 0) {
  console.log('🎉 ALL files and client scripts validated with 0 errors!');
  process.exit(0);
} else {
  console.error(`💥 Validation found ${totalErrors} error(s).`);
  process.exit(1);
}

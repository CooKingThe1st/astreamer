const fs = require('fs');
const path = require('path');
const vm = require('vm');

const workerPath = path.join(__dirname, '../worker.js');
const serverPath = path.join(__dirname, '../server.js');

const workerContent = fs.readFileSync(workerPath, 'utf8');
const serverContent = fs.readFileSync(serverPath, 'utf8');

const marker = 'const INDEX_HTML = `';
const workerHtmlStart = workerContent.indexOf(marker);
const workerHtmlEnd = workerContent.lastIndexOf('`;');

const serverHtmlStart = serverContent.indexOf(marker);
const serverHtmlEnd = serverContent.lastIndexOf('`;');

if (workerHtmlStart === -1 || workerHtmlEnd === -1 || serverHtmlStart === -1 || serverHtmlEnd === -1) {
  console.error('Error finding markers:', { workerHtmlStart, workerHtmlEnd, serverHtmlStart, serverHtmlEnd });
  process.exit(1);
}

let serverHtml = serverContent.substring(serverHtmlStart + marker.length, serverHtmlEnd);
serverHtml = serverHtml.replaceAll('${JSON.stringify(db.BASE_TAG_DICT || {})}', '${JSON.stringify(BASE_TAG_DICT || {})}');
serverHtml = serverHtml.replaceAll('${JSON.stringify(db.BASE_TAG_DICT)}', '${JSON.stringify(BASE_TAG_DICT || {})}');

const updatedWorker = workerContent.substring(0, workerHtmlStart + marker.length) + serverHtml + workerContent.substring(workerHtmlEnd);

fs.writeFileSync(workerPath, updatedWorker, 'utf8');
console.log('✅ Synchronized INDEX_HTML to worker.js');

// Now run advance_validate_syntax logic inline
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
} else {
  console.error(`💥 Validation found ${totalErrors} error(s).`);
}

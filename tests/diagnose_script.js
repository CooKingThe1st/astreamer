const fs = require('fs');
const vm = require('vm');
const path = require('path');

['server.js', 'worker.js'].forEach(file => {
  console.log(`\n================================`);
  console.log(`Inspecting ${file}...`);
  const code = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

  // Backend syntax
  try {
    const sanitized = file === 'worker.js' ? code.replace(/\bexport\s+default\b/, 'const __export_default =') : code;
    new vm.Script(sanitized);
    console.log(`✅ ${file} backend syntax: VALID`);
  } catch (err) {
    console.error(`❌ ${file} backend syntax error:`, err.message);
  }

  // Template eval
  const htmlMatch = code.match(/const\s+INDEX_HTML\s*=\s*`([\s\S]*?)`;/);
  if (htmlMatch) {
    try {
      const context = vm.createContext({ db: { BASE_TAG_DICT: {} }, BASE_TAG_DICT: {}, JSON: JSON });
      const html = vm.runInContext('`' + htmlMatch[1] + '`', context);
      console.log(`✅ ${file} INDEX_HTML evaluated (${html.length} chars)`);

      const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
      let m;
      let idx = 0;
      while ((m = scriptRegex.exec(html)) !== null) {
        idx++;
        const body = m[1];
        if (!body.trim()) continue;
        try {
          new vm.Script(body, { filename: `${file}_script_${idx}.js` });
          console.log(`✅ ${file} <script #${idx}> syntax: VALID (${body.length} chars)`);
        } catch (err) {
          console.error(`❌ ${file} <script #${idx}> syntax error:`, err.message);
          const lineM = err.stack.match(/_script_\d+\.js:(\d+)/);
          if (lineM) {
            const lineNo = parseInt(lineM[1], 10);
            const lines = body.split('\n');
            console.log(`Line ${lineNo}:`);
            for (let l = Math.max(1, lineNo - 3); l <= Math.min(lines.length, lineNo + 3); l++) {
              console.log(`${l === lineNo ? '->' : '  '} ${l}: ${lines[l - 1]}`);
            }
          }
        }
      }
    } catch (err) {
      console.error(`❌ ${file} template eval error:`, err.message);
    }
  }
});

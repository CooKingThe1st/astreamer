const fs = require('fs');
const path = require('path');

const iconPath = path.join(__dirname, 'icon', 'logo_425.png');
const workerPath = path.join(__dirname, 'worker.js');

if (!fs.existsSync(iconPath)) {
  console.error('Missing logo_425.png at:', iconPath);
  process.exit(1);
}

const b64 = fs.readFileSync(iconPath).toString('base64');
let workerCode = fs.readFileSync(workerPath, 'utf8');

const markerStart = '// == APP_LOGO_PAYLOAD_START ==';
const markerEnd = '// == APP_LOGO_PAYLOAD_END ==';
const payloadSnippet = `${markerStart}\nconst APP_LOGO_PNG_B64 = "${b64}";\n${markerEnd}`;

if (workerCode.includes(markerStart)) {
  const reg = new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}`, 'm');
  workerCode = workerCode.replace(reg, payloadSnippet);
} else {
  // Prepend or add right before fetch handler
  workerCode = payloadSnippet + '\n\n' + workerCode;
}

fs.writeFileSync(workerPath, workerCode, 'utf8');
console.log('✅ Successfully embedded logo_425.png into worker.js!');

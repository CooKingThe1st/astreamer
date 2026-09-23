const fs = require('fs');
const path = require('path');

const iconPath = path.join(__dirname, 'icon', 'logo_425.png');
if (fs.existsSync(iconPath)) {
  const buf = fs.readFileSync(iconPath);
  const b64 = 'data:image/png;base64,' + buf.toString('base64');
  fs.writeFileSync(path.join(__dirname, 'icon', 'logo_base64.txt'), b64, 'utf8');
  console.log('Successfully generated logo_base64.txt, length:', b64.length);
} else {
  console.error('File not found:', iconPath);
}

const fs = require('fs');
const path = require('path');

const workerPath = path.join(__dirname, 'worker.js');
const serverPath = path.join(__dirname, 'server.js');

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

let workerHtml = workerContent.substring(workerHtmlStart + marker.length, workerHtmlEnd);
workerHtml = workerHtml.replaceAll('${JSON.stringify(BASE_TAG_DICT || {})}', '${JSON.stringify(db.BASE_TAG_DICT || {})}');
workerHtml = workerHtml.replaceAll('${JSON.stringify(BASE_TAG_DICT)}', '${JSON.stringify(db.BASE_TAG_DICT || {})}');

const updatedServer = serverContent.substring(0, serverHtmlStart + marker.length) + workerHtml + serverContent.substring(serverHtmlEnd);

fs.writeFileSync(serverPath, updatedServer, 'utf8');
console.log('Successfully synchronized INDEX_HTML from worker.js to server.js!');

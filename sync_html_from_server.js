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

let serverHtml = serverContent.substring(serverHtmlStart + marker.length, serverHtmlEnd);
serverHtml = serverHtml.replaceAll('${JSON.stringify(db.BASE_TAG_DICT || {})}', '${JSON.stringify(BASE_TAG_DICT || {})}');
serverHtml = serverHtml.replaceAll('${JSON.stringify(db.BASE_TAG_DICT)}', '${JSON.stringify(BASE_TAG_DICT || {})}');

const updatedWorker = workerContent.substring(0, workerHtmlStart + marker.length) + serverHtml + workerContent.substring(workerHtmlEnd);

fs.writeFileSync(workerPath, updatedWorker, 'utf8');
console.log('Successfully updated worker.js with synchronized INDEX_HTML from server.js!');

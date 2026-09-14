const fs = require('fs');

const worker = fs.readFileSync('worker.js', 'utf8');

function searchPatterns(fileContent, filename) {
  console.log(`=== Searching ${filename} ===`);
  const lines = fileContent.split('\n');
  lines.forEach((l, idx) => {
    const lineNum = idx + 1;
    if (
      l.includes('openPageImportModal') ||
      l.includes('reimport') ||
      l.includes('reImport') ||
      l.includes('batchImport') ||
      l.includes('Batch Import') ||
      l.includes('queueWork') ||
      l.includes('activeJobs') ||
      l.includes('backgroundJob') ||
      l.includes('addJob') ||
      l.includes('job-item') ||
      l.includes('jobItem') ||
      l.includes('wishlist') && l.includes('import') ||
      l.includes('importWorks') ||
      l.includes('importRJ') ||
      l.includes('batch-import')
    ) {
      console.log(`Line ${lineNum}: ${l.trim().slice(0, 120)}`);
    }
  });
}

searchPatterns(worker, 'worker.js');

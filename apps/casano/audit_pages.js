const fs = require('fs');
const path = require('path');

function walk(dir, results = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fp = path.join(dir, item);
    if (fs.statSync(fp).isDirectory()) {
      walk(fp, results);
    } else if (item === 'page.tsx') {
      const content = fs.readFileSync(fp, 'utf8');
      const hasUseClient = content.includes("'use client'") || content.includes('"use client"');
      if (!hasUseClient) {
        results.push(fp);
      }
    }
  }
  return results;
}

const pages = walk('src/app');
console.log('Pages WITHOUT "use client":');
pages.forEach(p => console.log(' ', p));
console.log('\nTotal:', pages.length);

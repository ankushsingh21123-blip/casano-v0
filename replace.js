const fs = require('fs');
const path = require('path');

const files = [
  'src/app/admin/wizard/page.tsx',
  'src/app/architecture/page.jsx',
  'src/app/checkout/page.tsx',
  'src/app/investors/page.tsx',
  'src/app/merchant/page.tsx'
];

files.forEach(f => {
  const filePath = path.join(__dirname, f);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(/&quot;/g, '"');
    content = content.replace(/&apos;/g, "'");
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Fixed', f);
  } else {
    console.log('Not found', f);
  }
});
console.log('Done');

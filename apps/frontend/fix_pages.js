const fs = require('fs');
const path = require('path');

const dirs = ['fashion', 'gadgets', 'groceries', 'gym', 'stationery'];
dirs.forEach(d => {
  const f = path.join('src/app/category', d, 'page.tsx');
  const c = fs.readFileSync(f, 'utf8');
  if (!c.includes('use client')) {
    fs.writeFileSync(f, '"use client";\n' + c);
    console.log('Fixed:', d);
  } else {
    console.log('Already OK:', d);
  }
});

// Also check other non-client pages that may cause issues
const otherPages = [
  'src/app/admin/investor/page.tsx',
  'src/app/admin/wizard/page.tsx',
  'src/app/merchant/scanner/page.tsx',
];
otherPages.forEach(f => {
  if (fs.existsSync(f)) {
    const c = fs.readFileSync(f, 'utf8');
    if (!c.includes('use client')) {
      fs.writeFileSync(f, '"use client";\n' + c);
      console.log('Fixed:', f);
    } else {
      console.log('Already OK:', f);
    }
  }
});

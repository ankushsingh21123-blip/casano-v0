const fs = require('fs');
const files = [
  'src/components/ProductCard.tsx',
  'src/components/OldMobileHome.tsx',
  'src/components/Header.tsx',
  'src/components/CartPanel.tsx',
  'src/components/LoginModal.tsx',
  'src/app/product/[id]/page.tsx',
  'src/app/checkout/page.tsx',
  'src/app/account/orders/page.tsx',
  'src/app/account/layout.tsx',
  'src/app/account/addresses/page.tsx'
];
files.forEach(f => {
  const code = fs.readFileSync(f, 'utf8');
  if (!code.includes('use client')) console.log('MISSING in', f);
});
console.log('Done checking client blocks');

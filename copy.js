const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\HP\\Downloads\\antigravity-platform (1).jsx', 'utf8');
fs.writeFileSync('src\\app\\page.jsx', '"use client";\n' + content);
fs.unlinkSync('src\\app\\page.tsx');
console.log('Successfully replaced page.tsx with page.jsx');

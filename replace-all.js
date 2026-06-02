const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (/\.(jsx?|tsx?)$/.test(file)) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf-8');
  let changed = false;
  
  if (content.includes('&quot;')) {
    content = content.replace(/&quot;/g, '"');
    changed = true;
  }
  if (content.includes('&apos;')) {
    content = content.replace(/&apos;/g, "'");
    changed = true;
  }
  if (content.includes('&gt;')) {
    content = content.replace(/&gt;/g, ">");
    changed = true;
  }
  if (content.includes('&lt;')) {
    content = content.replace(/&lt;/g, "<");
    changed = true;
  }
  
  // also fix the JSX type error in architecture/page.jsx (it's jsx, not tsx)
  if (f.endsWith('architecture\\page.jsx') || f.endsWith('architecture/page.jsx')) {
    if (content.includes('(v: any)')) {
      content = content.replace(/\(v: any\)/g, '(v)');
      changed = true;
    }
    if (content.includes('(item: any)')) {
      content = content.replace(/\(item: any\)/g, '(item)');
      changed = true;
    }
    if (content.includes('(e: any)')) {
      content = content.replace(/\(e: any\)/g, '(e)');
      changed = true;
    }
  }

  // Same for page.jsx in root
  if (f.endsWith('src\\app\\page.jsx') || f.endsWith('src/app/page.jsx')) {
    // If there is any type syntax we remove it, though page.jsx only had &quot; in the logs.
  }

  if (changed) {
    fs.writeFileSync(f, content, 'utf-8');
    console.log('Fixed', f);
  }
});
console.log('Done replacement');

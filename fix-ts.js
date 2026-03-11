const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));

let fixed = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Fix implicit 'any' on map variables
    content = content.replace(/\((item|req|res|e|err|p|record)\) =>/g, "($1: any) =>");
    // Fix implicit 'any' on catch blocks which can't have an explicit annotation
    content = content.replace(/catch \((e|err)\) \{/g, 'catch ($1: any) {');
    // Fix implicit 'any' on parameters without parens
    content = content.replace(/\]\.map\((p|item|i|e) =>/g, "].map(($1: any) =>");
    content = content.replace(/ e =>/g, " (e: any) =>");
    content = content.replace(/ err =>/g, " (err: any) =>");

    // Fix unescaped entities
    content = content.replace(/ Don't /g, " Don&apos;t ");
    content = content.replace(/ don't /g, " don&apos;t ");
    content = content.replace(/ you're /g, " you&apos;re ");
    content = content.replace(/ I'm /g, " I&apos;m ");
    content = content.replace(/ It's /g, " It&apos;s ");
    content = content.replace(/ it's /g, " it&apos;s ");
    content = content.replace(/ You've /g, " You&apos;ve ");
    content = content.replace(/ we're /g, " we&apos;re ");
    content = content.replace(/ We're /g, " We&apos;re ");
    content = content.replace(/ they're /g, " they&apos;re ");
    content = content.replace(/ won't /g, " won&apos;t ");
    content = content.replace(/ can't /g, " can&apos;t ");


    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        fixed++;
        console.log("Fixed:", file);
    }
});

console.log(`Fixed ${fixed} files.`);

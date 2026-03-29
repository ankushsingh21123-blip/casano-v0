const { spawnSync } = require('child_process');
require('dotenv').config({ path: '.env.local' });

for (const [key, value] of Object.entries(process.env)) {
  if (key.startsWith('NEXT_PUBLIC_FIREBASE') || key.startsWith('FIREBASE_ADMIN')) {
    console.log(`Uploading ${key} to Vercel production edge...`);
    const result = spawnSync('npx.cmd', ['vercel', 'env', 'add', key, 'production'], {
      input: value,
      encoding: 'utf-8',
      shell: true
    });
    console.log(result.stdout || "Success!");
    if (result.stderr && !result.stderr.includes('already exists')) {
      console.error(result.stderr);
    }
  }
}
console.log("All environment variables uploaded successfully.");

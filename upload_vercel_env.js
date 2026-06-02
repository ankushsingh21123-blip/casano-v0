const { spawnSync } = require('child_process');
require('dotenv').config({ path: '.env.local' });

// Clean VERCEL_TOKEN if it contains version/userId prefixes (e.g. from IDE configuration)
if (process.env.VERCEL_TOKEN && process.env.VERCEL_TOKEN.includes(':')) {
  const parts = process.env.VERCEL_TOKEN.split(':');
  process.env.VERCEL_TOKEN = parts[parts.length - 1];
}

for (const [key, value] of Object.entries(process.env)) {
  if (key.startsWith('NEXT_PUBLIC_') || key.startsWith('FIREBASE_ADMIN')) {
    console.log(`Uploading ${key} to Vercel production edge...`);
    const result = spawnSync('npx.cmd', ['vercel', 'env', 'add', key, 'production'], {
      input: value.trim(), // Use trim() to avoid trailing newlines
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

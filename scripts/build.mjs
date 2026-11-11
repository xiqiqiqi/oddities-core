#!/usr/bin/env node
import path from 'node:path';

const configPath = process.env.SITE_CONFIG || process.argv[2];

if (!configPath) {
  console.error('Usage: SITE_CONFIG=../mysteries/site.config.ts node scripts/build.mjs');
  process.exit(1);
}

const resolved = path.resolve(process.cwd(), configPath);

console.log(`[build] site config: ${resolved}`);
console.log('[build] TODO M1:');
console.log('  1. load site.config.ts (channel, domain, accent, locales)');
console.log('  2. load entries from ../oddities-and-mysteries');
console.log('  3. filter by channel, render Astro pages');
console.log('  4. run Pagefind for channel sites');
console.log('  5. write dist/CNAME and sitemap/RSS');

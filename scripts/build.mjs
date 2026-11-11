#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const coreRoot = path.resolve(here, '..');

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === '--dev') {
      args.dev = true;
      continue;
    }

    if (token.startsWith('--')) {
      args[token.slice(2)] = argv[index + 1];
      index += 1;
    }
  }

  return args;
}

async function loadSiteConfig(file) {
  try {
    const module = await import(`${pathToFileURL(file).href}?t=${Date.now()}`);
    return module.default;
  } catch (error) {
    // 兼容未开启 TypeScript 类型剥离的 Node：site.config.ts 只用到 `as const`。
    const source = fs.readFileSync(file, 'utf8');
    const code = source
      .replace(/\bas\s+const\b/g, '')
      .replace(/export\s+default\s+/, 'module.exports = ');
    const module = { exports: {} };
    new Function('module', 'exports', code)(module, module.exports);
    return module.exports;
  }
}

function walkHtml(dir, files = []) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      walkHtml(full, files);
    } else if (item.name.endsWith('.html')) {
      files.push(full);
    }
  }

  return files;
}

function writeSitemap(outDir, siteUrl) {
  const pages = walkHtml(outDir)
    .map((file) => path.relative(outDir, file).split(path.sep).join('/'))
    .filter((relative) => relative !== '404.html')
    .map((relative) => '/' + relative.replace(/index\.html$/, ''))
    .sort();

  const today = new Date().toISOString().slice(0, 10);
  const body = pages
    .map((page) => `  <url><loc>${siteUrl}${page}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n');

  fs.writeFileSync(
    path.join(outDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
  );

  return pages.length;
}

function writeRobots(outDir, siteUrl) {
  fs.writeFileSync(
    path.join(outDir, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
  );
}

function writePwa(outDir, config) {
  const name = `${config.name} · ${config.tagline || '稀奇奇'}`;
  const manifest = {
    name,
    short_name: config.name,
    description: '收集全世界稀奇古怪的事件、故事、物品、遗迹与生物。',
    lang: 'zh-CN',
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#12100E',
    theme_color: '#12100E',
    icons: [
      { src: '/assets/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };

  fs.writeFileSync(
    path.join(outDir, 'manifest.webmanifest'),
    `${JSON.stringify(manifest, null, 2)}\n`
  );

  fs.writeFileSync(
    path.join(outDir, 'sw.js'),
    `const CACHE = 'xiqiqi-v1';

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  event.respondWith(
    fetch(request)
      .then(function (response) {
        if (response && response.status === 200 && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE).then(function (cache) {
            cache.put(request, copy);
          }).catch(function () {});
        }
        return response;
      })
      .catch(function () {
        return caches.match(request);
      })
  );
});
`
  );
}

const args = parseArgs(process.argv.slice(2));
const configPath = path.resolve(
  process.cwd(),
  args.config || process.env.SITE_CONFIG || 'site.config.ts'
);
const siteRoot = path.dirname(configPath);
const outDir = path.resolve(process.cwd(), args.out || path.join(siteRoot, 'dist'));
const contentRoot = path.resolve(
  args.content ||
    process.env.XIQIQI_CONTENT_ROOT ||
    path.join(coreRoot, '..', 'oddities-and-mysteries')
);

if (!fs.existsSync(configPath)) {
  console.error(`[build] site config not found: ${configPath}`);
  process.exit(1);
}

if (!fs.existsSync(path.join(contentRoot, 'entries'))) {
  console.error(`[build] content repo not found: ${contentRoot}`);
  process.exit(1);
}

const config = await loadSiteConfig(configPath);

if (!config || !config.channel || !config.domain) {
  console.error('[build] site config must define channel and domain');
  process.exit(1);
}

const mode = config.channel === 'portal' ? 'portal' : 'channel';
const siteUrl = `https://${config.domain}`;
const env = {
  ...process.env,
  XIQIQI_SITE_MODE: mode,
  XIQIQI_SITE_CHANNEL: String(config.channel),
  XIQIQI_SITE_NAME: String(config.name || ''),
  XIQIQI_SITE_TAGLINE: String(config.tagline || ''),
  XIQIQI_SITE_DOMAIN: String(config.domain),
  XIQIQI_SITE_ACCENT: String(config.accent || '#D99A2B'),
  XIQIQI_SITE_URL: siteUrl,
  XIQIQI_CONTENT_ROOT: contentRoot,
};

console.log(`[build] site      ${config.name} (${mode}, channel=${config.channel})`);
console.log(`[build] domain    ${siteUrl}`);
console.log(`[build] content   ${contentRoot}`);
console.log(`[build] output    ${outDir}`);

function run(command, commandArgs) {
  const result = spawnSync(command, commandArgs, { cwd: coreRoot, env, stdio: 'inherit' });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

run(process.execPath, [path.join(coreRoot, 'scripts', 'sync-assets.mjs')]);

const astroBin = path.join(coreRoot, 'node_modules', 'astro', 'astro.js');

if (!fs.existsSync(astroBin)) {
  console.error('[build] astro is not installed. Run npm install in oddities-core first.');
  process.exit(1);
}

if (args.dev) {
  run(process.execPath, [astroBin, 'dev']);
  process.exit(0);
}

run(process.execPath, [astroBin, 'build']);

const builtDir = path.join(coreRoot, 'dist');

if (!fs.existsSync(builtDir)) {
  console.error(`[build] build output missing: ${builtDir}`);
  process.exit(1);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
fs.cpSync(builtDir, outDir, { recursive: true });

const cnamePath = path.join(siteRoot, 'CNAME');

if (fs.existsSync(cnamePath)) {
  const cname = fs.readFileSync(cnamePath, 'utf8').trim();
  if (cname) fs.writeFileSync(path.join(outDir, 'CNAME'), `${cname}\n`);
}

fs.writeFileSync(path.join(outDir, '.nojekyll'), '');

const pageCount = writeSitemap(outDir, siteUrl);
writeRobots(outDir, siteUrl);
writePwa(outDir, config);

console.log(`[build] done      ${pageCount} pages -> ${outDir}`);

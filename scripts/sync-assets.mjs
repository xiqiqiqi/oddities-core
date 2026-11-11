#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const coreRoot = path.resolve(here, '..');
const contentRoot = process.env.XIQIQI_CONTENT_ROOT
  ? path.resolve(process.env.XIQIQI_CONTENT_ROOT)
  : path.resolve(coreRoot, '..', 'oddities-and-mysteries');

const source = path.join(contentRoot, 'assets');
const target = path.join(coreRoot, 'public', 'content');

if (!fs.existsSync(source)) {
  console.error(`[sync] content assets not found: ${source}`);
  process.exit(1);
}

fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(source, target, { recursive: true });

console.log(`[sync] ${source} -> ${target}`);

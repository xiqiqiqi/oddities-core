#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const source = path.resolve(process.cwd(), '..', 'oddities-and-mysteries', 'assets');
const target = path.resolve(process.cwd(), 'public', 'content');

if (!fs.existsSync(source)) {
  console.error(`[sync] content assets not found: ${source}`);
  process.exit(1);
}

fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(source, target, { recursive: true });

console.log(`[sync] ${source} -> ${target}`);

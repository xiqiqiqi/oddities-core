import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

export type Lang = 'zh' | 'en';

const i18nRoot = path.resolve(process.cwd(), 'src/i18n');
const cache = new Map<Lang, Record<string, any>>();

export function ui(lang: Lang): Record<string, any> {
  if (!cache.has(lang)) {
    const file = path.join(i18nRoot, `${lang}.yml`);
    cache.set(lang, (yaml.load(fs.readFileSync(file, 'utf8')) || {}) as Record<string, any>);
  }

  return cache.get(lang) as Record<string, any>;
}

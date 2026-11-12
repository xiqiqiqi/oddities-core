#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const here = path.dirname(fileURLToPath(import.meta.url));
const coreRoot = path.resolve(here, '..');
const contentRoot = path.resolve(
  process.env.CONTENT_DIR || path.join(coreRoot, '..', 'oddities-and-mysteries')
);
const entriesRoot = path.join(contentRoot, 'entries');

const channels = new Set(['mystery', 'tales', 'objects', 'places', 'creatures', 'hoaxes']);
const types = new Set(['event', 'phenomenon', 'object', 'place', 'person', 'creature', 'story']);
const credibilityLevels = new Set(['verified', 'disputed', 'folklore', 'hoax']);
const statuses = new Set(['draft', 'review', 'published']);
const translationStatuses = new Set(['zh_only', 'translated', 'reviewed']);
const requiredFields = [
  'channel',
  'type',
  'slug',
  'title_zh',
  'era',
  'region',
  'tags',
  'credibility',
  'sources',
  'cover',
  'status',
  'translation_status',
];

const errors = [];
const warnings = [];

function readYaml(file) {
  try {
    return yaml.load(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    errors.push(`${file}: YAML 解析失败：${error.message}`);
    return null;
  }
}

function readFrontmatter(file) {
  if (!fs.existsSync(file)) return null;
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    warnings.push(`${file}: 没有 frontmatter`);
    return {};
  }
  try {
    return yaml.load(match[1]) || {};
  } catch (error) {
    errors.push(`${file}: frontmatter 解析失败：${error.message}`);
    return {};
  }
}

function listEntries() {
  const result = [];
  if (!fs.existsSync(entriesRoot)) return result;

  for (const channel of fs.readdirSync(entriesRoot)) {
    const channelDir = path.join(entriesRoot, channel);
    if (!fs.statSync(channelDir).isDirectory()) continue;

    for (const slug of fs.readdirSync(channelDir)) {
      const entryDir = path.join(channelDir, slug);
      if (fs.statSync(entryDir).isDirectory()) {
        result.push({ channel, slug, dir: entryDir });
      }
    }
  }

  return result;
}

const entries = listEntries();
const slugSet = new Set(entries.map((entry) => entry.slug));

if (entries.length === 0) {
  errors.push(`${entriesRoot}: 没有找到条目`);
}

for (const entry of entries) {
  const entryPath = path.join(entry.dir, 'entry.yml');
  if (!fs.existsSync(entryPath)) {
    errors.push(`${entry.dir}: 缺少 entry.yml`);
    continue;
  }

  const data = readYaml(entryPath);
  if (!data) continue;

  const prefix = `${entry.channel}/${entry.slug}/entry.yml`;

  const rawYaml = fs.readFileSync(entryPath, 'utf8');
  for (const m of rawYaml.matchAll(/^\s+(?:publisher|title|usage|license|year):\s+([^"'\n][^\n]*)$/gm)) {
    if (/\s#/.test(m[1])) {
      warnings.push(`${prefix}: 值未加引号且含 " #"，YAML 会在此截断：${m[0].trim().slice(0, 70)}`);
    }
  }

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push(`${prefix}: 缺少 ${field}`);
    }
  }

  if (data.channel !== entry.channel) {
    errors.push(`${prefix}: channel=${data.channel} 与目录 ${entry.channel} 不一致`);
  }
  if (data.slug !== entry.slug) {
    errors.push(`${prefix}: slug=${data.slug} 与目录 ${entry.slug} 不一致`);
  }
  if (!channels.has(data.channel)) {
    errors.push(`${prefix}: channel 非法：${data.channel}`);
  }
  if (!types.has(data.type)) {
    errors.push(`${prefix}: type 非法：${data.type}`);
  }
  if (!credibilityLevels.has(data.credibility)) {
    errors.push(`${prefix}: credibility 非法：${data.credibility}`);
  }
  if (!statuses.has(data.status)) {
    errors.push(`${prefix}: status 非法：${data.status}`);
  }
  if (!translationStatuses.has(data.translation_status)) {
    errors.push(`${prefix}: translation_status 非法：${data.translation_status}`);
  }

  if (!Array.isArray(data.tags) || data.tags.length < 3 || data.tags.length > 8) {
    errors.push(`${prefix}: tags 需要 3–8 个`);
  }

  if (data.coords !== null && data.coords !== undefined) {
    if (
      !Array.isArray(data.coords) ||
      data.coords.length !== 2 ||
      data.coords.some((value) => typeof value !== 'number')
    ) {
      errors.push(`${prefix}: coords 需要 [纬度, 经度] 或 null`);
    }
  }

  if (!Array.isArray(data.sources) || data.sources.length < 2) {
    errors.push(`${prefix}: sources 至少 2 条`);
  } else {
    const ids = new Set();
    for (const source of data.sources) {
      for (const field of ['id', 'title', 'publisher', 'url', 'year', 'license', 'usage']) {
        if (!source[field]) {
          errors.push(`${prefix}: source ${source.id || '?'} 缺少 ${field}`);
        }
      }
      if (source.id && ids.has(source.id)) {
        errors.push(`${prefix}: source id 重复：${source.id}`);
      }
      if (source.id) ids.add(source.id);
      if (source.url && !/^https?:\/\//.test(source.url)) {
        errors.push(`${prefix}: source ${source.id} URL 不是 http(s)`);
      }
    }
  }

  if (data.cover) {
    const coverPath = path.resolve(entry.dir, data.cover);
    if (!fs.existsSync(coverPath)) {
      errors.push(`${prefix}: cover 文件不存在：${data.cover}`);
    }
  }

  const zhPath = path.join(entry.dir, 'zh.md');
  const enPath = path.join(entry.dir, 'en.md');

  if (!fs.existsSync(zhPath)) {
    errors.push(`${entry.dir}: 缺少 zh.md`);
  } else {
    const frontmatter = readFrontmatter(zhPath);
    if (frontmatter && (!frontmatter.title || !frontmatter.summary)) {
      errors.push(`${zhPath}: frontmatter 需要 title 和 summary`);
    }
  }

  if (data.translation_status !== 'zh_only' && !fs.existsSync(enPath)) {
    errors.push(`${entry.dir}: translation_status=${data.translation_status} 但缺少 en.md`);
  }

  if (fs.existsSync(enPath)) {
    const frontmatter = readFrontmatter(enPath);
    if (frontmatter && (!frontmatter.title || !frontmatter.summary)) {
      errors.push(`${enPath}: frontmatter 需要 title 和 summary`);
    }
  }

  for (const markdownPath of [zhPath, enPath]) {
    if (!fs.existsSync(markdownPath)) continue;
    const text = fs.readFileSync(markdownPath, 'utf8');
    const imagePattern = /!\[[^\]]*\]\(([^)]+)\)/g;
    let match;

    while ((match = imagePattern.exec(text))) {
      const target = match[1].split('#')[0].split('?')[0];
      if (/^(https?:)?\/\//.test(target)) continue;

      const resolved = path.resolve(path.dirname(markdownPath), target);
      if (!fs.existsSync(resolved)) {
        errors.push(`${markdownPath}: 图片不存在：${target}`);
      }
    }
  }

  if (Array.isArray(data.related)) {
    for (const slug of data.related) {
      if (!slugSet.has(slug)) {
        errors.push(`${prefix}: related 条目不存在：${slug}`);
      }
    }
  }
}

const summary = entries.reduce((acc, entry) => {
  acc[entry.channel] = (acc[entry.channel] || 0) + 1;
  return acc;
}, {});

console.log(`内容目录：${contentRoot}`);
console.log(`条目数：${entries.length}`, summary);

if (warnings.length > 0) {
  console.log(`\n警告 ${warnings.length} 条：`);
  for (const warning of warnings) console.log(`  - ${warning}`);
}

if (errors.length > 0) {
  console.log(`\n错误 ${errors.length} 条：`);
  for (const error of errors) console.log(`  ✗ ${error}`);
  process.exit(1);
}

console.log('\n✓ 全部条目通过校验');

#!/usr/bin/env node
/**
 * 稀奇奇质量仪表盘
 * 用法：node quality-audit.mjs [--json]
 * 退出码：0 = 全部门禁通过；1 = 有硬失败
 */
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
const reportDir = path.join(contentRoot, 'research');
const reportPath = path.join(reportDir, 'quality-audit.json');

const CHANNELS = new Set(['creatures', 'mystery', 'objects', 'places', 'tales']);
const HARD = {
  zhMin: 840,
  zhMax: 3000,
  enWordsMin: 560,
  enWordsMax: 2000,
  minSources: 2,
};

const failures = [];
const warnings = [];
const entries = [];

function cjkCount(text) {
  return (text.match(/[\u4e00-\u9fa5]/g) || []).length;
}
function stripFrontmatter(text) {
  return text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
}
function sectionCount(text) {
  return (text.match(/^##\s+/gm) || []).length;
}
function wordCount(text) {
  return (text.match(/\b[A-Za-z][A-Za-z'’-]*\b/g) || []).length;
}
function hasSourceTail(text) {
  return text.includes('**Sources and licenses**') || text.includes('**Sources and Licenses**');
}

for (const channel of [...CHANNELS]) {
  const channelDir = path.join(entriesRoot, channel);
  if (!fs.existsSync(channelDir)) continue;
  for (const slug of fs.readdirSync(channelDir)) {
    const dir = path.join(channelDir, slug);
    if (!fs.statSync(dir).isDirectory()) continue;
    const ymlPath = path.join(dir, 'entry.yml');
    const zhPath = path.join(dir, 'zh.md');
    const enPath = path.join(dir, 'en.md');
    const row = { channel, slug, ok: true, issues: [] };

    if (!fs.existsSync(ymlPath)) {
      failures.push(`${channel}/${slug}: 缺少 entry.yml`);
      continue;
    }
    let data;
    try {
      data = yaml.load(fs.readFileSync(ymlPath, 'utf8'));
    } catch (e) {
      failures.push(`${channel}/${slug}: entry.yml 解析失败 ${e.message}`);
      continue;
    }
    if (!fs.existsSync(zhPath) || !fs.existsSync(enPath)) {
      failures.push(`${channel}/${slug}: 缺少 zh.md 或 en.md`);
      continue;
    }
    const zh = fs.readFileSync(zhPath, 'utf8');
    const en = fs.readFileSync(enPath, 'utf8');
    const zhBody = stripFrontmatter(zh);
    const enBody = stripFrontmatter(en);

    row.zhChars = cjkCount(zhBody);
    row.zhSections = sectionCount(zhBody);
    row.enSections = sectionCount(enBody);
    row.enWords = wordCount(enBody);
    row.enCJK = cjkCount(enBody);
    row.sourceTail = hasSourceTail(enBody);
    row.status = data.status;
    row.translationStatus = data.translation_status;
    row.editorialStatus = data.editorial_status || null;
    row.sources = Array.isArray(data.sources) ? data.sources.length : 0;

    if (row.zhChars < HARD.zhMin || row.zhChars > HARD.zhMax) {
      row.issues.push(`中文字数 ${row.zhChars} 不在 ${HARD.zhMin}-${HARD.zhMax}`);
    }
    if (row.enSections !== row.zhSections) {
      row.issues.push(`英文节数 ${row.enSections} ≠ 中文 ${row.zhSections}`);
    }
    if (row.enCJK > 0) {
      row.issues.push(`英文含中文字符 ${row.enCJK}`);
    }
    if (!row.sourceTail) {
      row.issues.push('英文缺 Sources and licenses');
    }
    if (row.status !== 'published') {
      row.issues.push(`status=${row.status}`);
    }
    if (!['reviewed', 'native_reviewed'].includes(row.translationStatus)) {
      row.issues.push(`translation_status=${row.translationStatus}`);
    }
    if (row.sources < HARD.minSources) {
      row.issues.push(`sources=${row.sources}`);
    }
    if (!row.editorialStatus) {
      warnings.push(`${channel}/${slug}: 缺 editorial_status`);
    }
    if (row.enWords < HARD.enWordsMin || row.enWords > HARD.enWordsMax) {
      warnings.push(`${channel}/${slug}: 英文词数 ${row.enWords} 超出建议区间 ${HARD.enWordsMin}-${HARD.enWordsMax}`);
    }

    const imageRefs = [...enBody.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((m) => m[1]);
    row.images = imageRefs.length;
    for (const ref of imageRefs) {
      const target = ref.split('#')[0].split('?')[0];
      if (/^(https?:)?\/\//.test(target)) continue;
      const resolved = path.resolve(dir, target);
      if (!fs.existsSync(resolved)) row.issues.push(`英文图片不存在 ${target}`);
    }

    if (row.issues.length) {
      row.ok = false;
      for (const issue of row.issues) failures.push(`${channel}/${slug}: ${issue}`);
    }
    entries.push(row);
  }
}

const summary = {
  generatedAt: new Date().toISOString(),
  contentRoot,
  total: entries.length,
  channels: entries.reduce((acc, e) => {
    acc[e.channel] = (acc[e.channel] || 0) + 1;
    return acc;
  }, {}),
  zhChars: {
    min: Math.min(...entries.map((e) => e.zhChars)),
    max: Math.max(...entries.map((e) => e.zhChars)),
  },
  enWords: {
    min: Math.min(...entries.map((e) => e.enWords)),
    max: Math.max(...entries.map((e) => e.enWords)),
    avg: Math.round(entries.reduce((s, e) => s + e.enWords, 0) / entries.length),
  },
  failures,
  warnings,
  entries,
};

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2) + '\n', 'utf8');

console.log(`内容目录：${contentRoot}`);
console.log(`条目：${summary.total}`, summary.channels);
console.log(`中文：${summary.zhChars.min}-${summary.zhChars.max} 字`);
console.log(`英文：${summary.enWords.min}-${summary.enWords.max} 词，平均 ${summary.enWords.avg}`);
console.log(`硬失败：${failures.length}`);
for (const f of failures.slice(0, 30)) console.log(`  ✗ ${f}`);
if (failures.length > 30) console.log(`  … 另有 ${failures.length - 30} 条`);
console.log(`警告：${warnings.length}`);
for (const w of warnings.slice(0, 10)) console.log(`  ! ${w}`);
console.log(`报告：${reportPath}`);

if (failures.length) process.exit(1);
console.log('\n✓ 质量门禁全部通过');

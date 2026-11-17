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
const researchRoot = path.join(contentRoot, 'research');

const PUBLICATION_STATUSES = new Set(['reviewed', 'line_edited', 'native_reviewed']);
const errors = [];
const warnings = [];
const rows = [];

function listEntries() {
  const result = [];
  for (const channel of fs.readdirSync(entriesRoot)) {
    const channelDir = path.join(entriesRoot, channel);
    if (!fs.statSync(channelDir).isDirectory()) continue;
    for (const slug of fs.readdirSync(channelDir)) {
      const dir = path.join(channelDir, slug);
      if (fs.statSync(dir).isDirectory()) result.push({ channel, slug, dir });
    }
  }
  return result;
}

function sectionBodies(text) {
  const parts = text.split(/^## /m).slice(1);
  return parts.map((part) => {
    const lines = part.split('\n');
    const head = lines[0].trim();
    let body = lines.slice(1).join('\n').trim();
    body = body.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
    body = body.replace(/^\*.*\*$/gm, '');
    return { head, body };
  });
}

function stripFrontmatter(text) {
  return text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
}

function similarity(a, b) {
  const aa = a.replace(/\s+/g, '');
  const bb = b.replace(/\s+/g, '');
  if (!aa.length || !bb.length) return 0;
  const bigrams = new Map();
  for (let i = 0; i < aa.length - 1; i += 1) {
    const key = aa.slice(i, i + 2);
    bigrams.set(key, (bigrams.get(key) || 0) + 1);
  }
  let hit = 0;
  for (let i = 0; i < bb.length - 1; i += 1) {
    const key = bb.slice(i, i + 2);
    const count = bigrams.get(key) || 0;
    if (count > 0) {
      hit += 1;
      bigrams.set(key, count - 1);
    }
  }
  return (2 * hit) / Math.max(1, aa.length + bb.length - 2);
}

function duplicateSections(text) {
  const sections = sectionBodies(text);
  const hits = [];
  for (let i = 0; i < sections.length; i += 1) {
    for (let j = i + 2; j < sections.length; j += 1) {
      if (sections[i].body.length < 120 || sections[j].body.length < 120) continue;
      const score = similarity(sections[i].body, sections[j].body);
      if (score >= 0.72) hits.push({ a: i + 1, b: j + 1, score: Number(score.toFixed(2)) });
    }
  }
  return hits;
}

const imageAuditSummaryPath = path.join(researchRoot, 'image-audit-summary.json');
const imageAuditSummary = fs.existsSync(imageAuditSummaryPath)
  ? JSON.parse(fs.readFileSync(imageAuditSummaryPath, 'utf8'))
  : { total: 0, verified: 0 };
const imageAuditCsvPath = path.join(researchRoot, 'image-audit.csv');
const imageAuditRows = fs.existsSync(imageAuditCsvPath)
  ? fs.readFileSync(imageAuditCsvPath, 'utf8').trim().split(/\r?\n/).slice(1).filter(Boolean).length
  : 0;
const imageAuditVerified = imageAuditSummary.verified || 0;
const imageAuditTotal = imageAuditSummary.total || 0;
if (imageAuditRows === 0) {
  errors.push('图片审计 CSV 缺失或为空');
} else if (imageAuditVerified !== imageAuditRows || imageAuditTotal !== imageAuditRows) {
  errors.push(`图片审计未闭环：摘要 ${imageAuditVerified}/${imageAuditTotal}，CSV 实际 ${imageAuditRows} 行`);
}

for (const entry of listEntries()) {
  const ymlPath = path.join(entry.dir, 'entry.yml');
  if (!fs.existsSync(ymlPath)) {
    errors.push(`${entry.channel}/${entry.slug}: missing entry.yml`);
    continue;
  }
  const data = yaml.load(fs.readFileSync(ymlPath, 'utf8')) || {};
  const prefix = `${entry.channel}/${entry.slug}`;

  if (!PUBLICATION_STATUSES.has(data.translation_status)) {
    errors.push(`${prefix}: translation_status=${data.translation_status}，发布门禁要求 reviewed/line_edited/native_reviewed`);
  }
  if (!data.editorial_status) {
    errors.push(`${prefix}: 缺少 editorial_status`);
  }
  if (!data.fact_ledger || !fs.existsSync(path.join(contentRoot, data.fact_ledger))) {
    errors.push(`${prefix}: fact_ledger 不存在`);
  } else {
    const ledger = fs.readFileSync(path.join(contentRoot, data.fact_ledger), 'utf8');
    const mapped = (ledger.match(/^\| F\d{2} \|/gm) || []).length;
    if (mapped < 5) errors.push(`${prefix}: 硬事实映射 ${mapped} 条，少于 5`);
  }
  if (!data.image_license_audit || !fs.existsSync(path.join(contentRoot, data.image_license_audit))) {
    errors.push(`${prefix}: image_license_audit 不存在`);
  }

  const zh = fs.readFileSync(path.join(entry.dir, 'zh.md'), 'utf8');
  const en = fs.readFileSync(path.join(entry.dir, 'en.md'), 'utf8');
  const zhBody = stripFrontmatter(zh);
  const enBody = stripFrontmatter(en);
  const zhChars = (zhBody.match(/[\u4e00-\u9fa5]/g) || []).length;
  const enWords = enBody.split(/\s+/).filter(Boolean).length;
  const enCjk = (enBody.match(/[\u4e00-\u9fa5]/g) || []).length;

  if (zhChars < 840 || zhChars > 3000) errors.push(`${prefix}: 中文 ${zhChars} 字，要求 840–3000`);
  if (enWords < 560 || enWords > 1800) errors.push(`${prefix}: 英文 ${enWords} 词，要求 560–1800`);
  if (enCjk > 10) errors.push(`${prefix}: 英文正文含 ${enCjk} 个中文字符`);

  const zhSections = (zhBody.match(/^## /gm) || []).length;
  const enSections = (enBody.match(/^## /gm) || []).length;
  if (zhSections !== enSections) errors.push(`${prefix}: 中英小节数不一致 ${zhSections}/${enSections}`);

  const zhDup = duplicateSections(zhBody);
  const enDup = duplicateSections(enBody);
  if (zhDup.length) errors.push(`${prefix}: 中文重复小节 ${JSON.stringify(zhDup.slice(0, 3))}`);
  if (enDup.length) errors.push(`${prefix}: 英文重复小节 ${JSON.stringify(enDup.slice(0, 3))}`);

  rows.push({ channel: entry.channel, slug: entry.slug, zhChars, enWords, zhSections, enSections });
}

const summary = rows.reduce((acc, row) => {
  acc[row.channel] = (acc[row.channel] || 0) + 1;
  return acc;
}, {});

const report = {
  generatedAt: new Date().toISOString(),
  entries: rows.length,
  channels: summary,
  imageAuditRows: imageAuditTotal,
  imageAuditVerified,
  errors,
  warnings,
};
fs.writeFileSync(path.join(researchRoot, 'quality-gate.json'), JSON.stringify(report, null, 2));

console.log(`条目 ${rows.length}`, summary);
console.log(`图片审计 ${imageAuditVerified}/${imageAuditTotal} verified`);
if (warnings.length) {
  console.log(`警告 ${warnings.length}`);
  warnings.slice(0, 10).forEach((w) => console.log(`  - ${w}`));
}
if (errors.length) {
  console.log(`错误 ${errors.length}`);
  errors.slice(0, 30).forEach((e) => console.log(`  ✗ ${e}`));
  process.exit(1);
}
console.log('✓ 出版级硬门禁通过');

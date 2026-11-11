import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { marked } from 'marked';

export type Lang = 'zh' | 'en';

export interface SourceItem {
  id: string;
  title: string;
  publisher: string;
  url: string;
  year: string;
  license: string;
  usage: string;
}

export interface ChannelMeta {
  id: string;
  route: string;
  zh: string;
  en: string;
  annotationZh: string;
  annotationEn: string;
  descriptionZh: string;
  descriptionEn: string;
}

export interface Entry {
  channel: string;
  channelRoute: string;
  channelZh: string;
  channelEn: string;
  annotationZh: string;
  annotationEn: string;
  type: string;
  slug: string;
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  summaryEn: string;
  era: string;
  eraEn: string;
  region: string;
  regionEn: string;
  coords: [number, number] | null;
  tags: string[];
  collections: string[];
  credibility: string;
  sources: SourceItem[];
  sourceCount: number;
  cover: string;
  related: string[];
  status: string;
  featured: boolean;
  translationStatus: string;
  bodyHtmlZh: string;
  bodyHtmlEn: string;
  readingMinutesZh: number;
  readingMinutesEn: number;
  hrefZh: string;
  hrefEn: string;
}

const coreRoot = process.cwd();
const contentRoot = path.resolve(coreRoot, '..', 'oddities-and-mysteries');
const entriesRoot = path.join(contentRoot, 'entries');
const taxonomyRoot = path.join(contentRoot, 'taxonomy');

function readYaml(file: string): Record<string, any> {
  return (yaml.load(fs.readFileSync(file, 'utf8')) || {}) as Record<string, any>;
}

function splitFrontmatter(raw: string): { data: Record<string, any>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };

  return {
    data: (yaml.load(match[1]) || {}) as Record<string, any>,
    body: match[2] || '',
  };
}

function rewriteAssets(markdown: string): string {
  return markdown.replace(/!\[([^\]]*)\]\(\.\.\/\.\.\/\.\.\/assets\//g, '![$1](/content/');
}

function toHtml(markdown: string): string {
  return String(marked.parse(rewriteAssets(markdown)));
}

function readingMinutes(text: string): number {
  const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const words = (text.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[A-Za-z0-9']+/g) || []).length;
  return Math.max(1, Math.ceil(chinese / 400 + words / 200));
}

function loadChannels(): ChannelMeta[] {
  const raw = readYaml(path.join(taxonomyRoot, 'channels.yml')) as unknown as any[];

  return raw
    .filter((channel) => channel.status === 'launch')
    .map((channel) => ({
      id: channel.id,
      route: channel.repo,
      zh: channel.zh,
      en: channel.en,
      annotationZh: channel.annotation_zh,
      annotationEn: channel.annotation_en,
      descriptionZh: channel.description_zh,
      descriptionEn: channel.description_en,
    }));
}

const channels = loadChannels();
const channelMap = new Map(channels.map((channel) => [channel.id, channel]));

export function getChannels(): ChannelMeta[] {
  return channels;
}

export function getChannelByRoute(route: string): ChannelMeta | undefined {
  return channels.find((channel) => channel.route === route);
}

export function getEntries(): Entry[] {
  const entries: Entry[] = [];

  if (!fs.existsSync(entriesRoot)) return entries;

  for (const channelId of fs.readdirSync(entriesRoot)) {
    const channel = channelMap.get(channelId);
    if (!channel) continue;

    const channelDir = path.join(entriesRoot, channelId);
    if (!fs.statSync(channelDir).isDirectory()) continue;

    for (const slug of fs.readdirSync(channelDir)) {
      const entryDir = path.join(channelDir, slug);
      if (!fs.statSync(entryDir).isDirectory()) continue;

      const metaPath = path.join(entryDir, 'entry.yml');
      if (!fs.existsSync(metaPath)) continue;

      const meta = readYaml(metaPath);
      const zhPath = path.join(entryDir, 'zh.md');
      const enPath = path.join(entryDir, 'en.md');
      const zhRaw = fs.existsSync(zhPath) ? fs.readFileSync(zhPath, 'utf8') : '';
      const enRaw = fs.existsSync(enPath) ? fs.readFileSync(enPath, 'utf8') : '';
      const zh = splitFrontmatter(zhRaw);
      const en = splitFrontmatter(enRaw);

      const titleZh = String(zh.data.title || meta.title_zh || slug);
      const titleEn = String(en.data.title || meta.title_en || titleZh);
      const summaryZh = String(zh.data.summary || '');
      const summaryEn = String(en.data.summary || summaryZh);
      const bodyHtmlZh = toHtml(zh.body);
      const bodyHtmlEn = enRaw ? toHtml(en.body) : bodyHtmlZh;

      entries.push({
        channel: channel.id,
        channelRoute: channel.route,
        channelZh: channel.zh,
        channelEn: channel.en,
        annotationZh: channel.annotationZh,
        annotationEn: channel.annotationEn,
        type: String(meta.type || ''),
        slug,
        titleZh,
        titleEn,
        summaryZh,
        summaryEn,
        era: String(meta.era || ''),
        eraEn: String(meta.era_en || meta.era || ''),
        region: String(meta.region || ''),
        regionEn: String(meta.region_en || meta.region || ''),
        coords: (meta.coords as [number, number] | null) ?? null,
        tags: (meta.tags as string[]) || [],
        collections: (meta.collections as string[]) || [],
        credibility: String(meta.credibility || ''),
        sources: (meta.sources as SourceItem[]) || [],
        sourceCount: Array.isArray(meta.sources) ? meta.sources.length : 0,
        cover: String(meta.cover || '').replace('../../../assets/', '/content/'),
        related: (meta.related as string[]) || [],
        status: String(meta.status || ''),
        featured: Boolean(meta.featured),
        translationStatus: String(meta.translation_status || 'zh_only'),
        bodyHtmlZh,
        bodyHtmlEn,
        readingMinutesZh: readingMinutes(zh.body),
        readingMinutesEn: readingMinutes(en.body),
        hrefZh: `/${channel.route}/${slug}/`,
        hrefEn: `/en/${channel.route}/${slug}/`,
      });
    }
  }

  return entries.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.slug.localeCompare(b.slug);
  });
}

export function getEntriesByChannel(channelId: string): Entry[] {
  return getEntries().filter((entry) => entry.channel === channelId);
}

export function getEntry(slug: string): Entry | undefined {
  return getEntries().find((entry) => entry.slug === slug);
}

export function getRelatedEntries(entry: Entry): Entry[] {
  const all = getEntries();
  return entry.related
    .map((slug) => all.find((item) => item.slug === slug))
    .filter((item): item is Entry => Boolean(item));
}

export function entryWallMeta(entry: Entry, lang: Lang): string {
  const channel = lang === 'zh'
    ? `${entry.channelZh} · ${entry.annotationZh}`
    : `${entry.channelEn} · ${entry.annotationEn}`;
  const era = lang === 'zh' ? entry.era : entry.eraEn;
  return `${channel} · ${era}`;
}

export function entryHeroMeta(entry: Entry, lang: Lang): string {
  const reading = lang === 'zh'
    ? `阅读 ${entry.readingMinutesZh} 分钟`
    : `${entry.readingMinutesEn} min read`;
  const era = lang === 'zh' ? entry.era : entry.eraEn;
  const region = lang === 'zh' ? entry.region : entry.regionEn;
  return `${era} · ${region} · ${reading}`;
}

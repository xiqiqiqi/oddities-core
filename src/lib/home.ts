import {
  entryHeroMeta,
  entryWallMeta,
  getEntries,
  getSiteInfo,
  type Entry,
  type Lang,
} from './content';

interface WallItem {
  href: string;
  image: string;
  alt: string;
  meta: string;
  title: string;
  ratio: 'wide' | 'tall' | 'portrait' | 'square';
}

export interface HomepageData {
  entries: Entry[];
  featured: Entry;
  heroKicker: string;
  heroMeta: string;
  heroTitle: string;
  heroSummary: string;
  heroImage: string;
  heroHref: string | null;
  ctaLabel: string;
  stats: Array<{ label: string; value: string }>;
  wallItems: WallItem[];
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  channelMode: boolean;
  randomChannel?: string;
}

export function getHomepageData(lang: Lang): HomepageData | null {
  const entries = getEntries();
  const featured = entries.find((entry) => entry.featured) || entries[0];

  if (!featured) return null;

  const site = getSiteInfo(lang);
  const channelMode = site.mode === 'channel';
  const totalSources = entries.reduce((sum, entry) => sum + entry.sourceCount, 0);
  const regions = new Set(
    entries.map((entry) => (lang === 'zh' ? entry.region : entry.regionEn)).filter(Boolean)
  );

  const ratios: WallItem['ratio'][] = ['wide', 'tall', 'square', 'portrait', 'wide'];
  const wallItems: WallItem[] = entries.map((entry, index) => ({
    href: lang === 'zh' ? entry.hrefZh : entry.hrefEn,
    image: entry.cover,
    alt: lang === 'zh' ? entry.titleZh : entry.titleEn,
    meta: entryWallMeta(entry, lang),
    title: lang === 'zh' ? entry.titleZh : entry.titleEn,
    ratio: ratios[index % ratios.length],
  }));

  return {
    entries,
    featured,
    heroKicker: channelMode
      ? `${site.name} · ${site.tagline}`
      : `${lang === 'zh' ? featured.channelZh : featured.channelEn} · ${
          lang === 'zh' ? featured.annotationZh : featured.annotationEn
        }`,
    heroMeta: channelMode
      ? lang === 'zh'
        ? `${entries.length} 条已入库`
        : `${entries.length} entries`
      : entryHeroMeta(featured, lang),
    heroTitle: channelMode
      ? site.name
      : lang === 'zh'
        ? featured.titleZh
        : featured.titleEn,
    heroSummary: channelMode
      ? site.description
      : lang === 'zh'
        ? featured.summaryZh
        : featured.summaryEn,
    heroImage: featured.cover,
    heroHref: channelMode ? null : lang === 'zh' ? featured.hrefZh : featured.hrefEn,
    ctaLabel: lang === 'zh' ? '读这个故事' : 'Read the story',
    stats: lang === 'zh'
      ? [
          { label: '收录条目', value: String(entries.length) },
          { label: '引用来源', value: String(totalSources) },
          { label: '覆盖地区', value: String(regions.size) },
        ]
      : [
          { label: 'Entries', value: String(entries.length) },
          { label: 'Sources', value: String(totalSources) },
          { label: 'Regions', value: String(regions.size) },
        ],
    wallItems,
    siteName: site.name,
    siteTagline: site.tagline,
    siteDescription: site.description,
    channelMode,
    randomChannel: site.channel || undefined,
  };
}

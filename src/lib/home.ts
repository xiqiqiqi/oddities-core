import { entryHeroMeta, entryWallMeta, getEntries, type Entry, type Lang } from './content';

interface WallItem {
  href: string;
  image: string;
  alt: string;
  meta: string;
  title: string;
  ratio: 'wide' | 'tall' | 'portrait' | 'square';
}

const extraTunguska: Record<Lang, Omit<WallItem, 'href'>[]> = {
  zh: [
    {
      image: '/content/inline/tunguska-aerial.jpg',
      alt: '通古斯倒伏森林航拍场景复原',
      meta: '未解之谜 · 匪夷所思 · 1908',
      title: '蝴蝶形的森林',
      ratio: 'tall',
    },
    {
      image: '/content/inline/tunguska-kulik.jpg',
      alt: '库利克考察队场景复原',
      meta: '未解之谜 · 匪夷所思 · 1927',
      title: '十九年后，走进现场',
      ratio: 'portrait',
    },
    {
      image: '/content/inline/tunguska-evenki.jpg',
      alt: '鄂温克营地与火球场景复原',
      meta: '未解之谜 · 匪夷所思 · 1908',
      title: '火球掠过营地',
      ratio: 'wide',
    },
    {
      image: '/content/inline/tunguska-felled-trees.jpg',
      alt: '倒伏森林历史照片',
      meta: '历史照片 · 1920s',
      title: '倒下的森林',
      ratio: 'square',
    },
    {
      image: '/content/inline/tunguska-telegraph-poles.jpg',
      alt: '电线杆树历史照片',
      meta: '历史照片 · 1929',
      title: '电线杆树',
      ratio: 'tall',
    },
    {
      image: '/content/inline/tunguska-map.svg',
      alt: '通古斯爆炸范围地图',
      meta: '地图 · 1908',
      title: '爆炸范围',
      ratio: 'wide',
    },
    {
      image: '/content/inline/tunguska-airburst.svg',
      alt: '通古斯空爆示意图',
      meta: '图解 · 1908',
      title: '天空中的爆炸',
      ratio: 'square',
    },
  ],
  en: [
    {
      image: '/content/inline/tunguska-aerial.jpg',
      alt: 'Reconstruction of the Tunguska blast zone from the air',
      meta: 'Mysteries · Beyond Belief · 1908',
      title: 'The Butterfly Forest',
      ratio: 'tall',
    },
    {
      image: '/content/inline/tunguska-kulik.jpg',
      alt: 'Reconstruction of Kulik’s expedition',
      meta: 'Mysteries · Beyond Belief · 1927',
      title: 'Nineteen Years Later',
      ratio: 'portrait',
    },
    {
      image: '/content/inline/tunguska-evenki.jpg',
      alt: 'Reconstruction of an Evenki camp and the fireball',
      meta: 'Mysteries · Beyond Belief · 1908',
      title: 'The Fireball Over the Camp',
      ratio: 'wide',
    },
    {
      image: '/content/inline/tunguska-felled-trees.jpg',
      alt: 'Historical photograph of the fallen forest',
      meta: 'Historical photo · 1920s',
      title: 'The Fallen Forest',
      ratio: 'square',
    },
    {
      image: '/content/inline/tunguska-telegraph-poles.jpg',
      alt: 'Historical photograph of the telegraph pole trees',
      meta: 'Historical photo · 1929',
      title: 'Telegraph Pole Trees',
      ratio: 'tall',
    },
    {
      image: '/content/inline/tunguska-map.svg',
      alt: 'Map of the Tunguska blast zone',
      meta: 'Map · 1908',
      title: 'The Blast Zone',
      ratio: 'wide',
    },
    {
      image: '/content/inline/tunguska-airburst.svg',
      alt: 'Diagram of an airburst',
      meta: 'Diagram · 1908',
      title: 'An Airburst',
      ratio: 'square',
    },
  ],
};

export interface HomepageData {
  entries: Entry[];
  featured: Entry;
  heroKicker: string;
  heroMeta: string;
  heroTitle: string;
  heroSummary: string;
  heroImage: string;
  heroHref: string;
  ctaLabel: string;
  stats: Array<{ label: string; value: string }>;
  wallItems: WallItem[];
}

export function getHomepageData(lang: Lang): HomepageData | null {
  const entries = getEntries();
  const featured =
    entries.find((entry) => entry.slug === 'tunguska-1908') ||
    entries.find((entry) => entry.featured) ||
    entries[0];

  if (!featured) return null;

  const ratios: WallItem['ratio'][] = ['wide', 'tall', 'square', 'portrait', 'wide'];
  const entryCards: WallItem[] = entries.map((entry, index) => ({
    href: lang === 'zh' ? entry.hrefZh : entry.hrefEn,
    image: entry.cover,
    alt: lang === 'zh' ? entry.titleZh : entry.titleEn,
    meta: entryWallMeta(entry, lang),
    title: lang === 'zh' ? entry.titleZh : entry.titleEn,
    ratio: ratios[index % ratios.length],
  }));

  const extras = extraTunguska[lang].map((item) => ({
    ...item,
    href: lang === 'zh' ? featured.hrefZh : featured.hrefEn,
  }));

  return {
    entries,
    featured,
    heroKicker: lang === 'zh'
      ? `${featured.channelZh} · ${featured.annotationZh}`
      : `${featured.channelEn} · ${featured.annotationEn}`,
    heroMeta: entryHeroMeta(featured, lang),
    heroTitle: lang === 'zh' ? featured.titleZh : featured.titleEn,
    heroSummary: lang === 'zh' ? featured.summaryZh : featured.summaryEn,
    heroImage: featured.cover,
    heroHref: lang === 'zh' ? featured.hrefZh : featured.hrefEn,
    ctaLabel: lang === 'zh' ? '读这个故事' : 'Read the story',
    stats: lang === 'zh'
      ? [
          { label: '爆炸当量', value: '10–15 Mt' },
          { label: '倒伏森林', value: '2,000 km²' },
          { label: '陨石坑', value: '0' },
        ]
      : [
          { label: 'Yield', value: '10–15 Mt' },
          { label: 'Forest flattened', value: '2,000 km²' },
          { label: 'Crater', value: '0' },
        ],
    wallItems: [...entryCards, ...extras],
  };
}

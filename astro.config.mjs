import { defineConfig } from 'astro/config';

// 这是核心仓的默认配置。实际站点构建时会根据 site.config.ts
// 注入站点域名、频道、强调色和输出目录。
// sitemap 在 M1 接入真实路由后再加，避免空站点构建报错。
export default defineConfig({
  site: 'https://xiqiqi.com',
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});

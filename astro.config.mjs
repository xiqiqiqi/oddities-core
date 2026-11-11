import { defineConfig } from 'astro/config';

// 核心仓默认配置。站点构建时由 scripts/build.mjs 注入：
// XIQIQI_SITE_URL（域名）、XIQIQI_SITE_MODE / XIQIQI_SITE_CHANNEL（门户或频道站）。
export default defineConfig({
  site: process.env.XIQIQI_SITE_URL || 'https://xiqiqi.com',
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});

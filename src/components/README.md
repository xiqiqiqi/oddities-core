# 组件清单

| 组件 | 对应原型 | 职责 |
|---|---|---|
| `Masthead.astro` | 页头 | 品牌、频道导航、netcn 导航入口、明暗/语言切换、搜索入口 |
| `MobileTabBar.astro` | 移动底栏 | 主站、五个频道、netcn 导航，固定在移动端底部 |
| `Hero.astro` | 全屏头图 | 背景图、频道注释、日期地点、标题、简介、CTA |
| `ImageWall.astro` | 首页瀑布流 | 3/2/1 列瀑布流，不同比例卡片，标题叠加 |
| `EntryBody.astro` | 条目正文 | 标题、摘要、正文排版、全出血图片 |
| `SourceLedger.astro` | 来源台账 | S1–Sn 表格，链接、机构、年份、用途、许可 |
| `RelatedEntries.astro` | 相关条目 | 同频道相关档案卡片 |
| `SearchOverlay.astro` | 搜索层 | 客户端标题、摘要、标签检索 |
| `ThemeToggle.astro` | 明暗切换 | 默认暗色，切换亮色，记住选择 |
| `LangToggle.astro` | 中英切换 | EN / 中，记住选择 |
| `Rhino.astro` | 犀牛图标 | 页头、空状态、随机入口 |
| `Footer.astro` | 页脚 | 单行：站名与 xiqiqi.com、报告问题、法律与隐私、netcn 导航 |
| `InfoPage.astro` | 关于 / 法律页 | 标题区、粘性目录、分节正文 |

## 组件约定

- 所有站点共用 `oddities-core` 的同一套组件，站点仓不复制页面代码。
- 每个组件只依赖 `tokens.css` 的变量，不写死颜色。
- 中英文文案必须由 `lang` 或 `src/i18n/*.yml` 驱动，不在英文页面留下中文按钮、标签或无障碍文案。
- 页脚保持单行，只保留站名与 xiqiqi.com、报告问题、法律与隐私和 netcn 导航；频道入口由页头和移动底栏承担。
- 法律与隐私文案集中在 `src/lib/info.ts`，页面只负责路由与语言。

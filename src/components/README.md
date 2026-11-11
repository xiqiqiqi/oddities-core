# 组件清单

| 组件 | 对应原型 | 职责 |
|---|---|---|
| `Masthead.astro` | 页头 | 品牌、频道导航、明暗/语言切换、搜索入口 |
| `Hero.astro` | 全屏头图 | 背景图、频道注释、日期地点、标题、简介、CTA |
| `ImageWall.astro` | 首页瀑布流 | 3/2/1 列瀑布流，不同比例卡片，标题叠加 |
| `EntryBody.astro` | 条目正文 | 标题、摘要、正文排版、全出血图片 |
| `SourceLedger.astro` | 来源台账 | S1–Sn 表格，链接、机构、年份、用途、许可 |
| `ThemeToggle.astro` | 明暗切换 | 默认暗色，切换亮色，记住选择 |
| `LangToggle.astro` | 中英切换 | EN / 中，记住选择 |
| `Rhino.astro` | 犀牛图标 | 页头、空状态、随机入口 |
| `Footer.astro` | 页脚 | 品牌、频道注释、关于、开源许可 |

## M0 状态

- 组件是可渲染的骨架，不是最终视觉。
- M1 会把 `design/homepage/index.html`、`story-tunguska.html`、`styles.css` 的完整实现迁移进来。
- 每个组件只依赖 `tokens.css` 的变量，不写死颜色。
- 新增组件前先看原型里是否已经有对应区块，避免重复造。

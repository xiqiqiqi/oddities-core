# oddities-core

**稀奇奇 / XIQIQI** 的统一站点引擎。

所有频道站和门户共用这一份 UI、组件、i18n 和内容加载逻辑。站点仓只放 `site.config.ts` 和 `CNAME`，页面代码不复制。

## 当前状态

- Astro 5 静态站点，中文在根路径，英文在 `/en/`。
- 已接入内容仓 `oddities-and-mysteries` 的 151 个条目，构建 314 页。
- 首页瀑布流、频道页、条目页、相关条目、来源台账、明暗切换、中英切换均已可用。
- 内容校验脚本与图片同步脚本已可运行。

目前 `oddities-core` 构建的是一个包含全部频道的统一站点。按 `site.config.ts` 拆分单频道站的 `core build --config` 命令尚未实现，6 个站点仓仍是脚手架。

## 结构

```text
src/
  components/    # 页头、头图、瀑布流、条目正文、来源台账、页脚、犀牛
  layouts/       # BaseLayout、SiteLayout
  i18n/          # zh.yml / en.yml
  styles/        # tokens.css、base.css
  pages/         # 首页、频道页、条目页、英文路由
scripts/
  sync-assets.mjs        # 把内容仓图片同步到 public/content
  validate-content.mjs   # 校验内容仓
```

## 命令

```bash
npm install
npm run dev
npm run validate
npm run build
npm run preview
```

`npm run dev` 和 `npm run build` 会先执行 `sync-assets.mjs`。

## 构建链路

```text
content 变更
  → sync-assets.mjs
  → validate-content.mjs
  → astro build
  → dist/
```

单频道站的构建链路仍在实现中：

```text
site.config.ts
  → core build --config
  → 只包含该频道的 dist/
  → GitHub Pages
```

## 许可

代码 MIT。内容 CC BY-SA 4.0，见 `oddities-and-mysteries`。

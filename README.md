# oddities-core

**稀奇奇 / XIQIQI** 的统一站点引擎。

门户 `xiqiqi.com` 和五个频道站共用这一份 UI、组件、i18n 和内容加载逻辑。站点仓只放 `site.config.ts`、`CNAME` 和部署流水线，页面代码不复制。

## 当前状态

- Astro 静态站点，中文在根路径，英文在 `/en/`。
- 一个核心构建六种站点：门户显示全部频道，频道站只显示本频道。
- 门户条目卡片直接链接到对应频道站的 canonical 全文页，不复制正文。
- 频道站条目路径：`/<slug>/`、`/en/<slug>/`；门户只有 `/` 和 `/en/`。
- 首页瀑布流、条目页、相关条目、来源台账、明暗切换、中英切换均可运行。
- 构建时自动生成 `CNAME`、`sitemap.xml`、`robots.txt`、`.nojekyll`。

## 结构

```text
src/
  components/    # 页头、头图、瀑布流、条目正文、来源台账、页脚、犀牛
  layouts/       # BaseLayout、SiteLayout
  i18n/          # zh.yml / en.yml
  styles/        # tokens.css、base.css
  pages/         # 首页、条目页（频道站）、英文路由、404
  lib/           # content.ts、site.ts、home.ts
scripts/
  build.mjs              # 读取 site.config.ts 并构建单个站点
  sync-assets.mjs        # 把内容仓图片同步到 public/content
  validate-content.mjs   # 校验内容仓
```

## 命令

```bash
npm install
npm run dev            # 预览全站（门户模式）
npm run validate
npm run build          # 构建全站到 dist/
```

构建指定站点（推荐在站点仓内执行）：

```bash
node ../oddities-core/scripts/build.mjs --config site.config.ts --out dist
```

也可直接传内容仓与输出目录：

```bash
node scripts/build.mjs \
  --config ../mysteries/site.config.ts \
  --content ../oddities-and-mysteries \
  --out ../mysteries/dist
```

### 构建时注入的环境变量

| 变量 | 说明 |
|---|---|
| `XIQIQI_SITE_MODE` | `portal` 或 `channel` |
| `XIQIQI_SITE_CHANNEL` | 频道 id，如 `mystery` |
| `XIQIQI_SITE_DOMAIN` | 自定义域名 |
| `XIQIQI_SITE_URL` | `https://` + 域名 |
| `XIQIQI_SITE_ACCENT` | 频道强调色 |
| `XIQIQI_CONTENT_ROOT` | 内容仓绝对路径 |

## 构建链路

```text
site.config.ts
  → build.mjs 注入站点环境变量
  → sync-assets.mjs
  → astro build（频道过滤 + 站点路由）
  → dist/ + CNAME + sitemap.xml + robots.txt
  → GitHub Pages
```

每个站点仓的 `.github/workflows/deploy.yml` 会检出本仓与内容仓，再调用 `scripts/build.mjs` 部署。

## 许可

代码 MIT。内容 CC BY-SA 4.0，见 `oddities-and-mysteries`。

# personal website

Breeze 的个人主页。纯静态，零依赖、零构建：三个文件 + 一个图标，推上去就是成品。

```
index.html      页面结构与全部文案
styles.css      设计变量、布局、动效
script.js       canvas 风场、滚动显现、导航高亮
assets/         图标等静态资源
```

## 本地预览

直接双击 `index.html` 就能看。想要更接近线上环境（相对路径、缓存行为一致），用任意静态服务器：

```bash
python -m http.server 8080
# 然后打开 http://localhost:8080
```

改了文件刷新即可，不需要安装任何东西。

## 改内容

文案全在 `index.html` 里，按注释顺序从上往下就是页面顺序。常改的几处：

| 位置 | 内容 |
| --- | --- |
| `<title>` / `meta description` | 浏览器标签与搜索结果里显示的标题、简介 |
| `.hero__title` | 首页大标题 |
| `.hero__lede` | 一句话自我介绍 |
| `.hero__facts` | 三格事实：在做什么、常用技术、托管在哪 |
| `.work__row` | 项目列表，一行一个，复制整块 `<li>` 即可加项目 |
| `.about` | 关于段落 |
| `.stack li` | 技术清单 |
| `.contact__mail` | 邮箱（同时改两处 `mailto:`） |

**要改的占位值**：邮箱 `2507821335@qq.com`、GitHub 用户名 `CoolBreezeBlowsGently`、项目描述里的细节。三处都在 `index.html`，搜关键词就能定位。

配色和字号全部在 `styles.css` 顶部的 `:root` 里，改一处全站生效：

```css
--petrol: #052b2c;   /* 深色底 */
--mint:   #e6f2ec;   /* 深底上的浅色文字 */
--accent: #ff5a1f;   /* 唯一的强调色 */
--ground: #f1f3f1;   /* 浅色页面底色 */
```

## 部署（Cloudflare Pages）

仓库推上去之后，在 Cloudflare 后台连一次即可，之后每次 `git push` 自动部署：

1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 选择本仓库，分支 `main`
3. 构建配置（纯静态，全部留空）：
   - Framework preset: **None**
   - Build command: **留空**
   - Build output directory: **`/`**
4. **Save and Deploy**，几十秒后拿到 `*.pages.dev` 域名

自定义域名可在 Pages 项目的 **Custom domains** 里加，Cloudflare 会自动签发证书。

## 约定

- 不引入框架、不引入构建步骤、不引外部字体。加依赖前先问一句值不值。
- 动效只服务于「风」这一个意象，并且尊重 `prefers-reduced-motion`。
- 语义标签、键盘可访问、对比度：改样式时别弄丢。

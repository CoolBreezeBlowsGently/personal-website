# personal website

Breeze 的个人主页与笔记。纯静态，零依赖、零构建：手写 HTML / CSS / JS，推上去就是成品。

```
index.html               首页：风场 masthead + 文章列表 + 侧栏
archive.html             归档：按年份列出全部文章
tags.html                标签：分类与标签索引
about.html               关于
posts/                   文章，一篇一个 HTML
404.html                 找不到页面
feed.xml                 RSS（手写，2 条 item 就够）
styles.css               设计变量、布局、动效
script.js                canvas 风场 + 年份
assets/                  图标等静态资源
```

## 本地预览

直接双击 `index.html` 就能看。想要更接近线上环境（相对路径、缓存行为一致），用任意静态服务器：

```bash
python -m http.server 8080
# 然后打开 http://localhost:8080
```

改了文件刷新即可，不需要安装任何东西。

## 发一篇新文章

四步，都在编辑器里完成，没有构建：

1. 复制 `posts/why-handwritten.html` 为新文件，改 `<title>`、`meta description`、`.prose__meta`（分类 / 日期 / 阅读时长）、`<h1>`、`.prose__lede` 和正文。
2. 在 `index.html` 的 `<ol class="posts">` 里加一个 `<li class="post">`（复制上面那条改文案与链接）。
3. 在 `archive.html` 的 `<ol class="archive__list">` 里加一行，改年份分组和计数。
4. 在 `tags.html` 对应分类 / 标签下加一行，并在 `feed.xml` 加一条 `<item>`。

别忘了顺手改首页与侧栏里的「目前 N 篇」和 `.catlist__n` 数字。

## 改内容

| 位置 | 内容 |
| --- | --- |
| `<title>` / `meta description` | 浏览器标签与搜索结果里显示的标题、简介 |
| `.masthead__title` | 首页大标题 |
| `.masthead__lede` | 一句话自我介绍 |
| `.card--bio` | 侧栏名片：名字、简介、GitHub / 邮箱 / RSS |
| `.about__main` | 关于页正文 |
| `.foot` | 页脚年份与链接 |

**占位值**：邮箱 `2507821335@qq.com`、GitHub 用户名 `CoolBreezeBlowsGently`。全站搜关键词就能定位。

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

# InnovoGrow Web Project Context

最后更新：2026-06-13

## 项目名称与简介

InnovoGrow 官网静态网页项目。项目用于展示 InnovoGrow 商业种植 LED 灯具、解决方案、资源内容、公司介绍和联系入口。

本文件是后续开发任务的上下文入口。任何代码修改、功能迭代、Bug 修复、结构调整或文档更新前，都应先阅读本文件，再查看实际代码。

## 当前项目目标

- 维护一个轻量、可编辑、适合 CloudCannon 管理内容的静态官网。
- 保持页面视觉、文案、跳转和内容数据结构稳定。
- 在修改页面结构或内容模型时，避免破坏 CloudCannon 的 `data-editable` / `data-prop` 绑定。

## 当前开发阶段

项目处于上线内容维护与页面微调阶段。已有主要页面和内容 JSON，当前工作以页面区块调整、内容维护、样式优化和 CloudCannon 编辑体验稳定为主。

## 技术栈与运行环境

- 静态 HTML / CSS / JavaScript。
- Node.js 仅用于构建脚本。
- 构建命令：`npm.cmd run build`，对应 `node tools/build-cloudcannon.js`。
- 构建产物目录：`dist/`。
- `dist/`、`.cloudcannon/`、`or/` 在 `.gitignore` 中，不作为源码提交。
- 本地预览可使用静态服务，例如：`python -m http.server 4173 --bind 127.0.0.1`。

## 主要目录结构说明

- `index.html`：首页。
- `products.html`：产品页面。
- `solutions.html`：解决方案页面。
- `resources.html`：资源页面。
- `about.html`：关于我们页面。
- `contact.html`：联系页面。
- `styles.css`：首页及全局基础样式的一部分。
- `global-ui.css`：共享 UI 样式。
- `*-overview.css`：各子页面专用样式。
- `script.js`：首页内容渲染、移动菜单、首页表单阻止默认提交等逻辑。
- `shared-site.js`：共享导航、页脚、站点级内容渲染。
- `subpage.js`：子页面 JSON 内容加载和渲染逻辑。
- `content/*.json`：CloudCannon 可编辑内容数据。
- `assets/site-images/`：站点图片、SVG 图标和响应式图片资源。
- `tools/build-cloudcannon.js`：构建脚本，将源码复制到 `dist/`，排除 `.git`、`.cloudcannon`、`dist`、`or`。
- `cloudcannon.config.yml`：CloudCannon 页面、内容集合和输入类型配置。
- `sync-from-github.ps1`：一键同步脚本，执行 `fetch + pull --rebase origin main`。
- `sync-from-github.cmd`：Windows 双击入口，调用 `sync-from-github.ps1`。

## 页面与功能模块说明

- 首页 `index.html`
  - 数据：`content/home.json`
  - 模块：hero、challenge、products、strategies、performance metrics、applications、contact section。
  - JS：`script.js` 加载 `content/home.json`，并通过 `shared-site.js` 渲染共享导航和页脚。

- 产品页 `products.html`
  - 数据：`content/products.json`
  - 模块：hero、产品列表、产品 CTA。
  - JS：`subpage.js` 的 `renderProductsPage`。

- 解决方案页 `solutions.html`
  - 数据：`content/solutions.json`
  - 模块：hero、application links、system、compare、use cases、packages、process、CTA。
  - JS：`subpage.js` 的 `renderSolutionsPage`。

- 资源页 `resources.html`
  - 数据：`content/resources.json`
  - 模块：hero、feature strip、resource library、case studies、FAQ、hub。
  - JS：`subpage.js` 的 `renderResourcesPage`。

- 关于页 `about.html`
  - 数据：`content/about.json`
  - 当前模块：hero、story、journey、values、proof、craft、support、CTA。
  - 注意：Leadership Team 人物区块已删除，`content/about.json` 中也不再保留 `team` 数据，`subpage.js` 中不再渲染 about team。

- 联系页 `contact.html`
  - 数据：`content/contact.json`
  - 模块：hero、contact form、side cards、process、FAQ、map。
  - 注意：地图/位置区块 `.map-band` 当前通过 `hidden` 属性隐藏；`content/contact.json` 的 `map` 数据仍保留，便于未来恢复。

## 数据结构 / 数据库集合说明

本项目没有后端数据库。内容数据来自本地 JSON 文件：

- `content/site.json`：共享 header nav、header CTA、footer columns、newsletter、bottom links。
- `content/home.json`：首页内容。
- `content/products.json`：产品页内容。
- `content/solutions.json`：解决方案页内容。
- `content/resources.json`：资源页内容。
- `content/about.json`：关于页内容。
- `content/contact.json`：联系页内容。

CloudCannon 通过 HTML 中的 `data-editable`、`data-prop` 和 JS 生成的编辑属性识别可编辑内容。修改内容模型时，需要同步检查 HTML、JSON、渲染 JS 和 `cloudcannon.config.yml`。

## 已完成功能

- 主要页面：Home、Products、Solutions、Resources、About、Contact。
- JSON 驱动的页面内容渲染。
- 共享导航和页脚内容渲染。
- CloudCannon 页面与内容集合配置。
- 响应式图片和站点图片资源。
- 基础移动菜单逻辑。
- Contact / 首页表单目前为前端展示逻辑，默认阻止提交。

## 待开发功能

- 如需真正接收询盘，需要接入表单提交后端、第三方表单服务或邮件/CRM 流程。
- 如需启用隐藏的 Contact 地图/位置区块，移除 `contact.html` 中 `.map-band` 的 `hidden` 属性，并验证移动端布局。
- 如需新增页面，应同步新增 HTML、内容 JSON、必要样式、CloudCannon 配置、导航/页脚链接和渲染逻辑。

## 当前已知问题

- 当前没有自动化测试套件。
- 首页和 Contact 页表单目前使用 `formsubmit.co` 免费邮件转发方案。
- FormSubmit 第一次启用目标邮箱时，需要在收件箱中完成一次激活确认。
- Contact 页面地图/位置区块当前是有源码和数据但隐藏状态。
- `dist/` 为构建产物且被忽略，源码变更后需运行 `npm.cmd run build` 验证构建。

## 最近变更记录

- 2026-06-13：删除 About 页面 Leadership Team 人物区块，并同步移除 `content/about.json` 的 `team` 数据和 `subpage.js` 的 about team 渲染逻辑。
- 2026-06-13：隐藏 Contact 页面 “We're Located in the Heart of U.S. Ag Innovation” 地图/位置区块，保留 `content/contact.json` 的 `map` 数据。
- 2026-06-13：新增本项目上下文文档 `IGWeb_PROJECT_CONTEXT.md`，作为后续协作入口。
- 2026-06-13：首页和 Contact 页表单已简化为联系方式收集，仅保留姓名、公司、邮箱、电话和留言。
- 2026-06-13：表单提交接入 `formsubmit.co`，当前目标邮箱为 `sean@innovogrow.com`，用于免费邮件转发，不再收集附件。
- 2026-06-13：新增 `sync-from-github.ps1` 和 `sync-from-github.cmd`，用于从 GitHub 一键同步本地仓库。

## 开发注意事项

- 每次开始修改代码前，必须先阅读 `IGWeb_PROJECT_CONTEXT.md`。
- 如文档描述与实际代码不一致，以实际代码为准；核对后应修正文档。
- 修改页面结构时，优先检查对应 HTML、`content/*.json`、`subpage.js` 或 `script.js`、页面 CSS。
- 修改共享导航、页脚或站点级内容时，检查 `content/site.json` 和 `shared-site.js`。
- 不要随意删除 `data-editable`、`data-prop`、`data-type` 等 CloudCannon 编辑属性。
- 不要提交 `dist/`，它是构建产物。
- 代码修改后至少运行 `npm.cmd run build`。
- 涉及前端视觉或交互的修改，应使用本地预览验证页面显示。
- 工作区可能存在用户或 CloudCannon 产生的改动；修改前先看 `git status --short --branch`，不要回滚未确认的他人改动。
- 当前免费表单方案依赖 `formsubmit.co`，如果更换收件邮箱，需要同步更新首页和 Contact 页表单 `action`。
- 当前全站官方联系收口统一为：`sean@innovogrow.com` 和 `+1 (310) 738-9334`。
- `sync-from-github.ps1` 默认要求工作区干净；如果确实需要带着本地改动同步，可运行 `.\sync-from-github.ps1 -StashLocalChanges`。

## 后续修改约定

后续所有任务遵循：

1. 先阅读 `IGWeb_PROJECT_CONTEXT.md`。
2. 再查看实际代码、配置、目录和相关内容 JSON。
3. 基于实际项目结构进行最小必要修改。
4. 运行必要验证，例如 `npm.cmd run build` 和浏览器预览。
5. 如本次修改影响页面、组件、流程、数据结构、依赖、配置、运行方式或后续开发判断，同步更新 `IGWeb_PROJECT_CONTEXT.md`。

## Additional Notes

- 2026-06-13: The Contact page upload area uses a custom English file picker UI instead of the browser-native file input label, so locale-specific Chinese text does not appear in the website UI.
- Visible website UI text should remain English-only. Avoid relying on browser-native localized controls when they can surface non-English labels to visitors.

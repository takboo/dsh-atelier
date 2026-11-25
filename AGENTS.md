# 协作与开发约束

- 本仓继承 [dsh-engineering.lock.json](dsh-engineering.lock.json) 锁定版本基座契约（`docs/engineering-contract.md`）的跨插件共享治理原则，涵盖 **`Verification is all you need`**（证据驱动与 `mise` 统一门禁）、EGM 磁盘真相与产品 [README.md](README.md) 保护、以及 YAGNI / 先做减法、变更须经独立只读复核后再提交且未经授权不自动 `git push` 或打 tag；基座全文不在此复述，以下仅列本插件专属边界与红线。
- 修改运行时集成、打包、测试或截图前，先阅读 [docs/README.md](docs/README.md)、[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)、[docs/workflow.md](docs/workflow.md) 与 [src/README.md](src/README.md)。
- 修改发布自动化或市场条目之前，先阅读 [docs/RELEASING.md](docs/RELEASING.md)，保持 npm 与 GitHub Release 产物字节一致。
- 所有业务源码位于 `src/`，修改后通过 `npm run build` 重新生成受跟踪的 `client.js`；保持 DSH 模块 ID 与包名一致，宿主机入口 `index.js` 不含浏览器代码。
- 将主题写入、原生接管与恢复集中在主题控制器内；DSH 掌管正文、代码与终端字体，切换风格时必须保留字体设置。
- 通过 `ctx.slots.inject` 注册界面贡献并将所有资源绑定至插件生命周期，同时覆盖激活与停用清理测试。
- 使用固定版本的官方主题运行时测试构建后的 `client.js`；涉及 UI 或 CSS 改动时执行浏览器检查，并在截图变化时核对重生成图片。
- 保持 [README.md](README.md) 面向产品用户，维护者信息写入 [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) 与 [docs/workflow.md](docs/workflow.md)。
- 工程外壳由 [dsh-engineering.lock.json](dsh-engineering.lock.json) 与 [mise.toml](mise.toml) 锁定；完成改动后运行 `mise run check`（`check:shell` + `check:plugin`）与 `npm pack --dry-run`，涉及包/宿主/界面改动时执行 `mise run verify:host`，并按 [docs/workflow.md](docs/workflow.md) 的 `E0`–`E4` 等级如实汇报已跑与 `not-run` 项。

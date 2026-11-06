# 发布与商店收录

## 发布身份与安装产物

- npm：`@takboo/dsh-atelier`，公开包。
- GitHub：`takboo/dsh-atelier`，版本标签为 `v<package.json version>`。
- 许可证：MIT。
- dshmarket：通过 awesome-dsh-plugin 的 `theme` 分类条目收录。

同一个已验证的 npm tarball 同时用于 npm 和 GitHub Release。Release 提供 `dsh-atelier-<版本>.tgz` 与固定别名 `dsh-atelier.tgz`，两者字节相同；固定别名供商店的 `latest/download` 地址使用。附带 `SHA256SUMS` 和 `verification.json`，记录包版本、标签、提交、工作区是否有改动和完整性摘要。

## 本地准备

```sh
npm ci
npm run release:prepare
```

命令依次构建、运行全部检查、核验插件身份和发布文件，再打包到 `artifacts/v<版本>/`。这是本地准备命令，不调用 npm 发布或 GitHub API。也可用 `RELEASE_TAG=v<版本>` 检查指定标签是否与 package.json 一致。

检查 `verification.json` 和包内容。在独立 DSH profile 安装该 tgz，检查画廊入口、会话材质、明暗切换、字体设置、原生接管及停用恢复。兼容性记录放在开发文档中；README 面向产品用户。

## 首次发布配置

1. 将仓库发布到 `takboo/dsh-atelier`，添加 `dsh-plugin`、`deepseek-harness`、`theme` topics。
2. 核对 package.json 的包名、repository、license、engines、元信息及截图。
3. 为已提交的源码创建版本标签，手动运行 GitHub 的 Release 工作流并保持 `dry_run` 开启。下载并解压该次 Actions artifact；首次创建 npm 包时，用已登录的维护者账号发布其中已验证的 tgz：

   ```sh
   npm publish ./dsh-atelier-<版本>.tgz --access public --ignore-scripts
   ```

4. 在 npm 包设置中配置 GitHub Trusted Publisher：用户 `takboo`、仓库 `dsh-atelier`、工作流文件 `release.yml`，允许直接发布。工作流通过 OIDC 认证，使用 Node 24 及 npm 11.5.1+。具体配置以 [npm 官方文档](https://docs.npmjs.com/trusted-publishers/)为准。
5. 在 GitHub 为同一个已准备标签创建 Release。工作流核验包完整性；若 npm 上已有完全相同的字节，会跳过重复发布并上传附件。

首次发布后，将 README 安装章节的“发布后／收录后”状态更新为实际可用渠道。

## 后续版本

1. 修改版本，运行 `npm install --package-lock-only` 同步锁文件；执行 `npm run release:prepare` 并完成实际宿主验证。
2. 将源码、生成的 `client.js`、锁文件和相关文档提交到 GitHub。
3. 创建对应版本标签和 GitHub Release。预发布版本（如 `1.5.0-rc.1`）同时勾选 GitHub 的 prerelease 标记。
4. `Release` 工作流检出标签，重新执行检查，准备一次产物，保存 Actions artifact，再将同一 tgz 发布至 npm 并附加到 Release。正式版本使用 `latest`；预发布使用 `next`。
5. 核对 npm 版本、dist-tag、Release 两个附件和摘要。不要把发布预发布包的 `next` 当成稳定版升级。

也可手动运行工作流，指定一个已有标签。`dry_run` 默认开启，仅验证和保存 Actions artifact；关闭后会发布 npm 并向该标签的已有 Release 上传附件。

已有 npm 版本若字节不同，发布会失败，需使用新版本。Release 上传不覆盖既有附件。部分步骤失败时，先从该次运行保留的 Actions artifact 恢复缺失附件，保持已发布字节不变；不要重打包覆盖已有发布。

## dshmarket 条目

dshmarket 的目录来源是 [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)，不是市场应用仓库。已准备 [market/takboo__dsh-atelier.yml](../market/takboo__dsh-atelier.yml)，正式发版后将它作为 `data/plugins/takboo__dsh-atelier.yml` 提交到目录仓库。

条目使用 `theme` 分类、中英文描述和固定的 Release tarball URL。截图保留在 README 的 GitHub 相对图片链接中，可供商店详情提取。npm 元数据中的 repository 必须指向本仓库，便于目录核对 npm 包归属。公开仓库满足目录的创建时间要求后再提交；具体门槛见[收录贡献指南](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/main/contributing.md)。

上架操作由目录维护者审核合并。npm 发布、Release 附件上传与目录收录分别核对。本轮只准备本地配置与条目，不执行发布或投稿。

## 旧本地包迁移

从 `@local/dsh-atelier` 迁移时，先停用并移除旧包，再安装 `@takboo/dsh-atelier`，避免两个包重复注册同名主题。偏好的 `dsh-atelier:*` 存储键保持不变，同一浏览器源中的既有搭配可继续读取。

## 参考

- [DSH-better-sidebar 发布工作流](https://github.com/omdsh-dev/DSH-better-sidebar/blob/main/.github/workflows/release.yml)：公开包元信息、标签核验与 OIDC 发布。
- [dshmarket 提交入口说明](https://github.com/dsh-market/dsh-market#submit-your-plugin)：目录来源和安装源选择。

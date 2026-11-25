# 工作流与验证门禁

本仓库通过 `dsh-engineering.lock.json` 锁定 `dsh-plugin-engineering`，并在 `mise.toml` 中提供统一开发与验证入口。模块职责见 [DEVELOPMENT.md](DEVELOPMENT.md)，发布流程见 [RELEASING.md](RELEASING.md)。

## 统一验证门禁

运行 `check:shell` 与 `verify:host` 前，本地需准备包含 `dsh-engineering.lock.json` 锁定标签（`v0.2.0-rc.1`）的 `dsh-plugin-engineering` Git 检出目录。`mise.toml` 优先按 `DSH_ENGINEERING_CHECKOUT` 定位 `locked-run.mjs`（未设置时回退到同级 `../dsh-plugin-engineering`）；`locked-run.mjs` 自身要求基座绝对路径来自 `DSH_ENGINEERING_CHECKOUT`、`${XDG_CONFIG_HOME:-$HOME/.config}/dsh-plugin-engineering/checkout`（或直接执行 `doctor` 时传入 `--checkout <绝对路径>`）。即使使用同级目录，也请先导出 `DSH_ENGINEERING_CHECKOUT` 或写入该配置文件，并可运行 `node "${DSH_ENGINEERING_CHECKOUT:-../dsh-plugin-engineering}/scripts/locked-run.mjs" doctor` 核对基座检出、Node 版本与环境配置。

```sh
mise run setup
mise run check
npm pack --dry-run
mise run verify:host
```

- `mise run setup`：执行 `npm ci`，安装锁定依赖。
- `mise run check`：并行执行 `check:shell`（通过 `locked-run.mjs check-plugin` 校验外壳契约、锁文件与文档索引）、`check:plugin`（执行 `npm run check`：构建 `client.js`、运行 Node 测试、浏览器预览检查与包核验）与 `check:mise`（校验 `VERIFY_HOST_RUN_DIR` 隔离与 `VERIFY_HOST_DIR` 覆盖）。
- `mise run verify:pack`：运行 `scripts/pack-host-candidate.mjs`，默认写入每次调用自动分配的 `VERIFY_HOST_RUN_DIR`（`artifacts/verify-host/run-<timestamp>-<random>/`，可用 `VERIFY_HOST_DIR` 显式覆盖），先清理该目录旧文件，构建并校验后在隔离暂存目录打包，核验包内真实字节的 `exports`、`locale/*.json` 元信息与 `icon.svg`，通过后再原子发布 `candidate.tgz` 并输出 SHA-256。
- `mise run verify:host:container`：串行依赖 `verify:pack`，通过 `locked-run.mjs container` 使用 `tests/host/targets.json` 与 `tests/host/probe.mjs` 在隔离容器中执行真实 DSH 宿主准入与拒绝验证，报告写入同轮目录下的 `report.json`。
- `mise run verify:host`：串行依赖 `verify:host:container`，执行 `scripts/pack-host-candidate.mjs --verify-report` 以只读方式核对同轮 `report.json` 与 `candidate.tgz` 的 SHA-256 一致性（不修改或删除报告文件）。

## 改动面与最小必跑验证矩阵

| 改动范围 | 必跑验证 |
| --- | --- |
| 文档与索引（`docs/`、`src/README.md`、`AGENTS.md`） | `mise run check`、`npm pack --dry-run` |
| 工程外壳、脚本或单测（`mise.toml`、`scripts/`、`tests/`） | `mise run check`、`npm pack --dry-run`；涉及候选包或宿主探针时加跑 `mise run verify:host` |
| 客户端源码、样式或 manifest（`src/`、`client.js`、`package.json`、`cordis.patch.yml`） | `mise run check`、`npm pack --dry-run`、`mise run verify:host`；UI 改动需检查重生成截图 |
| 支持范围或宿主目标（`engines.dsh`、`tests/host/targets.json`） | `mise run check`、`mise run verify:host`，并在真实目标宿主完成桌面端复测 |

## 证据等级（严禁假绿）

| 等级 | 含义 | 本仓对应验证 |
| --- | --- | --- |
| `E0` | 静态外壳与文档契约 | `mise run check:shell`（`check-plugin.mjs` 与文档索引校验） |
| `E1` | 宿主机单测、隔离浏览器与候选包元数据 | `mise run check:plugin`、`npm pack --dry-run`、`mise run verify:pack`（校验 `.tgz` 内 `exports`、`locale/*.json` 与 `icon.svg`） |
| `E2` | 隔离容器真实 DSH 宿主探针 | `mise run verify:host`（验证 `0.2.1-rc.5` 准入与 Web 交互、`0.2.2-rc.1` 拒绝及报告溯源） |
| `E3` | 原生桌面端与真实操作系统图形验收 | 独立 profile 安装同包，验证 macOS/Windows/Linux 窗口、字体、接管与启停 |
| `E4` | 公开分发与渠道安装核验 | npm、GitHub Release 与 dshmarket 实际发布后按渠道核对 |

每次交付必须注明已实跑的最高证据等级；未执行的 `E2`、`E3`、`E4` 必须显式标注为 `not-run`，不得用低等级结果替代高等级验收。

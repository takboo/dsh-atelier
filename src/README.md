# 源码目录索引

修改 `src/` 下任意文件后，执行 `npm run build` 重新生成仓库根目录受跟踪的 `client.js`。

| 文件 | 职责 |
| --- | --- |
| [client.js](client.js) | DSH 客户端插件入口，注册字典、主题、样式与侧栏/画廊插槽并绑定清理生命周期。 |
| [gallery.js](gallery.js) | 风格画廊界面与预览卡片，通过外部存储快照订阅当前主题状态。 |
| [identity.js](identity.js) | 公开插件 ID 常量，与包名、模块工厂及 `cordis.patch.yml` 一致。 |
| [locale.js](locale.js) | 画廊界面的中英文文案字典。 |
| [preferences.js](preferences.js) | 主题偏好校验、旧格式迁移与可容错浏览器本地存储读写。 |
| [runtime.js](runtime.js) | 主题控制器，统一管理风格应用、原生接管、恢复、订阅与停用清理。 |
| [themes.js](themes.js) | 六套风格定义及语义 token 生成。 |
| [styles/gallery.css](styles/gallery.css) | 画廊视图的局部排版、卡片布局与响应式样式。 |
| [styles/global.css](styles/global.css) | 通过 `data-atelier-style` 限定作用域的全局风格材质与细节样式。 |

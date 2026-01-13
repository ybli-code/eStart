# 项目技术架构升级文档

本项目已从 Vue 2 (Options API) 成功升级至现代化的前端技术栈。以下是详细的技术集成说明和使用规范。

## 1. 核心技术栈 (Core Stack)

- **前端框架**: Vue 3.3+ (Composition API + `<script setup>`)
- **编程语言**: TypeScript 5.0+
- **构建工具**: Vite 5.0+
- **状态管理**: Pinia 2.1+ (带持久化插件 `pinia-plugin-persistedstate`)
- **UI 组件库**: Element Plus (按需引入 + 主题定制)
- **网络请求**: Axios (集成拦截器与类型定义)

## 2. 目录结构规范

```text
src/
├── api/            # 接口定义
├── assets/         # 静态资源 (图片、样式)
├── components/     # 公共组件 (Vue 3 + TS)
├── hooks/          # 复用逻辑 (Composables)
├── store/          # Pinia 状态管理
├── utils/          # 工具函数
├── views/          # 页面组件
├── App.vue         # 根组件
└── main.ts         # 入口文件
```

## 3. 关键模块集成说明

### 3.1 Pinia 状态管理
状态管理已全面迁移至 Pinia。
- **持久化**: 使用 `pinia-plugin-persistedstate` 插件，只需在 store 定义中设置 `persist: true` 即可自动持久化到 localStorage。
- **使用示例**:
  ```typescript
  import { useSettingStore } from '@/store/setting'
  const settingStore = useSettingStore()
  ```

### 3.2 Element Plus 按需引入
通过 `unplugin-auto-import` 和 `unplugin-vue-components` 实现了组件和 API 的自动按需引入。
- 在模板中直接使用 `<el-button>` 即可，无需手动 import。
- `ref`, `computed`, `onMounted` 等常用 Vue API 也已配置为自动引入。

### 3.3 环境配置 (Vite)
- **多环境**: 支持 `.env.development`, `.env.production`, `.env.extension`。
- **变量名前缀**: 必须以 `VITE_` 开头才能在代码中通过 `import.meta.env` 访问。

### 3.4 辅助工具集成
- **Lunar Calendar**: 集成 `lunar-javascript` 用于农历计算。
- **Image Cropper**: 集成 `vue-picture-cropper` 用于头像/背景裁剪。

## 4. 开发规范

- **组件编写**: 统一使用 `<script setup lang="ts">`。
- **类型定义**: 尽量为 props 和 state 定义明确的 TypeScript 接口。
- **样式**: 使用 Less 预处理器，配合全局变量进行主题定制。

## 5. 生产优化

- **代码分割**: Vite 默认配置。
- **压缩**: 已配置生产环境混淆与压缩。
- **兼容性**: 通过 `@vitejs/plugin-legacy` 支持旧版浏览器。

---
*文档更新日期: 2026-01-13*

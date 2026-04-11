# tianjitong-trace

田迹通 · 消费者追溯查询 H5

> Vue 3 + Vite + TypeScript + Tailwind CSS v3

## 开发

```bash
pnpm install
pnpm dev
```

访问 http://localhost:5174/ 会跳到 mock 追溯码 `/TJT240315ABCDEF`。

## 路由

- `/:traceCode` — 追溯详情页
- `/404` — 未找到页

## 脚本

- `pnpm dev` 本地开发
- `pnpm build` 生产构建
- `pnpm preview` 预览构建产物
- `pnpm type-check` 类型检查

当前仅使用本地 mock 数据,后端对接待 `tianjitong-server` 基础服务层完成后进行。

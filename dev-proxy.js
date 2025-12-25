const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const FRONTEND_PORT = process.env.PORT || 8081;
const API_TARGET = process.env.API_TARGET || 'http://localhost:8080';

const app = express();

// 放宽或覆盖 Content-Security-Policy，避免某些浏览器/扩展尝试连接时被阻止（开发环境）
app.use((req, res, next) => {
  // 设置一个比较宽松的 CSP，仅用于本地开发代理
  res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' data: blob: *; connect-src * ws: http: https:");
  next();
});

// 返回 204 对于 /.well-known/* 的请求，避免浏览器扩展或 DevTools 特殊请求触发错误日志
app.use((req, res, next) => {
  if (req.path.startsWith('/.well-known/')) {
    res.status(204).end();
    return;
  }
  next();
});

// 日志：打印每个请求的方法与路径（便于调试为什么某些方法被拒绝）
app.use((req, res, next) => {
  console.log(`[DEV-PROXY] ${req.method} ${req.path}`);
  next();
});

// 代理 /api 到后端，保留原始路径（提前挂载，避免被 static 中间件拦截）
app.use(createProxyMiddleware('/api', {
  target: API_TARGET,
  changeOrigin: true,
  secure: false,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    try {
      console.log('[PROXY REQ] Forwarding:', req.method, req.originalUrl || req.url, '->', API_TARGET + proxyReq.path);
    } catch (e) {
      console.error('[PROXY REQ] logging failed', e && e.message);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log('[PROXY RES] Status for', req.method, req.originalUrl || req.url, proxyRes.statusCode);
  },
  onError: (err, req, res) => {
    console.error('[PROXY ERROR]', err && err.message);
  }
}));

// 将根路径和 /login 映射到 in/Login.html，便于直接访问（提前注册，确保根路径优先返回登录页）
app.get(['/', '/login', '/Login.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'in', 'Login.html'));
});

// 静态文件目录（以项目根的 in/ 作为演示前端目录）
app.use(express.static(path.join(__dirname, 'in')));
// 也托管 src/ 中的主要页面（例如 src/index.html），方便直接打开项目的主要页面
app.use(express.static(path.join(__dirname, 'src')));
// 也托管编译/打包后的文件（dist）以供页面引用
// 挂载在 /dist，使页面可以通过 /dist/... 访问对应文件
app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.listen(FRONTEND_PORT, () => {
  console.log(`Dev proxy running: http://localhost:${FRONTEND_PORT} -> ${API_TARGET}`);
});

// 简单的 404 日志（便于调试缺失的静态资源）
app.use((req, res) => {
  console.warn(`Dev proxy 404 for: ${req.method} ${req.path}`);
  res.status(404).send('Not Found');
});

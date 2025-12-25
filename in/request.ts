// 默认后端地址：开发时优先使用相对路径，以便通过 dev-proxy 转发；可通过 window.__BASE_URL__ 覆盖
const defaultBaseURL = '';
// 支持在页面中通过 window.__BASE_URL__ 覆盖（便于在不同机器/设备上测试）
// 注意：允许空字符串 '' 作为有效值（表示使用相对路径，由代理转发）
let baseURL: string;
if (typeof window !== 'undefined' && Object.prototype.hasOwnProperty.call(window, '__BASE_URL__')) {
  baseURL = (window as any).__BASE_URL__;
} else {
  baseURL = defaultBaseURL;
}

function buildUrl(path: string, params?: Record<string, any>): string {
  const url = new URL(path, baseURL);
  if (params) {
    Object.keys(params).forEach(k => {
      const v = params[k];
      if (v !== undefined && v !== null) url.searchParams.append(k, String(v));
    });
  }
  return url.toString();
}

async function requestFetch(path: string, options?: RequestInit) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = Object.assign({}, (options && options.headers) || {});
  headers['Content-Type'] = headers['Content-Type'] || 'application/json;charset=utf-8';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(path.startsWith('http') ? path : `${baseURL}${path}`, Object.assign({}, options, { headers }));
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  const data = await res.json().catch(() => null);
  return data;
}

export default {
  get(path: string, params?: Record<string, any>) {
    const url = buildUrl(path, params);
    return requestFetch(url, { method: 'GET' });
  },
  post(path: string, body?: any) {
    return requestFetch(path, { method: 'POST', body: JSON.stringify(body) });
  }
};
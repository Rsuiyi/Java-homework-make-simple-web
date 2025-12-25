var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// 默认后端地址：本地开发通常使用 localhost:8080
const defaultBaseURL = 'http://localhost:8080';
// 支持在页面中通过 window.__BASE_URL__ 覆盖（便于在不同机器/设备上测试）
// 允许空字符串 '' 作为有效值（表示使用相对路径，由代理转发）
let baseURL = defaultBaseURL;
if (typeof window !== 'undefined' && Object.prototype.hasOwnProperty.call(window, '__BASE_URL__')) {
    baseURL = window.__BASE_URL__;
}
function buildUrl(path, params) {
    const url = new URL(path, baseURL);
    if (params) {
        Object.keys(params).forEach(k => {
            const v = params[k];
            if (v !== undefined && v !== null)
                url.searchParams.append(k, String(v));
        });
    }
    return url.toString();
}
function requestFetch(path, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = localStorage.getItem('token');
        const headers = Object.assign({}, (options && options.headers) || {});
        headers['Content-Type'] = headers['Content-Type'] || 'application/json;charset=utf-8';
        if (token)
            headers['Authorization'] = `Bearer ${token}`;
        const res = yield fetch(path.startsWith('http') ? path : `${baseURL}${path}`, Object.assign({}, options, { headers }));
        if (!res.ok) {
            const text = yield res.text();
            throw new Error(`HTTP ${res.status}: ${text}`);
        }
        const data = yield res.json().catch(() => null);
        return data;
    });
}
export default {
    get(path, params) {
        const url = buildUrl(path, params);
        return requestFetch(url, { method: 'GET' });
    },
    post(path, body) {
        return requestFetch(path, { method: 'POST', body: JSON.stringify(body) });
    }
};

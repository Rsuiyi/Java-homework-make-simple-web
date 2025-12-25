"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
// 创建 axios 实例
// 使用相对路径作为默认 baseURL（便于 dev-proxy 转发），并支持通过 window.__BASE_URL__ 覆盖
var baseURL = (typeof window !== 'undefined' && window.__BASE_URL__ !== undefined) ? window.__BASE_URL__ : '';
var request = axios_1.default.create({
    baseURL: baseURL, // 默认为 ''（相对路径），可通过 window.__BASE_URL__ 覆盖
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
});
// 请求拦截器（核心修改：参数类型改为 InternalAxiosRequestConfig）
request.interceptors.request.use(function (config) {
    var token = localStorage.getItem('token');
    // 确保 headers 非空（兜底赋值）
    config.headers = config.headers || {};
    if (token) {
        config.headers.Authorization = "Bearer ".concat(token);
    }
    return config;
}, function (error) {
    console.error('请求拦截器错误：', error);
    return Promise.reject(error);
});
// 响应拦截器（无需修改）
request.interceptors.response.use(function (response) {
    var res = response.data;
    return res;
}, function (error) {
    console.error('请求失败：', error.message || '网络异常');
    return Promise.reject(error);
});
exports.default = request;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var b_1 = require("./b");
// 关闭模态框
function closeModal(modalId) {
    var modalEl = document.getElementById(modalId);
    if (modalEl) {
        modalEl.style.display = 'none';
    }
}
// 显示模态框
function showModal(modalId, message) {
    var msgElId = modalId === 'successModal' ? 'successMessage' : 'errorMessage';
    var msgEl = document.getElementById(msgElId);
    var modalEl = document.getElementById(modalId);
    if (msgEl) {
        msgEl.textContent = message;
    }
    if (modalEl) {
        modalEl.style.display = 'flex';
    }
}
// DOM 加载完成后执行
$(document).ready(function () {
    return __awaiter(this, void 0, void 0, function () {
        var params, message, type, modalId;
        return __generator(this, function (_a) {
            params = new URLSearchParams(window.location.search);
            message = params.get('message');
            type = params.get('type');
            // 检查并显示模态框
            if (message && type) {
                modalId = type === 'success' ? 'successModal' : 'errorModal';
                showModal(modalId, message);
                // 移除URL参数，避免刷新重复显示
                params.delete('type');
                params.delete('message');
                window.history.replaceState({}, document.title, window.location.pathname + (params.toString() ? "?".concat(params.toString()) : ''));
            }
            // 登录按钮点击事件（替换为真实接口请求）
            $('#submit').click(function () {
                return __awaiter(this, void 0, void 0, function () {
                    var username, password, loginParams, res, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                username = $('#LoginUser').val() || '';
                                password = $('#LoginPassword').val() || '';
                                if (!username.trim() || !password.trim()) {
                                    showModal('errorModal', '用户名或密码不能为空！');
                                    return [2 /*return*/]; // 校验失败直接返回
                                }
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                loginParams = {
                                    username: username.trim(),
                                    password: password.trim()
                                };
                                return [4 /*yield*/, (0, b_1.login)(loginParams)];
                            case 2:
                                res = _a.sent();
                                // 4. 根据接口响应处理
                                if (res.code === 200) { // 假设 200 是成功状态码
                                    showModal('successModal', "\u767B\u5F55\u6210\u529F\uFF01".concat(res.message, " \u5373\u5C06\u8DF3\u8F6C\u5230\u4E3B\u9875"));
                                    // 可存储 token（res.data 通常是 token）
                                    localStorage.setItem('token', res.data);
                                    // 模拟跳转（替换为真实主页路径）
                                    setTimeout(function () {
                                        window.location.href = '/index.html';
                                    }, 1500);
                                }
                                else {
                                    // 接口返回失败（如用户名密码错误）
                                    showModal('errorModal', res.message || '登录失败，请重试！');
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                error_1 = _a.sent();
                                // 捕获网络错误/接口异常（如 404/500）
                                console.error('登录请求失败：', error_1);
                                showModal('errorModal', '网络异常，请检查后重试！');
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            });
            // 注册按钮点击事件（若有注册接口，可参考登录逻辑改造；若无则保留模拟，但补充类型）
            $('#register').click(function () {
                return __awaiter(this, void 0, void 0, function () {
                    var username, password, confirmPwd, registerParams, res, error_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                username = $('#RegisterUser').val() || '';
                                password = $('#RegisterPassword').val() || '';
                                confirmPwd = $('#RegisterConfirmPassword').val() || '';
                                if (!username.trim() || !password.trim()) {
                                    showModal('errorModal', '用户名或密码不能为空！');
                                    return [2 /*return*/];
                                }
                                else if (password !== confirmPwd) {
                                    showModal('errorModal', '两次密码输入不一致！');
                                    return [2 /*return*/];
                                }
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                registerParams = {
                                    username: username.trim(),
                                    password: password.trim()
                                };
                                return [4 /*yield*/, (0, b_1.register)(registerParams)];
                            case 2:
                                res = _a.sent();
                                if (res && res.code === 200) {
                                    showModal('successModal', "\u6CE8\u518C\u6210\u529F\uFF01".concat(res.message, " \u5373\u5C06\u8DF3\u8F6C\u5230\u4E3B\u9875"));
                                    setTimeout(function () {
                                        window.location.href = '/index.html';
                                    }, 1500);
                                }
                                else {
                                    showModal('errorModal', res.message || '注册失败，请重试！');
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                error_2 = _a.sent();
                                console.error('注册请求失败：', error_2);
                                showModal('errorModal', '网络异常，请检查后重试！');
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            });
            // 为 HTML 内联 onclick 提供全局函数引用
            window.closeModal = closeModal;
            window.showModal = showModal;
            return [2 /*return*/];
        });
    });
});

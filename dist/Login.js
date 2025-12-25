var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { login, register } from './b.js';
// 关闭模态框
function closeModal(modalId) {
    const modalEl = document.getElementById(modalId);
    if (modalEl) {
        modalEl.style.display = 'none';
    }
}
// 显示模态框
function showModal(modalId, message) {
    const msgElId = modalId === 'successModal' ? 'successMessage' : 'errorMessage';
    const msgEl = document.getElementById(msgElId);
    const modalEl = document.getElementById(modalId);
    if (msgEl) {
        msgEl.textContent = message;
    }
    if (modalEl) {
        modalEl.style.display = 'flex';
    }
}
// DOM 加载完成后执行
$(document).ready(function () {
    return __awaiter(this, void 0, void 0, function* () {
        // 解析URL参数
        const params = new URLSearchParams(window.location.search);
        const message = params.get('message');
        const type = params.get('type');
        // 检查并显示模态框
        if (message && type) {
            const modalId = type === 'success' ? 'successModal' : 'errorModal';
            showModal(modalId, message);
            // 移除URL参数，避免刷新重复显示
            params.delete('type');
            params.delete('message');
            window.history.replaceState({}, document.title, window.location.pathname + (params.toString() ? `?${params.toString()}` : ''));
        }
        // 登录按钮点击事件（替换为真实接口请求）
        $('#submit').click(function () {
            return __awaiter(this, void 0, void 0, function* () {
                // 1. 获取并校验输入值
                const username = $('#LoginUser').val() || '';
                const password = $('#LoginPassword').val() || '';
                if (!username.trim() || !password.trim()) {
                    showModal('errorModal', '用户名或密码不能为空！');
                    return; // 校验失败直接返回
                }
                try {
                    // 2. 构造登录参数（符合 LoginParams 类型约束）
                    const loginParams = {
                        username: username.trim(),
                        password: password.trim()
                    };
                    // 3. 调用真实的登录接口（await 等待异步结果）
                    const res = yield login(loginParams);
                    // 4. 根据接口响应处理
                    if (res.code === 200) { // 假设 200 是成功状态码
                        showModal('successModal', `登录成功！${res.message} 即将跳转到主页`);
                        // 可存储 token（res.data 通常是 token）
                        localStorage.setItem('token', res.data);
                        // 模拟跳转（替换为真实主页路径）
                        setTimeout(() => {
                            window.location.href = '/index.html';
                        }, 1500);
                    }
                    else {
                        // 接口返回失败（如用户名密码错误）
                        showModal('errorModal', res.message || '登录失败，请重试！');
                    }
                }
                catch (error) {
                    // 捕获网络错误/接口异常（如 404/500）
                    console.error('登录请求失败：', error);
                    showModal('errorModal', '网络异常，请检查后重试！');
                }
            });
        });
        // 注册按钮点击事件（若有注册接口，可参考登录逻辑改造；若无则保留模拟，但补充类型）
        $('#register').click(function () {
            return __awaiter(this, void 0, void 0, function* () {
                const username = $('#RegisterUser').val() || '';
                const password = $('#RegisterPassword').val() || '';
                const confirmPwd = $('#RegisterConfirmPassword').val() || '';
                if (!username.trim() || !password.trim()) {
                    showModal('errorModal', '用户名或密码不能为空！');
                    return;
                }
                else if (password !== confirmPwd) {
                    showModal('errorModal', '两次密码输入不一致！');
                    return;
                }
                try {
                    const registerParams = {
                        username: username.trim(),
                        password: password.trim()
                    };
                    const res = yield register(registerParams);
                    if (res && res.code === 200) {
                        showModal('successModal', `注册成功！${res.message} 即将跳转到主页`);
                        setTimeout(() => {
                            window.location.href = '/index.html';
                        }, 1500);
                    }
                    else {
                        showModal('errorModal', res.message || '注册失败，请重试！');
                    }
                }
                catch (error) {
                    console.error('注册请求失败：', error);
                    showModal('errorModal', '网络异常，请检查后重试！');
                }
            });
        });
        // 为 HTML 内联 onclick 提供全局函数引用
        window.closeModal = closeModal;
        window.showModal = showModal;
    });
});

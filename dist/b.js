var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import request from './request.js';
/**
 * update password
 * @param {object} params UpdatePasswordRequest
 * @param {string}params .oldPassword
 * @param {string}params .newPassword
 * @param {string}params .username
 */
export function updatePassword(params) {
    return request.post(`/api/user/updatePassword`, params);
}
/**
 * logout
 * @returns
 */
export function logout(params) {
    return request.post(`/api/user/logout`, params);
}
/**
 * register
 * @param {object} params LoginRequest
 * @param {string}params .username
 * @param {string}params .password
 * @returns
 */
export function register(params) {
    return request.post(`/api/register`, params);
}
/**
 * @param {object} params LoginRequest
 * @param {string}params .username
 * @param {string}params .password
 */
export function login(params) {
    return __awaiter(this, void 0, void 0, function* () {
        return request.post(`/api/login`, params);
    });
}
/**
 * getUserInfo
 * @return
 */
export function getUserInfo(params) {
    return request.get(`/api/user/me`, params);
}

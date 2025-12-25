import request from './request';

//
export interface UpdatePasswordRes {
    oldPassword?: string;
    newPassword?: string;
}

export interface UpdatePasswordParams {
    oldPassword?: string;
    newPassword?: string;
    username?: string;
}

export interface LogoutParams {
    // 根据后端实际字段补充，这里保持宽松类型
    [key: string]: any;
}

export interface GetUserInfoParams {
    [key: string]: any;
}

/**
 * update password
 * @param {object} params UpdatePasswordRequest
 * @param {string}params .oldPassword
 * @param {string}params .newPassword
 * @param {string}params .username
 */
export function updatePassword(params: UpdatePasswordParams): Promise<UpdatePasswordRes> {
    return request.post(`/api/user/updatePassword`, params);
}

//
export interface LogoutRes {
    code : number;
    message: string;
    data: string;
}
/**
 * logout
 * @returns
 */
export function logout(params: LogoutParams): Promise<LogoutRes> {
    return request.post(`/api/user/logout`, params);
}

//
//
export interface RegisterParams {
    username?: string;
    password?: string;
}
export interface RegisterRes {
    code : number;
    message: string;
    data: string;
}
/**
 * register
 * @param {object} params LoginRequest
 * @param {string}params .username
 * @param {string}params .password
 * @returns
 */
export function register(params: RegisterParams): Promise<RegisterRes> {
    return request.post( `/api/register`, params);
}


export interface LoginParams {
    username?: string;
    password?: string;
}
export interface LoginRes {
    code : number;
    message: string;
    data: string;
}
/**
 * @param {object} params LoginRequest
 * @param {string}params .username
 * @param {string}params .password
 */
export async function login(params: LoginParams): Promise<LoginRes> {
    return request.post( `/api/login`, params);
}

//
export interface GetUserPageRes {
    code : number;
    message: string;
    data: {
        page: number;
        size: number;
        totalPages: number;
        totalElements: number;
        content:{
            id: number;
            username: string;
            password: string;
            avatar: string;
        }[];
    };
}
//
export interface GetUserInfoRes {
    code : number;
    message: string;
    data: {
        id: number;
        username: string;
        avatar: string;
    };
}
/**
 * getUserInfo
 * @return 
 */
export function getUserInfo(params: GetUserInfoParams): Promise<GetUserInfoRes> {
    return request.get( `/api/user/me`, params);
}

'use strict';
import {formPost, handleResponseFun, textPost} from "../utils/FetchUtil";
import {
    notificationErrorFun,
    notificationFun,
    notificationSuccessFun,
    notificationWarningFun
} from "../utils/MessageUtil";
import {windowLogin} from "../constants/RouterData";
import {getAppKeyValue} from "../constants/SessionStorageData";
import {
    STATUS_EXCEPTION_MESSAGE,
    STATUS_QUERY_NULL_MESSAGE,
    STATUS_QUERY_NULL_NOLOGIN,
    STATUS_SUCCESS_MESSAGE
} from "../utils/STATUS";

//调试开发
// export const urlContent = "http://192.168.2.62:19200/"; // 晓杰
// export const urlContent = "http://192.168.2.203:19200/"; // 国辉
export const urlContent = "https://webtest.bjupi.com:9891/api/gkj/"; // 测试

// 正式
// export const urlContent = window.location.origin + '/api/gkj/';

export const urlPublicContent = urlContent + 'public/';
export const urlLoadContent = urlContent + 'load/';


export const handleNoLoginFun = (data) => {
    handelMessageFun(data.message);
};

export const handelMessageFun = (data) => {
    const {code, msg} = data;

    if (code === STATUS_SUCCESS_MESSAGE) {
        notificationSuccessFun(msg);
    } else if (code === STATUS_QUERY_NULL_MESSAGE) {
        notificationWarningFun(msg);
    } else if (code === STATUS_EXCEPTION_MESSAGE) {
        notificationErrorFun(msg);
    } else if (code === STATUS_QUERY_NULL_NOLOGIN) {
        windowLogin();
    } else {
        const notificationMsg = msg ? msg : "服务器无法连接，请与运营商联系";
        notificationFun(notificationMsg);
    }
};

/**
 * 处理后端返回来的数据。
 */
export function responseFun(data, messageFun) {
    return handleResponseFun(data, messageFun ? messageFun : handelMessageFun, handleNoLoginFun);
}

/**
 * 获取验证令牌
 */
export const getAppKey = () => {
    const appKeyValue = getAppKeyValue();
    return appKeyValue ? 'appKey=' + appKeyValue : "";
};

/**
 * 处理后端请求参数
 */
export function requestParam(thisUrl, data) {
    data = data || {};
    const getAppKeyData = getAppKey();
    const params = Object.entries(data).map(([key, value]) => `${key}=${value}`);
    const timestampString = `?${Date.now()}`;
    const queryString = params.length ? `&${params.join('&')}` : '';
    const appKeyString = getAppKeyData ? `&${getAppKeyData}` : '';

    return `${thisUrl}${timestampString}${appKeyString}${queryString}`;
}

/**
 * 初始化数据
 */
export async function init() {
    return formPost(urlContent + requestParam('init', null), null);
}

/**
 * 登录
 */
export async function login(loginAccountJson) {
    return textPost(urlPublicContent + requestParam('login', null), loginAccountJson);
}

/**
 * 获取验证码
 */
export async function verification(verification) {
    return formPost(urlPublicContent + requestParam('verification', {verification}));
}

/**
 * 获取验证码
 */
export async function check(uuid, phone, code) {
    return formPost(urlPublicContent + requestParam('checkm', {uuid, phone, code}));
}

/**
 * 菜单
 */
export async function getPermissionMenu() {
    return formPost(urlContent + requestParam('getPermissionMenu', null));
}

// POST / 获取菜单
export async function getColExpertPermissionMenu() {
    return formPost(urlContent + requestParam('getColExpertPermissionMenu', null));
}

/**
 * 登出
 */
export async function logout() {
    return formPost(urlContent + requestParam('logout', null), null);
}

/**
 * 获取DictCode
 * @param keyStrs key
 * @return
 */
export async function mapDictCodes(keyStrs) {
    console.log(requestParam('mapDictCodes', {keyStrs}))
    return formPost(urlContent + requestParam('mapDictCodes', {keyStrs}), null);
}

/**
 * 下载手册
 * @return
 */
export async function manual() {
    return formPost(urlLoadContent + requestParam('manual', null), null);
}

// 跳转连接
export async function sysLoginAction(codeString) {
    return formPost(urlPublicContent + requestParam('sysLoginAction', {codeString}), null);
}

/**
 * 下载插件
 * @return
 */
export async function videoWebPlugin() {
    return formPost(urlLoadContent + requestParam('videoWebPlugin', null), null);
}

/**
 * 是否是帆软
 * @return
 */
export async function queryFineReport() {
    return formPost(urlPublicContent + requestParam('queryFineReport', null), null);
}
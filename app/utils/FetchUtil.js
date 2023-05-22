'use strict';
const contentTypeForm = "application/x-www-form-urlencoded";
const contentTypeText = "application/text;charset=UTF-8";
import {messageWarning} from "./MessageUtil";

import {getAppKeyValue, key_appKey} from "../constants/SessionStorageData";

import {
    STATUS_EXCEPTION_MESSAGE,
    STATUS_QUERY_NULL_MESSAGE,
    STATUS_QUERY_NULL_NOLOGIN,
    STATUS_SUCCESS,
    STATUS_SUCCESS_MESSAGE
} from "./STATUS";

const POST = "POST";
const GET = "GET";
const checkStatusErrorMsg = "checkStatusErrorMsg";

export const noLoginMesssage = '您处于未登录状态。';
export const otherLoginMesssage = '该账号已在其他地方登录。';
export const isBlobFile = "isBlobFile";
export const systemErrorMsg = "系统发生异常，请与运营商联系";

export const formPost = (url, body) => {
    return request(url, body, POST, contentTypeForm, false);
};

export const formGet = (url, body) => {
    return request(url, body, GET, contentTypeForm, false);
};

export const textPost = (url, body) => {
    return request(url, body, POST, contentTypeText, false);
};
export const streamPost = (url, body) => {
    return request(url, body, POST, contentTypeForm, true);
};

export const parseJSON = (response) => {
    return response.json ? response.json() : response;
};

export const checkStatus = (response) => {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    let errorMsg;
    let isBlob = false;

    switch (response.status) {
        case 400:
            errorMsg = "服务器无法接连，请与运营商联系";
            break;
        case 404:
            errorMsg = "数据获取异常，请与运营商联系";
            break;
        case 500:
            if (response._bodyBlob) {
                isBlob = true;
                errorMsg = response._bodyBlob;
            } else if (response._bodyText) {
                if (!String(response._bodyText).includes("<html")) {
                    return JSON.parse(response._bodyText);
                } else {
                    errorMsg = systemErrorMsg;
                }
            } else {
                errorMsg = systemErrorMsg;
            }
            break;
        default:
            errorMsg = response.statusText;
    }

    return { code: isBlob ? isBlobFile : checkStatusErrorMsg, msg: errorMsg };
};

export const catchErr = (err) => {
    messageWarning("网络异常，请检查网络稳定性！");
};

export const handleResponseFun = (data, messageFun, noLoginFun) => {
    const { code, msg, data: responseData } = data;

    if (code === STATUS_SUCCESS || code === STATUS_SUCCESS_MESSAGE) {
        return responseData === undefined || responseData === null ? true : responseData;
    } else if (code === STATUS_QUERY_NULL_MESSAGE || code === STATUS_EXCEPTION_MESSAGE) {
        if (noLoginFun && (msg === noLoginMesssage || msg === otherLoginMesssage)) {
            noLoginFun(data);
        } else {
            messageFun(data);
        }
    } else if (code === STATUS_QUERY_NULL_NOLOGIN) {
        messageFun(data);
    } else if (code === isBlobFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.currentTarget.result;
            if (result.indexOf("HTTP Status 500") > -1) {
                handleResponseFun({ code: STATUS_EXCEPTION_MESSAGE, msg: systemErrorMsg }, messageFun, noLoginFun);
            } else {
                const tmpData = JSON.parse(result);
                handleResponseFun(tmpData, messageFun, noLoginFun);
            }
        };
        reader.readAsText(data.msg);
    } else {
        messageFun(data);
    }

    return null;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url
 * @param body
 * @param method
 * @param contentType
 * @param isStream
 * @return {object}
 */
const request = (url, body, method, contentType, isStream) => {
    const login = !!getAppKeyValue();
    return fetch(url, {
        body: body, method: method, headers: login && url.indexOf("/public/") === -1 ? {
            "Content-Type": contentType,
            [key_appKey]: getAppKeyValue(),
        } : {
            "Content-Type": contentType
        }
    })
        .then(checkStatus)
        .then(isStream ? (response) => response : parseJSON)
        .then((data) => {
                if (isStream) {
                    data.blob().then(blob => {
                        return (blob)
                    });
                } else {
                    return ({data})
                }
            }
        )
        .catch(catchErr);
};
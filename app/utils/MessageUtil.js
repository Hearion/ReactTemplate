'use strict';
import React from "react";
import {message, Modal, notification} from "antd";
import {SmileOutlined} from "@ant-design/icons";
const confirm = Modal.confirm;

export const notificationFun = (description) => {
    notification.open({
        message: '提示',
        description: description,
        icon: <SmileOutlined style={{color: '#108ee9'}}/>
    });
};
export const notificationWarningFun = (description) => {
    notification["warning"]({
        message: '提示',
        description: description,
    });
};
export const notificationErrorFun = (description) => {
    notification["error"]({
        message: '提示',
        description: description,
    });
};
export const notificationSuccessFun = (description) => {
    notification["success"]({
        message: '提示',
        description: description,
    });
};
export const messageError = (msg) => {
    message.error(msg);
};

export const messageWarning = (msg) => {
    message.warning(msg);
};

const confirmBase = (content, cancelText, okText, onCancelFunction, onOkFunction) => {
    confirm({
        title: "操作提示",
        content: content,
        cancelText: cancelText,
        okText: okText,
        keyboard:false,
        onCancel() {
            onCancelFunction ? onCancelFunction() : null;
        },
        onOk() {
            onOkFunction ? onOkFunction() : null;
        },
    });
};

export const confirmLeftDelect = (content, onOk) => {
    confirmBase(content, "删除", "取消", onOk, null);
};

export const confirmYes = (content, onOk) => {
    confirmBase(content, "确认", "取消", onOk, null);
};
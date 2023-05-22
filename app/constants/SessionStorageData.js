import {isYq} from "./ReleaseOrgan";

export const key_appKey = "appKey";
const key_loginName = "loginName";
const key_organId = "organId";
const key_topOrgan = "topOrgan";
const key_rank = "rank";
const key_fineReport = "fineReport"

const key_menus = "menus";
const key_selectedKeys = "selectedKeys";
const key_menuKey = "menuKey";
const key_identity = "identity";


export const saveAppKey = (appKey) => {
    sessionStorage.setItem(key_appKey, appKey);
};

export const saveLoginName = (loginName) => {
    sessionStorage.setItem(key_loginName, loginName);
};

export const saveOrganId = (organId) => {
    sessionStorage.setItem(key_organId, organId);
};

export const saveTopOrgan = (topOrgan) => {
    sessionStorage.setItem(key_topOrgan, topOrgan);
};

export const saveIdentity = (identity) => {
    sessionStorage.setItem(key_identity, identity);
};

export const saveRank = (rank) => {
    sessionStorage.setItem(key_rank, rank);
};

export const getLoginName = () => {
    return sessionStorage.getItem(key_loginName);
};

export const saveAppMenus = (menus) => {
    sessionStorage.setItem(key_menus, JSON.stringify(menus));
};

export const getAppKeyValue = () => {
    return sessionStorage.getItem(key_appKey);
};

export const saveFineReport = (fineReport) => {
    sessionStorage.setItem(key_fineReport, fineReport);
};

//登录用户机构id
export const getOrganId = () => {
    return sessionStorage.getItem(key_organId);
}

//登录用户是否为最大机构
export const getTopOrgan = () => {
    let topOrgan = false;
    if (sessionStorage.getItem(key_topOrgan) === "true") {
        topOrgan = true;
    }
    return topOrgan;
}

export const removeAppKeyMenus = () => {
    sessionStorage.removeItem(key_appKey);
    sessionStorage.removeItem(key_menus);
    sessionStorage.removeItem(key_selectedKeys);
    sessionStorage.removeItem(key_menuKey);
    sessionStorage.removeItem(key_topOrgan);
    sessionStorage.removeItem(key_rank);
    sessionStorage.removeItem(key_fineReport);
};
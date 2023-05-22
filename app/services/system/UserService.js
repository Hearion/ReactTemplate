'use strict';
//职业工种
import {formPost, textPost} from "../../utils/FetchUtil";
import {requestParam, urlContent} from "../ServerService";

const userUrl = urlContent + "user/";

/**
 * 获取page
 * @return '
 */
export async function queryUserPage(organId, status, pageNo, pageSize) {
    return formPost(userUrl + requestParam('queryUserPage', {organId, status, pageNo, pageSize}), null);
}

/**
 * 获取已启用的角色列表
 * @return '
 */
export async function getRoleListByAddUser() {
    return formPost(userUrl + requestParam('getRoleListByAddUser'), null);
}

/**
 * 保存
 */
export async function saveUser(userJson) {
    return textPost(userUrl + requestParam('saveUser'), userJson);
}

/**
 * 设置职业工种启用状态
 * @param userId
 * @param status 是否启用
 * @return '
 */
export async function setUserStatus(userId, status) {
    return formPost(userUrl + requestParam('setUserStatus', {userId, status}), null);
}

/**
 * 删除
 * @return '
 */
export async function delUser(userId) {
    return formPost(userUrl + requestParam('delUser', {userId}), null);
}

/**
 * POST /user/ 修改用户密码
 * @return '
 */
export async function modifyUserPass(oldPass, newPass) {
    return formPost(userUrl + requestParam('modifyUserPass', {oldPass, newPass}), null);
}

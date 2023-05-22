'use strict';
//职业工种
import {formPost, textPost} from "../../utils/FetchUtil";
import {requestParam, urlContent} from "../ServerService";

const roleUrl = urlContent + "role/";

/**
 * 获取角色page
 * @return '
 */
export async function getSysRoleByAccount(name, isPublic, isValid, pageNo, pageSize) {
    return formPost(roleUrl + requestParam('getSysRoleByAccount', {name, isPublic, isValid, pageNo, pageSize}), null);
}

/**
 * 保存
 */
export async function saveRole(jsonRole) {
    return textPost(roleUrl + requestParam('saveRole'), jsonRole);
}

/**
 * 设置启用状态
 */
export async function updateRoleValid(uuid, isValid) {
    return formPost(roleUrl + requestParam('updateRoleValid', {uuid, isValid}), null);
}

/**
 * 删除
 * @return '
 */
export async function deleteRole(uuid) {
    return formPost(roleUrl + requestParam('deleteRole', {uuid}), null);
}

/**
 * 查询当前角色的菜单按钮授权情况
 * @param roleId
 * @returns {Promise<{data: *} | void>}
 */
export async function listAllMenuButtonRole(roleId) {
    return formPost(roleUrl + requestParam('listAllMenuButtonRole', {roleId}), null);
}

/**
 * 查询某个菜单下已定义的可授权元素
 * @param roleId
 * @param menuCode
 * @returns {Promise<{data: *} | void>}
 */
export async function listDefineElementByMenu(roleId, menuCode) {
    return formPost(roleUrl + requestParam('listDefineElementByMenu', {roleId, menuCode}), null);
}

/**
 * 保存授权元素到角色
 * @param roleId
 * @param menuCode
 * @param elementCodeStr
 * @returns {Promise<{data: *} | void>}
 */
export async function saveElementRole(roleId, menuCode, elementCodeStr) {
    return formPost(roleUrl + requestParam('saveElementRole', {roleId, menuCode, elementCodeStr}), null);
}

/**
 * 清除特殊授权
 * @param roleId
 * @param menuCode
 * @returns {Promise<{data: *} | void>}
 */
export async function delElementRole(roleId, menuCode) {
    return formPost(roleUrl + requestParam('delElementRole', {roleId, menuCode}), null);
}


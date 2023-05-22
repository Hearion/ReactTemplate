'use strict';
import {formPost, textPost} from "../../utils/FetchUtil";
import {requestParam, urlContent} from "../ServerService";

const organUrl = urlContent + "organ/";

/**
 *获取机构树
 * @return '
 */
export async function getOrganListByHierarchy() {
    return formPost(organUrl + requestParam('getOrganListByHierarchy', null), null);
}

/**
 *POST /organ/ 获取机构树(全局)

 * @return '
 */
export async function getOrganList() {
    return formPost(organUrl + requestParam('getOrganList'), null);
}

/**
 * 机构新增/编辑（除了界面上的字段，还有parentId要传给我，返回状态码“200”表示成功）
 */
export async function saveOrgan(aplOrganJson) {
    return textPost(organUrl + requestParam('saveOrgan'), aplOrganJson);
}


/**
 * 删除
 * @return '
 */
export async function deleteAplOrgan(organUuid) {
    return formPost(organUrl + requestParam('deleteAplOrgan', {organUuid}), null);
}

/**
 * 查询机构详情
 * @return '
 */
export async function getAplOrganByUuid(organUuid) {
    return formPost(organUrl + requestParam('getAplOrganByUuid', {organUuid}), null);
}

/**
 * POST /organ/deleteOrganFiling删除机构的备案信息
 * @return '
 */
export async function deleteOrganFiling(organFilingId) {
    return formPost(organUrl + requestParam('deleteOrganFiling', {organFilingId}), null);
}

/**
 * 导入机构
 */
export async function importAplOrgans(jsonOrgans) {
    return textPost(organUrl + requestParam('importAplOrgans'), jsonOrgans);
}

/**
 * 查询机构树
 * 返回递归结构
 * @param name
 * @param identity
 * @param type
 * @returns {Promise<*>}
 */
export async function getAplOrganCommon(name, identity, type) {
    return formPost(organUrl + requestParam('getAplOrganCommon', {name, identity, type}), null);
}
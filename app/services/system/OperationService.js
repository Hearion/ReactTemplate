'use strict';
import {formPost, textPost} from "../../utils/FetchUtil";
import {requestParam, urlContent} from "../ServerService";

const roleUrl = urlContent + "operation/";

/**
 * 获取日志page
 * @return '
 */
export async function getSysOperationLogPage(isLogin, remark, operaType, contType, type, pageNo, pageSize) {
    return formPost(roleUrl + requestParam('getSysOperationLogPage', {isLogin, remark, operaType, contType, type, pageNo, pageSize}), null);
}

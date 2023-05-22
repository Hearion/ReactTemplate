'use strict';
import {formPost, textPost} from "../utils/FetchUtil";
import {requestParam, urlContent} from "./ServerService";

/** 
    * 机构类型：ssOrganType
    *备案省份：provinceUserType
**/
export async function mapDictCodes(keyStrs) {
    return formPost(urlContent + requestParam('mapDictCodes', {keyStrs}), null);
}

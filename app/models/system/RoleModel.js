import {responseFun} from "../../services/ServerService";
import {
    getSysRoleByAccount,
    saveRole,
    deleteRole,
    updateRoleValid,
    listAllMenuButtonRole,
    listDefineElementByMenu,
    saveElementRole, delElementRole
} from "../../services/system/RoleService";
import {createAction} from "../../utils/CommonUtils";

export default {
    namespace: 'role',
    state: {
        roleMenus: [],
        roles: []
    },
    effects: {
        * getSysRoleByAccount({payload}, {call, put}) { 
            let responseData = yield call(getSysRoleByAccount,payload.name,payload.isPublic,payload.isValid,payload.pageNo,payload.pageSize);
            if (responseData !== null) {
                let data = responseFun(responseData.data);
                if (data !== null) {
                    payload.success(data);
                }
            }
        }, * saveRole({payload}, {call, put}) {
            let responseData = yield call(saveRole, JSON.stringify(payload.data));
            if (responseData !== null) {
                let data = responseFun(responseData.data);
                if (data !== null) {
                    payload.success();
                }
            }
        }, * deleteRole({payload}, {call, put}) {
            let responseData = yield call(deleteRole, payload.uuid);
            if (responseData !== null) {
                let data = responseFun(responseData.data);
                if (data !== null) {
                    payload.success();
                }
            }
        }, * updateRoleValid({payload}, {call, put}) {
            let responseData = yield call(updateRoleValid, payload.uuid, payload.isValid);
            if (responseData !== null) {
                let data = responseFun(responseData.data);
                if (data !== null) {
                    payload.success();
                }
            }
        }, * listAllMenuButtonRole({payload}, {call, put}) { // 查询当前角色的菜单按钮授权情况
            let responseData = yield call(listAllMenuButtonRole, payload.roleId);
            if (responseData !== null) {
                let data = responseFun(responseData.data);
                if (data !== null) {
                    payload.success(data);
                }
            }
        }, * listDefineElementByMenu({payload}, {call, put}) { // 查询某个菜单下已定义的可授权元素
            let responseData = yield call(listDefineElementByMenu, payload.roleId, payload.menuCode);
            if (responseData !== null) {
                let data = responseFun(responseData.data);
                if (data !== null) {
                    payload.success(data);
                }
            }
        }, * saveElementRole({payload}, {call, put}) { // 保存授权元素到角色
            let responseData = yield call(saveElementRole, payload.roleId, payload.menuCode, payload.elementCodeStr);
            if (responseData !== null) {
                let data = responseFun(responseData.data);
                if (data !== null) {
                    payload.success(data);
                }
            }
        }, * delElementRole({payload}, {call, put}) { // 取消授权
            let responseData = yield call(delElementRole, payload.roleId, payload.menuCode);
            if (responseData !== null) {
                let data = responseFun(responseData.data);
                if (data !== null) {
                    payload.success(data);
                }
            }
        }
    },
    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload}
        }
    }
};
import {responseFun} from "../../services/ServerService";
import {queryUserPage, saveUser, delUser, setUserStatus, getRoleListByAddUser, modifyUserPass} from "../../services/system/UserService";
import {createAction} from "../../utils/CommonUtils";

export default {
    namespace: 'user',
    state: {
        roleMenus: [],
        roles: []
    },
    effects: {
        * queryUserPage({payload}, {call, put}) { 
            let responseData = yield call(queryUserPage,payload.organId,payload.status,payload.pageNo,payload.pageSize);
            if (responseData !== null) {
                let data = responseFun(responseData.data);
                if (data !== null) {
                    payload.success(data);
                }
            }
        }, * saveUser({payload}, {call, put}) {
            let responseData = yield call(saveUser, JSON.stringify(payload.data));
            if (responseData !== null) {
                let data = responseFun(responseData.data);
                if (data !== null) {
                    payload.success();
                }
            }
        }, * delUser({payload}, {call, put}) {
            let responseData = yield call(delUser, payload.userId);
            if (responseData !== null) {
                let data = responseFun(responseData.data);
                if (data !== null) {
                    payload.success();
                }
            }
        }, * setUserStatus({payload}, {call, put}) {
            let responseData = yield call(setUserStatus, payload.userId,payload.status);
            if (responseData !== null) {
                let data = responseFun(responseData.data);
                if (data !== null) {
                    payload.success();
                }
            }
        }, * getRoleListByAddUser({payload}, {call, put}) {
            let responseData = yield call(getRoleListByAddUser);
            if (responseData !== null) {
                let data = responseFun(responseData.data);
                if (data !== null) {
                    yield put(createAction("updateState")({
                        roles: data
                    }));
                }
            }
        }, * modifyUserPass({payload}, {call, put}) {
            let responseData = yield call(modifyUserPass, payload.oldPass,payload.newPass);
            if (responseData !== null) {
                let data = responseFun(responseData.data);
                if (data !== null) {
                    payload.success();
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
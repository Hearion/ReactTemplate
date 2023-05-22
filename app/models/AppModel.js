import {
    getPermissionMenu,
    getColExpertPermissionMenu,
    init,
    login,
    verification,
    check,
    logout,
    mapDictCodes,
    responseFun,
    manual,
    sysLoginAction,
    videoWebPlugin,
    queryFineReport
} from "../services/ServerService";
import {notificationFun} from "../utils/MessageUtil";
import {
    removeAppKeyMenus,
    saveAppKey,
    saveAppMenus,
    saveLoginName,
    saveOrganId,
    saveTopOrgan,
    saveRank,
    saveIdentity,
    saveFineReport,
} from "../constants/SessionStorageData";
import {windowLogin} from "../constants/RouterData";

export default {
    namespace: 'app',
    state: {
        initDefault: null,
        menuData: [],
        loginData: {},
    },
    effects: {
        * init({payload}, {call}) {
            let responseData = yield call(init);
            if (responseData !== null) {
                let data = responseFun(responseData.data);
                if (data !== null) {
                    notificationFun("操作成功。");
                }
            }
        }, * login({payload}, {call, put}) {
            let responseData = yield call(login, payload.loginAccountJson);
            if (responseData != null) {
                let data = responseFun(responseData.data);
                // if (data !== null) {
                //     yield put(createAction("updateState")({pageData: data}));
                // }
                if (data !== null) {
                    // yield put(createAction("updateState")({loginData: data}));
                    removeAppKeyMenus()
                    saveAppKey(data.appKey);
                    saveLoginName(data.nickName);
                    saveOrganId(data.organId);
                    saveTopOrgan(data.topOrgan);
                    saveIdentity(data.identity);
                    saveRank(data.rank);
                    payload.success(data);
                }
            }
        },
        * verification({payload}, {call, put}) {
            let responseData = yield call(verification, payload.verification);
            if (responseData != null) {
                let data = responseFun(responseData.data);
                // if (data !== null) {
                //     yield put(createAction("updateState")({pageData: data}));
                // }
                if (data !== null) {
                    // yield put(createAction("updateState")({loginData: data}));
                    payload.success(data);
                }
            }
        }, * check({payload}, {call, put}) {
            let responseData = yield call(check, payload.uuid, payload.phone, payload.code,);
            if (responseData != null) {
                let data = responseFun(responseData.data);
                // if (data !== null) {
                //     yield put(createAction("updateState")({pageData: data}));
                // }
                if (data !== null) {
                    // yield put(createAction("updateState")({loginData: data}));
                    removeAppKeyMenus()
                    saveAppKey(data.appKey);
                    saveLoginName(data.nickName);
                    saveOrganId(data.organId);
                    saveTopOrgan(data.topOrgan);
                    saveRank(data.rank);
                    payload.success(data);
                }
            }
        }, * getPermissionMenu({payload}, {call, put}) {
            let responseData = yield call(getPermissionMenu);
            if (responseData != null) {
                let data = responseFun(responseData.data);
                if (data !== null) {
                    saveAppMenus(data);
                    payload.success(data);
                }

            }
        }, * getColExpertPermissionMenu({payload}, {call, put}) {
            let responseData = yield call(getColExpertPermissionMenu);
            if (responseData != null) {

                let data = responseFun(responseData.data);
                if (data !== null) {
                    saveAppMenus(data);
                    payload.success(data);
                }

            }
        }, * logout({payload}, {call}) {
            let responseData = yield call(logout);
            if (responseData != null) {
                let data = responseFun(responseData.data);
                if (data !== null) {
                    windowLogin();
                }
            }
        }, * mapDictCodes({payload}, {call, put}) {
            let responseData = yield call(mapDictCodes, payload.keyStrs);
            if (responseData != null) {
                let data = responseFun(responseData.data);
                if (data !== null) {
                    payload.success(data);
                }
            }
        }, * manual({payload}, {call, put}) {
            let responseData = yield call(manual);
            if (responseData != null) {
                let data = responseFun(responseData.data);
                if (data !== null) {
                    payload.success(data);
                }
            }
        }, * sysLoginAction({payload}, {call, put}) {
            let responseData = yield call(sysLoginAction, payload.codeString);
            if (responseData != null) {
                let data = responseFun(responseData.data);
                if (data !== null) {
                    payload.success(data);
                }
            }
        }, * videoWebPlugin({payload}, {call, put}) {
            let responseData = yield call(videoWebPlugin);
            if (responseData != null) {
                let data = responseFun(responseData.data);
                if (data !== null) {
                    payload.success(data);
                }
            }
        }, * queryFineReport({payload}, {call, put}) {
            let responseData = yield call(queryFineReport,);
            if (responseData != null) {
                let data = responseFun(responseData.data);
                // if (data !== null) {
                //     yield put(createAction("updateState")({pageData: data}));
                // }
                if (data !== null) {
                    // yield put(createAction("updateState")({loginData: data}));
                    saveFineReport(data);
                    payload.success(data);
                }
            }
        },
    },

    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload}
        }
    }
};
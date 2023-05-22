import {responseFun} from "../../services/ServerService";
import {getSysOperationLogPage} from "../../services/system/OperationService";

export default {
    namespace: 'operation',
    state: {
        roleMenus: [],
        roles: []
    },
    effects: {
        * getSysOperationLogPage({payload}, {call, put}) { 
            let responseData = yield call(getSysOperationLogPage,payload.isLogin,payload.remark,payload.operaType,payload.contType,payload.type,payload.pageNo,payload.pageSize);
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
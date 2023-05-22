import {responseFun} from "../../services/ServerService";
import {
    deleteOccupationById,
    enableOccupationLevel, getEnableOccuLevelRecordPage,
    getOccupationInfo,
    getOccupationPage,
    saveOccupationAttachLevelAndDecaration
} from "../../services/system/OccuService";

export default {
    namespace: 'occupation',
    state: {},
    effects: {
        * saveOccupationAttachLevelAndDecaration({payload}, {call, put}) {
            let responseData = yield call(saveOccupationAttachLevelAndDecaration, payload.parentId, payload.occuPationJson);
            if (responseData != null) {
                let data = responseFun(responseData.data)
                if (data !== null) {
                    payload.success(data)
                }
            }
        },
        * getOccupationPage({payload}, {call, put}) {
            let responseData = yield call(getOccupationPage, payload.parentId, payload.pageNo, payload.pageSize);
            if (responseData != null) {
                let data = responseFun(responseData.data)
                if (data !== null) {
                    payload.success(data)
                }
            }
        },
        * deleteOccupationById({payload}, {call, put}) {
            let responseData = yield call(deleteOccupationById, payload.occupationId);
            if (responseData != null) {
                let data = responseFun(responseData.data)
                if (data !== null) {
                    payload.success(data)
                }
            }
        },
        * getOccupationInfo({payload}, {call, put}) {
            let responseData = yield call(getOccupationInfo, payload.occupationId);
            if (responseData != null) {
                let data = responseFun(responseData.data)
                if (data !== null) {
                    payload.success(data)
                }
            }
        },
        * enableOccupationLevel({payload}, {call, put}) {
            let responseData = yield call(enableOccupationLevel, payload.occupationId, payload.occuLevelStr, payload.enableStatus, payload.remark);
            if (responseData != null) {
                let data = responseFun(responseData.data)
                if (data !== null) {
                    payload.success(data)
                }
            }
        },
        * getEnableOccuLevelRecordPage({payload}, {call, put}) {
            let responseData = yield call(getEnableOccuLevelRecordPage, payload.majorName, payload.careerName, payload.enableStatus, payload.pageNo, payload.pageSize);
            if (responseData != null) {
                let data = responseFun(responseData.data)
                if (data !== null) {
                    payload.success(data)
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

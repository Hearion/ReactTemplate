import {responseFun} from "../../services/ServerService";
import {mapDictCodes} from "../../services/DictCodeService";
import {createAction} from "../../utils/CommonUtils";
import {
  deleteAplOrgan,
  deleteOrganFiling,
  getAplOrganByUuid,
  getOrganListByHierarchy,
  getOrganList,
  importAplOrgans,
  saveOrgan,
  getAplOrganCommon
} from "../../services/system/OrganService";

export default {
  namespace: 'organ',
  state: {
    dict: {},
    organList: [],
    organsByUuid: {},
  },
  effects: {
    * mapDictCodes({payload}, {call, put}) {
      let responseData = yield call(mapDictCodes, "ssOrganType,provinceUserType");
      if (responseData != null) {
        let data = responseFun(responseData.data);
        if (data !== null) {
          yield put(createAction("updateState")({dict: data}));
        }
      }
    }, * getOrganListByHierarchy({payload}, {call, put}) {
      let responseData = yield call(getOrganListByHierarchy);
      if (responseData !== null) {
        let data = responseFun(responseData.data);
        if (data !== null) {
          payload.success(data);
        }
      }
    }, * getOrganList({payload}, {call, put}) {
      let responseData = yield call(getOrganList);
      if (responseData !== null) {
        let data = responseFun(responseData.data);
        if (data !== null) {
          payload.success(data);
        }
      }
    }, * getAplOrganByUuid({payload}, {call, put}) {
      let responseData = yield call(getAplOrganByUuid, payload.organUuid);
      if (responseData !== null) {
        let data = responseFun(responseData.data);
        if (data !== null) {
          yield put(createAction("updateState")({
            organsByUuid: data
          }));
          if (payload.success) {
            payload.success(data);
          }
        }
      }
    }, * deleteAplOrgan({payload}, {call, put}) {
      let responseData = yield call(deleteAplOrgan, payload.organUuid);
      if (responseData !== null) {
        let data = responseFun(responseData.data);
        if (data !== null) {
          payload.success();
        }
      }
    }, *saveOrgan({payload}, {call, put}) {
      let responseData = yield call(saveOrgan, JSON.stringify(payload.aplOrganJson));
      if (responseData !== null) {
        let data = responseFun(responseData.data);
        if (data !== null) {
          payload.success();
        }
      }
    }, *deleteOrganFiling({payload}, {call, put}) {
      let responseData = yield call(deleteOrganFiling, payload.organFilingId);
      if (responseData !== null) {
        let data = responseFun(responseData.data);
        if (data !== null) {
          payload.success();
        }
      }
    }, *importAplOrgans({payload}, {call, put}) {
      let responseData = yield call(importAplOrgans, payload.jsonOrgans);
      if (responseData !== null) {
        let data = responseFun(responseData.data);
        if (data !== null) {
          payload.success();
        }
      }
    },* getAplOrganCommon({payload}, {call, put}) {
      let responseData = yield call(getAplOrganCommon, payload.name, payload.identity,payload.type);
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
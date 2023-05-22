import AppModel from "./AppModel";
import {systemModelAdd} from "./system";
export const modelAdd = (dvaApp) => {
  dvaApp.model(AppModel);
  systemModelAdd(dvaApp);
};
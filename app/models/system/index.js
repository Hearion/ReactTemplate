import OrganModel from "./OrganModel";
import RoleModel from "./RoleModel";
import UserModel from "./UserModel";
import OperationModel from "./OperationModel";

export const systemModelAdd = (dvaApp) => {
    dvaApp.model(OrganModel);
    dvaApp.model(RoleModel);
    dvaApp.model(UserModel);
    dvaApp.model(OperationModel);
};
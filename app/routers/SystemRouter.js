import React from "react";
import {Route, Switch} from "react-router-dom";
import VerifyComponent from "../components/VerifyComponent";
import RouterData from "../constants/RouterData";

import Home from "../page/Home";
import OrganPage from "../page/system/OrganPage";
import UserPage from "../page/system/UserPage";
import RolePage from "../page/system/RolePage";
import OperationPage from "../page/system/OperationPage";

const SystemRouter = () => {
    return (
        <Switch>
            <Route exact path={RouterData.home} component={VerifyComponent(Home)}/>
            {/*系统管理-机构管理*/}
            <Route exact path={RouterData.organ} component={VerifyComponent(OrganPage)}/>
            {/*系统管理-用户管理*/}
            <Route exact path={RouterData.user} component={VerifyComponent(UserPage)}/>
            {/*系统管理-角色管理*/}
            <Route exact path={RouterData.role} component={VerifyComponent(RolePage)}/>
            {/*系统管理-操作记录*/}
            <Route exact path={RouterData.operation} component={VerifyComponent(OperationPage)}/>
        </Switch>
    );
};

export default SystemRouter;
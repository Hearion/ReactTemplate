import React from "react";
import {Route, Switch} from "react-router-dom";
import LoginPage from "../page/LoginPage";
import Home from "../page/Home";
import RouterData from "../constants/RouterData";

const Routers = () => {
    return (
        <React.Fragment>
            <Switch>
                <Route exact path={RouterData.login} component={LoginPage}/>
                <Home/>
            </Switch>
        </React.Fragment>
    )
};
export default Routers;
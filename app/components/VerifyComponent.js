import React from "react";
import { getAppKeyValue } from "../constants/SessionStorageData";
import RouterData from "../constants/RouterData";

//主要用于验证未登录时，跳转到登录界面
export default function VerifyComponent(Component) {
    if (Component.VerifyComponent) {
        return Component.VerifyComponent
    }

    class AuthenticatedComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                login: false
            };
        };

        componentWillMount() {
            this.checkAuth();
        }

        componentWillReceiveProps(nextProps) {
            this.checkAuth();
        }

        checkAuth() {
            //未登陆重定向到登陆页面
            const login = getAppKeyValue() ? true : false;
            if (!login) {
                if (sessionStorage.getItem("isExpert") == "1") {
                    this.props.history.push(RouterData.expertLogin);
                } else if (sessionStorage.getItem("isExpert") == "2") {
                    this.props.history.push(RouterData.markingLogin);
                } else {
                    this.props.history.push(RouterData.login);
                }

                return;
            }
            this.setState({ login });
        }

        render() {
            return this.state.login ? <Component {...this.props} /> : null;
        }
    }
    Component.VerifyComponent = AuthenticatedComponent;
    return Component.VerifyComponent;
}
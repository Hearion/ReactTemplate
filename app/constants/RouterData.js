import {removeAppKeyMenus} from "./SessionStorageData";
import {rootPath} from "./ReleaseOrgan";

export const windowLogin = () => {
    removeAppKeyMenus();
    setTimeout(() => {
        window.location.href = window.location.origin + route_login;
    }, 50);//50毫秒后跳转
};

export const routerRoot = (path) => {
    return rootPath + path;
};

export const route_login = routerRoot("");

export default {
    login: routerRoot(""),
    home: routerRoot("home"),
    //系统管理
    organ: routerRoot("organ"),//机构管理
    user: routerRoot("user"),//用户管理
    role: routerRoot("role"),//角色管理
    operation: routerRoot("operation"),//操作记录
}

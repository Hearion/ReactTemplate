'use strict';
import "core-js/es";
import "react-app-polyfill/ie9"; // 引入兼容的版本，一般ie9就可以了
import "react-app-polyfill/stable";
import dva from "dva";
import createLoading from "dva-loading";
import { modelAdd } from "./models";
import App from "./App";
import { createBrowserHistory } from "history";
import "./styles/antd.css"
import "./assets/css/common.css";
import "./styles/compatibleAntd.css";
import "./sass/style.scss";
import "./utils/aes";

import { getDocumentTitle } from "./constants/ReleaseOrgan";

document.title = getDocumentTitle();

// 初始化dva
const app = dva({
  history: createBrowserHistory(), onError(e) {
  }
});
app.use(createLoading());//注册loading插件
modelAdd(app);// 注册 Model
app.router(App); // 注册路由表
app.start('#app'); // 启动应用
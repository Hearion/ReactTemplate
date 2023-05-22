import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Routers from "./routers/Routers";
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import 'moment/locale/zh-cn';
import moment from "moment";
moment.locale('zh-cn');

function App({ history }) {

    return (
        <BrowserRouter history={history}>
            <ConfigProvider locale={zhCN}>
                <Routers />
            </ConfigProvider>
        </BrowserRouter>
    );
}
export default App;
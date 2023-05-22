import React from "react";
import {ConfigProvider} from "antd";
import zhCN from "antd/es/locale/zh_CN";

import SystemRouter from "./SystemRouter";


const IndexRouter = () => {
    return (
        <ConfigProvider locale={zhCN}>
            <SystemRouter/>
        </ConfigProvider>
    );
};

export default IndexRouter;
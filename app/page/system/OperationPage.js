'use strict';
import React, { useState, useEffect } from "react";
import { Row, Col, Select, Button, } from 'antd';
import { connect } from "dva";
import { TitleColor } from "../../components/common/TitleColor";
import { SearchGroup } from "../../components/common/SearchGroup";
import Colors from "../../themes/Colors";
import { notificationFun } from "../../utils/MessageUtil";
import Pagination from "../../components/common/Pagination";
import { createAction } from "../../utils/CommonUtils";
import { isWk } from "../../constants/ReleaseOrgan";

const OperationPage = ({ dispatch, history }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [selectValue, setSelectValue] = useState(1);//筛选类型
    const [searchValue, setSearchValue] = useState("");//筛选参数
    const [pageData, setPageData] = useState({});
    const [pageNo, setPageNo] = useState(1);//页数
    const [pageSize, setPageSize] = useState(10);//条数
    const [isDict, setIsDict] = useState({})
    const [operaType, setOperaType] = useState('');//操作类型
    const [contType, setContType] = useState('');//操作对象
    const [isOperate, setIsOperate] = useState(true);//当前tabs

    useEffect(() => {
        dispatch(createAction('app/mapDictCodes')({
            keyStrs: "operaType,contType",
            success: (data) => {
                if (Array.isArray(data.operaType) && data.operaType.length > 0) {
                    setOperaType(data.operaType[0].value.toString())
                }
                if (Array.isArray(data.contType) && data.contType.length > 0) {
                    setContType(data.contType[0].value.toString())
                }
                setIsDict(data)
            }
        }))
        onGetSysOperationLogPage(true, searchValue, operaType, contType, selectValue, pageNo, pageSize)
    }, []);

    //选择筛选类型
    const onSelect = (value) => {
        setSelectValue(value)
    };

    //筛选参数
    const onSearch = (value) => {
        setSearchValue(value)
        setPageNo(1)
        if (selectValue == "") {
            notificationFun("请选择筛选类型")
        } else {
            onGetSysOperationLogPage(isLogin, value, operaType, contType, selectValue, 1, pageSize)
        }
    };

    //获取列表
    const onGetSysOperationLogPage = (isLogin, remark, operaType, contType, type, pageNo, pageSize) => {
        dispatch(createAction("operation/getSysOperationLogPage")({
            isLogin: isLogin,
            remark: remark,
            operaType: operaType,
            contType: contType,
            type: type,
            pageNo: pageNo,
            pageSize: pageSize,
            success: (data) => {
                if (data && data.datas && data.datas.length > 0) {
                    setPageData(data);
                } else {
                    setPageData({});
                }
            }
        }));
    };

    //分页
    const onPageChange = (page, filter) => {
        setPageNo(page.current)
        setPageSize(page.pageSize)
        onGetSysOperationLogPage(isLogin, searchValue, operaType, contType, selectValue, page.current, page.pageSize)

    };

    //登录日志
    const loginColumns = [
        { title: '姓名', dataIndex: 'userName', key: "userName" },
        { title: '登录名', dataIndex: 'loginAccount', key: "loginAccount" },
        { title: '所属机构', dataIndex: 'organName', key: "organName" },
        { title: '登录IP', dataIndex: 'ip', key: "ip" },
        { title: '登录时间', dataIndex: 'insertDate', key: "insertDate" },
        { title: '注销时间', dataIndex: 'logoutDate', key: "logoutDate",width:180 }
    ];

    //操作日志
    const operatingColumns = [
        { title: '姓名', dataIndex: 'userName', key: "userName" },
        { title: '登录名', dataIndex: 'loginAccount', key: "loginAccount" },
        { title: '所属机构', dataIndex: 'organName', key: "organName" },
        { title: '登录IP', dataIndex: 'ip', key: "ip" },
        { title: '操作内容', dataIndex: 'content', key: "content" },
        { title: '操作时间', dataIndex: 'insertDate', key: "insertDate",width:180 }
    ];

    return (
        <Row className={"flex1 box"}>
            <Col span={24}>

                <div className="title">
                    <div style={{display:'flex',height:'54px',lineHeight:'54px'}}>
                        <span onClick={() => {
                            setIsLogin(true)
                            setSelectValue(1)
                            setSearchValue("")
                            setPageNo(1)
                            setPageSize(10)
                            setOperaType(''),
                                setContType(''),
                                setIsOperate(true)
                            onGetSysOperationLogPage(true, "", "", "", "", 1, 10)
                        }} style={{ cursor: "pointer", display: "inline-block", borderBottom: isLogin ? "3px solid " + Colors.titleColor : "3px solid transparent",minWidth:'100px',textAlign:'center',marginRight:'20px' }}>
                            <TitleColor right={'0px'} color={isLogin ? Colors.titleColor : Colors.titleNoColor} fontWeight={isLogin ? Colors.titleWeight:Colors.titleNoWeight} titleName={"登录日志"} />
                        </span>
                        <span onClick={() => {
                            setIsLogin(false)
                            setSelectValue(1)
                            setSearchValue("")
                            setPageNo(1)
                            setPageSize(10)
                            setOperaType(isDict.operaType[0].value.toString()),
                                setContType(isDict.contType[0].value.toString()),
                                setIsOperate(false)
                            onGetSysOperationLogPage(false, "", "", "", "", 1, 10)

                        }} style={{ cursor: "pointer", display: "inline-block", borderBottom: !isLogin ? "3px solid " + Colors.titleColor : "3px solid transparent",minWidth:'100px',textAlign:'center',marginRight:'20px' }}>
                            <TitleColor right={'0px'} color={!isLogin ? Colors.titleColor : Colors.titleNoColor} fontWeight={!isLogin ?  Colors.titleWeight:Colors.titleNoWeight} titleName={"操作日志"} />
                        </span>
                    </div>
                        <SearchGroup childType={selectValue} childName={searchValue} searchList={[{ value: 1, text: "姓名" }, { value: 2, text: "登录名" }, { value: 3, text: "所属机构" }, { value: 4, text: "登录IP" }, { value: 5, text: "操作内容" }]} onSearchValue={(value) => onSearch(value)} onSelectValue={(value) => onSelect(value)} />
                </div>

                {isWk && !isOperate &&
                    <div style={{ width: 520, display: "inline-block", position: "relative", top: "-5px" }}>

                        <Select value={contType} onChange={(e) => { setContType(e) }} style={{ width: 120 }}>
                            {isDict.contType && Array.isArray(isDict.contType) && isDict.contType.length > 0 &&
                                isDict.contType.map((item) => {
                                    return (
                                        <Option key={item.text + item.value} value={item.value.toString()}>{item.text}</Option>
                                    )
                                })

                            }
                        </Select>

                        <Select value={operaType.toString()} onChange={(e) => { setOperaType(e) }} style={{ marginLeft: 10, width: 120 }}>
                            {isDict.operaType && Array.isArray(isDict.operaType) && isDict.operaType.length > 0 &&
                                isDict.operaType.map((item) => {
                                    return (
                                        <Option key={item.text + item.value} value={item.value.toString()}>{item.text}</Option>
                                    )
                                })

                            }
                        </Select>

                        <Button style={{ marginLeft: 10 }} onClick={() => {
                            onGetSysOperationLogPage(false, "", operaType, contType, "", 1, 10)
                        }}>查询</Button>

                        <Button style={{ marginLeft: 10 }} onClick={() => {
                            setOperaType(isDict.operaType[0].value.toString()),
                                setContType(isDict.contType[0].value.toString()),
                                onGetSysOperationLogPage(false, "", "", "", "", 1, 10)
                        }}>重置</Button>
                    </div>
                }

                <div style={{ marginTop: 20 }}>
                    <Pagination serialNo={true} columns={isLogin ? loginColumns : operatingColumns} dataProvider={pageData} onChange={(page, filter) => { onPageChange(page, filter) }} pagination={true} />
                </div>
            </Col>
        </Row>
    )
}
const mapStateToProps = ({ app }) => {
    return { initDefault: app.initDefault }
};

export default connect(mapStateToProps)(OperationPage);

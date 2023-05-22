'use strict';
import React, {useEffect, useState} from "react";
import {TreeClass} from "../../components/common/Tree";
import {connect} from "dva";
import {TitleColor} from "../../components/common/TitleColor";
import Colors from "../../themes/Colors";
import {Button, Col, Dropdown, Form, Input, Menu, Modal, Row, Upload, Space} from "antd";
import {
    credit4CodeReg,
    credit6CodeReg,
    creditCodeReg,
    getArrObjectByProperty,
    importExecl,
    validDate,
    validEmail,
    validPostCode,
    NoChineseReg
} from "../../utils/PrjUtils";
import {confirmLeftDelect, notificationFun, notificationWarningFun} from "../../utils/MessageUtil";
import {createAction} from "../../utils/CommonUtils";
import {DownOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {getTopOrgan, getOrganId} from "../../constants/SessionStorageData";

//机构
const organText = "序号,机构编码,机构名称,社会统一信用代码,联系人,联系邮箱,联系电话,联系手机,联系地址,传真,邮编,上级机构名称".split(",");
const organCode = "serial,code,name,creditCode,linkMan,linkEmail,linkPhone,linkManPhone,linkAddress,fax,zipCode,organName".split(",");


const formList = [
    {name: "机构编码", dataIndex: "code", required: true, message: "请输入机构编码", pattern: NoChineseReg},
    {name: "机构名称", dataIndex: "name", required: true, message: "请输入机构名称", pattern: null},
    {
        name: "社会统一信用代码",
        dataIndex: "creditCode",
        required: false,
        message: "请输入15或者18位社会统一信用代码",
        pattern: creditCodeReg
    },
    // {name: "机构英文名称", dataIndex: "englishName", required: true, message: "请输入机构英文名称", pattern: null},
    {name: "联系人", dataIndex: "linkMan", required: false, message: null, pattern: null},
    {name: "联系邮箱", dataIndex: "linkEmail", required: false, message: "请输入有效邮箱地址", pattern: validEmail},
    {name: "联系电话", dataIndex: "linkPhone", required: false, message: null, pattern: null},
    {name: "联系手机", dataIndex: "linkManPhone", required: false, message: null, pattern: null},
    {name: "联系地址", dataIndex: "linkAddress", required: false, message: null, pattern: null},
    {name: "传真", dataIndex: "fax", required: false, message: null, pattern: null},
    {name: "邮编", dataIndex: "zipCode", required: false, message: "请输入6位邮政编码", pattern: validPostCode},
    // {name:"联系人职务", dataIndex:"linkPost", required:false, message:null, pattern:null},
    // {name: "报名点", dataIndex: "enrollPoint", required: false, message: null, pattern: null},
];

const recordList = [
    {name: "机构备案编码", dataIndex: "filingCode", required: false, message: null, pattern: null},
    {name: "机构类型", dataIndex: "organType", required: false, message: "请选择机构类型", pattern: null},
    {
        name: "评价机构代码",
        dataIndex: "evaluateOrganCode",
        required: false,
        message: "请输入4位评价机构代码",
        pattern: credit4CodeReg
    },
    {name: "备案地", dataIndex: "provinceCode", required: false, message: null, pattern: null},
    {
        name: "备案号",
        dataIndex: "evaluateOrganSequence",
        required: false,
        message: "请输入6位备案号",
        pattern: credit6CodeReg
    },
    {name: "备案开始时间", dataIndex: "evaluateDate", required: false, message: null, pattern: null},
    {name: "备案结束时间", dataIndex: "evaluateEndDate", required: false, message: null, pattern: null},
];

const OrganPage = ({dispatch, organs}) => {

    const [organData, setOrganData] = useState([]);//机构数据
    const [visible, setVisible] = useState(false);//弹框
    const [isAdd, setIsAdd] = useState(true);//是否新增
    const [organUuid, setOrganUuid] = useState("");//机构uuid
    const [organId, setOrganId] = useState("");//机构id
    const [rank, setRank] = useState("");//4时不可以加下级
    const [maxOrganUuid, setMaxOrganUuid] = useState("");//最大机构uuid
    const [maxOrganId, setMaxOrganId] = useState("");//最大机构id

    useEffect(() => {
        dispatch(createAction("organ/mapDictCodes")());
        onGetOrganListByHierarchy(true)
    }, []);

    //获取机构列表
    const onGetOrganListByHierarchy = (isDetails) => {
        dispatch(createAction("organ/getOrganListByHierarchy")({
            success: (data) => {
                if (isDetails) {
                    if (data.length > 0) {
                        onGetAplOrganByUuid(data[0].uuid, data[0].id)
                        setMaxOrganUuid(data[0].uuid)
                        setMaxOrganId(data[0].id)
                        setRank(data[0].rank)
                    }
                } else {
                    onGetAplOrganByUuid(organUuid, organId)
                }
                setOrganData(data)
            }
        }));
    };

    //保存机构
    const onCreate = (values) => {
        let aplOrganJson = {};
        if (values.organFilingJson.length) {
            aplOrganJson.organFilingJson = values.organFilingJson;

        }
        for (let i = 0; i < formList.length; i++) {
            aplOrganJson[formList[i].dataIndex] = values[formList[i].dataIndex];
        }
        if (isAdd) {
            aplOrganJson = (Object.assign(aplOrganJson, {parentId: organId}))
        } else {
            aplOrganJson = (Object.assign(aplOrganJson, values))
        }
        dispatch(createAction("organ/saveOrgan")({
            aplOrganJson: aplOrganJson,
            success: () => {
                onGetOrganListByHierarchy(false)
                setVisible(false);
            }
        }));
    };

    const onReFresh = () => {
        onGetOrganListByHierarchy(false)
    }

    //树形结构选中
    const onTreeSelect = (selectedKeys, e) => {
        setRank(e.node.rank)
        onGetAplOrganByUuid(e.node.uuid, e.node.id)
    };

    //机构详情
    const onGetAplOrganByUuid = (organUuid, organId) => {
        setOrganUuid(organUuid)
        setOrganId(organId)
        dispatch(createAction("organ/getAplOrganByUuid")({
            organUuid: organUuid
        }));
    };

    let importDatas = [];
    let importObjs = {};
    const onImportModel = (file) => {
        if (!file) {
            return;
        }
        if (file.name.indexOf(".xls") === -1) {
            return notificationFun(("请选择EXCEL文件上传"));
        }

        importExecl((msg) => {
            notificationFun(msg);
            importDatas = [];
            importObjs = {};
        }, file, organText, ruleOrganFun, () => {
            //查询机构树数据源
            dispatch(createAction("organ/importAplOrgans")({
                jsonOrgans: JSON.stringify(importDatas),
                success: () => {
                    notificationFun("导入成功");
                    onGetOrganListByHierarchy(false);
                }
            }));
            importDatas = [];
            importObjs = {};
        });
    };

    //考评员的验证规则
    const ruleOrganFun = (rowCnt, column, arr) => {
        let exportObj = {};
        const noBlack = [1, 2, 11];
        for (let i = 0; i < column.length; i++) {
            if (arr[i] == "" && noBlack.indexOf(i) > -1) {
                return "第" + rowCnt + "行[" + column[i] + "]不能为空";
            }
            exportObj[organCode[i]] = arr[i];
        }

        if (importObjs.hasOwnProperty(arr[1])) {
            return "第" + rowCnt + "行[" + column[1] + "]存在重复";
        }
        importDatas.push(exportObj);
        return null;
    };

    //导入时处理dict类型的数据
    const hanldeImportDict = (rowCnt, column, arr, list, exportObj, codes, i, dictValue) => {
        if (dictValue ? dictValue : arr[i]) {
            const dictObj = getArrObjectByProperty(list, "text", dictValue ? dictValue : arr[i]);
            if (!dictObj) {
                return "第" + rowCnt + "行[" + column[i] + "]填写有误";
            }
            if (dictValue) {
                return dictObj;
            } else {
                exportObj[codes[i]] = dictObj.value;
            }
        }
        return null;
    };

    const menu = (
        <Menu onClick={(e) => {
            handleMenuClick(e)
        }}>
            <Menu.Item className="organItem" key="1">
                <Upload beforeUpload={onImportModel} showUploadList={false} accept=".xlsx,.xls">
                    导入
                </Upload>
            </Menu.Item>
            <Menu.Item key="2">
                <a style={{width: "100%"}} href={"file/organPersonal.xls"} download="机构信息导入模板.xls">下载模板</a>
            </Menu.Item>
            <Menu.Item key="3">删除</Menu.Item>
        </Menu>
    );

    const handleMenuClick = (e) => {
        if (e.key == 3) {
            confirmLeftDelect("请确认是否删除", () => {
                dispatch(createAction("organ/deleteAplOrgan")({
                    organUuid: organUuid,
                    success: () => {
                        onGetAplOrganByUuid(maxOrganUuid, maxOrganId)
                        onGetOrganListByHierarchy(true)
                        // onOccupationPage(proType,proName,proValid,"",proPageNo,proPageSize);
                        notificationFun("删除成功");
                    }
                }));
            })
        }
    };

    return (
        <Row className={"flex1 box"}>
            <Col flex="300px">
                <div className="treeTitle">
                    <TitleColor titleName={"机构管理"}/>
                </div>
                <div className="treeDiv">
                    <TreeClass onSelect={onTreeSelect} selectedKeys={organUuid} dataProvider={organData}/>
                </div>
            </Col>

            <Col style={{paddingLeft: 20, flex: "1 1",}}>
                <div className="title">
                    <TitleColor titleName={"机构详情"}/>
                    <div style={{float: "right"}}>
                        <Space size={15}>
                            <Button icon={<i className="icon icon-a-button_newlyadded IconFont"></i>}
                                    disabled={organUuid == "" || rank == "4"} onClick={() => {
                                setVisible(true)
                                setIsAdd(true)
                            }} type="primary">增加</Button>
                            <Button icon={<i className="icon icon-button_edit IconFont"></i>} disabled={organUuid == ""}
                                    onClick={() => {
                                        setVisible(true)
                                        setIsAdd(false)
                                    }} type="primary">编辑</Button>
                            <Dropdown overlay={menu}>
                                <Button type="primary">
                                    更多 <DownOutlined/>
                                </Button>
                            </Dropdown>
                        </Space>
                        {/* <Dropdown.Button  disabled={organUuid==""} overlay={menu}>更多</Dropdown.Button> */}
                    </div>
                </div>
                <div style={{margin: '20px 0', borderCollapse: 'collapse'}}>
                    <Row style={{
                        borderTop: '1px solid #DDDDDD',
                        borderLeft: '1px solid #DDDDDD',
                        width: '95%',
                        margin: 'auto'
                    }}>
                        {formList.map((item, index) => (
                            <Col key={'formList' + index} style={{height: 77, boxSizing: 'border-box'}} span={12}>
                                <Row style={{lineHeight: '76px'}}>
                                    <Col style={{
                                        textAlign: "right",
                                        borderBottom: '1px solid #DDDDDD',
                                        boxSizing: 'border-box',
                                        backgroundColor: '#F5F5F5',
                                        color: '#666666',
                                        paddingRight: '10px',
                                        fontSize: '16px',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }} span={8}>{item.name + "："}</Col>
                                    {item.dataIndex === "enrollPoint" ?
                                        <Col style={{
                                            borderLeft: '1px solid #DDDDDD',
                                            borderRight: '1px solid #DDDDDD',
                                            borderBottom: '1px solid #DDDDDD',
                                            textAlign: "left",
                                            paddingLeft: '30px'
                                        }} title={organs.organsByUuid[item.dataIndex] ? "是" : "否"}
                                             span={16}>{organs.organsByUuid[item.dataIndex] ? "是" : "否"}</Col>
                                        :
                                        <Col style={{
                                            borderLeft: '1px solid #DDDDDD',
                                            borderRight: '1px solid #DDDDDD',
                                            borderBottom: '1px solid #DDDDDD',
                                            textAlign: "left",
                                            paddingLeft: '30px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }} title={organs.organsByUuid[item.dataIndex]}
                                             span={16}>{organs.organsByUuid[item.dataIndex]}</Col>
                                    }
                                </Row>
                            </Col>
                        ))}
                    </Row>
                    {organs.organsByUuid.organFilingJson && organs.organsByUuid.organFilingJson.length &&
                        organs.organsByUuid.organFilingJson.map((item, index) => {
                            return (
                                <Row key={'organs' + index} style={{
                                    borderTop: '1px solid #DDDDDD',
                                    borderLeft: '1px solid #DDDDDD',
                                    width: '95%',
                                    margin: 'auto',
                                    marginTop: 20
                                }}>
                                    {
                                        recordList.map((recordList) => (
                                            recordList.dataIndex == "organType" ?
                                                <Col style={{height: 77, boxSizing: 'border-box'}} span={12}>
                                                    <Row style={{lineHeight: '76px'}}>
                                                        <Col style={{
                                                            textAlign: "right",
                                                            borderBottom: '1px solid #DDDDDD',
                                                            boxSizing: 'border-box',
                                                            backgroundColor: '#F5F5F5',
                                                            color: '#666666',
                                                            paddingRight: '10px',
                                                            fontSize: '16px',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        }} span={8}>{recordList.name + "："}</Col>
                                                        <Col style={{
                                                            borderLeft: '1px solid #DDDDDD',
                                                            borderRight: '1px solid #DDDDDD',
                                                            borderBottom: '1px solid #DDDDDD',
                                                            textAlign: "left",
                                                            paddingLeft: '30px',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        }}
                                                             title={organs.dict && organs.dict.ssOrganType && item[recordList.dataIndex] ? getArrObjectByProperty(organs.dict.ssOrganType, "value", item[recordList.dataIndex]).text : null}
                                                             span={16}>{organs.dict && organs.dict.ssOrganType && item[recordList.dataIndex] ? getArrObjectByProperty(organs.dict.ssOrganType, "value", item[recordList.dataIndex]).text : null}</Col>
                                                    </Row>
                                                </Col>
                                                :
                                                recordList.dataIndex == "provinceCode" ?
                                                    <Col style={{height: 77, boxSizing: 'border-box'}} span={12}>
                                                        <Row style={{lineHeight: '76px'}}>
                                                            <Col style={{
                                                                textAlign: "right",
                                                                borderBottom: '1px solid #DDDDDD',
                                                                boxSizing: 'border-box',
                                                                backgroundColor: '#F5F5F5',
                                                                color: '#666666',
                                                                paddingRight: '10px',
                                                                fontSize: '16px',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }} span={8}>{recordList.name + "："}</Col>
                                                            <Col style={{
                                                                borderLeft: '1px solid #DDDDDD',
                                                                borderRight: '1px solid #DDDDDD',
                                                                borderBottom: '1px solid #DDDDDD',
                                                                textAlign: "left",
                                                                paddingLeft: '30px',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }}
                                                                 title={organs.dict && organs.dict.provinceUserType && item[recordList.dataIndex] ? getArrObjectByProperty(organs.dict.provinceUserType, "value", item[recordList.dataIndex]).text : null}
                                                                 span={16}>{organs.dict && organs.dict.provinceUserType && item[recordList.dataIndex] ? getArrObjectByProperty(organs.dict.provinceUserType, "value", item[recordList.dataIndex]).text : null}</Col>
                                                        </Row>
                                                    </Col>
                                                    :
                                                    <Col style={{height: 77, boxSizing: 'border-box'}} span={12}>
                                                        <Row style={{lineHeight: '76px'}}>
                                                            <Col style={{
                                                                textAlign: "right",
                                                                borderBottom: '1px solid #DDDDDD',
                                                                boxSizing: 'border-box',
                                                                backgroundColor: '#F5F5F5',
                                                                color: '#666666',
                                                                paddingRight: '10px',
                                                                fontSize: '16px',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }} span={8}>{recordList.name + "："}</Col>
                                                            <Col style={{
                                                                borderLeft: '1px solid #DDDDDD',
                                                                borderRight: '1px solid #DDDDDD',
                                                                borderBottom: '1px solid #DDDDDD',
                                                                textAlign: "left",
                                                                paddingLeft: '30px',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }} title={item[recordList.dataIndex]}
                                                                 span={16}>{item[recordList.dataIndex]}</Col>
                                                        </Row>
                                                    </Col>
                                        ))
                                    }
                                </Row>
                            )

                        })
                    }
                </div>
            </Col>

            {visible &&
                <CollectionCreateForm
                    visible={visible}
                    onCreate={onCreate}
                    onReFresh={onReFresh}
                    formData={isAdd ? {} : organs.organsByUuid}
                    isAdd={isAdd}
                    organs={organs}
                    onCancel={() => {
                        setVisible(false);
                    }}
                    dispatch={dispatch}
                />}

        </Row>
    )
}
const CollectionCreateForm = ({visible, onCreate, onReFresh, onCancel, formData, isAdd, organs, dispatch}) => {
    const [recordForm, setRecordForm] = useState(formData.organFilingJson && formData.organFilingJson.length ? formData.organFilingJson : [{
        evaluateOrganCode: "",
        provinceCode: "",
        evaluateOrganSequence: "",
        organType: ""
    }]);
    const formItemLayout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 14,
        },
    };
    const formRecordLayout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 13,
        },
    };
    const [form] = Form.useForm();
    return (
        <Modal
            open={visible}
            title={isAdd ? "增加机构" : "编辑机构"}
            onCancel={onCancel}
            width={900}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        let isCreate = true;
                        let organFilingJson = [];
                        if (recordForm.length && getTopOrgan()) {
                            for (let i = 0; i < recordForm.length; i++) {
                                if (values["evaluateOrganCode" + i] != "" && values["provinceCode" + i] != "" && values["evaluateOrganSequence" + i] != "" && values["organType" + i] != "") {
                                    if (recordForm[i].id || recordForm[i].id == 0) {
                                        organFilingJson.push({
                                            evaluateOrganCode: values["evaluateOrganCode" + i],
                                            provinceCode: values["provinceCode" + i],
                                            evaluateOrganSequence: values["evaluateOrganSequence" + i],
                                            organType: values["organType" + i],
                                            evaluateDate: values["evaluateDate" + i] ? values["evaluateDate" + i].format('YYYY-MM-DD') : "",
                                            evaluateEndDate: values["evaluateEndDate" + i] ? values["evaluateEndDate" + i].format('YYYY-MM-DD') : "",
                                            id: recordForm[i].id,
                                            organId: recordForm[i].organId
                                        })
                                    } else {
                                        organFilingJson.push({
                                            evaluateOrganCode: values["evaluateOrganCode" + i],
                                            provinceCode: values["provinceCode" + i],
                                            evaluateOrganSequence: values["evaluateOrganSequence" + i],
                                            organType: values["organType" + i],
                                            evaluateDate: values["evaluateDate" + i] ? values["evaluateDate" + i].format('YYYY-MM-DD') : "",
                                            evaluateEndDate: values["evaluateEndDate" + i] ? values["evaluateEndDate" + i].format('YYYY-MM-DD') : "",
                                        })
                                    }
                                    delete values["provinceCode" + i]
                                    delete values["evaluateOrganCode" + i]
                                    delete values["evaluateOrganSequence" + i]
                                    delete values["organType" + i]
                                    delete values["evaluateDate" + i]
                                    delete values["evaluateEndDate" + i]

                                } else if (values["evaluateOrganCode" + i] == "" && values["provinceCode" + i] == "" && values["evaluateOrganSequence" + i] == "" && values["organType" + i] == "") {
                                    delete values["evaluateOrganCode" + i]
                                    delete values["provinceCode" + i]
                                    delete values["evaluateOrganSequence" + i]
                                    delete values["organType" + i]
                                    delete values["evaluateDate" + i]
                                    delete values["evaluateEndDate" + i]

                                } else {
                                    isCreate = false;
                                    notificationWarningFun("添加备案地需填写“评价机构代码，备案地，机构类型，备案号”")
                                }
                            }
                        }
                        values.organFilingJson = organFilingJson;
                        if (!isAdd) {
                            values.parentId = formData.parentId;
                            values.id = formData.id;
                            values.uuid = formData.uuid;
                            values.hierarchy = formData.hierarchy;
                            values.rank = formData.rank;
                        }
                        if (isCreate) {
                            onCreate(values);
                        }
                        //
                    })
                    .catch((info) => {
                    });
            }}
        >
            <Form form={form} {...formItemLayout}>
                <Row style={{marginBottom: 20}}>
                    {formList.map((item, index) => {
                        return (
                            <Col key={'formList2' + index} span={12}>
                                <Form.Item
                                    name={item.dataIndex}
                                    initialValue={formData[item.dataIndex] ? formData[item.dataIndex] : ""}
                                    label={item.name}
                                    rules={[
                                        {
                                            required: item.required,
                                            message: item.message,
                                            pattern: item.pattern
                                        },
                                    ]}
                                >
                                    <Input
                                        disabled={isAdd == false && item.dataIndex == "code" ? true : (isAdd == false && getOrganId() != formData.parentId && item.dataIndex == "name" && getTopOrgan() != true) ? true : false}/>
                                </Form.Item>
                            </Col>
                        )
                    })}
                </Row>

                {recordForm.length == 0 ?
                    <div style={{paddingTop: 5, top: 0, right: 0, textAlign: "right"}}>
                        <PlusCircleOutlined style={{color: Colors.enableFsColor}} onClick={() => {
                            let recordForms = [...recordForm];
                            recordForms.push({
                                evaluateOrganCode: "",
                                provinceCode: "",
                                evaluateOrganSequence: "",
                                organType: ""
                            });
                            setRecordForm(recordForms)
                        }}/>
                    </div>
                    :
                    null
                }


            </Form>
        </Modal>
    );
};
const mapStateToProps = ({organ, app}) => {
    return {organs: organ}
};

export default connect(mapStateToProps)(OrganPage);

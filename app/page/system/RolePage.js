'use strict';
import React, { useState, useEffect } from "react";
import { connect } from "dva";
import { TitleColor } from "../../components/common/TitleColor";
import Colors from "../../themes/Colors";
import { Row, Col, Button, Modal, Form, Input, Select, Dropdown, Menu, Checkbox, Tabs, Space } from "antd";
import { confirmLeftDelect, notificationWarningFun, confirmYes, notificationSuccessFun } from "../../utils/MessageUtil";
import { createAction } from "../../utils/CommonUtils";
import Pagination from "../../components/common/Pagination";
import LessPagination from "../../components/common/LessPagination";
import { listDefineElementByMenu } from "../../services/system/RoleService";
import { inArray } from "../../utils/PrjUtils";
const { TabPane } = Tabs;

// const reses = "organ,operation,personInquire,grade";
const RolePage = ({ dispatch, history }) => {


    const [visible, setVisible] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [name, setName] = useState("");//名称
    const [isPublicFilter, setIsPublicFilter] = useState("");//下级可见
    const [isValidFilter, setIsValidFilter] = useState("");//状态
    const [pageNo, setPageNo] = useState(1);//页数
    const [pageSize, setPageSize] = useState(10);//条数
    const [pageData, setPageData] = useState({});
    const [formData, setFormData] = useState({});
    const [authModal, setAuthModal] = useState(false); // 按钮授权modal控制
    const [authDataList, setAuthDataList] = useState([]); //按钮授权modal列表数据
    const [selectRoleId, setSelectRoleId] = useState(''); // 按钮授权所操作的roleId
    const [selectRoleCode, setSelectRoleCode] = useState(''); // 按钮授权所操作的code
    const [authButtonModal, setAuthButtonModal] = useState(false); // 可授权的按钮弹框
    const [authButtonData, setAuthButtonData] = useState([]); // 可授权的按钮数据

    useEffect(() => {
        onGetSysRoleByAccount(name, isPublicFilter, isValidFilter, pageNo, pageSize)
    }, []);
    const onCreate = (values) => {
        if (!isAdd) {
            values.id = formData.id;
            values.uuid = formData.uuid;
        }
        dispatch(createAction("role/saveRole")({
            data: values,
            success: () => {
                setVisible(false);
                onGetSysRoleByAccount(name, isPublicFilter, isValidFilter, pageNo, pageSize)
            }
        }));

    };

    //获取列表
    const onGetSysRoleByAccount = (name, isPublic, isValid, pageNo, pageSize) => {
        dispatch(createAction("role/getSysRoleByAccount")({
            name: name, isPublic: isPublic, isValid: isValid, pageNo: pageNo, pageSize: pageSize,
            success: (data) => {
                if (data && data.datas && data.datas.length > 0) {
                    setPageData(data);
                } else {
                    setPageData({});
                }
            }
        }));
    };
    //编辑
    const onEdit = (record) => {
        setFormData({ ...record, reses: record.reses?.split(",") })
        setIsAdd(false)
        setVisible(true)
    };

    //删除
    const onDelete = (record) => {
        confirmLeftDelect("请确认是否删除？", () => {
            dispatch(createAction("role/deleteRole")({
                uuid: record.uuid,
                success: () => {
                    onGetSysRoleByAccount(name, isPublicFilter, isValidFilter, pageNo, pageSize)
                }
            }))
        })
    }

    //职业更多选择
    const onMenuClick = (e, record) => {
        if (e.key == "启用") {
            confirmYes("请确认是否启用？", () => {
                dispatch(createAction("role/updateRoleValid")({
                    uuid: record.uuid,
                    isValid: true,
                    success: () => {
                        onGetSysRoleByAccount(name, isPublicFilter, isValidFilter, pageNo, pageSize)
                    }
                }))
            })
        } else if (e.key == "停用") {
            confirmYes("请确认是否停用？", () => {
                dispatch(createAction("role/updateRoleValid")({
                    uuid: record.uuid,
                    isValid: false,
                    success: () => {
                        onGetSysRoleByAccount(name, isPublicFilter, isValidFilter, pageNo, pageSize)
                    }
                }))
            })
        }
    };

    const onPageChange = (page, filter) => {
        let isPublic = filter.isPublic && filter.isPublic.length ? filter.isPublic[0] : "";
        let isValid = filter.isValid && filter.isValid.length ? filter.isValid[0] : "";
        setIsPublicFilter(isPublic)
        setIsValidFilter(isValid)
        setPageNo(page.current)
        setPageSize(page.pageSize)
        onGetSysRoleByAccount(name, isPublic, isValid, page.current, page.pageSize)
    };

    // 按钮授权
    const onAuth = (roleId) => {
        setAuthModal(true)
        setSelectRoleId(roleId)
        dispatch(createAction('role/listAllMenuButtonRole')({
            roleId,
            success: (data) => {
                if (data) {
                    setAuthDataList(data)
                }
            }
        }))
    }

    const onListDefineElementByMenu = (code) => {
        dispatch(createAction('role/listDefineElementByMenu')({
            roleId: selectRoleId,
            menuCode: code,
            success: (data) => {
                if (data.length > 0) {
                    setAuthButtonModal(true)
                    setSelectRoleCode(code)
                    setAuthButtonData(data)
                }
            }
        }))
    }

    const [form] = Form.useForm();

    // 提交特殊授权
    const onFinish = (data) => {
        if (data.auth.length > 0) {
            dispatch(createAction('role/saveElementRole')({
                roleId: selectRoleId,
                menuCode: selectRoleCode,
                elementCodeStr: data.auth.join(),
                success: (data) => {
                    if (data) {
                        setAuthButtonModal(false)
                        onAuth(selectRoleId)
                        return notificationSuccessFun('添加成功')
                    }
                }
            }))
        } else {
            return notificationWarningFun('没有选择授权元素')
        }
    }

    // 删除特殊授权
    const delAuth = (code) => {
        confirmYes("确定取消特殊授权吗?", () => {
            dispatch(createAction('role/delElementRole')({
                roleId: selectRoleId,
                menuCode: code,
                success: (data) => {
                    if (data) {
                        onAuth(selectRoleId)
                        return notificationSuccessFun('取消成功')
                    }
                }
            }))
        })
    }

    const columns = [
        { title: '角色名称', dataIndex: 'name', key: "name", className: "tableAlignCenter" },
        { title: '角色描述', dataIndex: 'remark', key: "remark", className: "tableAlignCenter" },
        { title: '创建人', dataIndex: 'createName', key: "createName", className: "tableAlignCenter" },
        { title: '创建日期', dataIndex: 'insertDate', key: "insertDate", className: "tableAlignCenter" },
        {
            title: '下级可见', dataIndex: 'isPublic', key: "isPublic", width: 80, className: "tableAlignCenter", filterMultiple: false, filters: [{ text: "是", value: true }, { text: "否", value: false }],
            render: (text, record, index) =>
                <div>{record.isPublic ? "是" : "否"}</div>

        },
        {
            title: '状态', dataIndex: 'isValid', key: "isValid", width: 80, className: "tableAlignCenter", filterMultiple: false, filters: [{ text: "启用", value: true }, { text: "停用", value: false }],
            render: (text, record, index) =>
                <div className={record.isValid ? "circular-0" : "circular-2"}>{record.isValid ? "启用" : "停用"}</div>

        },
        // {
        //     title: '特殊授权',
        //     align: 'center',
        //     width: '100px',
        //     render: (text, record, index) => {
        //         return (
        //             <a className="editTextColor" onClick={() => { onAuth(record.id) }}>授权</a>
        //         )
        //     }
        // },
        {
            title: '操作', dataIndex: 'operation', key: 'operation', width: 150, className: "tableAlignCenter",
            render: (text, record, index) =>
                <Space size={15}>
                    <span className={record.isEdit ? "editTextColor" : "disableTextColor"} onClick={() => {
                        if (record.isEdit) {
                            onEdit(record)
                        }
                    }}>编辑</span>

                    <span className={record.isEdit ? "editTextColor" : "disableTextColor"} onClick={() => {
                        if (record.isEdit) {
                            onDelete(record)
                        }
                    }}>删除</span>

                    {record.isEdit ?
                        <Dropdown placement="bottomCenter" overlay={
                            <Menu onClick={(e) => onMenuClick(e, record)}>
                                <Menu.Item style={{ textAlign: 'center' }} key="启用">启用</Menu.Item>
                                <Menu.Item style={{ textAlign: 'center' }} key="停用">停用</Menu.Item>

                            </Menu>
                        } trigger={['click']}>
                            <a className="editTextColor">更多</a>
                        </Dropdown>
                        :
                        <span className={"disableTextColor"}>更多</span>
                    }
                </Space>
        }
    ];

    // 按钮授权表头
    const authColumns = [
        {
            title: '菜单名称',
            dataIndex: 'name',
            key: "name",
            align: 'center'
        },
        {
            title: '按钮授权',
            dataIndex: 'elementNames',
            key: 'elementNames',
            align: 'center'
        },
        {
            title: '操作',
            width: '120px',
            align: 'center',
            render: (text, record, index) => {
                return (
                    <div>
                        <Space size={15}>
                            <span className="editTextColor" onClick={() => { onListDefineElementByMenu(record.code) }}>授权</span>
                            <span className="editTextColor" onClick={() => { delAuth(record.code) }}>撤销</span>
                        </Space>
                    </div>
                )
            }
        }
    ]

    return (
        <Row className={"flex1 box"}>
            <Col span={24}>
                <div className="title">
                    <TitleColor titleName={"角色管理"} />
                    <div style={{ float: "right", }}>
                        <Button icon={<i className="icon icon-a-button_newlyadded IconFont"></i>} onClick={() => {
                            setVisible(true)
                            setIsAdd(true)
                        }} type="primary">增加</Button>
                    </div>
                </div>
                <div style={{ marginTop: 20 }}>
                    <Pagination serialNo={true} columns={columns} dataProvider={pageData} onChange={(page, filter) => { onPageChange(page, filter) }} pagination={true} />
                </div>
            </Col>
            {visible &&
                <CollectionCreateForm
                    visible={visible}
                    onCreate={onCreate}
                    formData={isAdd ? {} : formData}
                    isAdd={isAdd}
                    onCancel={() => {
                        setVisible(false);
                    }}
                />}
            <Modal title="特殊授权" open={authModal} width={800} footer={false} centered={true} onCancel={() => { setAuthModal(false); setSelectRoleId(''); }}>
                <LessPagination serialNo={true}
                    scroll={{ y: 500 }}
                    columns={authColumns}
                    dataProvider={authDataList}
                    pagination={false}
                    onChange={(page, filters) => { }}
                />
            </Modal>
            <Modal title="授权功能选择" open={authButtonModal} width={600} centered={true} onCancel={() => { setAuthButtonModal(false); form.resetFields(); }}
                onOk={() => { form.submit() }}
            >
                <Form form={form} onFinish={onFinish}>
                    <Form.Item name="auth" label="可授权的元素" >
                        <Checkbox.Group>
                            {authButtonData.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <Checkbox value={item.elementCode} style={{ lineHeight: '32px' }}>
                                            {item.elementName}
                                        </Checkbox>
                                    </div>
                                )
                            })}
                        </Checkbox.Group>
                    </Form.Item>
                </Form>
            </Modal>
        </Row>
    )
}
const CollectionCreateForm = ({ visible, onCreate, onCancel, formData, isAdd }) => {

    const formList = [
        { name: "角色名称", dataIndex: "name", required: true, message: "请输入角色名称", pattern: null },
        { name: "角色描述", dataIndex: "remark", required: false, message: null, pattern: null },
        { name: "下级可见", dataIndex: "isPublic", required: null, message: null, pattern: null },
    ];
    const [isPublic, setIsPublic] = useState(formData.isPublic ? true : false);
    const [isChecked, setIsChecked] = useState({});
    const menuList = sessionStorage.getItem("menus") ? JSON.parse(sessionStorage.getItem("menus")) : [];
    const [activeKey, setActiveKey] = useState(menuList[0]?.code); // 激活面板的key
    const [roleList, setRoleList] = useState({});

    let menuObject = {};

    useEffect(() => {
        if (visible && formData.reses) {
            let checked = { ...isChecked }
            menuList.map((item) => {
                menuObject[item.code] = [];
                item.menuDtoList && item.menuDtoList.map((itemChild) => {
                    if (itemChild.canAddChild) {
                        itemChild.menuDtoList && itemChild.menuDtoList.map((itemChildChild) => {
                            if (itemChildChild.menuDtoList && itemChildChild.menuDtoList.length > 0) {
                                itemChildChild.menuDtoList.map((itemChildChildChild) => {
                                    if (formData.reses.indexOf(itemChildChildChild.code) != -1) {
                                        menuObject[item.code].push(itemChildChildChild.code)
                                    }

                                })
                            } else {
                                if (formData.reses.indexOf(itemChildChild.code) != -1) {
                                    menuObject[item.code].push(itemChildChild.code)
                                }
                            }

                        })
                    } else {
                        if (itemChild.code == "gradeIdentification") {
                            if (formData.reses.indexOf(itemChild.code) != -1) {
                                menuObject[item.code].push(itemChild.code)
                            }
                            itemChild.menuDtoList.map((itemChildChild) => {
                                itemChildChild.menuDtoList.map((itemChildChildChild) => {

                                    if (formData.reses.indexOf(itemChildChildChild.code) != -1) {
                                        menuObject[item.code].push(itemChildChildChild.code)
                                    }

                                    for (let i = 0; i < itemChildChild.menuDtoList.length; i++) {
                                        if (!inArray(itemChildChild.menuDtoList[i].code, menuObject[item.code])) {
                                            checked[itemChildChild.code] = false
                                            return setIsChecked({ ...checked })
                                        }
                                        checked[itemChildChild.code] = true
                                        setIsChecked({ ...checked })
                                    }
                                })
                            })

                        } else if (itemChild.menuDtoList && itemChild.menuDtoList.length > 0) {
                            itemChild.menuDtoList.map((itemChildChild) => {
                                if (formData.reses.indexOf(itemChildChild.code) != -1) {
                                    menuObject[item.code].push(itemChildChild.code)
                                }
                            })
                        } else {
                            if (formData.reses.indexOf(itemChild.code) != -1) {
                                menuObject[item.code].push(itemChild.code)
                            }
                        }
                    }
                })
            }
            )
        } else {
            let checked = { ...isChecked }
            menuList.map((item) => {
                item.menuDtoList && item.menuDtoList.map((itemChild) => {
                    if (!itemChild.canAddChild) {
                        if (itemChild.code == "gradeIdentification") {
                            itemChild.menuDtoList.map((itemChildChild) => {
                                for (let i = 0; i < itemChildChild.menuDtoList.length; i++) {
                                    checked[itemChildChild.code] = false
                                    setIsChecked({ ...checked })
                                }
                            })
                        }
                    }
                })
            })
        }
        setRoleList(menuObject)
    }, [visible])

    // if (formData.reses) {
    //     let checked = {}
    //     {
    //         menuList.map((item) => {
    //                 menuObject[item.code] = [];
    //                 item.menuDtoList && item.menuDtoList.map((itemChild) => {
    //                     if (itemChild.canAddChild) {
    //                         itemChild.menuDtoList && itemChild.menuDtoList.map((itemChildChild) => {
    //                             if (itemChildChild.menuDtoList && itemChildChild.menuDtoList.length > 0) {
    //                                 itemChildChild.menuDtoList.map((itemChildChildChild) => {
    //                                     if (formData.reses.indexOf(itemChildChildChild.code) != -1) {
    //                                         menuObject[item.code].push(itemChildChildChild.code)
    //                                     }
    //
    //                                 })
    //                             } else {
    //                                 if (formData.reses.indexOf(itemChildChild.code) != -1) {
    //                                     menuObject[item.code].push(itemChildChild.code)
    //                                 }
    //                             }
    //
    //                         })
    //                     } else {
    //                         if (itemChild.code == "gradeIdentification") {
    //                             if (formData.reses.indexOf(itemChild.code) != -1) {
    //                                 menuObject[item.code].push(itemChild.code)
    //                             }
    //                             itemChild.menuDtoList.map((itemChildChild) => {
    //                                 checked[itemChildChild.code] = false
    //                                 itemChildChild.menuDtoList.map((itemChildChildChild) => {
    //                                     if (formData.reses.indexOf(itemChildChildChild.code) != -1) {
    //                                         menuObject[item.code].push(itemChildChildChild.code)
    //                                     }
    //                                 })
    //                             })
    //
    //                         } else if (itemChild.menuDtoList && itemChild.menuDtoList.length > 0) {
    //                             itemChild.menuDtoList.map((itemChildChild) => {
    //                                 if (formData.reses.indexOf(itemChildChild.code) != -1) {
    //                                     menuObject[item.code].push(itemChildChild.code)
    //                                 }
    //                             })
    //                         } else {
    //                             if (formData.reses.indexOf(itemChild.code) != -1) {
    //                                 menuObject[item.code].push(itemChild.code)
    //                             }
    //                         }
    //                     }
    //                 })
    //             }
    //         )
    //     }
    // }

    const [isChange, setIsChange] = useState(false);

    const formItemLayout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 14,
        },
    };
    const [form] = Form.useForm();

    // 选择菜单
    const onSelectMenu = (event, topCode, code, isExam) => {

        let isIn = false
        let oldArr = roleList[topCode] ? [...roleList[topCode]] : []
        let oldIndex = ''

        roleList[topCode] && roleList[topCode].length > 0 && roleList[topCode].map((item, index) => {
            if (item === code) {
                isIn = true
                oldIndex = index
            }
        })

        if (event.target.checked) {
            if (!isIn) {
                oldArr.push(code)
            }
        } else {
            if (isIn) {
                oldArr.splice(oldIndex, 1)
            }
        }

        setIsChange(!isChange);
        setRoleList(Object.assign(roleList, { [topCode]: oldArr }))
    }

    // 选择流程
    const onProcessChange = (data, topCode, checked) => {
        let codes = roleList[topCode] ? [...roleList[topCode]] : []

        if (checked) {
            // 选中操作
            data.menuDtoList.map(item => {
                if (!inArray(item.code, codes)) {
                    codes.push(item.code)
                }
            })
            let obj = { ...isChecked }
            obj[data.code] = true
            setIsChecked({ ...obj })
        } else {
            // 取消选中
            // 双倍push使数据重复
            data.menuDtoList.map(item => {
                codes.push(item.code)
                codes.push(item.code)
            })
            // 删除重复值
            codes = codes.filter((i) => codes.indexOf(i) === codes.lastIndexOf(i))
            let obj = { ...isChecked }
            obj[data.code] = false
            setIsChecked({ ...obj })
        }
        setIsChange(!isChange);
        setRoleList(Object.assign(roleList, { [topCode]: codes }))
    }

    return (
        <Modal
            open={visible}
            title={isAdd ? "增加角色" : "编辑角色"}
            okText="确认"
            cancelText="取消"
            onCancel={onCancel}
            width={900}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        let roleAll = [];
                        for (let i in roleList) {
                            if (roleList[i].length > 0) {
                                for (let j = 0; j < roleList[i].length; j++) {
                                    roleAll.push(roleList[i][j])
                                }
                            }
                        }
                        let jsonRole = { name: values.name, remark: values.remark, isPublic: isPublic, reses: roleAll.toString() };
                        onCreate(jsonRole);

                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                {...formItemLayout}
            >
                <Row>
                    {formList.map((item) => (
                        item.dataIndex == "isPublic" ?
                            <Col span={8}>
                                <Form.Item
                                    name={item.dataIndex}
                                    label={item.name}
                                    rules={[
                                        {
                                            required: item.required,
                                            message: item.message,
                                            pattern: item.pattern
                                        },
                                    ]}
                                >
                                    <Checkbox onChange={(e) => { setIsPublic(e.target.checked) }} checked={isPublic}></Checkbox>
                                </Form.Item>
                            </Col>
                            :
                            <Col span={8}>
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
                                    <Input autoComplete="new-password" />
                                </Form.Item>
                            </Col>
                    ))}
                </Row>

                <Tabs
                    items={Array.from(menuList, (item, index) => {
                        return {
                            key: item.code,
                            label: item.name,
                            children: null,
                        }
                    })}
                    activeKey={activeKey}
                    onChange={key => setActiveKey(key)}
                >

                </Tabs>

                {menuList.map((item) => {
                    let allCheck = [];
                    if (item.canAddChild) {
                        for (let i = 0; i < item.menuDtoList.length; i++) {
                            if (item.menuDtoList[i].canAddChild) {
                                for (let j = 0; j < item.menuDtoList[i].menuDtoList.length; j++) {
                                    allCheck.push(item.menuDtoList[i].menuDtoList[j].code)
                                }
                            } else {
                                if (item.menuDtoList[i].code == "gradeIdentification") {
                                    let obj = {}
                                    for (let m = 0; m < item.menuDtoList[i].menuDtoList.length; m++) {
                                        // allCheck.push(item.menuDtoList[i].menuDtoList[m].code)

                                        obj[item.menuDtoList[i].menuDtoList[m].code] = false
                                        for (let n = 0; n < item.menuDtoList[i].menuDtoList[m].menuDtoList.length; n++) {
                                            allCheck.push(item.menuDtoList[i].menuDtoList[m].menuDtoList[n].code)
                                        }
                                    }
                                    allCheck.push(item.menuDtoList[i].code)
                                } else {
                                    allCheck.push(item.menuDtoList[i].code)
                                }

                            }
                        }
                    }
                    let checked = roleList[item.code] ? allCheck.length == roleList[item.code].length : false;
                    return (
                        <div>
                            {
                                activeKey === item.code ?
                                    <React.Fragment key={'tabChild' + item.code}>
                                        <Checkbox onChange={(e) => {
                                            if (e.target.checked) {
                                                setIsChange(!isChange);
                                                setRoleList(Object.assign(roleList, { [item.code]: allCheck }))
                                                let checked = { ...isChecked }
                                                Object.keys(checked).map(cItem => {
                                                    checked[cItem] = true
                                                })
                                                setIsChecked({ ...checked })
                                            } else {
                                                setIsChange(!isChange);
                                                setRoleList(Object.assign(roleList, { [item.code]: [] }))
                                                let checked = { ...isChecked }
                                                Object.keys(checked).map(cItem => {
                                                    checked[cItem] = false
                                                })
                                                setIsChecked({ ...checked })
                                            }
                                        }} checked={checked}>
                                            全选
                                        </Checkbox>
                                        <Checkbox.Group style={{ width: '100%' }} value={roleList[item.code]} onChange={(e) => {
                                            // setIsChange(!isChange);
                                            // setRoleList(Object.assign(roleList,{[item.code]:e}))
                                        }}>
                                            {item.menuDtoList && item.menuDtoList.map((itemChild) => {
                                                return (
                                                    itemChild.canAddChild ?
                                                        <div>
                                                            <div>{itemChild.name}</div>
                                                            {itemChild.menuDtoList && itemChild.menuDtoList.map((itemChildChild) => (
                                                                itemChildChild.menuDtoList && itemChildChild.menuDtoList.length > 0 ?
                                                                    <Space wrap={true} size={"small"}>
                                                                        <div style={{ lineHeight: "30px" }}>{itemChildChild.name}</div>
                                                                        {
                                                                            itemChildChild.menuDtoList.map((itemChildChildChild) => (
                                                                                <Checkbox style={{ width: 165, marginLeft: 29, height: 25 }} value={itemChildChildChild.code} onChange={(e) => {
                                                                                    onSelectMenu(e, item.code, itemChildChildChild.code)
                                                                                }}>{itemChildChildChild.name}</Checkbox>
                                                                            ))
                                                                        }
                                                                    </Space>
                                                                    :
                                                                    <Checkbox style={{ width: 165, marginLeft: 29, height: 25 }} value={itemChildChild.code} onChange={(e) => {
                                                                        onSelectMenu(e, item.code, itemChildChild.code)
                                                                    }}>{itemChildChild.name}</Checkbox>
                                                            ))}
                                                        </div>
                                                        :
                                                        itemChild.code == "gradeIdentification" ?
                                                            <div >
                                                                <Checkbox value={itemChild.code} onChange={(e) => {
                                                                    onSelectMenu(e, item.code, itemChild.code)
                                                                }}>{itemChild.name}</Checkbox>
                                                                {itemChild.menuDtoList && itemChild.menuDtoList.map((itemChildChild) => (
                                                                    <div style={{ marginLeft: 20 }}>
                                                                        <div style={{ lineHeight: "30px", marginTop: '10px' }}>
                                                                            {itemChildChild.name}
                                                                            {
                                                                                !isChecked[itemChildChild.code] ?
                                                                                    <span className="editTextColor" style={{ marginLeft: 15 }} onClick={() => { onProcessChange(itemChildChild, item.code, true) }}>全选</span> :
                                                                                    <span className="editTextColor" style={{ marginLeft: 15 }} onClick={() => { onProcessChange(itemChildChild, item.code, false) }}>全不选</span>
                                                                            }
                                                                        </div>
                                                                        {/*<div style={{lineHeight:"30px"}}>*/}
                                                                        {/*    <Checkbox style={{width:165,marginLeft:8}} value={itemChildChild.code} onChange={(e) => {*/}
                                                                        {/*        onProcessChange(e, itemChildChild, item.code)*/}
                                                                        {/*    }}>{itemChildChild.name}</Checkbox>*/}
                                                                        {/*</div>*/}
                                                                        <Space wrap={true} size={"small"} >
                                                                            {itemChildChild.menuDtoList && itemChildChild.menuDtoList.map((itemChildChildChild) => (
                                                                                <Checkbox style={{ width: 165, marginLeft: 29, height: 25 }} value={itemChildChildChild.code}
                                                                                          onChange={(e) => {
                                                                                              onSelectMenu(e, item.code, itemChildChildChild.code, true)
                                                                                              if (itemChildChild.menuDtoList) {
                                                                                                  for (let i = 0; i < itemChildChild.menuDtoList.length; i++) {
                                                                                                      let checked = { ...isChecked }
                                                                                                      if (!inArray(itemChildChild.menuDtoList[i].code, roleList[item.code])) {
                                                                                                          checked[itemChildChild.code] = false
                                                                                                          return setIsChecked({ ...checked })
                                                                                                      }
                                                                                                      checked[itemChildChild.code] = true
                                                                                                      setIsChecked({ ...checked })
                                                                                                  }
                                                                                              }
                                                                                          }}
                                                                                >{itemChildChildChild.name}</Checkbox>
                                                                            ))}
                                                                        </Space>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            :
                                                            itemChild.menuDtoList && itemChild.menuDtoList.length > 0 ?
                                                                <Space wrap={true} size={"small"} >
                                                                    <div>{itemChild.name}</div>
                                                                    {
                                                                        itemChild.menuDtoList.map((itemChildChild) => {
                                                                            return (
                                                                                <Checkbox style={{ width: 165, marginLeft: 29, height: 25 }} value={itemChildChild.code} onChange={(e) => {
                                                                                    onSelectMenu(e, item.code, itemChildChild.code)
                                                                                }}>{itemChildChild.name}</Checkbox>
                                                                            )
                                                                        })
                                                                    }
                                                                </Space>


                                                                :
                                                                <Checkbox style={{ width: 165, marginLeft: 29, height: 25, }} value={itemChild.code} onChange={(e) => {
                                                                    onSelectMenu(e, item.code, itemChild.code)
                                                                }}>{itemChild.name}</Checkbox>

                                                )
                                            })}
                                        </Checkbox.Group>
                                    </React.Fragment> : null
                            }
                        </div>

                    )
                })}
            </Form>
        </Modal>
    );
};
const mapStateToProps = ({ organ }) => {
    return { dict: organ.dict }
};

export default connect(mapStateToProps)(RolePage);

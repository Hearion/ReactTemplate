/**
 * Created by Administrator on 2019/7/30.
 */
'use strict';
import {Table,LocaleProvider} from 'antd';
import React,{Component} from 'react';
import PropTypes from "prop-types";
const serialNo='serialNo';

export default class Pagination extends Component{
    constructor(props){
        super(props);
        this.state={
            dataProvider:[],
            rowClassNameSerialNo:null,
            columns:[]
        }
    };
    componentWillMount(){
        let columns = [...this.props.columns];
        if(this.props.serialNo && columns[0].dataIndex!==serialNo){
            if(this.props.property){
                columns.unshift({title: "序号",dataIndex: serialNo,className:"tableAlignCenter",width:this.props.serialNoWidth?this.props.serialNoWidth:90,fixed:'left',render:(text,record,index)=><span style={{color:record[this.props.property]?"#333333":"inherit"}}>{record.serialNo}</span>});
            }else{
                columns.unshift({title: "序号",dataIndex: serialNo,className:"tableAlignCenter",width:this.props.serialNoWidth?this.props.serialNoWidth:90,fixed:'left'});
            }
        }
        let {rowClassNameSerialNo}=this.props;
        if(rowClassNameSerialNo){
            this.state.rowClassNameSerialNo=rowClassNameSerialNo;
        }
        this.setState({columns:columns});
    }
    componentWillReceiveProps(props){
        let columns = [...props.columns];
        if( props.serialNo && columns[0].dataIndex!==serialNo){
            if(props.property){
                columns.unshift({title: "序号",dataIndex: serialNo,className:"tableAlignCenter",width:this.props.serialNoWidth?this.props.serialNoWidth:90,fixed:'left',render:(text,record,index)=><span style={{color:record[props.property]?"#333333":"inherit"}}>{record.serialNo}</span>});
            }else{
                columns.unshift({title: "序号",dataIndex: serialNo,className:"tableAlignCenter",width:this.props.serialNoWidth?this.props.serialNoWidth:90,fixed:'left'});
            }
        }
        this.setState((pervState)=>{
            pervState.columns = columns;
            if(props.rowClassNameSerialNo){
                pervState.rowClassNameSerialNo=props.rowClassNameSerialNo;
            }
        })
    }
    rowSelectAction=(dataProvider)=>{
        if(this.props.pagination){
            const {datas,pageNo,pageSize} =dataProvider;
            if(this.props.serialNo && datas && datas.length>0 && this.state.columns && this.state.columns[0].dataIndex===serialNo){
                datas.map((itme,i)=>{
                    itme[serialNo]=(++i)+(pageNo-1)*(pageSize);
                });
            }else if(this.props.serialNo===false && datas && datas.length>0 && this.state.columns && this.state.columns[0].dataIndex===serialNo){
                datas.map((itme,i)=>{
                    itme[serialNo]=(++i)+(pageNo-1)*(pageSize);
                });
            }
            return datas
        }else {
            if(this.props.serialNo && dataProvider && this.state.columns && this.state.columns[0].dataIndex===serialNo){
                dataProvider.map((itme,i)=>{
                    itme[serialNo]=++i;
                });
            }else if(this.props.serialNo===false && dataProvider && this.state.columns && this.state.columns[0].dataIndex===serialNo){
                dataProvider.map((itme,i)=>{
                    itme[serialNo]=++i;
                });
            }
            return dataProvider
        }
    };

    rowClassName=(record, index)=>{
        let {pagination,dataProvider}=this.props;
        let {rowClassNameSerialNo}=this.state;
        let serialNo=null;
        if(pagination){
            if(dataProvider.datas && dataProvider.datas.length>0){
                serialNo=rowClassNameSerialNo?rowClassNameSerialNo:dataProvider.datas[0].serialNo;
            }
        }else{
            if(dataProvider && dataProvider.length>0) {
                serialNo = rowClassNameSerialNo ? rowClassNameSerialNo : dataProvider[0].serialNo;
            }
        }
        if(serialNo==record.serialNo){
            return "selectedTableStyle"
        }else{
            return ""
        }
    };
    onRowClick=(record, index, event)=>{
        this.setState({rowClassNameSerialNo:record.serialNo});
        if(this.props.onRowClick){
            this.props.onRowClick(record, index, event);
        }
    };

    render(){
        {/*serialNo 是否显示序号 columns 表头数据  selectedRowKeys 选择状态回调（必须与rowSelect连用） rowSelect 选择事件回调 dataProvider 数据源 onChange 赛选 分页 排序回调 */}
        const {dataProvider,rowSelect,selectedRowKeys,onChange,pagination,type,bordered,visible,expandedRowRender,getCheckboxProps,scroll,rowKey} =this.props;
        const rowSelection= {
            type:(type?'radio':'checkbox'),
            selectedRowKeys,
            onChange: rowSelect,
            getCheckboxProps:getCheckboxProps,

        };
        return(
            visible?
            <Table size="middle" bordered={bordered} expandedRowRender={expandedRowRender} rowClassName={this.rowClassName} rowKey={rowKey} rowSelection={rowSelect?rowSelection:null} 
                onRow={record => {
                    return {
                        onClick: e => {
                            this.onRowClick(record, record["serialNo"], e);
                        }, // 点击行
                        onDoubleClick: e => {
                        },
                        onContextMenu: e => {
                        },
                        onMouseEnter: e => {
                        }, // 鼠标移入行
                        onMouseLeave: e => {
                        },
                    };
                }}
                onChange={onChange} columns={this.state.columns} dataSource={this.rowSelectAction(dataProvider)}
                pagination={pagination?{total:dataProvider.totalCount,pageSize:dataProvider.pageSize,current:dataProvider?dataProvider.pageNo:null,showTotal:total => `共 ${total} 条`,showSizeChanger:true,pageSizeOptions:['5','10','30','50','70','100','1000']}:false} scroll={scroll}/>
                :null
        )
    }
}

Pagination.propTypes = {
    dataProvider:PropTypes.any.isRequired,
    onRowClick:PropTypes.func,
    onChange:PropTypes.func,
    rowSelect:PropTypes.func,
    selectedRowKeys:PropTypes.arrayOf(PropTypes.number),
    serialNo:PropTypes.bool,
    pagination:PropTypes.bool.isRequired,
    property:PropTypes.string,
    visible:PropTypes.bool,
    scroll:PropTypes.object,
    columns:PropTypes.arrayOf(PropTypes.object).isRequired,
    bordered:PropTypes.bool,
    rowClassNameSerialNo:PropTypes.number,
};

Pagination.defaultProps={
    visible:true,
    bordered:false,
    columns:[],
    pagination:false,
    rowKey:"serialNo"
};

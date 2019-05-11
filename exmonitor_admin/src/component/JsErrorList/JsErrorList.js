import React from 'react';
import { Table } from 'antd';
import './JsErrorList.less';

class JsErrorList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '异常信息',
                    dataIndex: 'errorMessage',
                    fixed: 'left',
                    width: 300,
                    render: (text, record, index) => {
                        return (<a href={`/#/Admin/detail?errorId=${record.id}&errorMessage=${encodeURIComponent(record.errorMessage)}&monitorId=${record.monitorId}`}>{text}</a>);
                    }
                },
                {
                    title: '页面URL',
                    align: 'center',
                    width: 300,
                    dataIndex: 'completeUrl',
                },
                {
                    title: '用户标识',
                    align: 'center',
                    width: 300,
                    dataIndex: 'customerKey',
                    render: (text, record) => {
                        return(<a href={`#/Admin/behavior?monitorId=${record.monitorId}&customerKey=${text}`}>{text}</a>);
                    },
                },
                {
                    title: '设备',
                    align: 'center',
                    width: 100,
                    dataIndex: 'deviceName',
                },
                {
                    title: '客户端IP地址',
                    align: 'center',
                    width: 100,
                    dataIndex: 'ip',
                },
                {
                    title: '国家',
                    align: 'center',
                    width: 100,
                    dataIndex: 'country',
                },
                {
                    title: '省份',
                    align: 'center',
                    width: 100,
                    dataIndex: 'province',
                },
                {
                    title: '城市',
                    align: 'center',
                    width: 100,
                    dataIndex: 'city',
                },
                {
                    title: '浏览器信息',
                    align: 'center',
                    width: 400,
                    dataIndex: 'browserInfo',
                },
                {
                    title: '发生时间',
                    align: 'center',
                    fixed: 'right',
                    width: 200,
                    dataIndex: 'createdAt',
                },
                {
                    title: '操作',
                    align: 'center',
                    fixed: 'right',
                    width: 100,
                    render: (text, record, index) => {
                        return (<a href={`/#/Admin/detail?errorId=${record.id}&errorMessage=${encodeURIComponent(record.errorMessage)}&monitorId=${record.monitorId}`}>详情</a>);
                    }
                },
            ],
            dataSource: [],
            total: 0,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.jsErrorList.jsErrorList) {
            const data = nextProps.jsErrorList.jsErrorList.map((item, index) => {
                return {
                    key: index,
                    ...item,
                }
            });
            this.setState({
                dataSource: data,
                total: nextProps.jsErrorList.total,
            });
        }
    }

    handleTableChange = (pagination) => {
        const { pageSize, current } = pagination;
        const data = {
            limit: pageSize,
            offset: (current - 1) * pageSize,
        }
        this.props.handleTableChange(data);
    }

    render () {
        const { dataSource, total, columns, limit } =this.state;
        return (
            <div className="jsErrorList">
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={{pageSize: limit, total: total,}}
                    scroll={{ x: 2150 }}
                    onChange={this.handleTableChange}
                ></Table>
            </div>
        )
    }
}

export default JsErrorList;

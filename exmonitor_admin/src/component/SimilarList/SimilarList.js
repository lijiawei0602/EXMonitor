import React from 'react';
import moment from 'moment';
import './SimilarList.less';
import { Table } from 'antd';

class SimilarList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            pageSize: 10,
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
                    dataIndex: 'happenTime',
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
            ]
        }
    }

    render () {
        console.log(this.props.similarList);
        const { pageSize, columns } = this.state;
        const dataSource = this.props.similarList.map(item => {
            return {
                key: item.id,
                ...item,
                happenTime: moment(parseInt(item.happenTime)).format('YYYY-MM-DD HH:mm:ss'),
            }
        })
        return (
            <div className="similar">
                <Table
                    className="similar-table"
                    columns={columns}
                    dataSource={dataSource}
                    scroll={{ x: 1800 }}
                    pagination={{pageSize: pageSize, total: this.props.similarList.length}}
                ></Table>
            </div>
        )
    }
}

export default SimilarList;
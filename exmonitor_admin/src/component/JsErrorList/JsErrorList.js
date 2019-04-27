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
                    render: (text, record, index) => {
                        return (<a href={`/#/Admin/detail?errorId=${record.id}&errorMessage=${encodeURIComponent(record.errorMessage)}&monitorId=${record.monitorId}`}>{text}</a>);
                    }
                },
                {
                    title: '用户标识',
                    dataIndex: 'customerKey',
                },
                {
                    title: '发生时间',
                    dataIndex: 'createdAt',
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
                    onChange={this.handleTableChange}
                ></Table>
            </div>
        )
    }
}

export default JsErrorList;

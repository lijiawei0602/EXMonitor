import React from 'react';
import moment from 'moment';
import { Timeline, Icon, Col, Row, Card } from 'antd';
import Zmage from 'react-zmage'
import './BehaviorContent.less';

class BehaviorContent extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            customerItem: {},
            startTime: '',
            endTime: '',
        }
    }

    componentWillReceiveProps (nextProps) {
        const { behaviorRecord } = nextProps;
        if (behaviorRecord.length) {
            behaviorRecord.forEach((item, index) => {
                const time = moment(new Date(Number(item.happenTime)).getTime()).format('YYYY-MM-DD HH:mm:ss');
                if (index === 0) {
                    this.setState({
                        startTime: time,
                    });
                } else if (index === behaviorRecord.length - 1) {
                    this.setState({
                        endTime: time,
                    });
                }
                if (item.uploadType === 'CUSTOMER_PV') {
                    if (!Object.keys(this.state.customerItem).length) {
                        this.setState({
                            customerItem: item,
                        });
                    }
                }
            })
        }
    }

    timeLineItem = (data) => {
        return data.map((item, index) => {
            const time = moment(new Date(Number(item.happenTime)).getTime()).format('HH:mm:ss');
            if (item.uploadType === 'CUSTOMER_PV') {
                return (
                    <Timeline.Item className="detailContent-footmark-item" key={index} dot={<Icon type="flag" style={{color: '#2c58a8', fontSize: '12px', border: '1px solid #2c58a8', padding: '5px', borderRadius: '50%'}} />}>
                        <p className="detailContent-footmark-item-topic">进入页面</p>
                        <a href={item.completeUrl}>{item.completeUrl}</a>
                        <span className="detailContent-footmark-item-time">{time}</span>
                    </Timeline.Item>
                )
            } else if (item.uploadType === 'HTTP_LOG') {
                return (
                    <Timeline.Item className="detailContent-footmark-item" key={index} dot={<Icon type="sync" style={{color: '#3fa372', fontSize: '12px', border: '1px solid #3fa372', padding: '5px', borderRadius: '50%'}} />}>
                        <p className="detailContent-footmark-item-topic">
                            ajax{item.statusResult}
                            <span style={{marginLeft: '30px', fontWeight: 'normal', fontSize: '12px'}}>{item.httpUrl}  <i style={{color: '#3fa372', marginLeft: '10px'}}>[{item.status}]</i></span>
                        </p>
                        {
                            item.statusResult === '请求返回'
                            ?
                            <div>
                                result
                                <span style={{marginLeft: '80px', fontSize: '12px'}}>{item.statusText}</span>
                            </div>
                            :
                            null
                        } 
                        <span className="detailContent-footmark-item-time">{time}</span>
                    </Timeline.Item>
                )
            } else if (item.uploadType === 'BEHAVIOR_INFO') {
                return (
                    <Timeline.Item className="detailContent-footmark-item" key={index} dot={<Icon type="user" style={{color: '#6c5fc7', fontSize: '12px', border: '1px solid #6c5fc7', padding: '5px', borderRadius: '50%'}} />}>
                        <p className="detailContent-footmark-item-topic">
                            {item.behaviorType}
                            <span style={{marginLeft: '80px', fontWeight: 'normal', fontSize: '12px'}}>
                                {item.tagName} .{item.className}
                            </span>
                        </p>
                        {
                            item.innerText
                            ?
                            <p>
                                innerText
                                <span style={{marginLeft: '50px', fontSize: '12px'}}>123{item.innerText}</span>
                            </p>
                            :
                            null
                        }
                        {
                            item.innerValue
                            ?
                            <p>
                                inputValue
                                <span style={{marginLeft: '50px', fontSize: '12px'}}>123{item.inputValue}</span>
                            </p>
                            :
                            null
                        }
                        {
                            item.placeholder === 'undefined'
                            ?
                            null
                            :
                            <p>
                                placeholder
                                <span style={{marginLeft: '50px', fontSize: '12px'}}>123{item.placeholder}</span>
                            </p>
                        }
                        <span className="detailContent-footmark-item-time">{time}</span>
                    </Timeline.Item>
                )
            } else if (item.uploadType === 'SCREEN_SHOT') {
                const imgSrc = this.byteToString(item.screenInfo.data);
                return (
                    <Timeline.Item className="detailContent-footmark-item" key={index} dot={<Icon type="user" style={{color: '#6c5fc7', fontSize: '12px', border: '1px solid #6c5fc7', padding: '5px', borderRadius: '50%'}} />}>
                        <p className="detailContent-footmark-item-topic">
                            屏幕截图
                            <span style={{color: '#1890ff', cursor: 'pointer', marginLeft: '55px', fontSize: '12px'}} onClick={this.handleShowScreenShot}>预览</span>
                        </p>
                        <div style={{fontSize: '12px'}}>
                            描述
                            <span style={{marginLeft: '90px'}}>{item.description}</span>
                        </div>
                        <span className="detailContent-footmark-item-time">{time}</span>
                        {
                                this.state.showScreenShot
                                ?
                                <div className="mark" onClick={this.handleShowScreenShot}>
                                    <Zmage src={imgSrc} alt="屏幕截图" className="detailContent-footmark-item-screenShot"/>
                                </div>
                                :
                                null
                            }
                    </Timeline.Item>
                )
            } else if (item.uploadType === 'JS_ERROR') {
                return (
                    <Timeline.Item className="detailContent-footmark-item" style={{background: '#fffcfb'}} key={index} dot={<Icon type="warning" theme="filled" style={{color: 'red', fontSize: '12px', border: '1px solid #bf2a1d', padding: '5px', borderRadius: '50%'}} />}>
                        <p className="detailContent-footmark-item-topic">
                            <span style={{color: '#bf2a1d'}}>发生错误</span>
                            <span style={{marginLeft: '55px', fontWeight: 'normal', fontSize: '12px', color: '#bf2a1d'}}>{item.errorMessage}</span>
                        </p>
                        <span className="detailContent-footmark-item-time">{time}</span>
                    </Timeline.Item>
                )
            }
        });
    }

    render () {
        const { behaviorRecord } = this.props;
        const { customerItem, startTime, endTime } = this.state;
        if (!behaviorRecord.length) return null;
        return (
            <div className="behavior-content">
                <Row>
                    <Col span={12} style={{marginRight: '3%'}}>
                        <Card title="行为记录">
                            <Timeline>
                                {this.timeLineItem(behaviorRecord)}
                            </Timeline>
                        </Card>
                    </Col>
                    <Col span={11}>
                        <Card title="用户基本信息" style={{marginBottom: '20px'}}>
                            <p>设备名称：{customerItem.deviceName}</p>
                            <p>系统版本：{customerItem.os}</p>
                            <p>网络地址：{customerItem.ip}</p>
                            <p>所在地区：{customerItem.country} {customerItem.province} {customerItem.city}</p>
                            <p>开始时间：{startTime}</p>
                            <p>结束时间：{endTime}</p>
                            <p>行为记录条数：{behaviorRecord.length}</p>
                        </Card>
                        <Card title="页面加载相关">
                            <div id="loadPageChart" style={{width: '100%', height: '300px'}}></div>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default BehaviorContent;
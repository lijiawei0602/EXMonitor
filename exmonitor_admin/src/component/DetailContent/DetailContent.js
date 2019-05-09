import React from 'react';
import moment from 'moment';
import Zmage from 'react-zmage'
import { Row, Col, Icon, Collapse, Timeline, Tabs } from 'antd';
import './DetailContent.less';
import chrome from '../../assets/chrome.png';
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

class DetailContent extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            show: true,
            showScrrenShot: false,
        }
        this.stackCodeContent = React.createRef();
    }

    analysisInfo (info) {
        const { os, browserInfo, } = info;
        let { browserName, browserVersion } = info;
        let osName = os.split(" ")[0];
        let osVersion = os.split(" ")[1];

        let browserArr = [], osVersionArr = [];
        if (osName === "web") {
            if (/Mac OS/i.test(browserInfo)) {
                osName = "Mac"
                osVersionArr = browserInfo.match(/Mac OS X [0-9_]+/g)
                osVersionArr = osVersionArr[0].split(" ")
                osVersion = osVersionArr[osVersionArr.length - 1]
            } else if (/Windows/i.test(browserInfo)) {
                osName = "Windows"
                osVersionArr = browserInfo.match(/Windows NT [0-9.]+/g)
                osVersionArr = osVersionArr[0].split(" ")
                osVersion = osVersionArr[osVersionArr.length - 1]
            }
        } else {
            if (/MicroMessenger/i.test(browserInfo)) {
                browserName = "MicroMessenger(微信)"
                browserArr = browserInfo.match(/MicroMessenger\/[0-9\.]+/g)
                browserVersion = browserArr.length ? browserArr[0].split("/")[1] : "..."
            } else if (/MQQBrowser/i.test(browserInfo)) {
                browserName = "MQQBrowser"
                browserArr = browserInfo.match(/MQQBrowser\/[0-9\.]+/g)
                browserVersion = browserArr.length ? browserArr[0].split("/")[1] : "..."
            } else if (/UCBrowser/i.test(browserInfo)) {
                browserName = "UCBrowser"
                browserArr = browserInfo.match(/UCBrowser\/[0-9\.]+/g)
                browserVersion = browserArr.length ? browserArr[0].split("/")[1] : "..."
            } else if (/QihooBrowser/i.test(browserInfo)) {
                browserName = "QihooBrowser"
                browserArr = browserInfo.match(/QihooBrowser\/[0-9\.]+/g)
                browserVersion = browserArr.length ? browserArr[0].split("/")[1] : "..."
            } else if (/CriOS/i.test(browserInfo)) {
                browserName = "CriOS(谷歌)"
                browserArr = browserInfo.match(/CriOS\/[0-9\.]+/g)
                browserVersion = browserArr.length ? browserArr[0].split("/")[1] : "..."
            } else if (/DingTalk/i.test(browserInfo)) {
                browserName = "DingTalk"
                browserArr = browserInfo.match(/DingTalk\/[0-9\.]+/g)
                browserVersion = browserArr.length ? browserArr[0].split("/")[1] : "..."
            } else {
                browserName = "Mobile UI WebView"
            }
        }
        return {
            osName,
            osVersion,
            browserName,
            browserVersion,
        }
    }

    handleStackCodeClick = () => {
        if (this.state.show) {
            this.stackCodeContent.current.style.display = 'none';
        } else {
            this.stackCodeContent.current.style.display = 'block';
        }
        this.setState({
            show: !this.state.show,
        });
    }

    componentWillUnmount () {
        this.setState({
            show: true,
        });
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

    handleShowScreenShot = (e) => {
        if (e.target.tagName.toLowerCase() === 'img') {
            return;
        }
        this.setState({
            showScreenShot: !this.state.showScreenShot,
        })
    }

    byteToString = (arr) =>  {
        if(typeof arr === 'string') {
            return arr;
        }
        var str = '',
            _arr = arr;
        for(var i = 0; i < _arr.length; i++) {
            var one = _arr[i].toString(2),
                v = one.match(/^1+?(?=0)/);
            if(v && one.length === 8) {
                var bytesLength = v[0].length;
                var store = _arr[i].toString(2).slice(7 - bytesLength);
                for(var st = 1; st < bytesLength; st++) {
                    store += _arr[st + i].toString(2).slice(2);
                }
                str += String.fromCharCode(parseInt(store, 2));
                i += bytesLength - 1;
            } else {
                str += String.fromCharCode(_arr[i]);
            }
        }
        return str;
    }

    render () {
        const info = this.props.jsErrorInfo;
        let data = {};
        if (Object.keys(info).length) {
            data = this.analysisInfo(info);
        }
        let browserIcon = null;
        if (data.browserName === 'chrome') {
            browserIcon = <img src={chrome} alt="" style={{width: '50px'}} />
        } else {
            browserIcon = <Icon type="ie" style={{color: '#1890ff'}} />
        }
        let osIcon = null;
        if (data.osName === 'android') {
            osIcon = <Icon type="android" />;
        } else if (data.osName === 'ios' || data.osName === 'Mac') {
            osIcon = <Icon type="apple" />;
        } else {
            osIcon = <Icon type="windows" />;
        }
        let deviceicon = null;
        if (info.deviceName === 'PC') {
            deviceicon = <Icon type="desktop" />;
        } else {
            deviceicon = <Icon type="mobile" />;
        }

        return (
            <div className="detailContent">
                <Row className="detailContent-icon">
                    <Col span={6} style={{ padding: '20px', display: 'flex', alignItems: 'center' }}>
                        <Icon type="cloud"  />
                        <div className="detailContent-icon-right">
                            <div>{info.ip || '未知'}</div>
                        </div>
                    </Col>
                    <Col span={6} style={{ padding: '20px', display: 'flex', alignItems: 'center' }}>
                        {browserIcon}
                        <div className="detailContent-icon-right">
                            <div>{data.browserName}</div>
                            <span>版本：{data.browserVersion || '未知'}</span>
                        </div>
                    </Col>
                    <Col span={6} style={{ padding: '20px', display: 'flex', alignItems: 'center' }}>
                        {osIcon}
                        <div className="detailContent-icon-right">
                            <div>{data.osName}</div>
                            <span>版本：{data.osVersion || '未知'}</span>
                        </div>
                    </Col>
                    <Col span={6} style={{ padding: '20px', display: 'flex', alignItems: 'center' }}>
                        {deviceicon}
                        <div className="detailContent-icon-right">
                            <div>{info.deviceName || '未知'}</div>
                        </div>
                    </Col>
                </Row>
                <Row className="detailContent-footmark">
                    <Collapse accordion bordered={false} defaultActiveKey={['1']}>
                        <Panel header="足迹" key="1">
                            <Timeline>
                                {this.timeLineItem(this.props.jsErrorTrack)}
                            </Timeline>
                        </Panel>
                    </Collapse>
                </Row>
                <Row className="detailContent-stackCode">
                    <Col>
                        <div style={{ padding: '10px' }}>
                            <h3 style={{color: '#968ba0', marginBottom: '20px'}}>
                                <Icon type="heat-map" style={{marginRight: '10px', color: 'red'}} />
                                EXCEPTION
                            </h3>
                            <Tabs>
                                <TabPane tab="异常信息" key="1">
                                    <h5 style={{fontSize: '15px'}}>{this.props.errorType}</h5>
                                    <pre style={{fontSize: '12px'}}>{this.props.errorMsg}</pre>
                                </TabPane>
                                <TabPane tab="堆栈明细" key="2">
                                    <pre style={{fontSize: '12px'}}>
                                        {this.props.errorStack}
                                    </pre>
                                </TabPane>
                            </Tabs>
                        </div>
                        <div className="detailContent-stackCode-header" onClick={this.handleStackCodeClick}>
                            {this.props.stackCodeSource}
                            &nbsp;<span>at line</span>&nbsp;
                            {this.props.stackCodeRow}
                            :
                            {this.props.stackCodeCol}
                        </div>
                        <div ref={this.stackCodeContent} className="detailContent-stackCode-content">
                            {
                                this.props.stackCodeArr.map((item, index) => {
                                    const i = this.props.stackCodeStart + index + 1;
                                    return (
                                        <pre key={index} className={i === this.props.stackCodeRow ? 'detailContent-stackCode-item highlightRow' : 'detailContent-stackCode-item'}>
                                        {`${i}.${item}`}
                                        </pre>
                                    )
                                })
                            }
                        </div> 
                    </Col>
                </Row>
            </div>
        )
    }
}
export default DetailContent;
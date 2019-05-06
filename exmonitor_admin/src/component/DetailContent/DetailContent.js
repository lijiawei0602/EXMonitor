import React from 'react';
import { Row, Col, Icon, Collapse, Timeline } from 'antd';
import './DetailContent.less';
const Panel = Collapse.Panel;

class DetailContent extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            show: true,
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

    render () {
        console.log(this.props.jsErrorInfo);
        const info = this.props.jsErrorInfo;
        let data = {};
        if (Object.keys(info).length) {
            data = this.analysisInfo(info);
        }
        console.log(data);
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
                        <Icon type="calendar" />
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
                    <Collapse accordion bordered={false}>
                        <Panel header="足迹" key="1">
                            <Timeline>
                                <Timeline.Item color="green">进入页面</Timeline.Item>
                                <Timeline.Item color="green">点击按钮</Timeline.Item>
                                <Timeline.Item color="red">发生了一个错误 noerror</Timeline.Item>
                            </Timeline>
                        </Panel>
                    </Collapse>
                </Row>
                <Row className="detailContent-stackCode">
                    <Col>
                        <div style={{ padding: '10px' }}>
                            <h3 style={{color: '#968ba0', marginBottom: '20px'}}>EXCEPTION</h3>
                            <h5 style={{fontSize: '15px'}}>{this.props.errorType}</h5>
                            <pre style={{fontSize: '12px'}}>{this.props.errorMsg}</pre>
                        </div>
                        <div className="detailContent-stackCode-header" onClick={this.handleStackCodeClick}>
                            {this.props.stackCodeSource}
                            &nbsp;<span>at line</span>&nbsp;
                            {this.props.stackCodeRow}
                            :
                            {this.props.stackCodeCol}
                        </div>
                        <div ref={this.stackCodeContent}>
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
import React from 'react';
import { Row, Col, Icon } from 'antd';
import './DetailContent.less';

class DetailContent extends React.Component {
    constructor (props) {
        super(props);
        this.state = {

        }
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
                        <Icon type="mobile" />
                        <div className="detailContent-icon-right">
                            <div>{info.deviceName || '未知'}</div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default DetailContent;
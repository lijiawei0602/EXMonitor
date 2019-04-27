import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Icon, Button, Dropdown, Menu } from 'antd';
import './Detail.less';
import actions from '../../action/index.js';

class Detail extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidMount () {
        const { dispatch } = this.props;
        let { search } = this.props.location;
        let param = {};
        search = search.slice(1);
        search.split('&').forEach(item => {
            const t = item.split('=');
            param[t[0]] = t[1];
        });
        const { errorId, monitorId, errorMessage } = param;
        const jsErrorInfoData = {
            errorId,
        }
        dispatch(actions.getJsErrorInfo(jsErrorInfoData)).then(res => {
            console.log(res);

        });
        dispatch(actions.getMailListByMonitorId({ monitorId }));

        const jsErrorInfoAffect = {
            monitorId,
            errorMsg: errorMessage,
        }
        dispatch(actions.getJsErrorInfoListAffect(jsErrorInfoAffect));
        dispatch(actions.getJsErrorInfoByMsg(jsErrorInfoAffect));
    }

    handleMenuClick = (e) => {
        const account = e.key;
        // 调用接口发送报警被容
    }

    render () {
        let { errorMessage, url, createdAt } = this.props.jsErrorInfo;
        const { count } = this.props.jsErrorInfoAffect || {};
        errorMessage = errorMessage || '';
        const errorType = errorMessage.split(':')[0];
        const errorMsg = errorMessage.split(':')[1];
        const menu = (
            <Menu onClick={this.handleMenuClick}>
                {
                    this.props.mailListMonitorId.map(item => {
                        return (
                            <Menu.Item key={item.account}>
                                <Icon type="user" />
                                {item.account}
                            </Menu.Item>
                        )
                    })
                }
            </Menu>
        );
        return (
            <div className="detail">
                <Row className="detail-header">
                    <Col span={10}>
                        <h2>{errorType}</h2>
                        <Row>
                            <span className="detail-icon"></span>
                            <span className="detail-msg">{errorMsg}</span>
                        </Row>
                        <Row style={{marginTop: '10px'}}>
                            <Icon type="link" style={{color: '#1890ff', marginRight: '10px'}} />
                            <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                        </Row>
                        <Row className="detail-header-action">
                            <Button className="detail-header-action-btn">
                                <Icon type="check-circle" />
                                <span>解决</span>
                            </Button>
                            <Button className="detail-header-action-btn">
                                <Icon type="minus-circle" />
                                <span>忽略</span>
                            </Button>
                            <Button className="detail-header-action-btn">
                                <Icon type="close-circle" />
                                <span>删除</span>
                            </Button>
                            <Dropdown overlay={menu}>
                                <Button><Icon type="usergroup-add" />派发</Button>
                            </Dropdown>
                        </Row>
                    </Col>
                    <Col span={14}>
                        <div className="detail-header-right">
                            <div className="detail-header-right-item" style={{marginTop: '20px'}}>
                                <p className="detail-header-right-item-top">
                                    {/* <Icon type="clock-circle" style={{marginRight: '5px'}} /> */}
                                    发生时间
                                </p>
                                <p className="detail-header-right-item-bottom" style={{fontSize: '15px'}}>
                                    {createdAt && createdAt.slice(0, 10)}
                                    <br />
                                    {createdAt && createdAt.slice(11)}
                                </p>
                            </div>
                            <div className="detail-header-right-item">
                                <p className="detail-header-right-item-top">发生次数</p>
                                <p className="detail-header-right-item-bottom">{this.props.jsErrorInfoMsg.length}</p>
                            </div>
                            <div className="detail-header-right-item">
                                <p className="detail-header-right-item-top">影响用户量</p>
                                <p className="detail-header-right-item-bottom">{count}</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        jsErrorInfo: state.jsError.jsErrorInfo,
        mailListMonitorId: state.mail.mailListMonitorId,
        jsErrorInfoAffect: state.jsError.jsErrorInfoAffect,
        jsErrorInfoMsg: state.jsError.jsErrorInfoMsg,
    }
}
export default connect(mapStateToProps)(Detail);
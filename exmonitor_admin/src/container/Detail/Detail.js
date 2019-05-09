import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Icon, Button, Dropdown, Menu, Modal, message, Tabs } from 'antd';
import './Detail.less';
import actions from '../../action/index.js';
import SimilarList from '../../component/SimilarList/SimilarList.js';
import DetailContent from '../../component/DetailContent/DetailContent.js';
const TabPane = Tabs.TabPane;

class Detail extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            monitorId: '',
            errorMessage: '',
            stackCodeSource: '',
            stackCodeStart: 0,
            stackCodeRow: 0,
            stackCodeCol: 0,
            stackCodeArr: [],
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
            monitorId: param.monitorId,
            errorMsg: errorMessage,
        }
        dispatch(actions.getJsErrorInfoListAffect(jsErrorInfoAffect));
        dispatch(actions.getJsErrorInfoByMsg(jsErrorInfoAffect));
        const ignoreData = {
            monitorId: param.monitorId
        };
        dispatch(actions.getIgnoreErrorList(ignoreData)).then(res => {
            const result = res.some(item => item.ignoreErrorMessage === errorMessage);
            if (result) {
                dispatch(actions.updateIgnoreError({ isIgnore: true }));
            }
        })
        dispatch(actions.getJsErrorInfoStackCode({id: errorId})).then(res => {
            if (res.type === 'origin') {
                // 后端暂未支持
                const { row, col, file } = res;
                const line = file.split('\n');

                const startRow = row - 3 > 0 ? row - 3 : 0;
                const endRow = (row + 3) >= (line.length - 1) ? (line.length - 1) : (row + 3);
                const resArr = [];
                for (let i = startRow; i <= endRow; i++) {
                    resArr.push(line[i]);
                }
                this.setState({
                    stackCodeStart: startRow,
                    stackCodeRow: row,
                    stackCodeCol: col,
                    stackCodeArr: resArr,
                });
            } else if (res.type === 'sourcemap') {
                const { row, col, file, source } = res;
                const line = file.split('\n');

                const startRow = row - 3 > 0 ? row - 3 : 0;
                const endRow = (row + 3) >= (line.length - 1) ? (line.length - 1) : (row + 3);
                const resArr = [];
                for (let i = startRow; i <= endRow; i++) {
                    resArr.push(line[i]);
                }
                this.setState({
                    stackCodeStart: startRow,
                    stackCodeRow: row,
                    stackCodeCol: col,
                    stackCodeSource: source,
                    stackCodeArr: resArr,
                });
            }
        });
        dispatch(actions.getJsErrorTrack({id: errorId}));

        this.setState({
            monitorId,
            errorMessage,
        });
    }

    componentWillUnmount () {
        const { dispatch } = this.props;
        dispatch(actions.updateIgnoreError({ isIgnore: false }));
    }

    handleResolveBtn = () => {
        const { dispatch } = this.props;
        Modal.info({
            title: '提示',
            content: (
                <div>
                    <p>是否已经修复了该异常？</p>
                </div>
            ),
            onOk: () => {
                const data = {
                    ignoreErrorMessage: this.state.errorMessage,
                    monitorId: this.state.monitorId,
                    type: 'resolve',
                }
                dispatch(actions.setIgnoreError(data)).then(res => {
                    console.log(res);
                });
            },
        });
    }

    handleIgnoreBtn = () => {
        const { dispatch } = this.props;
        Modal.info({
            title: '提示',
            content: (
                <div>
                    <p>是否已经修复了该异常？</p>
                </div>
            ),
            onOk() {
                const data = {
                    ignoreErrorMessage: this.state.errorMessage,
                    monitorId: this.state.monitorId,
                    type: 'ignore',
                }
                dispatch(actions.setIgnoreError(data)).then(res => {
                    console.log(res);
                });
            },
        });
    }

    handleMenuClick = (e) => {
        const { dispatch, currentProject } = this.props;
        const account = e.key;
        // 调用接口发送报警被容
        const data = {
            account,
            content: `<div>您好，异常监控系统监听到应用：${currentProject.projectName} 发生异常报警，请尽快查看修复，避免影响线上用户</div><br /><div>异常信息：${decodeURIComponent(this.state.errorMessage)}</div><br/ ><div>异常发生时间：${currentProject.createdAt}</div></div><br /><a href="${window.location.href}">点击查看异常详情</a>`,
        }
        dispatch(actions.dispatchMail(data)).then(res => {
            message.success(res);
        });
    }
    
    handleDeleteBtn = () => {
        Modal.warning({
            title: "提醒",
            content: "避免误操作，暂不开通删除功能",
        })
    }

    handleTabChange = (key) => {
        console.log(key);
    }

    render () {
        const { stackCodeRow, stackCodeCol, stackCodeSource, stackCodeArr, stackCodeStart } = this.state;
        let { errorMessage, completeUrl, createdAt } = this.props.jsErrorInfo;
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
                            <a href={completeUrl} target="_blank" rel="noopener noreferrer">{completeUrl}</a>
                        </Row>
                        <Row className="detail-header-action">
                            <Button
                                className="detail-header-action-btn"
                                onClick={this.handleResolveBtn}
                                disabled={this.props.isIgnore}>
                                <Icon type="check-circle" />
                                <span>解决</span>
                            </Button>
                            <Button
                                className="detail-header-action-btn"
                                onClick={this.handleIgnoreBtn}
                                disabled={this.props.isIgnore}>
                                <Icon type="minus-circle" />
                                <span>忽略</span>
                            </Button>
                            <Button
                                className="detail-header-action-btn"
                                onClick={this.handleDeleteBtn}>
                                <Icon type="close-circle" />
                                <span>删除</span>
                            </Button>
                            <Dropdown overlay={menu}>
                                <Button style={{fontSize: '12px'}}><Icon type="usergroup-add" />派发</Button>
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
                <Row className="detail-content">
                    <Tabs defaultActiveKey="detail" onChange={this.handleTabChange}>
                        <TabPane tab="详情" key="detail">
                            <DetailContent
                                errorType={errorType}
                                errorMsg={errorMsg}
                                jsErrorInfo={this.props.jsErrorInfo}
                                stackCodeStart={stackCodeStart}
                                stackCodeArr={stackCodeArr}
                                stackCodeRow={stackCodeRow}
                                stackCodeCol={stackCodeCol}
                                stackCodeSource={stackCodeSource}
                                jsErrorTrack={this.props.jsErrorTrack}/>
                        </TabPane>
                        <TabPane tab="相似" key="similar">
                            <SimilarList similarList={this.props.jsErrorInfoMsg} />
                        </TabPane>
                    </Tabs>
                </Row>
           </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        currentProject: state.project.currentProject,
        jsErrorInfo: state.jsError.jsErrorInfo,
        mailListMonitorId: state.mail.mailListMonitorId,
        jsErrorInfoAffect: state.jsError.jsErrorInfoAffect,
        jsErrorInfoMsg: state.jsError.jsErrorInfoMsg,
        isIgnore: state.ignoreError.isIgnore,
        ignoreErrorList: state.ignoreError.ignoreErrorList,
        jsErrorStackCode: state.jsError.jsErrorStackCode,
        jsErrorTrack: state.jsError.jsErrorTrack,
    }
}
export default connect(mapStateToProps)(Detail);
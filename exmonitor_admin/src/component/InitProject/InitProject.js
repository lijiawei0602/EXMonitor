import React from 'react';
import { Form, Row, Col, Input, Button, Card, message } from 'antd';
import { connect } from 'react-redux';
import copy from 'copy-to-clipboard';
import './InitProject.less';
import actions from '../../action/index.js';
const FormItem = Form.Item;




class InitProject extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            projectName: '',
            projectNameInfo: {},
            isCreate: false,
        }
    }

    handleProjectNameChange = (e) => {
        const value = e.target.value;
        this.setState({
            projectName: value,
            projectNameInfo: {},
        });
    }

    handleBtnClick = () => {
        const { dispatch, user } = this.props;
        const data = {
            userId: user.userId,
            projectName: this.state.projectName,
        }
        dispatch(actions.createProject(data)).then(res => {
            this.setState({
                isCreate: true,
            });
        }).catch(res => {
            const msg = res.message;
            this.setState({
                projectNameInfo: {
                    validateStatus: 'error',
                    hasFeedback: true,
                    help: msg,
                }
            });
        });
    }

    handleCopyClick = () => {
        const { initProject, user } = this.props;
        let obj = {
            monitorId: initProject.monitorId,
            projectName: initProject.projectName,
            userId: user.userId,
        };
        obj = JSON.stringify(obj, null, 4);
        copy(obj);
        message.success("已将参数信息复制到剪切板");
    }
    render () {
        const { projectName, projectNameInfo, isCreate,  } = this.state;
        const { initProject, user } = this.props;
        return (
            <div className="initProject">
                <Form>
                    <h3 className="initProject-header">注册项目</h3>
                    <FormItem label="项目名称" {...projectNameInfo} style={{marginTop: '20px'}}>
                        <Row>
                            <Col span={8}>
                                <Input style={{height: '40px'}} onChange={this.handleProjectNameChange}></Input>
                            </Col>
                            <Col span={3} style={{ marginLeft: '10px'}}>
                                <Button style={{width: '100%', height: '40px'}} type="primary" disabled={!projectName} onClick={this.handleBtnClick}>申请</Button>
                            </Col>
                        </Row>
                    </FormItem>
                    {
                        isCreate
                        ?
                        <FormItem style={{marginTop: '20px'}}>
                            <Card
                                onClick={this.handleCopyClick}
                                title="项目接入时携带的参数"
                                extra={<span style={{cursor: 'pointer', color: '#1890ff'}} onClick={this.handleCopyClick}>复制</span>}
                                style={{width: '500px'}}>
                                <pre>{'{'}</pre>
                                <pre>    monitorId: '{initProject.monitorId}',</pre>
                                <pre>    projectName: '{initProject.projectName}',</pre>
                                <pre>    userId: '{user.userId}',</pre>
                                <pre>{'}'}</pre>
                            </Card>
                        </FormItem>
                        :
                        null
                    }
                </Form>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.user.user,
        initProject: state.project.initProject,
    }
}
export default connect(mapStateToProps)(InitProject);
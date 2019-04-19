import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Input, Row, Col, Button, } from 'antd';
import './Create.less';
import Logo from '../../../assets/logo.png';
import action from '../../../action/index.js';

const FormItem = Form.Item;

class Create extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            userId: '',
            userIdInfo: {},
            password: '',
            passwordInfo: {},
            labelCol: {
                span: 12,
            }
        }
    }

    componentWillMount () {
        const token = sessionStorage.token;
        if (token) {
            this.props.history.push('/Admin/Home');
        }
    }
    handleUserIdChange = (e) => {
        this.setState({
            userIdInfo: {},
        });
        const value = e.target.value;
        this.setState ({
            userId: value,
        });
    }
    handlePasswordChange = (e) => {
        this.setState({
            passwordInfo: {},
        });
        const value = e.target.value;
        this.setState({
            password: value,
        });
    }
    handleCheck = () => {
        let userIdFlag = true;
        let passwordFlag = true;
        if (!this.state.userId) {
            userIdFlag = false;
            this.setState({
                userIdInfo: {
                    validateStatus: 'error',
                    hasFeedback: true,
                    help: 'userId不可为空',
                },
            });
        }
        if (!this.state.password) {
            passwordFlag = false;
            this.setState({
                passwordInfo: {
                    validateStatus: 'error',
                    hasFeedback: true,
                    help: 'password不可为空',
                }
            });
        }
        return userIdFlag && passwordFlag;
    }
    handleSubmit = () => {
        const { dispatch } = this.props;
        if (!this.handleCheck()) {
            return;
        }
        const param = {
            userId: this.state.userId,
            password: this.state.password,
        };
        dispatch(action.create(param)).then(res => {
            const token = res.data.token;
            sessionStorage.token = token;
            sessionStorage.userId = res.data.userId;
            this.props.history.push('/Admin/Home');
        });
        
    }
    handleKeyUp = (e) => {
        if (e.key === 'Enter') {
            this.handleSubmit();
        }
    }
    render () {
        const { labelCol, userId, userIdInfo, password, passwordInfo, } = this.state;
        return (
           <Form className="login">
                <Row>
                    <Col {...labelCol}>
                        <img width="100%" src={Logo} alt="" />
                    </Col>
                    <Col {...labelCol} style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '400px'}}>
                        <div className="login-topic">异常监控系统</div>
                        <FormItem label="用户名" {...userIdInfo}>
                            <Input value={userId} onChange={this.handleUserIdChange}></Input>
                        </FormItem>
                        <FormItem label="密码" {...passwordInfo}>
                            <Input type="password" value={password} onChange={this.handlePasswordChange} onKeyUp={this.handleKeyUp}></Input>
                        </FormItem>
                        <FormItem>
                            <Row>
                                <Col style={{display: 'flex', justifyContent: 'center'}}>
                                    <Button type="primary"  className="login-button" onClick={this.handleSubmit}>注册</Button>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem>
                            <Row>
                                <Col>
                                    <Link to="/User/login" style={{float: 'right'}}>返回登录</Link>
                                </Col>
                            </Row>
                        </FormItem>
                    </Col>
                </Row>
           </Form>
        )
    }
}


export default connect()(Create);
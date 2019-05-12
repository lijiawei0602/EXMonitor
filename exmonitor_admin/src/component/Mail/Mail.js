import React from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col, Select, Icon, Modal, Tag, Input, Tooltip, message, AutoComplete } from 'antd';
import './Mail.less';
import actions from '../../action/index.js';
import action from '../../action/index.js';
const InputGroup = Input.Group;
const Option = Select.Option;

class Mail extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            mailList: [],
            accountData: [],
            visible: false,
            clickIndex: 0,
            inputVisible: false,
            inputValue: '',
            dataSource: [],
        }
    }

    componentDidMount () {
        const { dispatch, user } = this.props;
        if (user) {
            dispatch(actions.getMailList(user.userId)).then(res => {
                let data = res.data.data;
                data = data.map(item => {
                    return {
                        projectName: item.projectName,
                        monitorId: item.monitorId,
                        account: item.account,
                    }
                });
                let arr = [];
                this.props.projectList && this.props.projectList.forEach((item, index) => {
                    arr[index] = {...item};
                    arr[index].account = [];
                    data.forEach(t => {
                        if (item.monitorId === t.monitorId) {
                            arr[index].projectName = t.projectName;
                            arr[index].monitorId = t.monitorId;
                            arr[index].account.push(t.account);
                        }
                    })
                })
                this.setState({
                    mailList: arr,
                });
            });
        }
    }

    componentWillReceiveProps (nextProps) {
        const { dispatch } = this.props;
        if (nextProps.user !== this.props || nextProps.mailList !== this.props.mailList) {
            dispatch(actions.getMailList(nextProps.user.userId)).then(res => {
                let data = res.data.data;
                data = data.map(item => {
                    return {
                        projectName: item.projectName,
                        monitorId: item.monitorId,
                        account: item.account,
                    }
                });
                let arr = [];
                this.props.projectList && this.props.projectList.forEach((item, index) => {
                    arr[index] = {...item};
                    arr[index].account = [];
                    data.forEach(t => {
                        if (item.monitorId === t.monitorId) {
                            arr[index].projectName = t.projectName;
                            arr[index].monitorId = t.monitorId;
                            arr[index].account.push(t.account);
                        }
                    })
                })
                this.setState({
                    mailList: arr,
                });
            });
        }
    }

    showModal = (index) => {
        this.setState({
            visible: true,
            clickIndex: index,
        });
    }

    handleOK = () => {
        this.setState({
            visible: false,
        })
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    handleTagClose = (removeTag) => {
        const { dispatch } = this.props;
        dispatch(action.deleteMail(removeTag)).then(res => {
            const accountArr = this.state.mailList[this.state.clickIndex].account.filter(tag => tag !== removeTag);
            this.state.mailList[this.state.clickIndex].account = accountArr;
            this.setState({
                mailList: this.state.mailList,
            });
        });
    }

    showInput = () => {
        this.setState({
            inputVisible: true,
            inputValue: '',
        }, () => {
            this.input.focus();
        })
    }

    handleInputChange = (value) => {
        this.setState({
            dataSource: !value || value.indexOf('@') >= 0 ? [] : [
              `${value}@gmail.com`,
              `${value}@163.com`,
              `${value}@qq.com`,
            ],
            inputValue: value,
          });
        // this.setState({
        //     inputValue: e.target.value,
        // });
    }


    handleInputConfirm = () => {
        const { dispatch, user } = this.props;
        const { inputValue, clickIndex } = this.state;
        let { mailList } = this.state;
        const mailRegex = /^([a-zA-z0-9_\-\.]+)@([a-zA-z0-9_\-\.])+\.([a-zA-Z]{2,4})$/g;
        if (!mailRegex.test(inputValue)) {
            message.error("邮箱输入格式有误");
            return;
        }
        if (inputValue && mailList[clickIndex].account.indexOf(inputValue) === -1) {
            mailList[clickIndex].account = [...mailList[clickIndex].account, inputValue];
            const data = {
                projectName: mailList[clickIndex].projectName,
                monitorId: mailList[clickIndex].monitorId,
                account: inputValue,
                userId: user.userId,
            }
            dispatch(actions.addMail(data));
        }
        this.setState({
            inputValue: '',
            inputVisible: false,
            mailList,
        });
    }

    projectOpt = () => this.props.projectList && this.props.projectList.map((item, index) => (
        <Option key={index} value={item.projectName}>{item.projectName}</Option>
    ));

    handleProjectNameChange = () => {
        
    }

    showProjectList = () => {
        return this.state.mailList.map((item, index) => {
            let accountStr = '';
            item.account.forEach((t, i) => {
                if (i !== item.account.length - 1){
                    accountStr += t + ' | ';
                } else {
                    accountStr += t;
                }
            });
            return (
                <Row className="mail-list-item" key={index}>
                    <Col span={15} style={{padding: '10px 0'}}>
                        <h4>{item.projectName}</h4>
                        <div>
                            {
                                accountStr
                                ?
                                <div>
                                    <Icon type="safety-certificate" style={{color: '#1890ff', marginRight: '5px'}} theme="filled" />
                                    {'已绑定邮箱：' + accountStr}
                                </div>
                                :
                                <div>
                                    <Icon type="warning" style={{color: 'rgb(240, 176, 16)', marginRight: '5px'}} theme="filled" />
                                    暂未绑定
                                </div>
                            }
                        </div>
                    </Col>
                    <Col span={1} className="mail-list-item-col2">
                        <span className="mail-list-item-action" onClick={() => this.showModal(index)}>修改</span>
                    </Col>
                </Row>
            )
        });
    }

    render () {
        const { visible, confirmLoading, mailList, clickIndex, inputValue, inputVisible } = this.state;
        return (
            <div className="mail">
                <div className="mail-header">
                    <h3>报警邮箱绑定</h3>
                    <div style={{color: '#1890ff', fontSize: '12px', marginBottom: '10px'}}>
                        <Icon style={{marginRight: '10px'}} type="info-circle" theme="filled" />
                        项目绑定邮箱账号后，当接入项目当日的异常数量达到设定的阈值时将发送邮件提醒
                    </div>
                </div>
                <div className="mail-list">
                    {this.showProjectList()}
                </div>
                <Modal
                    title="修改绑定邮箱"
                    visible={visible}
                    onOk={this.handleOK}
                    onCancel={this.handleCancel}
                    confirmLoading={confirmLoading}
                    footer={null}>
                    {
                        mailList.length && mailList[clickIndex].account.map((tag, index) => {
                            const isLongTag = tag.length > 20;
                            const tagELem = (
                                <Tag key={tag} closable={true} onClose={() => this.handleTagClose(tag)}>
                                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                </Tag>
                            )
                            return isLongTag ? <Tooltip title={tag} key={tag}>{tagELem}</Tooltip> : tagELem;
                        })
                    }
                    {
                        inputVisible && (
                            // <Input 
                            //     ref={(c) => this.input = c}
                            //     type="text"
                            //     size="small"
                            //     style={{width: 78}}
                            //     value={inputValue}
                            //     onChange={this.handleInputChange}
                            //     onBlur={this.handleInputConfirm}
                            //     onPressEnter={this.handleInputConfirm}
                            // />
                            <AutoComplete
                                ref={(c) => this.input = c}
                                // style={{width: 78}}
                                value={inputValue}
                                dataSource={this.state.dataSource}
                                onChange={this.handleInputChange}
                                onBlur={this.handleInputConfirm}
                                onPressEnter={this.handleInputConfirm}
                            ></AutoComplete>
                        )
                    }
                    {
                        !inputVisible && (
                            <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
                                <Icon type="plus" /> 添加邮箱
                            </Tag>
                        )
                    }
                </Modal>
            </div>
        )
    }
}

export default connect()(Mail);
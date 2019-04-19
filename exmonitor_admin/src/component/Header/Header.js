import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout, Menu, Dropdown, Icon } from 'antd';
import './Header.less'
import action from '../../action/index.js';

const { Header } = Layout;

class HeaderTop extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            projectList: [
                { projectName: '测试应用' },
                { projectName: '测试应用2' },
            ],
        }
    }

    componentWillMount () {
        const { dispatch } = this.props;
        if (!this.props.user) {
            dispatch(action.getUserInfo());
        }
    }

    projectMenu () {
        return (
            <Menu>
                {
                    this.state.projectList.map((item, index) => {
                        return (
                            <Menu.Item key={index} onClick={() => this.handleProjectChange(item.projectName)}>{item.projectName}</Menu.Item>
                        )
                    })
                }
            </Menu>
        )
    }

    userMenu () {
        return (
            <Menu>
                <Menu.Item onClick={this.handleUserPersonal}>个人中心</Menu.Item>
                <Menu.Item onClick={this.handleUserExit}>退出登录</Menu.Item>
            </Menu>
        )
    }

    handleProjectChange (projectName) {
        console.log(projectName);
    }
    handleUserExit = () => {
        sessionStorage.token = '';
        sessionStorage.userId = '';
        this.props.history.push('/User/login');
    }

    handleUserPersonal = () => {
        this.props.history.push('/Admin/info');
    }

    render () {
        const { projectList } = this.state;
        const { user } = this.props;
        return (
                <Header className="header">
                    <div>
                        <Icon type="project" style={{ fontSize: "30px", marginRight: "10px", color: '#1890ff', }} />
                        <Dropdown overlay={this.projectMenu()} trigger={['click', 'hover']}>
                            <span className="ant-dropdown-link" style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                {projectList[0].projectName}
                                <Icon type="down" />
                            </span>
                        </Dropdown>
                        <Dropdown overlay={this.userMenu()} trigger={['click', 'hover']}>
                        {
                            user ?
                                <div className="header-user">
                                    <Icon type="user" style={{marginRight: '5px'}} />
                                    <span>{user.userId}</span>
                                </div>
                            :
                            <div className="header-user">
                                <Link to="/User/login">登录</Link>
                                |
                                <Link to="/User/create">注册</Link>
                            </div>
                        }
                        </Dropdown>
                    </div>
                </Header>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.user.user,
    }
}
export default withRouter(connect(mapStateToProps)(HeaderTop));
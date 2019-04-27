import React from 'react';
import {connect} from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Layout, Menu, Dropdown, Icon } from 'antd';
import './Header.less'
import actions from '../../action/index.js';


const { Header } = Layout;

class HeaderTop extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            searchParam: {},
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
        const { monitorId, projectName } = param;
        if (monitorId && projectName) {
            dispatch(actions.switchProject({
                monitorId,
                projectName: decodeURIComponent(projectName),
            }));
        }
        this.setState({
            searchParam: param,
        });
    }

    componentWillReceiveProps (nextProps) {
        const { dispatch } = this.props;
        // 页面初始化时获取对应数据
        if (!this.state.searchParam['monitorId'] && !this.props.currentProject.projectName && nextProps.projectList && nextProps.projectList.length) {
            dispatch(actions.switchProject(nextProps.projectList[0]));
        }
    }

    projectMenu (projectList = []) {
        return (
            <Menu>
                {
                    projectList.map((item, index) => {
                        return (
                            <Menu.Item key={index} onClick={() => this.handleProjectChange(item)}>{item.projectName}</Menu.Item>
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

    handleProjectChange (projectItem) {
        const { dispatch, history } = this.props;
        history.push({
            pathname: '/Admin/home',
            search: `?monitorId=${projectItem.monitorId}&projectName=${encodeURIComponent(projectItem.projectName)}`
        });
        dispatch(actions.switchProject(projectItem));
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
        const projectList = this.props.projectList || [];
        const { user } = this.props;
        return (
                <Header className="header">
                    <div>
                        <Icon type="project" style={{ fontSize: "30px", marginRight: "10px", color: '#1890ff', }} onClick={() => this.props.history.push('/Admin/Home')}/>
                        <Dropdown overlay={this.projectMenu(projectList)} trigger={['click', 'hover']}>
                            <span className="ant-dropdown-link" style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                {
                                    Object.keys(this.props.currentProject).length ?
                                    this.props.currentProject.projectName :
                                    projectList.length ? projectList[0].projectName : ''}
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
        currentProject: state.project.currentProject,
    }
}

export default withRouter(connect(mapStateToProps)(HeaderTop));
import React from 'react';
import { connect } from 'react-redux';
import { Menu, Icon } from 'antd';
import './Info.less';
import ProjectInfo from '../../../component/ProjectInfo/ProjectInfo.js';
import InitProject from '../../../component/InitProject/InitProject.js';
import Mail from '../../../component/Mail/Mail.js';
import Sourcemap from '../../../component/Sourcemap/Sourcemap.js';

class Info extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            current: this.props.defaultSelected || 'all',
        }
    }

    handleMenuClick = (e) => {
        this.setState({
            current: e.key,
        });
    }
    
    render () {
        const { current } = this.state;
        const defaultSelectedKeys = this.props.defaultSelected  ? [this.props.defaultSelectedKeys] : ['all'];
        const { projectList, user } = this.props;
        let currentComponent;
        switch(current) {
            case 'all':
                currentComponent = (<ProjectInfo projectList={projectList} user={user}/>);
                break;
            case 'init':
                currentComponent = (<InitProject />);
                break;
            case 'mail':
                currentComponent = (<Mail projectList={projectList} user={user}/>);
                break;
            case 'sourcemap':
                currentComponent = (<Sourcemap />);
                break;
            default:
                currentComponent = null;
                break;
        }
        return (
            <div className="info">
                <Menu
                    className="info-menu"
                    defaultSelectedKeys={defaultSelectedKeys}
                    onClick={this.handleMenuClick}
                    mode="vertical">
                    <Menu.Item key="all">
                        <Icon type="appstore" />
                        项目信息
                    </Menu.Item>
                    <Menu.Item key="init">
                        <Icon type="file-protect" />
                        接入项目
                    </Menu.Item>
                    <Menu.Item key="sourcemap">
                        <Icon type="file-add" />
                        SourceMap文件
                    </Menu.Item>
                    <Menu.Item key="mail">
                        <Icon type="mail" />
                        报警绑定
                    </Menu.Item>
                </Menu>
                <div className="info-content">{currentComponent}</div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.user.user,
        projectList: state.project.projectList,
    }
}
export default connect(mapStateToProps)(Info);
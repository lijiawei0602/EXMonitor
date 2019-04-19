import React from 'react';
import { Menu, Icon } from 'antd';
import './Info.less';
import InitProject from '../../../component/InitProject/InitProject.js';
import Mail from '../../../component/Mail/Mail.js';

class Info extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            current: 'init',
        }
    }

    handleMenuClick = (e) => {
        this.setState({
            current: e.key,
        });
    }
    
    render () {
        const { current } = this.state;
        return (
            <div className="info" style={{background:'#fff'}}>
                <Menu
                    className="info-menu"
                    defaultSelectedKeys={['init']}
                    onClick={this.handleMenuClick}
                    mode="vertical">
                    <Menu.Item key="init">
                        <Icon type="file-protect" />
                        申请项目
                    </Menu.Item>
                    <Menu.Item key="mail">
                        <Icon type="mail" />
                        邮箱绑定
                    </Menu.Item>
                </Menu>
                <div className="info-content">
                    {
                        current === 'init'
                        ?
                        <InitProject></InitProject>
                        :
                        <Mail></Mail>
                    }
                </div>
            </div>
        )
    }
}

export default Info;
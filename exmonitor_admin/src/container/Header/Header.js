import React from 'react';
import { Layout, Menu, Dropdown, Icon } from 'antd';
import './Header.css'

const { Header, Content } = Layout;

class HeaderTop extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            userId: '04153080',
            projectList: [
                { projectName: '测试应用' },
                { projectName: '测试应用2' },
            ],
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

    handleProjectChange (projectName) {
        console.log(projectName);
    }

    render () {
        const { userId, projectList } = this.state;
        return (
            <Layout>
                <Header className="header">
                    <div>
                        <Icon type="project" style={{ fontSize: "30px", marginRight: "10px", color: '#1890ff', }} />
                        <Dropdown overlay={this.projectMenu()} trigger={['click', 'hover']}>
                            <span className="ant-dropdown-link" style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                {projectList[0].projectName}
                                <Icon type="down" />
                            </span>
                        </Dropdown>
                        <div className="header-user">
                            <Icon type="user" />
                            <span>{userId}</span>
                        </div>
                    </div>
                </Header>
                <Content>content</Content>
            </Layout>
        )
    }
}

export default HeaderTop;
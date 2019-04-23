import React from 'react';
import { Card, message } from 'antd';
import copy from 'copy-to-clipboard';
import './ProjectInfo.less';

class ProjectInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    handleCopyClick = (index) => {
        const { projectList, user } = this.props;
        let obj = {
            monitorId: projectList[index].monitorId,
            projectName: projectList[index].projectName,
            userId: user.userId,
        };
        obj = JSON.stringify(obj, null, 4);
        copy(obj);
        message.success('已将参数信息复制到剪切板');
    }

    showProjectInfo () {
        const { user, projectList } = this.props;
        return (projectList || []).map((item, index) => {
            return (
                <Card
                    key={index}
                    title={`${item.projectName}`}
                    onClick={() => this.handleCopyClick(index)}
                    extra={<span style={{cursor: 'pointer', color: '#1890ff'}} onClick={() => this.handleCopyClick(index)}>复制</span>}
                    hoverable={true}
                    style={{width: '440px', margin: '0 20px 20px 0', float: 'left'}}>
                    <pre>{'{'}</pre>
                    <pre>    monitorId: '{item.monitorId}',</pre>
                    <pre>    projectName: '{item.projectName}',</pre>
                    <pre>    userId: '{user && user.userId}',</pre>
                    <pre>{'}'}</pre>
                </Card>       
            )
        })
    }

    render () {
        return (
            <div className="projectInfo">
                <div className="projectInfo-header">
                    <h3>已接入项目的配置信息</h3>
                    <div className="projectInfo-header-right">
                        <div className="projectInfo-header-right-item">
                            <p className="projectInfo-header-right-item-top">项目数</p>
                            <p className="projectInfo-header-right-item-bottom">{this.props.projectList && this.props.projectList.length}</p>
                        </div>
                        <div className="projectInfo-header-right-item">
                            <p className="projectInfo-header-right-item-top">当前项目访问量</p>
                            <p className="projectInfo-header-right-item-bottom">{this.props.projectList && this.props.projectList.length}</p>
                        </div>
                    </div>
                </div>
                <div className="projectInfo-content">
                    {this.showProjectInfo()}
                </div>
            </div>
        )
    }
}

export default ProjectInfo;
import React from 'react';
import './Home.less';
import { Row, Col, Tabs } from 'antd';
const TabPane = Tabs.TabPane;

class Home extends React.Component {
    constructor (props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount () {

    }

    handleTabChange = (key) => {
        
    }

    render () {
        return (
            <div className="home">
                <Row style={{border: '1px solid #e8e8e8'}}>
                    <Col span={16}>
                        <Tabs defaultActiveKey="month" onChange={this.handleTabChange}>
                            <TabPane tab="月统计" key="month">
                                month
                            </TabPane>
                            <TabPane tab="天统计" key="day">
                                day
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Home;
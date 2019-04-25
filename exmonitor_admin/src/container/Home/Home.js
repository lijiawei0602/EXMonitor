import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Tabs, Icon } from 'antd';
import moment from 'moment'
import echarts from 'echarts';
import './Home.less';
import actions from '../../action/index.js';
import jsErrorMonthOpt from '../../chartConfig/jsErrorMonthOpt.js';
import jsErrorDayOpt from '../../chartConfig/jsErrorDayOpt';
const TabPane = Tabs.TabPane;

class Home extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            tab: '',
        }
    }

    componentDidMount () {

    }

    componentWillReceiveProps (nextProps) {
        const { dispatch } = this.props;
        if (this.props.currentProject.projectName !== nextProps.currentProject.projectName) {
            const data = {
                monitorId: nextProps.currentProject.monitorId,
                days: 30,
            }
            dispatch(actions.getJsErrorMonthList(data)).then(res => {
                const date = new Date().getTime();
                let arr = [];
                for (let i = 0; i < 30; i++) {
                    const time = date - 24 * 60 * 60 * 1000 * (29 - i);
                    arr[i] = {
                        day: moment(time).format('YYYY-MM-DD'),
                        count: 0,
                    };
                }
                arr.forEach(item => {
                    res.forEach(t => {
                        if (t.day === item.day) {
                            item.count = t.count;
                        }
                    })
                });
                const monthChart = echarts.init(document.getElementById('jsErrorMonthChart'));
                const options = jsErrorMonthOpt(arr);
                monthChart.setOption(options);
            });
            if (this.state.tab === 'day') {
                const obj = {
                    monitorId: nextProps.currentProject.monitorId,
                };
                dispatch(actions.getJsErrorDayList(obj)).then(res => {
                    const dayChart = echarts.init(document.getElementById('jsErrorDayChart'));
                    const options = jsErrorDayOpt(res);
                    dayChart.setOption(options);
                });
            }
        }
    }

    handleTabChange = (key) => {
        const { dispatch, currentProject } = this.props;
        if (key === 'day') {
            this.setState({
                tab: 'day',
            });
            if (!this.props.jsErrorDayList.length) {
                const obj = {
                    monitorId: currentProject.monitorId,
                }
                dispatch(actions.getJsErrorDayList(obj)).then(res => {
                    const dayChart = echarts.init(document.getElementById('jsErrorDayChart'));
                    const options = jsErrorDayOpt(res);
                    dayChart.setOption(options);
                });
            }
        } else {
            this.setState({
                tab: 'month',
            });
        }
    }

    render () {
        return (
            <div className="home">
                <Row style={{border: '1px solid #e8e8e8'}}>
                    <Col span={16}>
                        <Tabs defaultActiveKey="month" onChange={this.handleTabChange}>
                            <TabPane tab="月统计" key="month">
                                <div id="jsErrorMonthChart" className="jsErrorChart"></div>
                            </TabPane>
                            <TabPane tab="天统计" key="day">
                                <div id="jsErrorDayChart" className="jsErrorChart"></div>
                            </TabPane>
                        </Tabs>
                    </Col>
                    <Col span={8}>
                        <Tabs defaultActiveKey="rate" onChange={this.handleTabChange} className="rate">
                            <TabPane tab="总错误" key="rate">
                                <div className="rate-item">
                                    <Icon type="thunderbolt" theme="filled" />
                                    <div className="rate-item-font">总错误率</div>
                                    <div className="rate-item-font">1</div>
                                </div>
                                <div className="rate-item">
                                    <Icon type="windows" theme="filled" />
                                    <div className="rate-item-font">PC错误率</div>
                                    <div className="rate-item-font">2</div>
                                </div>
                                <div className="rate-item">
                                    <Icon type="android" theme="filled" />
                                    <div className="rate-item-font">Android错误率</div>
                                    <div className="rate-item-font">3</div>
                                </div>
                                <div className="rate-item">
                                    <Icon type="apple" theme="filled" />
                                    <div className="rate-item-font">iOS错误率</div>
                                    <div className="rate-item-font">3</div>
                                </div>
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        currentProject: state.project.currentProject,
        jsErrorDayList: state.jsError.jsErrorDayList,
    }
}
export default connect(mapStateToProps)(Home);
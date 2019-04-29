import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Tabs, Icon, Radio } from 'antd';
import moment from 'moment'
import echarts from 'echarts';
import './Home.less';
import JsErrorList from '../../component/JsErrorList/JsErrorList.js';
import actions from '../../action/index.js';
import { jsErrorMonthOpt, jsErrorMonthLineOpt } from '../../chartConfig/jsErrorMonthOpt.js';
import jsErrorDayOpt from '../../chartConfig/jsErrorDayOpt';
const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class Home extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            tab: '',
            monthChart: null,
            dayChart: null,
            isInitChart: false,
            monthArr: [],
            monthFlag: 'bar',
            allRate: 0,
            pcRate: 0,
            iosRate: 0,
            androidRate: 0,
            limit: 10,
            offset: 0,
        }
        this.monthChart = React.createRef();
        this.dayChart = React.createRef();
    }

    componentDidMount () {
        window.onresize = function () {
            this.state.monthChart && this.state.monthChart.resize();
        }.bind(this);
        if (this.props.currentProject.projectName) {
            const { dispatch } = this.props;
            const data = {
                monitorId: this.props.currentProject.monitorId,
                days: 30,
            }
            // 获取月统计数据
            dispatch(actions.getJsErrorMonthList(data)).then(res => {
                this.handleMonthData(res);
            });
        }
    }

    componentWillReceiveProps (nextProps) {
        const { dispatch } = this.props;
        if (this.props.currentProject.projectName !== nextProps.currentProject.projectName) {
            this.setState({
                monthFlag: 'bar',
            });
            const data = {
                monitorId: nextProps.currentProject.monitorId,
                days: 30,
            }
            // 获取月统计数据
            dispatch(actions.getJsErrorMonthList(data)).then(res => {
                this.handleMonthData(res);
            });
            if (this.state.tab === 'day') {
                const obj = {
                    monitorId: nextProps.currentProject.monitorId,
                };
                dispatch(actions.getJsErrorDayList(obj)).then(res => {
                    const dayChart = echarts.init(document.getElementById('jsErrorDayChart'));
                    const options = jsErrorDayOpt(res);
                    dayChart.setOption(options);
                    this.setState({
                        dayChart,
                    })
                });
            }
            // 获取天统计数据
            const rateData = {
                monitorId: nextProps.currentProject.monitorId,
                day: 30,
            }
            dispatch(actions.getJsErrorRate(rateData)).then(res => {
                this.setState({
                    allRate: (((res.pcCount + res.iosCount + res.androidCount) / (res.pcPV + res.iosPV + res.androidPV)) || 0) * 100,
                    pcRate: ((res.pcCount / res.pcPV) || 0) * 100,
                    iosRate: ((res.iosCount / res.iosPV) || 0) * 100,
                    androidRate: ((res.androidCount / res.androidPV) || 0) * 100,
                });
            })
            // 获取当前应用错误信息列表
            const jsErrorData = {
                monitorId: nextProps.currentProject.monitorId,
                limit: this.state.limit,
                offset: this.state.offset,
            }
            dispatch(actions.getJsErrorList(jsErrorData));
        }
    }

    handleMonthData (res) {
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
        this.setState({
            monthChart,
            monthArr: arr,
        });
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
                    this.setState({
                        dayChart,
                    }, () => {
                        window.addEventListener('resize', () => {
                            this.state.dayChart.resize();
                        })
                    })
                });
            }
        } else {
            this.setState({
                tab: 'month',
            });
        }
    }

    handleMonthChange = (e) => {
        const value = e.target.value;
        this.setState({
            monthFlag: value,
        })
        if (value === 'bar') {
            const options = jsErrorMonthOpt(this.state.monthArr);
            this.state.monthChart.setOption(options);
        }
        if (value === 'line') {
            const options = jsErrorMonthLineOpt(this.state.monthArr);
            this.state.monthChart.setOption(options);
        }
    }

    handleTableChange = (data) => {
        const { dispatch } = this.props;
        const jsErrorData = {
            ...data,
            monitorId: this.props.currentProject.monitorId,
        };
        dispatch(actions.getJsErrorList(jsErrorData));
    }

    render () {
        const { allRate, pcRate, iosRate, androidRate, monthFlag } = this.state;
        return (
            <div className="home">
                <Row style={{border: '1px solid #e8e8e8'}}>
                    <Col span={16}>
                        <Tabs defaultActiveKey="month" onChange={this.handleTabChange}>
                            <TabPane tab={<span><Icon type="bar-chart" />月统计</span>} key="month">
                                <RadioGroup value={monthFlag} onChange={this.handleMonthChange} className="month-switch">
                                    <RadioButton value="bar">
                                        <Icon type="bar-chart" />
                                    </RadioButton>
                                    <RadioButton value="line">
                                        <Icon type="line-chart" />
                                    </RadioButton>
                                </RadioGroup>
                                <div id="jsErrorMonthChart" ref={this.monthChart} className="jsErrorChart"></div>
                            </TabPane>
                            <TabPane tab={<span><Icon type="line-chart" />天统计</span>} key="day">
                                <div id="jsErrorDayChart" ref={this.dayChart} className="jsErrorChart"></div>
                            </TabPane>
                        </Tabs>
                    </Col>
                    <Col span={8}>
                        <Tabs defaultActiveKey="rate" onChange={this.handleTabChange} className="rate">
                            <TabPane tab={<span><Icon type="heat-map" />错误概览</span>} key="rate" className="rate-tab">
                                <div className="rate-item">
                                    <div style={{textAlign: 'center'}}><Icon type="thunderbolt" theme="filled" style={{fontSize: '40px',color: '#727082'}} /></div>
                                    <div className="rate-item-font">总错误率</div>
                                    <div className="rate-item-font">{allRate.toFixed(2)}%</div>
                                </div>
                                <div className="rate-item">
                                    <div style={{textAlign: 'center'}}><Icon type="windows" theme="filled" style={{fontSize: '40px',color: '#727082'}} /></div>
                                    <div className="rate-item-font">PC错误率</div>
                                    <div className="rate-item-font">{pcRate.toFixed(2)}%</div>
                                </div>
                                <div className="rate-item">
                                    <div style={{textAlign: 'center'}}><Icon type="android" theme="filled" style={{fontSize: '40px',color: '#727082'}} /></div>
                                    <div className="rate-item-font">Android错误率</div>
                                    <div className="rate-item-font">{androidRate.toFixed(2)}%</div>
                                </div>
                                <div className="rate-item">
                                    <div style={{textAlign: 'center'}}><Icon type="apple" theme="filled" style={{fontSize: '40px', color: '#727082'}} /></div>
                                    <div className="rate-item-font">iOS错误率</div>
                                    <div className="rate-item-font">{iosRate.toFixed(2)}%</div>
                                </div>
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>
                <Row style={{border: '1px solid #e8e8e8', marginTop: '20px'}}>
                    <JsErrorList
                        jsErrorList={this.props.jsErrorList}
                        handleTableChange={this.handleTableChange} />
                </Row>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        currentProject: state.project.currentProject,
        jsErrorMonthList: state.jsError.jsErrorMonthList,
        jsErrorDayList: state.jsError.jsErrorDayList,
        jsErrorRate: state.jsError.jsErrorRate,
        jsErrorList: state.jsError.jsErrorList,
    }
}
export default connect(mapStateToProps)(Home);
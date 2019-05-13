import React from 'react';
import { connect } from 'react-redux';
import { Select, Checkbox } from 'antd';
import echarts from 'echarts';
import moment from 'moment';
import './Customer.less';
import actions from '../../action/index.js';
import { customerCountOpt } from '../../chartConfig/customerCountOpt.js';
const Option = Select.Option;

class Customer extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            type: 'pv',
            level: 'hour',
            isCompare: false,
            customerCountChart: null,
            res: [],
        }
    }

    componentDidMount () {
        this.handleRequest();
    }

    componentWillUnmount () {
        window.onresize = null;
    }

    handleRequest () {
        const { dispatch } = this.props;
        const { type, level } = this.state;
        let customerData = {};
        if (level === 'hour') {
            customerData = {
                level: 'hour',
                monitorId: localStorage.monitorId,
            }
        } else if (level === 'day') {
            customerData = {
                level: 'day',
                monitorId: localStorage.monitorId,
                timeScope: 30,
            }
        }
        if (type === 'pv') {
            dispatch(actions.getCustomerCountPv(customerData)).then(res => {
                if (level === 'day') {
                    res.tomonth = this.handleMonthData(res.tomonth);
                    res.previous = this.handleMonthData(res.previous);
                }
                this.setState({
                    res,
                });
                this.handleResData(res);
            });
        } else if (type === 'uv') {
            dispatch(actions.getCustomerCount(customerData)).then(res => {
                if (level === 'day') {
                    res.tomonth = this.handleMonthData(res.tomonth);
                    res.previous = this.handleMonthData(res.previous);
                }
                this.setState({
                    res,
                });
                this.handleResData(res);
            });
        }
    }

    handleResData  (res) {
        const { isCompare } = this.state;
        if (isCompare) {
            const arr = [[...(res.tomonth || res.today)], [...res.previous]];
            const customerCountChart = echarts.init(document.getElementById('customerCountChart'));
            const options = customerCountOpt(arr);
            customerCountChart.setOption(options, true);
            this.setState({
                customerCountChart,
            }, () => {
                window.addEventListener('resize', () => {
                    customerCountChart.resize();
                });
            });
        } else {
            const arr = [[...(res.tomonth || res.today)]];
            const customerCountChart = echarts.init(document.getElementById('customerCountChart'));
            const options = customerCountOpt(arr);
            customerCountChart.setOption(options, true);
            this.setState({
                customerCountChart,
            }, () => {
                window.addEventListener('resize', () => {
                    customerCountChart.resize();
                });
            });
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
        return arr;
    }

    handleTypeChange = (value) => {
        this.setState({
            type: value,
        }, () => {
            this.handleRequest();
        });
    }

    handleLevelChange = (value) => {
        this.setState({
            level: value,
        }, () => {
            this.handleRequest();
        });
    }

    handleCheckboxChange = (e) => {
        this.setState({
            isCompare: !this.state.isCompare,
        }, () => {
            this.handleResData(this.state.res);
        });
    }

    render () {
        const { type, level, isCompare } = this.state;
        return (
            <div className="customer">
                <div className="customer-header">
                    <Select value={type} onChange={this.handleTypeChange} className="customer-type">
                        <Option value="pv">pv</Option>
                        <Option value="uv">uv</Option>
                    </Select>
                    <Select value={level} onChange={this.handleLevelChange} className="customer-level">
                        <Option key="hour" value="hour">小时级</Option>
                        <Option key="day" value="day">天级</Option>
                    </Select>
                    <Checkbox checked={isCompare} onChange={this.handleCheckboxChange} className="customer-compare">
                    {
                        level === 'hour'
                        ?
                        '相比昨日'
                        :
                        '相比上月'
                    }
                    </Checkbox>
                </div>
                <div className="customer-content">
                    <div id="customerCountChart" className="customer-chart"></div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        customerCount: state.customer.customerCount,
        customerCountPv: state.customer.customerCountPv,
    }
}

export default connect(mapStateToProps)(Customer);
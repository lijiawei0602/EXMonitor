import React from 'react';
import { connect } from 'react-redux';
import { Select, Checkbox } from 'antd';
import echarts from 'echarts';
import './Customer.less';
import actions from '../../action/index.js';
const Option = Select.Option;

class Customer extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            type: 'pv',
            level: 'hour',
            isCompare: false,
        }
    }

    componentDidMount () {
        this.handleRequest();
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
                console.log(res);
            });
        } else if (type === 'uv') {
            dispatch(actions.getCustomerCount(customerData)).then(res => {
                console.log(res);
            });
        }
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
        const checked = e.target.checked;
        this.setState({
            isCompare: !this.state.isCompare,
        }, () => {
            const { level } = this.state;
            if (checked) {
                if (level === 'day') {

                } else {

                }
            } else {
                
            }
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
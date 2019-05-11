import React from 'react';
import { connect } from 'react-redux';
import { Input, Select } from 'antd';
import BehaviorContent from '../../component/BehaviorContent/BehaviorContent.js';
import './Behavior.less';
import actions from '../../action/index.js';

const InputGroup = Input.Group;
const Search = Input.Search;
const Option = Select.Option;

const dayOption = [
    {key: '1', value: '1天'},
    {key: '2', value: '2天'},
    {key: '3', value: '3天'},
    {key: '7', value: '7天'},
    {key: '30', value: '30天'},
]

class Behavior extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            timeScope: 1,
        }
    }

    componentDidMount () {
        let { search } = this.props.location;
        let param = {};
        search = search.slice(1);
        search.split('&').forEach(item => {
            const t = item.split('=');
            param[t[0]] = t[1];
        });
        const { customerKey, timeScope, monitorId } = param;
        if (customerKey) {
            const { dispatch } = this.props;
            const behaviorData = {
                monitorId,
                timeScope: timeScope || this.state.timeScope,
                searchValue: customerKey,
            }
            dispatch(actions.getBehaviorRecord(behaviorData));
            dispatch(actions.getSearchCustomerInfo(behaviorData)).then(res => {
                console.log(res);
            });
        }
    }

    dayOption = () => dayOption.map(item => 
        <Option key={item.key} value={item.key}>{item.value}</Option>)
    
    handleInputSearch = (value) => {
        const { dispatch, currentProject } = this.props;
        const behaviorData = {
            monitorId: currentProject.monitorId,
            timeScope: this.state.timeScope,
            searchValue: value,
        }
        dispatch(actions.getBehaviorRecord(behaviorData));
        dispatch(actions.getSearchCustomerInfo(behaviorData)).then(res => {
            console.log(res);
        });
    }

    handleSelectChange = (value) => {
        this.setState({
            timeScope: value,
        });
    }

    render () {
        return (
            <div className="behavior">
                <div className="behavior-top">
                    <InputGroup
                        compact
                        className="behavior-top-input">
                        <Select defaultValue="1" onChange={this.handleSelectChange}>
                            {this.dayOption()}
                        </Select>
                        <Search
                            style={{width: '50%'}}
                            placeholder="请输入CustomerKey"
                            onSearch={this.handleInputSearch}
                            enterButton="搜索">
                        </Search>
                    </InputGroup>
                </div>
                <div className="behavior-content">
                    <BehaviorContent behaviorRecord={this.props.behaviorRecord}/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        currentProject: state.project.currentProject,
        behaviorRecord: state.behavior.behaviorRecord,
    }
}

export default connect(mapStateToProps)(Behavior);
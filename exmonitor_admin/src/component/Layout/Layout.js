import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import axios from 'axios';
import HeaderTop from '../Header/Header.js';
import './Layout.less';
import action from '../../action/index.js';

class Layout extends React.Component {
    constructor (props) {
        super(props);
        this.state = {

        }
    }
    componentWillMount () {
        const token = sessionStorage.getItem('token');
        const { dispatch } = this.props;
        if (!token) {
            this.props.history.push('/User/login');
        } else if (!this.props.user){
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            dispatch(action.getUserInfo()).then(res => {
                const userId = res.data.user.userId;
                this.getProjectListByUserId(userId);
            });
        } else {
            const userId = this.props.user.userId;
            this.getProjectListByUserId(userId);
        }
    }

    getProjectListByUserId (userId) {
        const { dispatch } = this.props;
        dispatch(action.getProjectList(userId));
    }

    render () {
        return (
            <div className="layout">
                <HeaderTop user={this.props.user} projectList={this.props.projectList}/>
                <div className="layout-content">{ this.props.children }</div>
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

export default withRouter(connect(mapStateToProps)(Layout));
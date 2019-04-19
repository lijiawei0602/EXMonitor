import React from 'react';
import { withRouter } from 'react-router';
import HeaderTop from '../Header/Header.js';
import './Layout.less';

class Layout extends React.Component {
    constructor (props) {
        super(props);
        this.state = {

        }
    }
    componentWillMount () {
        const token = sessionStorage.getItem('token');
        if (!token) {
            this.props.history.push('/User/login');
        }
    }

    render () {
        return (
            <div className="layout">
                <HeaderTop />
                <div className="layout-content">{ this.props.children }</div>
            </div>
        )
    }
}

export default withRouter(Layout);
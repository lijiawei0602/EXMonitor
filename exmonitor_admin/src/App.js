import React from 'react';
import { Provider } from 'react-redux';
import {
    Switch,
    Route,
    Redirect,
    withRouter,
  } from 'react-router-dom';
import configStore from './store/index.js';
import HeaderTop from './container/Header/Header.js';
import Test from './container/Test.js';

const store = configStore();

class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {

        }
    }
    render () {
        return (
            <Provider store={store}>
                <HeaderTop />
                <Switch>
                    <Route path='/index' component={Test}></Route>
                    <Redirect from='/' to='/index'></Redirect>
                </Switch>
            </Provider>
        );
    }
}

export default withRouter(App);
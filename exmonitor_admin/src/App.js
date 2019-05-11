import React from 'react';
import { Provider } from 'react-redux';
import {
    Switch,
    Route,
    Redirect,
  } from 'react-router-dom';
import configStore from './store/index.js';
import Layout from './component/Layout/Layout.js';
import Test from './container/Test.js';
import Login from './container/User/Login/Login.js';
import Create from './container/User/Create/Create.js';
import Info from './container/User/Info/Info.js';
import Home from './container/Home/Home.js';
import Detail from './container/Detail/Detail.js';
import Behavior from './container/Behavior/Behavior.js';

const store = configStore();

const UserRouter = () => (
    <Switch>
        <Route exact path="/User/login" component={Login}></Route>
        <Route exact path="/User/create" component={Create}></Route>
    </Switch>
)

const LayoutRouter = () => (
    <Layout>
        <Switch>
            <Route path='/Admin/Home' component={Home}></Route>
            <Route exact path="/Admin/info" component={Info}></Route>
            <Route exact path="/Admin/detail" component={Detail}></Route>
            <Route exact path="/Admin/behavior" component={Behavior}></Route>
        </Switch>
    </Layout>
)


class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {

        }
    }
    render () {
        return (
            <Provider store={store}>
                <Switch>
                    <Route path='/User' component={UserRouter}></Route>
                    <Route path="/Admin" component={LayoutRouter}></Route>
                    <Redirect from='/' to="/User/login"></Redirect>
                </Switch>
            </Provider>
        );
    }
}

export default App;
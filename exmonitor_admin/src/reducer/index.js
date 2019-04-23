import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import  * as types from '../constant/actionType.js';

const nameInitialState = {}
const user = (state = nameInitialState, action) => {
    switch (action.type) {
        case types['USER_LOGIN']:
            return Object.assign({}, state, {user: action.user});
        case types['USER_CREATE']:
            return Object.assign({}, state, {user: action.user});
        case types['USER_INFO']:
            return Object.assign({}, state, {user: action.user});
        default:
            return state
    }
}

const projectInitialState = {}
const project = (state = projectInitialState, action) => {
    switch (action.type) {
        case types['INIT_PROJECT']:
            return Object.assign({}, state, {initProject: action.initProject});
        case types.PROJECT_LIST:
            return Object.assign({}, state, {projectList: action.projectList});
        default:
            return state
    }
}

const mailInitialState = {}
const mail = (state = mailInitialState, action) => {
    switch (action.type) {
        case types.MAIL_LIST:
            return Object.assign({}, state, {mailList: action.mailList});
        case types.DELETE_MAIL:
            const arr = state.mailList.filter(item => item.account !== action.account);
            return Object.assign({}, state, {mailList: arr});
        case types.ADD_MAIL:
            const t = [...state.mailList, action.data];
            return Object.assign({}, state, {mailList: t});
        default:
            return state;
    }
}

export default combineReducers({
    user,
    project,
    mail,
    routing: routerReducer,
})
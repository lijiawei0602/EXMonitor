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

const projectInitialState = {
    projetList: [],
    currentProject: {},
}
const project = (state = projectInitialState, action) => {
    switch (action.type) {
        case types['INIT_PROJECT']:
            return Object.assign({}, state, {initProject: action.initProject});
        case types.PROJECT_LIST:
            return Object.assign({}, state, {projectList: action.projectList});
        case types.SWITCH_PROJECT:
            return Object.assign({}, state, {currentProject: action.currentProject});
        default:
            return state
    }
}

const mailInitialState = {
    mailListMonitorId: [],
}
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
        case types.MAIL_LIST_MONITORID:
            return Object.assign({}, state, {mailListMonitorId: action.mailListMonitorId});
        default:
            return state;
    }
}

const jsErrorInitialState = {
    jsErrorMonthList: [],
    jsErrorDayList: [],
    jsErrorRate: {},
    jsErrorList: {},
    jsErrorInfo: {},
    jsErrorInfoAffect: {},
    jsErrorInfoMsg: [],
    jsErrorStackCode: {},
    jsErrorTrack: [],
}
const jsError = (state = jsErrorInitialState, action) => {
    switch (action.type) {
        case types.JSERROR_MONTH_LIST:
            return Object.assign({}, state, {jsErrorMonthList: action.jsErrorMonthList});
        case types.JSERROR_DAY_LIST:
            return Object.assign({}, state, {jsErrorDayList: action.jsErrorDayList});
        case types.JSERROR_RATE:
            return Object.assign({}, state, {jsErrorRate: action.jsErrorRate});
        case types.JSERROR_LIST:
            return Object.assign({}, state, {jsErrorList: action.jsErrorList});
        case types.JSError_INFO:
            return Object.assign({}, state, {jsErrorInfo: action.jsErrorInfo});
        case types.JSERROR_INFO_AFFECT:
            return Object.assign({}, state, {jsErrorInfoAffect: action.jsErrorInfoAffect});
        case types.JSERROR_INFO_MSG:
            return Object.assign({}, state, {jsErrorInfoMsg: action.jsErrorInfoMsg});
        case types.JSERROR_STACK_CODE:
            return Object.assign({}, state, {jsErrorStackCode: action.jsErrorStackCode});
        case types.JSERROR_TRACK:
            return Object.assign({}, state, {jsErrorTrack: action.jsErrorTrack});
        default:
            return state
    }
}

const ignoreErrorInitialState = {
    isIgnore: false,
    ignoreErrorList: [],
}
const ignoreError = (state = ignoreErrorInitialState, action) => {
    switch (action.type) {
        case types.UPDATE_IGNORE_ERROR:
            return Object.assign({}, state, {isIgnore: action.isIgnore});
        case types.IGNORE_ERROR_LIST:
            return Object.assign({}, state, {ignoreErrorList: action.ignoreErrorList});
        default:
            return state
    }
}

const behaviorInitialState = {
    behaviorRecord: [],
}
const behavior = (state = behaviorInitialState, action) => {
    switch (action.type) {
        case types.BEHAVIOR_RECORD:
            return Object.assign({}, state, {behaviorRecord: action.behaviorRecord});
        case types.CUSTOMER_INFO:
            return Object.assign({}, state, {customerInfo: action.customerInfo});
        default:
            return state
    }
}

export default combineReducers({
    user,
    project,
    mail,
    jsError,
    ignoreError,
    behavior,
    routing: routerReducer,
})
import axios from 'axios';
import getHost from './getHost.js';
import { message } from 'antd';

const apiHost = getHost();

const token = localStorage.getItem('token');
if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
}
axios.defaults.baseURL = `${apiHost}/api`;
axios.interceptors.response.use(res => {
    if (res.status === 200) {
        return Promise.resolve(res);
    } else if (res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        return Promise.reject(res);
    } else {
        message.error(res.data.message);
        return Promise.reject(res);
    }
})

const apiUrl = {
    "login": `/user/login`,
    "create": `/user`,
    'getUserInfo': `/user`,
    "createProject": `/generate`,
    "sourcemap": `${apiHost}/api/sourceMap`,
    "projectList": `/projectList`,
    "projectByMonitorId": '/getProjectByMonitorId',
    "mailList": `/mail/list`,
    "addMail": `/mail`,
    "deleteMail": `/mail`,
    "jsErrorMonthList": `/getJsErrorInfoDaysAgo`,
    "jsErrorDayList": `/getJsErrorInfoTimesAgo`,
    "jsErrorRate": `/getJsErrorInfoCountByOs`,
    "jsErrorList": `/getJsErrorInfoListByMonitorId`,
    "jsErrorInfo": `/jsErrorInfo`,
    "mailListByMonitorId": '/mailList',
    "jsErrorInfoListAffect": '/getJsErrorInfoListAffect',
    "jsErrorInfoListByMsg": '/getJsErrorInfoListByMsg',
    "ignoreError": '/ignoreError',
    "ignoreErrorList": '/getIgnoreErrorList',
    "dispatchMail": '/dispatch',
    "jsErrorInfoStackCode": '/getJsErrorInfoStackCode',
    "jsErrorTrack": '/getJsErrorTrack',
    "behaviorRecord": '/searchBehaviorRecord',
    "searchCustomerInfo": '/searchCustomerInfo',
    "customerCount": '/getCustomerCountByTime',
    "customerCountPv": '/getCustomerCountByTimePv',
}


const login = (data) => {
    return axios.post(apiUrl.login, {
        ...data,
    });
}

const create = (data) => {
    return axios.post(apiUrl.create, {
        ...data,
    });
}
const getUserInfo = () => {
    return axios(apiUrl.getUserInfo);
}

const createProject = (data) => {
    return axios.post(apiUrl.createProject, {
        ...data,
    });
}

const sourceMapUrl = apiUrl.sourcemap;

const getProjectList = (userId) => {
    return axios.get(apiUrl.projectList, {
        params: {
            userId,
        }
    });
}

const getProjectByMonitorId = (data) => {
    return axios.get(apiUrl.projectByMonitorId, {
        params: {
            monitorId: data.monitorId,
        },
    });
}

const getMailList = (userId) => {
    return axios.get(apiUrl.mailList, {
        params: {
            userId,
        }
    });
}

const addMail = (data) => {
    return axios.post(apiUrl.addMail, {
        ...data,
    });
}

const deleteMail = (account) => {
    return axios.delete(apiUrl.deleteMail, {
        params: {
            account,
        },
    });
}

const getJsErrorMonthList = (data) => {
    return axios.get(apiUrl.jsErrorMonthList, {
        params: {
            monitorId: data.monitorId,
            days: data.days,
        }
    })
}

const getJsErrorDayList = (data) => {
    return axios.get(apiUrl.jsErrorDayList, {
        params: {
            monitorId: data.monitorId,
        }
    });
}

const getJsErrorRate = (data) => {
    return axios.get(apiUrl.jsErrorRate, {
        params: {
            monitorId: data.monitorId,
            day: data.day,
        },
    });
}

const getJsErrorList = (data) => {
    return axios.get(apiUrl.jsErrorList, {
        params: {
            monitorId: data.monitorId,
            limit: data.limit,
            offset: data.offset,
        }
    });
}

const getJsErrorInfo = (data) => {
    return axios.get(`${apiUrl.jsErrorInfo}/${data.errorId}`);
}

const getMailListByMonitorId = (data) => {
    return axios.get(apiUrl.mailListByMonitorId, {
        params: {
            monitorId: data.monitorId,
        },
    });
}

const getJsErrorInfoListAffect = (data) => {
    return axios.post(apiUrl.jsErrorInfoListAffect, {
        monitorId: data.monitorId,
        errorMsg: data.errorMsg,
    });
}

const getJsErrorInfoListByMsg = (data) => {
    return axios.post(apiUrl.jsErrorInfoListByMsg, {
        ...data,
    });
}

const setIgnoreError = (data) => {
    return axios.post(apiUrl.ignoreError, {
        ...data,
    });
}

const getIgnoreErrorList = (data) => {
    return axios.get(apiUrl.ignoreErrorList, {
        params: {
            ...data,
        }
    });
}

const dispatchMail = (data) => {
    return axios.post(apiUrl.dispatchMail, {
        ...data,
    });
}

const getJsErrorInfoStackCode = (data) => {
    return axios.get(`${apiUrl.jsErrorInfoStackCode}/${data.id}`);
}

const getJsErrorTrack = (data) => {
    return axios.get(`${apiUrl.jsErrorTrack}/${data.id}`);
}

const getBehaviorRecord = (data) => {
    return axios.post(apiUrl.behaviorRecord, {
        monitorId: data.monitorId,
        timeScope: data.timeScope,
        searchValue: data.searchValue,
    });
}

const getSearchCustomerInfo = (data) => {
    return axios.post(apiUrl.searchCustomerInfo, {
        monitorId: data.monitorId,
        timeScope: data.timeScope,
        searchValue: data.searchValue,
    });
}

const getCustomerCount = (data) => {
    return axios.post(apiUrl.customerCount, {
        ...data,
    });
}

const getCustomerCountPv = (data) => {
    return axios.post(apiUrl.customerCountPv, {
        ...data,
    });
}

export default {
    login,
    create,
    getUserInfo,
    createProject,
    sourceMapUrl,
    getProjectList,
    getProjectByMonitorId,
    getMailList,
    addMail,
    deleteMail,
    getJsErrorMonthList,
    getJsErrorDayList,
    getJsErrorRate,
    getJsErrorList,
    getJsErrorInfo,
    getMailListByMonitorId,
    getJsErrorInfoListAffect,
    getJsErrorInfoListByMsg,
    setIgnoreError,
    getIgnoreErrorList,
    dispatchMail,
    getJsErrorInfoStackCode,
    getJsErrorTrack,
    getBehaviorRecord,
    getSearchCustomerInfo,
    getCustomerCount,
    getCustomerCountPv,
};
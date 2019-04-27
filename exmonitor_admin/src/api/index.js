import axios from 'axios';
import getHost from './getHost.js';

const apiHost = getHost();

const token = sessionStorage.getItem('token');
if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
}
axios.defaults.baseURL = `${apiHost}/api`;

const apiUrl = {
    "login": `/user/login`,
    "create": `/user`,
    'getUserInfo': `/user`,
    "createProject": `/generate`,
    "sourcemap": `/sourceMap`,
    "projectList": `/projectList`,
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

export default {
    login,
    create,
    getUserInfo,
    createProject,
    sourceMapUrl,
    getProjectList,
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
};
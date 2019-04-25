import axios from 'axios';
import getHost from './getHost.js';

const apiHost = getHost();

const token = sessionStorage.getItem('token');
if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
}

const apiUrl = {
    "login": `${apiHost}/api/user/login`,
    "create": `${apiHost}/api/user`,
    'getUserInfo': `${apiHost}/api/user`,
    "createProject": `${apiHost}/api/generate`,
    "sourcemap": `${apiHost}/api/sourceMap`,
    "projectList": `${apiHost}/api/projectList`,
    "mailList": `${apiHost}/api/mail/list`,
    "addMail": `${apiHost}/api/mail`,
    "deleteMail": `${apiHost}/api/mail`,
    "jsErrorMonthList": `${apiHost}/api/getJsErrorInfoDaysAgo`,
    "jsErrorDayList": `${apiHost}/api/getJsErrorInfoTimesAgo`,
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
};
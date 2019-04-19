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

export default {
    login,
    create,
    getUserInfo,
};
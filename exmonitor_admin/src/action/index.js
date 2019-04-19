import { message } from 'antd';
import * as types from '../constant/actionType.js';
import api from '../api/index.js';

const receiveLogin = (user) => {
    return {
        type: types.USER_LOGIN,
        user,
    };
}

const login = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            api.login(data).then(res => {
                if (res.data.code === 200) {
                    dispatch(receiveLogin(res.data.data.user));
                    resolve(res.data);
                } else {
                    message.error(res.data.msg);
                    reject(res.data);
                }
            });
        });
    }
}

const receiveCreate = (user) => {
    return {
        type: types.USER_CREATE,
        user,
    };
}

const create = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            api.create(data).then(res => {
                if (res.data.code === 200) {
                    dispatch(receiveCreate(res.data.data.user));
                    resolve(res.data);
                } else {
                    message.error(res.data.msg);
                    reject(res.data);
                }
            });
        });
    }
}

const receiveUserInfo = (user) => {
    return {
        type: types.USER_INFO,
        user,
    }
}

const getUserInfo = () => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            api.getUserInfo().then(res => {
                if (res.data.code === 200) {
                    dispatch(receiveUserInfo(res.data.data.user));
                } else {
                    message.error(res.data.msg);
                    reject(res.data);
                }
            })
        })
    }
}

export default {
    login,
    create,
    getUserInfo,
}
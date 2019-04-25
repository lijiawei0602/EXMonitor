import { message } from 'antd';
import * as types from '../constant/actionType.js';
import api from '../api/index.js';
import { promises } from 'fs';

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
                    resolve(res.data);
                } else {
                    message.error(res.data.msg);
                    reject(res.data);
                }
            })
        })
    }
}

const receiveCreateProject = (data) => {
    return {
        type: types.INIT_PROJECT,
        initProject: data,
    }
}

const createProject = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            api.createProject(data).then(res => {
                if (res.data.code === 200) {
                    dispatch(receiveCreateProject(res.data.data));
                    resolve(res.data);
                } else {
                    message.error(res.data.message);
                    reject(res.data);
                }
            });
        })
    }
}

const receiveProjectList = (data) => {
    return {
        type: types.PROJECT_LIST,
        projectList: data,
    }
}

const getProjectList = (userId) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            api.getProjectList(userId).then(res => {
                if (res.data.code === 200) {
                    dispatch(receiveProjectList(res.data.data.rows));
                    resolve(res.data);
                } else {
                    message.error(res.data.message);
                    reject(res.data);
                }
            })
        })
    }
}

const receiveMailList = (data) => {
    return {
        type: types.MAIL_LIST,
        mailList: data,
    }
}

const getMailList = (userId) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            api.getMailList(userId).then(res => {
                if (res.data.code === 200) {
                    dispatch(receiveMailList(res.data.data.data));
                    resolve(res.data);
                } else {
                    message.error(res.data.message);
                    reject(res.data);
                }
            })
        })
    }
}

const receiveDeleteMail = (account) => {
    return {
        type: types.DELETE_MAIL,
        account,
    }
}

const deleteMail = (account) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            api.deleteMail(account).then(res => {
                if (res.data.code === 200) {
                    dispatch(receiveDeleteMail(account));
                    resolve(res.data);
                } else {
                    message.error(res.data.message);
                    reject(res.data);
                }
            })
        })
    }
}

const receiveAddMail = (data) => {
    return {
        type: types.ADD_MAIL,
        data,
    }
}

const addMail = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            api.addMail(data).then(res => {
                if (res.data.code === 200) {
                    dispatch(receiveAddMail(res.data.data.data));
                    resolve(res.data);
                } else {
                    message.error(res.data);
                    reject(res.data);
                }
            });
        })
    }
}

const switchProject = (data) => {
    return {
        type: types.SWITCH_PROJECT,
        currentProject: data,
    }
}

const receiveJsErrorMonthList = (data) => {
    return {
        type: types.JSERROR_MONTH_LIST,
        jsErrorMonthList: data,
    }
}

const getJsErrorMonthList = (data) => {
    return dispatch => {
        return new Promise ((resolve, reject) => {
            api.getJsErrorMonthList(data).then(res => {
                if (res.data.code === 200) {
                    dispatch(receiveJsErrorMonthList(res.data.data));
                    resolve(res.data.data);
                } else {
                    message.error(res.data.message);
                    reject(res.data);
                }
            })
        })
    }
}

const receiveJsErrorDayList = (data) => {
    return {
        type: types.JSERROR_DAY_LIST,
        jsErrorDayList: data,
    }
}

const getJsErrorDayList = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            api.getJsErrorDayList(data).then(res => {
                if (res.data.code === 200) {
                    dispatch(receiveJsErrorDayList(res.data.data));
                    resolve(res.data.data);
                } else {
                    message.error(res.data.message);
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
    createProject,
    getProjectList,
    getMailList,
    addMail,
    deleteMail,
    switchProject,
    getJsErrorMonthList,
    getJsErrorDayList,
}
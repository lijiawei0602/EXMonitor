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

const getProjectByMonitorId = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            api.getProjectByMonitorId(data).then(res => {
                if (res.data.code === 200) {
                    resolve(res.data.data);
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

const receiveJsErrorRate = (data) => {
    return {
        type: types.JSERROR_RATE,
        jsErrorRate: data,
    }
}

const getJsErrorRate = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            api.getJsErrorRate(data).then(res => {
                if (res.data.code === 200) {
                    dispatch(receiveJsErrorRate(res.data.data.result));
                    resolve(res.data.data.result);
                } else {
                    message.error(res.data.message);
                    reject(res.data);
                }
            })
        })
    }
}

const receiveJsErrorList = (data) => {
    return {
        type: types.JSERROR_LIST,
        jsErrorList: data,
    }
}

const getJsErrorList = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            api.getJsErrorList(data).then(res => {
                if (res.data.code === 200) {
                    dispatch(receiveJsErrorList(res.data.data));
                    resolve(res.data.data);
                } else {
                    message.error(res.data.message);
                    reject(res.data);
                }
            })
        })
    }
}

const receiveJsErrorInfo = (data) => {
    return {
        type: types.JSError_INFO,
        jsErrorInfo: data,
    }
}

const getJsErrorInfo = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            api.getJsErrorInfo(data).then(res => {
                if (res.data.code === 200) {
                    dispatch(receiveJsErrorInfo(res.data.data.data));
                    resolve(res.data.data.data);
                } else {
                    message.error(res.data.message);
                    reject(res.data);
                }
            })
        })
    }
}

const receiveMailListByMonitorId = (data) => {
    return {
        type: types.MAIL_LIST_MONITORID,
        mailListMonitorId: data,
    }
}

const getMailListByMonitorId = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            api.getMailListByMonitorId(data).then(res => {
                if (res.data.code === 200) {
                    dispatch(receiveMailListByMonitorId(res.data.data.data));
                    resolve(res.data.data.data);
                } else {
                    message.error(res.data.message);
                    reject(res.data);
                }
            })
        })
    }
}

const receiveJsErrorInfoListAffect = (data) => {
    return {
        type: types.JSERROR_INFO_AFFECT,
        jsErrorInfoAffect: data,
    }
}

const getJsErrorInfoListAffect = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            api.getJsErrorInfoListAffect(data).then(res => {
                if (res.data.code === 200) {
                    dispatch(receiveJsErrorInfoListAffect(res.data.data.data));
                    resolve(res.data.data.data)
                } else {
                    message.error(res.data.message);
                    reject(res.data);
                }
            });
        });
    };
}

const receiveJsErrorInfoByMsg = (data) => {
    return {
        type: types.JSERROR_INFO_MSG,
        jsErrorInfoMsg: data,
    }
}

const getJsErrorInfoByMsg = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            api.getJsErrorInfoListByMsg(data).then(res => {
                if (res.data.code === 200) {
                    dispatch(receiveJsErrorInfoByMsg(res.data.data.data));
                    resolve(res.data.data.data);
                } else {
                    message.error(res.data.message);
                    reject(res.data);
                }
            })
        })
    }
}

const updateIgnoreError = (data) => {
    return {
        type: types.UPDATE_IGNORE_ERROR,
        isIgnore: data.isIgnore,
    }
}

const setIgnoreError = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            api.setIgnoreError(data).then(res => {
                if (res.data.code === 200) {
                    dispatch(updateIgnoreError({ isIgnore: true }));
                    resolve(res.data.data.data);
                } else {
                    message.error(res.data.message);
                    reject(res.data);
                }
            })
        })
    }
}

const receiveIgnoreErrorList = (data) => {
    return {
        type: types.IGNORE_ERROR_LIST,
        ignoreErrorList: data,
    }
}

const getIgnoreErrorList = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            api.getIgnoreErrorList(data).then(res => {
                if (res.data.code === 200) {
                    dispatch(receiveIgnoreErrorList(res.data.data.data));
                    resolve(res.data.data.data);
                } else {
                    message.error(res.data.message);
                    reject(res.data);
                }
            })
        });
    }
}

const dispatchMail = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            api.dispatchMail(data).then(res => {
                if (res.data.code === 200) {
                    resolve(res.data.message);
                }
            })
        })
    }
}

const receiveJsErrorStackCode = (data) => {
    return {
        type: types.JSERROR_STACK_CODE,
        jsErrorStackCode: data,
    }
}

const getJsErrorInfoStackCode = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            api.getJsErrorInfoStackCode(data).then(res => {
                if (res.data.code === 200) {
                    dispatch(receiveJsErrorStackCode(res.data.data.data));
                    resolve(res.data.data.data);
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
    getProjectByMonitorId,
    getMailList,
    addMail,
    deleteMail,
    switchProject,
    getJsErrorMonthList,
    getJsErrorDayList,
    getJsErrorRate,
    getJsErrorList,
    getJsErrorInfo,
    getMailListByMonitorId,
    getJsErrorInfoListAffect,
    getJsErrorInfoByMsg,
    updateIgnoreError,
    setIgnoreError,
    getIgnoreErrorList,
    dispatchMail,
    getJsErrorInfoStackCode,
}
import moment from 'moment';
import jsErrorInfoModel from '../modules/jsErrorInfo.js';
import customerPVModal from '../modules/customerPV.js';
import util from '../util/index.js';

/**
 *  创建jsErrorInfo信息
 * @param {*} ctx 
 */
const create = async (ctx) => {
    const jsErrorInfo = ctx.request.body;
    if (data.happenTime) {
        const res = await jsErrorInfoModel.create(jsErrorInfo);
        const data = await jsErrorInfoModel.getJsErrorInfoDetail(res.id);

        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "创建信息成功",
            data,
        };
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "创建信息失败，请求参数有误",
        };
    }
}

/**
 * 获取信息列表
 * @param {*} ctx 
 */
const getJsErrorInfoList = async (ctx) => {
    const data = await jsErrorInfoModel.getJsErrorInfoList();
    if (data) {
        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "查询信息列表成功",
            data,
        };
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "获取信息列表失败，请求参数有误",
        };
    }
}

/**
 * 获取近几天内的错误数量
 * @param {*} ctx 
 */
const getJsErrorInfoCountByDay = async (ctx) => {
    const param = ctx.request.query;
    const data = await jsErrorInfoModel.getJsErrorInfoCountDaysAgo(param);

    if (data) {
        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "获取信息列表成功",
            data,
        };
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "获取信息列表失败，请求参数有误",
        };
    }
}

/**
 * 获取一天内各个时间段的错误数量
 * @param {*} ctx 
 */
const getJsErrorInfoCountByTime = async (ctx) => {
    const param = ctx.request.query;
    const data = [];
    const time = moment().format('YYYY-MM');
    for(let i = 0; i < 24; i++) {
        const hour = `${i < 10 ? '0' + i : i}`;
        const startTime = `${time} ${hour}:00:00`;
        const endTime = `${time} ${hour}:59:59`;  
        const count = await jsErrorInfoModel.getJsErrorInfoCountTimesAgo(startTime, endTime, param);
        data.push({
            hour,
            count,
        });
    }

    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: "查询当天不同时间段错误数量成功",
        data,
    };
}

/**
 * 查询当月/周/日的排名前15的错误信息
 * @param {*} ctx 
 */
const getJsErrorInfoSort = async (ctx) => {
    const param = ctx.request.body;
    const data = await jsErrorInfoModel.getJsErrorInfoSort(param);

    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: "获取错误信息列表成功",
        data,
    };
}

/**
 * 查找对应平台js错误的数量
 * @param {*} ctx 
 */
const getJsErrorInfoByOs = async (ctx) => {
    const param = ctx.request.query;
    let result = {};
    param.day = util.addDays(0 - param.day) + "00:00:00";
    result.pcCount = await jsErrorInfoModel.getJsErrorInfoPcCount(param);
    result.iosCount = await jsErrorInfoModel.getJsErrorInfoIosCount(param);
    result.androidCount = await jsErrorInfoModel.getJsErrorInfOAndroidCount(param);

    result.pcPv = await customerPVModal.getCustomerPcPvCount(param);
    result.iosCount = await customerPVModal.getCustomerIosPvCount(param);
    result.androidCount = await customerPVModal.getCustomerAndroidCount(param);

    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: "查询成功",
        data: {
            result,
        }
    };
}

/**
 * 根据errorMsg查询js错误列表
 * @param {*} ctx 
 */
const getJsErrorInfoByMsg = async (ctx) => {
    const param = ctx.request.body;
    const data = await jsErrorInfoModel.getJsErrorInfoByMsg(decodeURIComponent(param.errorMsg), param);
    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: "查询成功",
        data: {
            data,
        }
    };
}

/**
 *  根绝errorMsg查询受影响的用户
 * @param {*} ctx 
 */
const getJsErrorInfoAffectCount = async (ctx) => {
    const param = ctx.request.body;
    const data = await jsErrorInfoModel.getJsErrorInfoAffectCount(decodeURIComponent(param.errorMsg), param);

    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: "查询成功",
        data: {
            data,
        }
    };
}

/**
 * 根据页面信息查询js错误信息
 * @param {*} ctx 
 */
const getJsErrorInfoByPage = async (ctx) => {
    const param = ctx.request.query;
    const data = await jsErrorInfoModel.getJsErrorInfoByPage(param);
    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: "查询成功",
        data: {
            data,
        }
    };
}

/**
 *  查询jsError附近的js代码
 * @param {*} ctx 
 */
const getJsErrorInfoStackCode = async (ctx) => {
    const param = ctx.request.body;
    const data = await jsErrorInfoModel.getJsErrorInfoStackCode(data.stackList);
    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: "查询成功",
        data: {
            data,
        }
    };
}

/**
 * 根据id查询jsErrorInfo
 * @param {*} ctx 
 */
const getErrorInfoDetailById = async (ctx) => {
    const id = ctx.params.id;
    if (id) {
        const data = await jsErrorInfoModel.getJsErrorInfoDetail(id);
        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "查询成功",
            data: {
                data,
            }
        };
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "查询失败，请求参数有误",
        };
    }
}

/**
 * 根据id删除jsErrorInfo
 * @param {*} ctx 
 */
const deleteJsErrorInfoById = async (ctx) => {
    const id = ctx.params.id;
    if (id) {
        await jsErrorInfoModel.deleteJsErrorInfo(id);
        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "删除成功",
        };
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "删除失败，请求参数有误",
        };
    }
}

const updateJsErrorInfoById = async (ctx) => {
    const id = ctx.params.id;
    const param = ctx.request.bodyl;
    if (id) {
        await jsErrorInfoModel.updateJsErrorInfo(id, param);
        const data = jsErrorInfoModel.getJsErrorInfoDetail(id);

        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "删除成功",
        };
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "更新失败，请求参数有误",
        };
    }
}

export default {
    create,
    getJsErrorInfoList,
    getJsErrorInfoCountByDay,
    getJsErrorInfoCountByTime,
    getJsErrorInfoSort,
    getJsErrorInfoByOs,
    getJsErrorInfoByMsg,
    getJsErrorInfoAffectCount,
    getJsErrorInfoByPage,
    getJsErrorInfoStackCode,
    getErrorInfoDetailById,
    deleteJsErrorInfoById,
    updateJsErrorInfoById,
}
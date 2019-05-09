import moment from 'moment';
import jsErrorInfoModel from '../modules/jsErrorInfo.js';
import customerPVModel from '../modules/customerPV.js';
import behaviorModel from '../modules/behaviorInfo.js';
import httpLogModel from '../modules/httpLogInfo.js';
import screenShotModel from '../modules/screenShotInfo.js';
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

const getJsErrorInfoListByMonitorId = async (ctx) => {
    const param = ctx.request.query;
    const data = await jsErrorInfoModel.getJsErrorInfoListByMonitorId(param);
    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: "查询信息成功",
        data,
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
    let data = [];
    let dataPre = [];
    let dataSeven = [];
    const date = new Date().getTime();
    const datePre = new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
    const dateSeven = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
    const time = moment(date).format('YYYY-MM-DD');
    const timePre = moment(datePre).format('YYYY-MM-DD');
    const timeSeven = moment(dateSeven).format('YYYY-MM-DD');
    let isFinish = false;
    for(let i = 0; i < 24; i++) {
        const hour = `${i < 10 ? '0' + i : i}`;
        const startTime = `${time} ${hour}:00:00`;
        let endTime = `${time} ${hour}:59:59`;
        if (new Date(endTime).getTime() > date) {
            isFinish = true;
            endTime = moment(date).format('YYYY-MM-DD HH:mm:ss');
        }
       const count = await jsErrorInfoModel.getJsErrorInfoCountTimesAgo(startTime, endTime, param);

        data.push({
            hour,
            count: count[0].count,
        });
        if (isFinish) {
            break;
        }
    }

    let isFinishPre = false;
    for(let i = 0; i < 24; i++) {
        const hour = `${i < 10 ? '0' + i : i}`;
        const startTime = `${timePre} ${hour}:00:00`;
        let endTime = `${timePre} ${hour}:59:59`;
        if (new Date(endTime).getTime() > datePre) {
            isFinishPre = true;
            endTime = moment(dateSeven).format('YYYY-MM-DD HH:mm:ss');
        }
       const count = await jsErrorInfoModel.getJsErrorInfoCountTimesAgo(startTime, endTime, param);

        dataPre.push({
            hour,
            count: count[0].count,
        });
        if (isFinishPre) {
            break;
        }
    }

    let isFinishSev = false;
    for(let i = 0; i < 24; i++) {
        const hour = `${i < 10 ? '0' + i : i}`;
        const startTime = `${timeSeven} ${hour}:00:00`;
        let endTime = `${timeSeven} ${hour}:59:59`;
        if (new Date(endTime).getTime() > dateSeven) {
            isFinishSev = true;
            endTime = moment(dateSeven).format('YYYY-MM-DD HH:mm:ss');
        }
       const count = await jsErrorInfoModel.getJsErrorInfoCountTimesAgo(startTime, endTime, param);

        dataSeven.push({
            hour,
            count: count[0].count,
        });
        if (isFinishSev) {
            break;
        }
    }


    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: "查询当天不同时间段错误数量成功",
        data: {
            'today': data,
            'previous': dataPre,
            'sevenAgo': dataSeven,
        }
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
    param.day = util.addDays(0 - param.day) + " 00:00:00";
    result.pcCount = (await jsErrorInfoModel.getJsErrorInfoPcCount(param))[0].count;
    result.iosCount = (await jsErrorInfoModel.getJsErrorInfoIosCount(param))[0].count;
    result.androidCount = (await jsErrorInfoModel.getJsErrorInfoAndroidCount(param))[0].count;

    result.pcPV = (await customerPVModel.getCustomerPcPvCount(param))[0].count;
    result.iosPV = (await customerPVModel.getCustomerIosPvCount(param))[0].count;
    result.androidPV = (await customerPVModel.getCustomerAndroidCount(param))[0].count;

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
    const data = (await jsErrorInfoModel.getJsErrorInfoAffectCount(decodeURIComponent(param.errorMsg), param))[0];

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
    const id = ctx.params.id;
    const jsData = await jsErrorInfoModel.getJsErrorInfoDetail(id);
    const data = await jsErrorInfoModel.getJsErrorInfoStackCode(jsData);
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
    const param = ctx.request.body;
    if (id) {
        await jsErrorInfoModel.updateJsErrorInfo(id, param);
        const data = jsErrorInfoModel.getJsErrorInfoDetail(id);

        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "更新成功",
        };
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "更新失败，请求参数有误",
        };
    }
}

const getJsErrorTrackById = async (ctx) => {
    const id = ctx.params.id;
    const jsErrorInfo = await jsErrorInfoModel.getJsErrorInfoDetail(id);
    const pageKey = jsErrorInfo.pageKey;
    const endTime = jsErrorInfo.happenTime;
    const customerKey = jsErrorInfo.customerKey;
    // 根据pageKey查询customerInfo信息
    const customerInfo = await customerPVModel.getCustomerInfoByPageKey(pageKey);
    const startTime = customerInfo.happenTime;
    // 根据时间和customerKey查询在startTime和endTime区间内的httpLog、behaviorInfo、screenShotInfo
    const behaviorInfoArr = await behaviorModel.getBehaviorTrack(startTime, endTime, customerKey);
    const httpLogInfoArr = await httpLogModel.getHttpLogTrack(startTime, endTime, customerKey);
    const screenShotInfoArr = await screenShotModel.getScreenShotTrack(startTime, endTime, customerKey);
    const data = [].concat(customerInfo, behaviorInfoArr, httpLogInfoArr, screenShotInfoArr, jsErrorInfo);
    data.sort((a, b) => {
        return Number(a.happenTime) - Number(b.happenTime);
    });
    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: "查询成功",
        data: {
            data,
        }
    }
}

export default {
    create,
    getJsErrorInfoList,
    getJsErrorInfoListByMonitorId,
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
    getJsErrorTrackById,
}
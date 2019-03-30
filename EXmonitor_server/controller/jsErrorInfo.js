import moment from 'moment';
import jsErrorInfoModel from '../modules/jsErrorInfo.js';

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



export default {
    create,
    getJsErrorInfoList,
    getJsErrorInfoCountByDay,
    getJsErrorInfoCountByTime,
    getJsErrorInfoSort,

}
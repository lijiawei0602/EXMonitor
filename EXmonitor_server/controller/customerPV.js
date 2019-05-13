import customerPVModel from '../modules/customerPV.js';
import util from '../util/index.js';
import moment from 'moment';

/**
 * 创建用户pv信息
 * @param {*} ctx 
 */
const create = async (ctx) => {
    const customerPV = ctx.request.body;
    if (customerPV.happenTime) {
        const res = await customerPVModel.createCustomerPV(customerPV);
        const data = await customerPVModel.getCustomerPVDetail(res.id);

        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "创建用户pv信息成功",
            data,
        }
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "创建用户pv信息失败，请求参数有误",
        };
    }
}

/**
 * 查询用户pv信息列表
 * @param {*} ctx 
 */
const getCustomerPVList = async (ctx) => {
    const data = await customerPVModel.getCustomerPVList();

    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: "查询用户pv信息列表成功",
        data,
    }
}

/**
 * 根据id查询用户pv信息
 * @param {*} ctx 
 */
const getCustomerPVDetail = async (ctx) => {
    const id = ctx.params.id;
    if (id) {
        const data = await customerPVModel.getCustomerPVDetail(id);

        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "查询用户pv信息成功",
            data,
        }
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "查询用户pv信息失败",
        }
    }
}

/**
 * 根据id删除用户pv信息
 * @param {*} ctx 
 */
const deleteCustomerPV = async (ctx) => {
    const id = ctx.params.id;
    if (id) {
        await customerPVModel.deleteCustomerPV(id);

        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "删除用户pv信息成功",
        };
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "删除用户pv信息失败，请求参数有误",
        };
    }
}

/**
 * 根据id更新用户pv信息
 * @param {*} ctx 
 */
const update = async (ctx) => {
    const id = ctx.params.id;
    const customerPV = ctx.request.body;
    if (id && customerPV) {
        await customerPVModel.updateCustomerPV(id, customerPV);
        const data = await customerPVModel.getCustomerPVDetail(id);

        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "更新用户pv信息成功",
            data,
        }
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "更新用户pv信息失败，请求参数有误",
        }
    }
}

/**
 * 根据时间获取日活量
 * @param {*} ctx 
 */
const getCustomerCountByTime = async (ctx) => {
    const param = ctx.request.body;
    const level = param.level;
    if (level === 'hour') {
        let data = [];
        let dataPre = [];
        const date = new Date().getTime();
        const datePre = new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
        const time = moment(date).format('YYYY-MM-DD');
        const timePre = moment(datePre).format('YYYY-MM-DD');
        let isFinish = false;
        for(let i = 0; i < 24; i++) {
            const hour = `${i < 10 ? '0' + i : i}`;
            const startTime = `${time} ${hour}:00:00`;
            let endTime = `${time} ${hour}:59:59`;
            if (new Date(endTime).getTime() > date) {
                isFinish = true;
                endTime = moment(date).format('YYYY-MM-DD HH:mm:ss');
            }
        const count = await customerPVModel.getCustomerCountByTime(startTime, endTime, param);

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
                endTime = moment(datePre).format('YYYY-MM-DD HH:mm:ss');
            }
        const count = await customerPVModel.getCustomerCountByTime(startTime, endTime, param);

            dataPre.push({
                hour,
                count: count[0].count,
            });
            if (isFinishPre) {
                break;
            }
        }
        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: '查询成功',
            data: {
                'today': data,
                'previous': dataPre,
            }
        }
    } else if (level === 'day') {
        const startDate = util.addDays(0) + " 59:59:59";
        const endDate = util.addDays(0 - param.timeScope) + " 59:59:59";
        const startDatePre = util.addDays(0 - param.timeScope) + " 59:59:59";
        const endDatePre = util.addDays(0 - 2 * param.timeScope) + " 59:59:59";
        const data = await customerPVModel.getCustomerCountByDay(startDate, endDate, param);
        const dataPrev = await customerPVModel.getCustomerCountByDay(startDatePre, endDatePre, param);
        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "查询成功",
            data: {
                'tomonth': data,
                'previous': dataPrev,
            }
        };
    }
}

const getCustomerCountByTimePv = async (ctx) => {
    const param = ctx.request.body;
    const level = param.level;
    if (level === 'hour') {
        let data = [];
        let dataPre = [];
        const date = new Date().getTime();
        const datePre = new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
        const time = moment(date).format('YYYY-MM-DD');
        const timePre = moment(datePre).format('YYYY-MM-DD');
        let isFinish = false;
        for(let i = 0; i < 24; i++) {
            const hour = `${i < 10 ? '0' + i : i}`;
            const startTime = `${time} ${hour}:00:00`;
            let endTime = `${time} ${hour}:59:59`;
            if (new Date(endTime).getTime() > date) {
                isFinish = true;
                endTime = moment(date).format('YYYY-MM-DD HH:mm:ss');
            }
            const count = await customerPVModel.getCustomerCountByTimePv(startTime, endTime, param);

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
                endTime = moment(datePre).format('YYYY-MM-DD HH:mm:ss');
            }
            const count = await customerPVModel.getCustomerCountByTimePv(startTime, endTime, param);

            dataPre.push({
                hour,
                count: count[0].count,
            });
            if (isFinishPre) {
                break;
            }
        }
        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: '查询成功',
            data: {
                'today': data,
                'previous': dataPre,
            }
        }
    } else if (level === 'day') {
        const startDate = util.addDays(0) + " 59:59:59";
        const endDate = util.addDays(0 - param.timeScope) + " 59:59:59";
        const startDatePre = util.addDays(0 - param.timeScope) + " 59:59:59";
        const endDatePre = util.addDays(0 - 2 * param.timeScope) + " 59:59:59";
        const data = await customerPVModel.getCustomerCountByDayPv(startDate, endDate, param);
        const dataPrev = await customerPVModel.getCustomerCountByDayPv(startDatePre, endDatePre, param);
        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "查询成功",
            data: {
                'tomonth': data,
                'previous': dataPrev,
            }
        };
    }
}


export default {
    create,
    getCustomerPVList,
    getCustomerPVDetail,
    deleteCustomerPV,
    update,
    getCustomerCountByTime,
    getCustomerCountByTimePv,
}
import customerPVModel from '../modules/customerPV.js';

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


export default {
    create,
    getCustomerPVList,
    getCustomerPVDetail,
    deleteCustomerPV,
    update,
}
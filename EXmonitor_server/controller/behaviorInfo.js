import behaviorModel from '../modules/behaviorInfo.js';

/**
 * 创建行为信息
 * @param {*} ctx 
 */
const create = async (ctx) => {
    const behaviorInfo = ctx.request.body;
    if (behaviorInfo.happenTime) {
        let res = await behaviorModel.createBehaviorInfo(behaviorInfo);
        let data = await behaviorModel.getBehaviorInfoDetail(res.id);
        
        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "创建行为信息成功",
            data,
        }
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "创建行为信息失败，请求参数有误",
        };
    }
}

/**
 *  获取行为信息列表
 * @param {*} ctx 
 */
const getBehaviorInfoList = async (ctx) => {
    const data = await behaviorModel.getBehaviorInfoList();
    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: "获取行为信息列表成功",
        data,
    };
}

/**
 * 根据id查询行为信息
 * @param {*} ctx 
 */
const getBehaviorInfoDetail = async (ctx) => {
    const id = ctx.params.id;
    if (id) {
        const data = await behaviorModel.getBehaviorInfoDetail(id);
        
        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "查询行为信息成功",
            data,
        }
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "查询行为信息失败，请求参数有误",
        };
    }
}

/**
 * 根据id删除行为信息 
 * @param {*} ctx 
 */
const deleteBehaviorInfo = async (ctx) => {
    const id = ctx.params.id;
    if (id) {
        const data = await behaviorModel.deleteBehaviorInfo(id);

        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "删除行为信息成功",
        };
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "删除行为信息失败，请求参数有误",
        };
    }
}

/**
 * 根据id更新行为信息
 * @param {*} ctx 
 */
const updateBehaviorInfo = async (ctx) => {
    const id = ctx.params.id;
    const behaviorInfo = ctx.request.body;
    if (id && behaviorInfo) {
        await behaviorModel.updateBehaviorInfo(id, behaviorInfo);
        const data = behaviorModel.getBehaviorInfoDetail(id);

        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "更新行为信息成功",
            data,
        }
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "更新行为信息失败，请求参数有误",
        }
    }
}

export default {
    create,
    getBehaviorInfoList,
    getBehaviorInfoDetail,
    deleteBehaviorInfo,
    updateBehaviorInfo,
}
import ignoreErrorModel from '../modules/ignoreError.js';

const create = async (ctx) => {
    const param = ctx.request.body;
    if (param.monitorId && param.ignoreErrorMessage) {
        const res = await ignoreErrorModel.create(param);
        const data = await ignoreErrorModel.getIgnoreErrorDetail(res.id);
        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "创建成功",
            data: {
                data,
            }
        };
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "创建失败，请求参数有误",
        }
    }
}

const getIgnoreErrorList = async (ctx) => {
    const param = ctx.request.query;
    const data = await ignoreErrorModel.getIgnoreErrorList(param);
    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: "查询成功",
        data: {
            data,
        }
    };
}

const getIgnoreErrorInfoByApplication = async () => {
    const param = ctx.request.query;
    if (param) {
        const data = await ignoreErrorModel.getIgnoreErrorByApplication(param);
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
        }
    }
}

const update = async (ctx) => {
    const id = ctx.params.id;
    const param = ctx.request.body;
    if (id) {
        await ignoreErrorModel.update(id, param);
        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "更新成功"
        }
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "查询失败，请求参数有误",
        };
    }
}

const deleteIgnoreError = async (id) => {
    if (id) {
        await ignoreErrorModel.deleteIgnoreError(id);
        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "删除成功"
        }
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "删除失败，请求参数有误",
        };
    }
}

const getIgnoreErrorDetail = async (ctx) => {
    if (id) {
        const data = ignoreErrorModel.getIgnoreErrorDetail(id);
        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "查询成功",
            data: {
                data,
            }
        }
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "查询失败，请求参数有误",
        };
    }
}

export default {
    create,
    getIgnoreErrorList,
    getIgnoreErrorInfoByApplication,
    update,
    deleteIgnoreError,
    getIgnoreErrorDetail,
}
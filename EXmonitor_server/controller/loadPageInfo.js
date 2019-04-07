import loadPageInfoModal from '../modules/loadPageInfo.js';

const create = async (ctx) => {
    const param = ctx.request.body;
    const res = await loadPageInfoModal.create(param);
    const data = await loadPageInfoModal.getLoadPageInfoDetail(res.id);

    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: "创建成功",
        data: {
            data,
        }
    };
}

const getLoadPageInfoList = async (ctx) => {
    const data = await loadPageInfoModal.getLoadPageInfoList();

    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: "查询成功",
        data: {
            data,
        }
    };
}

const getLoadPageInfoDetail = async (ctx) => {
    const id = ctx.params.id;
    if (id) {
        const data = loadPageInfoModal.getLoadPageInfoDetail(id);

        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "查询成功",
            data: {
                data,
            },
        };
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "查询失败，请求参数有误",
        };
    }
}

const deleteLoadPageInfo = async (ctx) => {
    const id = ctx.params.id;

    if (id) {
        await loadPageInfoModal.deleteLoadPageInfo(id);

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
        }
    }
}

const updateLoadPageInfo = async (ctx) => {
    const id = ctx.params.id;
    const param = ctx.request.body;
    if (id) {
        await loadPageInfoModal.update(id, param);

        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "更新成功",
        }
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "更新失败，请求参数有误",
        };
    }
}

/**
 *  获取日活量
 * @param {*} ctx 
 */
const getLoadPageInfoTimeByDate = async (ctx) => {
    const param = ctx.request.body;
    const data = await loadPageInfoModal.getLoadPageInfoTimeByDate(param);

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
    getLoadPageInfoList,
    getLoadPageInfoDetail,
    deleteLoadPageInfo,
    updateLoadPageInfo,
    getLoadPageInfoTimeByDate,
}
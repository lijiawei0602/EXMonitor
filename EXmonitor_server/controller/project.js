import projectModel from '../modules/project.js';
/**
 * 创建项目
 * @param {*} ctx 
 */
const create = async (ctx) => {
    const project = ctx.request.body;
    if (project.title && project.author && project.content && project.category) {
        let ret = await projectModel.createProject(project);
        let data = await projectModel.getProjectById(ret.id);

        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "项目创建成功",
        };
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "创建失败，请求参数有误",
        };
    }
};

/**
 * 查询项目列表信息
 * @param {*} ctx 
 */
const getProjectList = async (ctx) => {
    const data = await projectModel.getProjectList();
    if (data) {
        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "查询项目信息成功",
            data: {
                data,
            },
        };
    } else {
        ctx.response.status = 412;
        ctx.response.body = {
            code: 412,
            message: "查询项目信息失败",
        };
    }
}

/**
 * 根据id查询项目信息
 * @param {*} ctx 
 */
const getProjectById = async (ctx) => {
    let { id } = ctx.params;
    if (id) {
        id = parseInt(id);
        const data = await projectModel.getProjectById(id);
        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "查询项目信息成功",
            data: {
                data,
            },
        };
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "请填写所要查询项目的id",
        };
    }
}

/**
 * 根据id删除项目
 * @param {*} ctx 
 */
const deleteProjectById = async (ctx) => {
    const { id } = ctx.params;
    if (id) {
        await projectModel.deleteProject(id);
        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "删除项目成功",
        };
    } else {
        ctx.response.status = 412;
        ctx.response.body = {
            code: 412,
            message: "请填写所要删除项目的id",
        };
    }
}

const updateProjectById = async (ctx) => {
    const { id } = ctx.params;
    const project = ctx.request.body;
    if (id && project) {
        const data = await projectModel.updateProject(id, project);
        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "更新项目成功",
        }
    } else {
        ctx.response.status = 412;
        ctx.response.body = {
            code: 412,
            message: "更新项目失败",
        };
    }
}


export default {
    create,
    getProjectList,
    getProjectById,
    deleteProjectById,
}
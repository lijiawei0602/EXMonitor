import projectModel from '../modules/project.js';
const create = async (ctx) => {
    const param = ctx.request.body;
    const { projectName, userId } = param;
    const data = await projectModel.getProjectListByUserId(userId);
    const isNoExist =  data.rows.every(item => {
        return item.projectName !== projectName;
    })
    if (!isNoExist) {
        ctx.response.status = 200;
        ctx.response.body = {
            code: 400,
            message: "该用户已有相同projectName的项目，请重新填写",
        }
    } else {
        // 生成monitorId
        const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLOMNOPQRSTUVWXYZ1234567890';
        let monitorId = '';
        for (let i = 0; i < str.length; i++) {
            monitorId += str[Math.floor(Math.random() * 50)];
        }
        monitorId = monitorId.substr(0, 35);
        await projectModel.createProject({
            monitorId,
            ...param,
        });
        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: '生成monitorId成功',
            data: {
                monitorId,
                projectName,
                userId,
            },
        };
    }
}

export default {
    create,
}
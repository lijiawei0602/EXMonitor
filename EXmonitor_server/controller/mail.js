import MailModel from '../modules/mail.js';
import ProjectModel from '../modules/project.js';
import jsErrorInfoModel from '../modules/jsErrorInfo.js';

const create = async (ctx) => {
    const param = ctx.request.body;
    const data = await MailModel.create(param);
    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: '创建成功',
        data: {
            data,
        }
    };
}

const getMailListByUserId = async (ctx) => {
    const userId = ctx.query.userId;
    const data = await MailModel.getMailListByUserId(userId);
    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: "查询成功",
        data: {
            data,
        },
    };
}

const getMailListByMonitorId = async (ctx) => {
    const monitorId = ctx.query.monitorId;
    const data = await MailModel.getMailListByMonitorId(monitorId);
    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: "查询成功",
        data: {
            data,
        },
    };
}

const deleteMail = async (ctx) => {
    const account = ctx.query.account;
    await MailModel.deleteMail(account);
    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: '删除成功',
    };
}

const getMailList = async (ctx) => {
    const data = await MailModel.getMailList();
    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: '查询成功',
        data: {
            data,
        }
    };
}

const dispatch = async (ctx) => {
    const param = ctx.request.body;
    const data = await jsErrorInfoModel.sendMailToUser(param);
    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: data.message,
    }
}

export default {
    create,
    getMailListByUserId,
    getMailListByMonitorId,
    deleteMail,
    getMailList,
    dispatch,
}
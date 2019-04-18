import MailModel from '../modules/mail.js';

const create = async (ctx) => {
    const param = ctx.request.body;
    await MailModel.create(param);
    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: '创建成功',
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

export default {
    create,
    getMailListByMonitorId,
    deleteMail,
}
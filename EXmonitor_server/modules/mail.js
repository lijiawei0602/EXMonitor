import sequelize from '../config/db.js';
const Mail = sequelize.import('../schema/mail.js');
Mail.sync({force: false});

const create = async (data) => {
    return await Mail.create({
        ...data,
    });
};

const getMailListByMonitorId = async (id) => {
    return await Mail.findAll({
        where: {
            monitorId: id,
        },
    });
}

const getMailListByUserId = async (id) => {
    return await Mail.findAll({
        where: {
            userId: id,
        },
        raw: true
    });
}

const deleteMail = async (account) => {
    return await Mail.destroy({
        where: {
            account,
        },
    });
}

const getMailList = async () => {
    return await Mail.findAll();
}

export default {
    create,
    getMailListByUserId,
    getMailListByMonitorId,
    deleteMail,
    getMailList,
}
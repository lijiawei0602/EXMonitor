import sequelize from '../config/db.js';
const Mail = sequelize.import('../schema/mail.js');
Mail.sync({force: false});

const create = async (data) => {
    return await Mail.create({
        ...data,
    });
};

const getMailListByMonitorId = async (id) => {
    return await Mail.findAndCountAll({
        where: {
            monitorId: id,
        },
    });
}

const deleteMail = async (account) => {
    return await Mail.destroy({
        where: {
            account,
        },
    });
}

export default {
    create,
    getMailListByMonitorId,
    deleteMail,
}
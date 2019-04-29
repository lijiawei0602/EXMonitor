import sequelize from '../config/db.js';
const IgnoreError = sequelize.import('../schema/ignoreError.js');
IgnoreError.sync({ force: false });

const create = async (data) => {
    return await IgnoreError.create({
        ...data,
    });
}

const update = async (id, data) => {
    return await IgnoreError.update({
        ...data
    }, {
        where: {
            id,
        },
        fields: Object.keys(data),
    });
}

const getIgnoreErrorList = async (data) => {
    return await IgnoreError.findAll({
        where: {
            monitorId: data.monitorId,
        }
    });
}

const deleteIgnoreError = async (id) => {
    await IgnoreError.destroy({
        where: {
            id,
        }
    });
    return true;
}

const getIgnoreErrorDetail = async (id) => {
    return await IgnoreError.findOne({
        where: {
            id,
        }
    });
}

const getIgnoreErrorByApplication = async (data) => {
    return await IgnoreError.findOne({
        where: {
            monitorId: data.monitorId,
        }
    });
}

// 判断错误是否被忽略
const getIgnoreErrorByMsg = async (data) => {
    const sql = "select count(*) as count from ignoreErrors where monitorId='" + data.monitorId + "' and ignoreErrorMessage='" + data.errorMessage + "'";
    return await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
}



export default {
    create,
    update,
    getIgnoreErrorList,
    deleteIgnoreError,
    getIgnoreErrorDetail,
    getIgnoreErrorByApplication,
    getIgnoreErrorByMsg
}
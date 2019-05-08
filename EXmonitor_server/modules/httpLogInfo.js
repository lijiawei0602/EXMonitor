import sequelize from "../config/db";

const HttpLogInfo = sequelize.import('../schema/httpLogInfo.js');
HttpLogInfo.sync({ force: false });

const create = async (data) => {
    return await HttpLogInfo.create({
        ...data,
    });
}

const update = async (id, data) => {
    await HttpLogInfo.update({
        ...data
    }, {
        where: {
            id,
        }
    });
    return true;
}

const getHttpLogInfoList = async () => {
    return await HttpLogInfo.findAndCountAll();
}

const getHttpLogInfoDetail = async (id) => {
    return await HttpLogInfo.findOne({
        where: {
            id,
        }
    });
}

const deleteHttpLogInfo = async (id) => {
    return await HttpLogInfo.destroy({
        where: {
            id,
        }
    });
}

/**
 * 获取当前用户所有的请求记录
 * @param {*} monitorIdSql 
 * @param {*} customerKeySql 
 * @param {*} happenTimeSql 
 */
const getHttpLogInfoByUser = async (monitorIdSql, customerKeySql, happenTimeSql) => {
    const sql = "select * from httpLogInfos where " + monitorIdSql + " and " +  customerKeySql + " and " + happenTimeSql;
    return await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
}

const getHttpLogTrack = async (startTime, endTime, customerKey) => {
    return HttpLogInfo.findAll({
        where: {
            happenTime: {
                $gte: startTime,
                $lte: endTime,
            },
            customerKey,
        }
    })
}

export default {
    create,
    update,
    getHttpLogInfoList,
    getHttpLogInfoDetail,
    deleteHttpLogInfo,
    getHttpLogInfoByUser,
    getHttpLogTrack,
}
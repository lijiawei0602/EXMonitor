import utils from '../util/index.js';
import sequelize from '../config/db.js';
const JsErrorInfo = sequelize.import('../schema/jsErrorInfo.js');
JsErrorInfo.sync({force: false});

/**
 * 创建jsErrorInfo
 * @param {*} data 
 */
const create = async (data) => {
    return await JsErrorInfo.create({
        ...data
    });
}

/**
 * 获取jsErrorInfo列表
 */
const getJsErrorInfoList = async () => {
    return await JsErrorInfo.findAndCountAll();
}

/**
 * 根据id获取jsErrorInfo信息
 * @param {*} id jsErrorINfo信息的id
 */
const getJsErrorInfoDetail = async (id) => {
    return await JsErrorInfo.findOne({
        where: {
            id,
        }
    });
}

/**
 * 根据id删除jsErrorInfo信息
 * @param {*} id JsErrorInfo信息id
 */
const deleteJsErrorInfo = async (id) => {
    await JsErrorInfo.destroy({
        where: {
            id,
        },
    });
    return true;
}

/**
 * 删除指定天数之前的jsErrorInfo信息
 * @param {*} days 删除days之前的jsErrorInfo信息
 */
const deleteJsErrorInfoDaysAgo = async (days) => {
    const timeScope = utils.addDays(0 - days) + "00:00:00";
    const sql = "delete from jsErrorInfos where createdAt<'" + timeScope + "'";
    return await sequelize.query(sql, { type: sequelize.QueryTypes.DELETE });
}

/**
 * 根据id更新jsErrorInfo信息
 * @param {*} id jsErrorInfo信息id
 * @param {*} data 待更新的jsErrorInfo信息
 */
const updateJsErrorInfo = async (id, data) => {
    await JsErrorInfo.update({
        ...data
    }, {
        where: {
            id,
        },
        fields: Object.keys(data),
    });
    return true;
};

/**
 * 获取指定天数内的jsErrorInfo信息(根据日期分组)
 * @param {*} data 
 */
const getJsErrorInfoCountDaysAgo = async (data) => {
    const sql = "select DATE_FORMAT(created, '%Y-%m-%d') as day, errorMessage, count(errorMessage) as count from jsErrorInfos where monitorId='" + data.monitorId + "' and DATE_SUB(CURDATE(),INTERVAL " + data.days + " DAY) <= createdAt GROUP BY day";
    return await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
}

/**
 * 获取指定时间段内的jsErrorInfo信息数量
 * @param {*} data 
 * @param {*} startTime 查询区间开始时间
 * @param {*} endTime   查询区间结束时间
 */
const getJsErrorInfoCountTimesAgo = async (data, startTime, endTime) => {
    const sql = "select count(*) as count from jsErrorInfos where monitorId='" + data.monitorId + "' and createdAt > '" + startTime + "' and createdAt < '" + endTime + "'";
    return await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
}

/**
 * 根据errorMessage查询jsErrorInfo列表
 * @param {*} errorMsg 
 * @param {*} data 
 */
const getJsErrorInfoByMsg = async (errorMsg, data) => {
    errorMsg = errorMsg.replace(/'/g, "\'");
    const sql = "select * from jsErrorInfos where monitorId='" + data.monitorId + "' and errorMessage like '%" + errorMsg + "%' order by happenTime desc limit 200";
    return await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
}

/**
 * 根据errorMessage查询受影响的用户
 * @param {*} errorMsg 
 * @param {*} data 
 */
const getJsErrorInfoAffectCount = async (errorMsg, data) => {
    errorMsg = errorMsg.replace(/'/, "\'");
    const sql = "select count(DISTINCT customerKey) as count from jsErrorInfos where monitorId='" + data.monitorId + "' and errorMessage like '%" + errorMsg + "%'";
    return await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
}


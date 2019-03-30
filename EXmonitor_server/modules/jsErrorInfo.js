import * as fetch from 'node-fetch';
import utils from '../util/index.js';
import sequelize from '../config/db.js';
import util from '../util/index.js';
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
 * 获取指定天数内的jsErrorInfo数量(根据日期分组)
 * @param {*} data 
 */
const getJsErrorInfoCountDaysAgo = async (data) => {
    const sql = "select DATE_FORMAT(created, '%Y-%m-%d') as day, count(errorMessage) as count from jsErrorInfos where monitorId='" + data.monitorId + "' and DATE_SUB(CURDATE(),INTERVAL " + data.days + " DAY) <= createdAt GROUP BY day";
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
 *  查询当月/周/日排名前15的错误信息
 * @param {*} data 
 */
const getJsErrorInfoSort = async (data) => {
    const { simpleUrl, timeType, monitorId } = data;
    const urlSql = simpleUrl ? " and simpleUrl='" + simpleUrl + "'" : " ";
    let start;
    if (timeType === 'month') {
        start = utils.addDays(-30);
    } else if (timeType === 'week') {
        start = utils.addDays(-7);
    } else {
        start = util.addDays(0);
    }
    const timeSql = " and createdAt > '" + start + "'";
    const sql = `select errorMessage, count(errorMessage) as count, createdAt, happenTime from jsErrorInfos where monitorId='${monitorId}' ${urlSql} ${timeSql} group by errorMessage order by count desc limit 0,15`;
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

/**
 * 查询当前页面url所对应的错误
 * @param {*} data 
 */
const getJsErrorInfoByPage = async (data) => {
    const { timeType } = data;
    let querySql = "";
    let startTime;
    if (timeType === "month") {
        startTime = utils.addDays(-30);
    } else {
        startTime = utils.addDays(0);
    }
    querySql = " where monitorId='" + data.monitorId + "' and createdAt > '" + startTime + "'";
    return await sequelize.query("select simpleUrl, count(simpleUrl) as count from jsErrorInfos " + querySql + " group by simpleUrl order by count desc", { type: sequelize.QueryTypes.query});
}

/**
 * 寻找报错位置附近代码
 * @param {*} data 
 */
const getJsErrorInfoStackCode = async (data) => {
    const arr = [];
    data.forEach(item => {
        const { jsPathStr, jsPath, locationX, locationY } = item;
        fetch(jsPath)
            .then((result) => {
                return result.text();
            })
            .then(res => {
                const startIndex = parseInt(locationY) - 50;
                const endIndex = parseInt(locationY) + 50;
                const start = encodeURIComponent(res.substring(startIndex, locationY - 1));
                const end = encodeURIComponent(res.substring(locationY - 1, end));
                const obj = {
                    jsPath,
                    jsPathStr,
                    locationX,
                    locationY,
                    code: `${start} 【错误位置：】 ${end}`,
                };
                arr.push(obj);
            }).catch((err) => {
                console.log('寻找错误区代码：', err);
            });
    });
    return arr;
}

/**
 *  获取pc错误总数
 * @param {*} data 
 */
const getJsErrorInfoPcCount = async (data) => {
    const sql = `select count(distinct pageKey) as count from jsErrorInfos where monitorId='${data.monitorId}' and createdAt > '${data.day}' and os like 'web%'`;
    return await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
}

/**
 *  获取ios错误总数
 * @param {*} data 
 */
const getJsErrorInfoIosCount = async (data) => {
    const sql = `select count(distinct pageKey) as count from jsErrorInfos where monitorId='${data.monitorId}' and createdAt > '${data.day}' and os like 'ios%'`;
    return await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
}

/**
 * 获取Android错误总数
 * @param {*} data 
 */
const getJsErrorInfOAndroidCount = async (data) => {
    const sql = `select count(distinct pageKey) as count from jsErrorInfos where monitorId='${data.monitorId}' and createdAt > '${data.day}' and os like 'android%'`;
    return await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
}

/**
 * 查询当前用户发生的jsErrorInfo信息
 * @param {*} data 
 * @param {*} customerKeySql 
 */
const getJsErrorInfoByUser = async (data, customerKeySql) => {
    const sql = `select * from jsErrorInfos where ${customerKeySql} and monitorId='${data.monitorId}'`;
    return await sequelize.query(sql, { type:  sequelize.QueryTypes.SELECT});
}

export default {
    create,
    getJsErrorInfoList,
    getJsErrorInfoDetail,
    deleteJsErrorInfo,
    deleteJsErrorInfoDaysAgo,
    updateJsErrorInfo,
    getJsErrorInfoCountDaysAgo,
    getJsErrorInfoCountTimesAgo,
    getJsErrorInfoSort,
    getJsErrorInfoByMsg,
    getJsErrorInfoAffectCount,
    getJsErrorInfoByPage,
    getJsErrorInfoStackCode,
    getJsErrorInfoPcCount,
    getJsErrorInfoIosCount,
    getJsErrorInfOAndroidCount,
    getJsErrorInfoByUser,
}
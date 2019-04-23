import JSON2 from 'JSON2';
import nodemailer from 'nodemailer';
const SourceMapConsumer = require('source-map').SourceMapConsumer;
const promisify = require('util').promisify;
import path from 'path';
import fs from 'fs';
import utils from '../util/index.js';
import sequelize from '../config/db.js';
import config from '../config/index.js';
import util from '../util/index.js';
const JsErrorInfo = sequelize.import('../schema/jsErrorInfo.js');
JsErrorInfo.sync({force: false});

const readFile = promisify(fs.readFile);

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
    const sql = "select DATE_FORMAT(createdAt, '%Y-%m-%d') as day, count(errorMessage) as count from jsErrorInfos where monitorId='" + data.monitorId + "' and DATE_SUB(CURDATE(),INTERVAL " + data.days + " DAY) <= createdAt GROUP BY day";
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
 * 当日同一个页面url下的jsError数量达到一定峰值的时候触发报警
 * @param {*} data 
 */
const sendMailToUser = async (data) => {
    // 获取当前用户的邮箱账号
    let mail;

    const mailTransport = nodemailer.createTransport({
        host: 'smtp.163.com',
        port: '25',
        auth: {
            user: config.mail.user,
            pass: config.mail.pass, //授权码
        }
    });
    const html = "123";
    const mailInfo = {
        from: config.mail.user,
        to: mail,
        subject: '异常监控系统报警提醒',
        html,
    };
    mailTransport.sendMail(mailInfo, function (err, msg) {
        if (err) {
            console.log('mail sned error:', err);
        } else {
            console.log('报警邮件发送成功...');
        }
    });
}

/**
 * 寻找报错位置附近代码
 * @param {*} data 
 */
const getJsErrorInfoStackCode = async (data) => {
    const { row, col, url, errorMessage } = data;
    // 根据url获取js文件名，从而获取对应的sourceMap文件
    const fileName = path.basename(url, '.js');
    let sourceMapFileName = "";
    const fileDir = path.resolve(__dirname, '../publicFile/');
    const list = fs.readdirSync(fileDir);
    list.forEach(item => {
        if (item.includes(fileName)) {
            sourceMapFileName = item;
        }
    });
    // 根据对应的sourceMap文件获取源文件内容以及行列数
    const SourceMapData = await readFile(fileDir + '/' + sourceMapFileName);
    let sourceMapPath = {};
    const sourceMapContent = SourceMapData.toString();
    const sourceMapJson = JSON2.parse(sourceMapContent);
    const sources = sourceMapJson.sources;
    sources.forEach(item => {
        sourceMapPath[filterPath(item)] = item;
    });
    return new Promise((resolve, reject) => {
        SourceMapConsumer.with(sourceMapContent, null, consumer => {
            const result = consumer.originalPositionFor({
                line: parseInt(row),
                column: parseInt(col),
            });
            const originSource = sourceMapPath[result.source];
            const originContent = sourceMapJson.sourcesContent[sources.indexOf(originSource)];
        
            const obj =  {
                row: result.line,
                col: result.column,
                source: result.source,
                msg: errorMessage,
                file: originContent,
            };
            resolve(obj);
        });
    })
}

const filterPath = (path) => {
    return path.replace(/\.[\.\/]+/g, "");
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

/**
 * 获取当前用户所有的行为记录信息
 * @param {*} monitorIdSql 
 * @param {*} customerKeySql 
 * @param {*} happenTimeSql 
 */
const getBehaviorInfoByUser = async (monitorIdSql,  customerKeySql, happenTimeSql) => {
    const sql = "select * from jsErrorInfos where " + monitorIdSql + " and " + customerKeySql + " and" + happenTimeSql;
    return await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
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
    getBehaviorInfoByUser,
}
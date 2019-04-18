
import fetch from 'node-fetch';
import behaviorInfoModel from '../modules/behaviorInfo.js';
import jsErrorInfoModel from '../modules/jsErrorInfo.js';
import ignoreErrorModel from '../modules/ignoreError.js';
import httpLogInfoModel from '../modules/httpLogInfo.js';
import screenShotInfoModel from '../modules/screenShotInfo.js';
import customerPVModel from '../modules/customerPV.js';
import loadPageInfoModel from '../modules/loadPageInfo.js';
import projectModel from '../modules/project.js';
import userModel from '../modules/user.js';
import util from '../util/index.js';

const ipQuery = "http://ip.taobao.com/service/getIpInfo.php?ip=";

/**
 * 按上传类型分类处理并创建各自信息
 * @param {*} ctx 
 */
const uploadLog = async (ctx) => {
    let param;
    if (typeof ctx.request.body !== 'object') {
        param = JSON.parse(ctx.request.body).data;
    } else {
        param = ctx.request.body.data;
    }
    param = JSON.parse(param);

    const req = ctx.req;
    const clientIp = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    const ipQueryStr = ipQuery + clientIp;
    const ipInfoPro = await fetch(ipQueryStr)
    const ipInfo = await ipInfoPro.json();
    const { country, region, city } = ipInfo.data;

    const logInfoArray = param.logInfo.split("$$$");
    for(let i = 0; i < logInfoArray.length; i++) {
        if (!logInfoArray[i]) {
            continue;
        }
        const logInfo = JSON.parse(logInfoArray[i]);

        // 判断init时填入的userId和monitorId正确与否
        const { monitorId, userId } = logInfo;
        const isUser = await userModel.findUserByUserId(userId);
        if (!isUser) {
            ctx.response.status = 401;
            ctx.response.body = {
                code: 401,
                message: 'userId配置错误',
            }
            return;
        }
        const projectList = await projectModel.getProjectListByUserId(userId);
        let flag = false;
        flag = projectList.rows.every(item => {
            return item.monitorId !== monitorId;
        })
        if (flag) {
            ctx.response.status = 401;
            ctx.response.body = {
                code: 401,
                message: '该用户暂未接入对应monitorId项目的配置，请去配置页面获取monitorId',
            };
            return;
        }
        logInfo.ip = clientIp;
        logInfo.country = country || "未知";
        logInfo.province = region || "未知";
        logInfo.city = city || "未知";

        switch(logInfo.uploadType) {
            case 'BEHAVIOR_INFO':
                await behaviorInfoModel.createBehaviorInfo(logInfo);
                break;
            case 'JS_ERROR':
                const ignoreArr = await ignoreErrorModel.getIgnoreErrorByMsg(logInfo);
                if (!ignoreArr[0].count) {
                    await jsErrorInfoModel.create(logInfo);
                }
                break;
            case 'HTTP_LOG':
                await httpLogInfoModel.create(logInfo);
                break;
            case 'SCREEN_SHOT':
                await screenShotInfoModel.create(logInfo);
                break;
            case 'CUSTOMER_PV':
                await customerPVModel.createCustomerPV(logInfo);
                break;
            case 'LOAD_PAGE':
                await loadPageInfoModel.create(logInfo);
                break;
            default:
                console.log('暂不支持,上传类型未处理：', logInfo.uploadType);
                break;
        };
        
        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "创建uploadLog信息成功",
        };
    }
}

/**
 * 根据用户查询所有的行为记录
 * @param {*} ctx 
 */
const searchBehaviorRecord = async (ctx) => {
    const param = JSON.parse(ctx.request.body);
    param.happenTimeScope = new Date(util.addDays(0 - param.timeScope) + "00:00:00").getTime();
    let customerKeyList = [];
    // 查询当前用户的customerKey列表
    let startTime = new Date().getTime();
    const customerKeyData = await customerPVModel.getCustomerKeyByUserId(param);
    customerKeyData.forEach(item => {
        customerKeyList.push(item.customerKey);
    });
    let currentTime = new Date().getTime();
    console.log(`CustomerKeyResult获取时间：${currentTime - startTime}`);
    startTime = currentTime;

    // 拼接monitorIdSql/customerKeySql/happenTimeSql/userIdSql查询参数
    const monitorIdSql = " monitorIdSql='" + param.monitorId + "' ";
    const happenTimeSql = " happenTime>'" + param.happenTimeScope + "' ";
    const userIdSql = " userId='" + param.searchValue + "' ";
    let customerKeySql = "";
    if (customerKeyList.length) {
        customerKeyList.forEach((item, index) => {
            if (index === customerKeyList.length - 1) {
                customerKeySql += " customerKey='" + item + "' ";
            } else {
                customerKeySql += " customerKey='" + item + "' or ";
            }
        });
        customerKeySql = " (" + customerKeySql + ") ";
    } else {
        customerKeySql = " customerKey='" + param.searchValue + "' ";
    }

    const behaviorInfoResult = await behaviorInfoModel.getBehaviorInfoByUser(monitorIdSql, customerKeySql, happenTimeSql);
    const customerPVResult = await customerPVModel.getBehaviorInfoByUser(monitorIdSql, customerKeySql, happenTimeSql);
    const jsErrorInfoResult = await jsErrorInfoModel.getBehaviorInfoByUser(monitorIdSql, customerKeySql, happenTimeSql);
    const screenShotResult = await screenShotInfoModel.getScreenShotInfoByUser(monitorIdSql, userIdSql, happenTimeSql);
    const httpLogInfoResult = await httpLogInfoModel.getHttpLogInfoByUser(monitorIdSql, customerKeySql, happenTimeSql);
    
    const behaviorList = [].concat(behaviorInfoResult, customerPVResult, jsErrorInfoResult, screenShotResult, httpLogInfoResult);
    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: "查询信息成功",
        data: {
            behaviorList,
        }
    }
}

/**
 * 根据用户查询用户详细信息
 * @param {*} ctx 
 */
const searchCustomerInfo = async (ctx) => {
    const param = JSON.parse(ctx.request.body);
    param.happenTimeScope = new Date(util.addDays(0 - param.timeScope) + "00:00:00").getTime();
    let customerKeyList = [];
    const customerKeyData = await customerPVModel.getCustomerKeyByUserId(param);
    customerKeyData.forEach(item => {
        customerKeyList.push(item.customerKey);
    });
    // 拼接monitorIdSql/customerKeySql/happenTimeSql/userIdSql查询参数
    const monitorIdSql = " monitorIdSql='" + param.monitorId + "' ";
    const happenTimeSql = " happenTime>'" + param.happenTimeScope + "' ";
    let customerKeySql = "";
    if (customerKeyList.length) {
        customerKeyList.forEach((item, index) => {
            if (index === customerKeyList.length - 1) {
                customerKeySql += " customerKey='" + item + "' ";
            } else {
                customerKeySql += " customerKey='" + item + "' or ";
            }
        });
        customerKeySql = " (" + customerKeySql + ") ";
    } else {
        customerKeySql = " customerKey='" + param.searchValue + "' ";
    }
    let startTime = new Date().getTime();
    const customerDetailList = await customerPVModel.getCustomerDetailByCustomerKey(monitorIdSql, customerKeySql, happenTimeSql);
    let currentTime = new Date().getTime();
    console.log("个人信息获取时间：", currentTime - startTime);
    startTime = currentTime;
    
    const pvCountList = await customerPVModel.getCustomerPVByCustomerKey(monitorIdSql, customerKey, happenTimeSql);
    currentTime = new Date().getTime();
    console.log("PVcount获取时间：", currentTime - startTime);
    startTime = currentTime;

    const loadPageTimeList = await loadPageInfoModel.getPageLoadTimeByCustomerKey(monitorIdSql, customerKeySql, happenTimeSql);
    currentTime = new Date().getTime();
    console.log("loadPageTimeList获取时间：", currentTime - startTime);

    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: "查询信息成功",
        data: {
            pvCountList,
            loadPageTimeList,
            customerDetailList,
        },
    };
}

export default {
    uploadLog,
    searchBehaviorRecord,
    searchCustomerInfo,
}
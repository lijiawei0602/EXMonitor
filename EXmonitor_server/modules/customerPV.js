import sequelize from '../config/db.js';
import util from '../util/index.js';
const CustomerPV = sequelize.import('../schema/customerPV.js');
CustomerPV.sync({force: false});

/**
 * 创建用户PV
 * @param {*} data 用户pv
 */
const createCustomerPV = async (data) => {
    return await CustomerPV.create({
        ...data
    });
}

/**
 * 更新用户PV
 * @param {*} id 用户pv信息id
 * @param {*} data 待更新的用户pv信息
 */
const updateCustomerPV = async (id, data) => {
    await CustomerPV.update({
        ...data
    }, {
        where: {
            id,
        },
        fields: Object.keys(data),
    })
    return true;
}

/**
 * 获取用户pv列表
 */
const getCustomerPVList = async () => {
    return await CustomerPV.findAndCountAll();
}

/**
 * 根据id获取用户pv信息
 * @param {*} id 用户PV信息id
 */
const getCustomerPVDetail = async (id) => {
    return await CustomerPV.findOne({
        where: {
            id,
        }
    })
}

/**
 * 根据id删除用户pv
 * @param {*} id 用户pv信息id
 */
const deleteCustomerPV = async (id) => {
    await CustomerPV.destroy({
        where: {
            id,
        }
    });
    return true;
}

/**
 * 获取pc的pv
 * @param {*} param 
 */
const getCustomerPcPvCount = async (param) => {
    return await sequelize.query("select count(distinct pageKey) as count from CustomerPVs where monitorId='" + param.monitorId + "' and createdAt > '" + param.day + "' and os like web%", { type: sequelize.QueryTypes.SELECT });
}

const getCustomerIosPvCount = async (param) => {
    return await sequelize.query("select count(distinct pageKey) as count from CustomerPVs where monitorId='" + param.monitorId + "' and createdAt > '" + param.day + "' and os like ios%", { type: sequelize.QueryTypes.SELECT });
}

const getCustomerAndroidCount = async (param) => {
    return await sequelize.query("select count(distinct pageKey) as count from CustomerPVs where monitorId='" + param.monitorId + "' and createdAt > '" + param.day + "' and os like android%", { type: sequelize.QueryTypes.query });
}

/**
 * 获取日活量
 * @param {*} param 
 */
const getCustomerCountByTime = async (param) => {
    const endDate = util.addDays(0 - param.timeScope);
    const sql = "select date_format(createdAt, 'Y%-m%-d%') as day, count(distinct(customerKey)) as count from loadPageInfos where createdAt>'" + endDate + "' and monitorId='" + param.monitorId + "' group by day";
    return await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
}

/**
 * 根据customerKey获取用户详情
 * @param {*} monitorIdSql 
 * @param {*} customerKeySql 
 * @param {*} happenTimeSql 
 */
const getCustomerDetailByCustomerKey = async (monitorIdSql, customerKeySql, happenTimeSql) => {
    const sql = "select * from customerPVs where " + monitorIdSql + " and " + customerKeySql + " and " + happenTimeSql;
    return await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
}

/**
 * 根据customerKey获取用户访问每个页面的次数
 * @param {*} monitorIdSql 
 * @param {*} customerKeySql 
 * @param {*} happenTimeSql 
 */
const getCustomerPVByCustomerKey = async (monitorIdSql, customerKeySql, happenTimeSql) => {
    const sql = "select cast(simpleUrl as char) as simpleUrl, count(simpleUrl) where " + monitorIdSql + " and " + customerKeySql + " and " + happenTimeSql + " group by simpleUrl";
    return await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
}

/**
 * 根据userid获取所有的customerKey
 * @param {*} param 
 */
const getCustomerKeyByUserId = async (param) => {
    const createdAtTime = util.addDays(0 - param.timeScope) + "00:00:00";
    const sql = "select distinct(customerKey) from customerPVs where createdAt> '" + createdAtTime + "' and userId='" + param.searchValue + "'"
                + " union " +
                "select distinct(customerKey) from behaviorInfos where createdAt> '" + createdAtTime + "' and userId='" + param.searchValue + "'"
                + " union " +
                "select distinct(customerKey) from httpLogInfos where createdAt> '" + createdAtTime + "' and userId='" + param.searchValue + "'";
    return await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
}

/**
 * 查询当前用户所有的行为记录信息
 * @param {*} monitorIdSql 
 * @param {*} customerKeySql 
 * @param {*} happenTimeSql 
 */
const getBehaviorInfoByUser = async (monitorIdSql, customerKeySql, happenTimeSql) => {
    const sql = "select * from customerPVs where " + monitorIdSql + " and " + customerKeySql + " and " + happenTimeSql;
    return await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
}

export default {
    createCustomerPV,
    updateCustomerPV,
    getCustomerPVList,
    getCustomerPVDetail,
    deleteCustomerPV,
    getCustomerPcPvCount,
    getCustomerIosPvCount,
    getCustomerAndroidCount,
    getCustomerCountByTime,
    getCustomerDetailByCustomerKey,
    getCustomerPVByCustomerKey,
    getCustomerKeyByUserId,
    getBehaviorInfoByUser,
}
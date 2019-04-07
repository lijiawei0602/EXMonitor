import sequelize from '../config/db.js';
import util from '../util/index.js';
const LoadPageInfo = sequelize.import('../schema/loadPageInfo.js');
LoadPageInfo.sync({force: false});

const create = async (data) => {
    return await LoadPageInfo.create({
        ...data,
    });
}

const getLoadPageInfoList = async () => {
    return await LoadPageInfo.findAndCountAll();
}

const getLoadPageInfoDetail = async (id) => {
    return await LoadPageInfo.findOne({
        where: {
            id,
        }
    });
};

const update = async (id, data) => {
    await LoadPageInfo.update({
        ...data,
    }, {
        where: {
            id,
        },
        fileds: Object.keys(data),
    });
    return true;
}

const deleteLoadPageInfo = async (id) => {
    return LoadPageInfo.destroy({
        where: {
            id,
        }
    });
    return true;
}

/**
 * 根据customerKey获取用户访问每个页面的平均请求时间
 * @param {*} monitorSql 
 * @param {*} customerSql 
 * @param {*} happenTimeSql 
 */
const getPageLoadTimeByCustomerKey = async (monitorSql, customerSql, happenTimeSql) => {
    const sql = "select cast(simpleUrl as char) as simpleUrl, count(simpleUrl) as urlCount, avg(loadPage) as loadPage, avg(domReady) as domReady, avg(request) as resource, avg(lookupDomain) as DNS from loadPageInfos where loadPage>0 and " + happenTimeSql + " and " + customerSql + " and " + monitorSql + " group by simpleUrl order by urlCount desc";
    return await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
}

/**
 * 获取当日页面加载的平均时间
 * @param {*} param 
 */
const getLoadPageTimeByDate = async (param) => {
    const endDate = util.addDays(0 - param.timeScope);
    const sql = "select cast(simpleUrl as char) as simpleUrl, count(simpleUrl) as urlCount, avg(loadPage) as loadPage, avg(request) as resource, avg(lookupDomain) as DNS from loadPageInfos where createdAt>'" + endDate + "' and loadPage>1 and loadPage<15000 and monitorId='" + param.monitorId + "' group by simpleUrl having urlCount>50 order by loadPage desc limit 15";
    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
}

export default {
    create,
    getLoadPageInfoList,
    getLoadPageInfoDetail,
    update,
    deleteLoadPageInfo,
    getPageLoadTimeByCustomerKey,
    getLoadPageTimeByDate,
}
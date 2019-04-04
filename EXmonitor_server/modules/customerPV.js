import sequelize from '../config/db.js';
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
    return await CustomerPV.destroy({
        where: {
            id,
        }
    });
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

export default {
    createCustomerPV,
    updateCustomerPV,
    getCustomerPVList,
    getCustomerPVDetail,
    deleteCustomerPV,
    getCustomerPcPvCount,
    getCustomerIosPvCount,
    getCustomerAndroidCount,
}
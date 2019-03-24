import sequelize from '../config/db.js';
const BehaviorInfo = sequelize.import('../schema/behaviorInfo.js');
BehaviorInfo.sync({force: false});

/**
 * 创建行为信息
 * @param {*} data 行为信息
 */
const createBehaviorInfo = async (data) => {
    return await BehaviorInfo.create({
        ...data
    });
}

/**
 * 更新行为信息
 * @param {*} id 所要更新行为信息的id
 * @param {*} data 更新的行为信息
 */
const updateBehaviorInfo = async (id, data) => {
    await BehaviorInfo.update({
        ...data
    }, {
        where: {
            id,
        },
        fields: Object.keys(data),  // 所要更新的字段
    });
    return true;
}

/**
 * 获取行为信息列表
 */
const getBehaviorInfoList = async () => {
    await BehaviorInfo.findAndCountAll();
}

/**
 * 获取某项行为信息
 * @param {*} id 行为信息id
 */
const getBehaviorInfoDetail = async (id) => {
    await BehaviorInfo.findOne({
        where: {
            id,
        },
    });
};

/**
 * 删除某项行为信息
 * @param {*} id 行为信息id
 */
const deleteBehaviorInfo = async (id) => {
    await BehaviorInfo.destroy({
        where: {
            id,
        },
    });
    return true;
};


export default {
    createBehaviorInfo,
    updateBehaviorInfo,
    getBehaviorInfoList,
    getBehaviorInfoDetail,
    deleteBehaviorInfo
}


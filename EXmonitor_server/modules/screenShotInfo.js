import sequelize from '../config/db.js';
const ScreenShotInfo = sequelize.import('../schema/screenShotInfo.js');
ScreenShotInfo.sync({ force: false });

const create = async (data) => {
    return await ScreenShotInfo.create({
        ...data,
    });
};

const update = async (id, data) => {
    await ScreenShotInfo.update({
        ...data
    }, {
        where: {
            id,
        },
        fields: Object.keys(data),
    });
    return true;
};

const getScreenShotInfoList = async () => {
    return await ScreenShotInfo.findAndCountAll();
};

const getScreenShotInfoDetail = async (id) => {
    return await ScreenShotInfo.findOne({
        where: {
            id,
        },
    });
};


const deleteScreenShotInfo = async (id) => {
    await ScreenShotInfo.destroy({
        where: {
            id,
        },
    });
    return true;
}

const getScreenShotInfoByUser = async (monitorSql, userIdSql, happenTimeSql) => {
    const sql = "select * from screenShotInfos where " + monitorSql + " and " + happenTimeSql + " and " + userIdSql + "'";
    return await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
}

const getScreenShotTrack = async (startTime, endTime, customerKey) => {
    endTime = (Number(endTime) + 4000).toString();
    return ScreenShotInfo.findAll({
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
    getScreenShotInfoList,
    getScreenShotInfoDetail,
    deleteScreenShotInfo,
    getScreenShotInfoByUser,
    getScreenShotTrack,
}
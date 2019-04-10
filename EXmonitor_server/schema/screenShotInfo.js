import baseInfo from './baseInfo.js';

const screenShotInfo = (sequelize, DataTypes) => {
    return sequelize.define('screenShotInfo', {
        ...baseInfo(DataTypes),
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        // 描述信息
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'description',
        },
        // 截屏图片地址
        screenInfo: {
            type: 'mediumblob',
            allowNull: true,
            field: 'screenInfo',
        },
        imgType: {
            type: DataTypes.STRING(10),
            allowNull: true,
            field: 'imgType',
        },
    }, {
        freezeTableName: false,
        indexes: [
            {
              name: "searchIndex",
              method: "BTREE",
              fields: [
                {
                  attribute: "userId",
                },
                {
                  attribute: "customerKey",
                },
                {
                  attribute: "createdAt",
                }
              ]
            }
        ]
    });
};

export default screenShotInfo;
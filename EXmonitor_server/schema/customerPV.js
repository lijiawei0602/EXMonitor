import baseInfo from './baseInfo.js';

const customerPV = (sequelize, DataTypes) => {
    return sequelize.define('customerPV', {
        ...baseInfo(DataTypes),
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        // 用户标识id
        pageKey: {
            type: DataTypes.STRING(36),
            allowNull: true,
            field: 'pageKey',
        },
        // 设备名称
        deviceName: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'deviceName',
        },
        // 系统信息
        os: {
            type: DataTypes.STRING(20),
            allowNull: true,
            field: 'os',
        },
        // 浏览器名称
        browserName: {
            type: DataTypes.STRING(20),
            allowNull: true,
            field: 'browserName',
        },
        // 浏览器版本
        browserVersion: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'browserVersion',
        },
        // 用户ip
        ip: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: 'ip',
        },
        // 国家
        country: {
            type: DataTypes.STRING(20),
            allowNull: true,
            field: 'country',
        },
        // 省份
        province: {
            type: DataTypes.STRING(20),
            allowNull: true,
            field: 'province',
        },
        // 城市
        city: {
            type: DataTypes.STRING(30),
            allowNull: true,
            field: 'city',
        },
        // 行为类型
        uploadType: {
            type: DataTypes.STRING(20),
            allowNull: true,
            field: 'uploadType',
        },
        // 加载类型（首次加载还是reload）
        loadType: {
            type: DataTypes.STRING(10),
            allowNull: true,
            field: 'loadType',
        },
        // 加载时间
        loadTime: {
            type: DataTypes.STRING(10),
            allowNull: true,
            field: 'loadTime',
        },
    }, {
        freezeTableName: false,
        indexes: [
            {
                name: 'userIdIndex',
                fields: [
                    { attribute: 'userId' }
                ]
            },
            {
                name: 'customerKeyIndex',
                fields: [
                    { attribute: 'customerKey' }
                ]
            },
            {
                name: 'createdAtIndex',
                fields: [
                    { attribute: 'createdAt' }
                ]
            },
            {
                name: 'updatedAtIndex',
                fields: [
                    { attribute: 'updatedAt' }
                ]
            },
            {
                name: 'happentimeIndex',
                fields: [
                    { attribute: 'happenTime' }
                ]
            }
        ]
    })
}

export default customerPV;
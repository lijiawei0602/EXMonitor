import baseInfo from './baseInfo.js';

const jsErrorInfo = (sequelize, DataTypes) => {
    return sequelize.define('jsErrorInfo', {
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
            field: 'deviceName'
        },
        // 系统信息
        os: {
            type: DataTypes.STRING(20),
            allowNull: true,
            field: 'os'
        },
        // 浏览器名称
        browserName: {
            type: DataTypes.STRING(20),
            allowNull: true,
            field: 'browserName'
        },
        // 浏览器版本号
        browserVersion: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'browserVersion'
        },
        // 用户的IP
        ip: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: 'ip'
        },
        // 国家
        country: {
            type: DataTypes.STRING(20),
            allowNull: true,
            field: 'country'
        },
        // 省份
        province: {
            type: DataTypes.STRING(30),
            allowNull: true,
            field: 'province'
        },
        // 城市
        city: {
            type: DataTypes.STRING(30),
            allowNull: true,
            field: 'city'
        },
        // js报错信息
        errorMessage: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'errorMessage',
        },
        // js报错堆栈
        errorStack: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'errorStack',
        },
        url: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'url',
        },
        row: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'row',
        },
        col: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'col',
        },
        // 浏览器信息
        browserInfo: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'browserInfo',
        },
    }, {
        freezeTableName: false,
        indexes: [
            {
              name: "userIdIndex",
              method: "BTREE",
              fields: [
                {
                  attribute: "userId"
                }
              ]
            },
            {
              name: "customerKeyIndex",
              method: "BTREE",
              fields: [
                {
                  attribute: "customerKey"
                }
              ]
            },
            {
              name: "createdAtIndex",
              method: "BTREE",
              fields: [
                {
                  attribute: "createdAt"
                }
              ]
            },
            {
              name: "happenTimeIndex",
              method: "BTREE",
              fields: [
                {
                  attribute: "happenTime"
                }
              ]
            }
          ]
    })
}

export default jsErrorInfo;
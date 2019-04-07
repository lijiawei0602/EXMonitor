import baseInfo from './baseInfo.js';

const loadPageInfo = (sequelize, DataTypes) => {
    return sequelize.define('loadPageInfo', {
        ...baseInfo(DataTypes),
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        loadPage: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'loadPage',
        },
        domReady: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'domReady',
        },
        lookupDomain: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'lookupDomain',
        },
        redirect: {
            type: DataTypes.INTEGER,
            allowNull: true,
            filed: 'redirect',
        },
        request: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'request',
        },
        loadEvent: {
            type: DataTypes.INTEGER,
            allowNull: true,
            filed: 'loadEvent',
        },
        uploadEvent: {
            type: DataTypes.INTEGER,
            allowNull: true,
            filed: 'uploadEvent',
        },
        connect: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'connect',
        },
        loadType: {
            type: DataTypes.STRING(20),
            allowNull: true,
            field: 'loadType',
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
            },
        ],
    });
}
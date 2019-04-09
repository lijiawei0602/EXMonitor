import baseInfo from "./baseInfo";

const httpLogInfo = (sequelize, DataTypes) => {
    return sequelize.define('httpLogInfo', {
        ...baseInfo(DataTypes),
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        httpUrl: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'httpUrl',
        },
        simpleHttpUrl: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'simpleHttpUrl',
        },
        status: {
            type: DataTypes.STRING(10),
            allowNull: true,
            field: 'status',
        },
        statusText: {
            type: DataTypes.STRING(20),
            allowNull: true,
            field: 'statusText',
        },
        statusResult: {
            type: DataTypes.STRING(20),
            allowNull: true,
            field: 'statusResult',
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

export default httpLogInfo;
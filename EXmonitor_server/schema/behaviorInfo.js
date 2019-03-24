import baseInfo from './baseInfo.js';
const behaviorInfo =  (sequelize, DataTypes) => {
    return sequelize.define('behaviorInfo', {
        ...baseInfo(DataTypes),
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        // 行为类型
        behaviorType: {
            type: DataTypes.STRING(20),
            allowNull: true,
            field: 'behaviorType',
        },
        // 标签名
        tagName: {
            type: DataTypes.STRING(15),
            allowNull: true,
            field: 'tagName',
        },
        // 元素的类名
        className: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'className',
        },
        // 元素包含的内容
        innerText: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'innerText',
        },
        // input的输入内容
        inputValue: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'inputValue',
        },
        // input框的placeholder
        placeholder: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'placehodler',
        },

    }, {
        freezeTableName: false,
        // 建立普通索引
        indexes: [
            {
                name: 'userIdIndex',
                fields: [
                    { attribute: 'userId' },
                ]
            },
            {
                name: 'customerKeyIndex',
                fields: [
                    { attribute: 'customerKey' },
                ],
            },
            {
                name: 'createdAtIndex',
                fields: [
                    { attribute: 'createdAt' },
                ]
            },
            {
                name: 'happenTimeIndex',
                fields: [
                    { attribute: 'happenTime' }
                ],
            }
        ]
    })
};

export default behaviorInfo;
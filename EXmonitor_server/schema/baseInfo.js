import moment from 'moment';
const baseInfo = (DataTypes) => {
    return {
        // 日志类型
        uploadType: {
            type: DataTypes.STRING(20),
            allowNull: true,
            field: 'uploadType',
        },
        // 发生时间
        happenTime: {
            type: DataTypes.STRING(20),
            allowNull: true,
            field: 'happenTime',
        },
        // 监控ID
        monitorId: {
            type: DataTypes.STRING(36),
            allowNull: true,
            field: 'monitorId',
        },
        // 用户标识ID
        customerKey: {
            type: DataTypes.STRING(36),
            allowNull: true,
            field: 'customerKey',
        },
        // 发生的页面URL
        simpleUrl: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'simpleUrl',
        },
        // 发生的页面完整的URL
        completeUrl: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'completeUrl',
        },
        // 自定义用户标识ID
        userId: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'userId',
        },
        // 自定义用户参数1
        firstUserParam: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'firstUserParam',
        },
        // 自定义用户参数2
        secondUserParam: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'secondUserParam',
        },
        createdAt: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
            },
        },
        updatedAt: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
            },
        },
    }
}

export default baseInfo;
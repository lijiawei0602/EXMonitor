import moment from 'moment';

const project = (sequelize, DataTypes) => {
    return sequelize.define('project', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        // 监控id
        monitorId: {
            type: DataTypes.STRING(36),
            allowNull: false,
            field: 'monitorId',
        },
        // 项目名称
        projectName: {
            type: DataTypes.STRING(20),
            allowNull: true,
            field: 'projectName',
        },
        // 监控代码
        monitorCode: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'monitorCode',
        },
        // fetch代码
        fetchCode: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'fetchCode',
        },
        // 过滤的域名
        filterDomain: {
            type: DataTypes.STRING(200),
            allowNull: true,
            field: 'filterDomain',
        },
        // 过滤类型
        filterType: {
            type: DataTypes.STRING(20),
            allowNull: true,
            field: 'filterType',
        },
        // 是否记录
        recording: {
            type: DataTypes.STRING(2),
            allowNull: true,
            field: 'recording',
        },
        createdAt: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDateValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        updatedAt: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDateValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    }, {
        freezeTableName: false,
    })
}

export default project;
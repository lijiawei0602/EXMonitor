const ignoreError = (sequelize, DataTypes) => {
    return sequelize.define('ignoreError', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        ignoreErrorMessage: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'ignoreErrorMessage',
        },
        // 区分异常已解决还是已忽略
        type: {
            type: DataTypes.STRING(10),
            allowNull: true,
            field: 'type',
        },
        // 监控id
        monitorId: {
            type: DataTypes.STRING(36),
            allowNull: true,
            field: 'monitorId',
        },
        createdAt: {
            type: DataTypes.DATE,
            get() {
                const createAt = this.getDataValue('createdAt');
                return moment(createAt).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        updatedAt: {
            type: DataTypes.DATE,
            get() {
                const updateAt = this.getDataValue('updatedAt');
                return moment(updateAt).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    }, {
        freezeTableName: false,
    })
}

export default ignoreError;
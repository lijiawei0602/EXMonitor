const mail = (sequelize, DataTypes) => {
    return sequelize.define('mail', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        account: {
            type: DataTypes.STRING(30),
            allowNull: true,
            field: 'account',
        },
        monitorId: {
            type: DataTypes.STRING(36),
            allowNull: true,
            field: 'monitorId',
        },
        userId: {
            type: DataTypes.STRING(20),
            allowNull: true,
            field: 'userId',
        },
        projectName: {
            type: DataTypes.STRING(36),
            allowNull: true,
            field: 'projectName',
        },
    })
}

export default mail;
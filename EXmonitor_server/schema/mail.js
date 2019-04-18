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
    })
}

export default mail;
import Sequelize from 'sequelize';
import config from './index.js';

const { host, dbname, username, password } = config.database;

const sequelize = new Sequelize(dbname, username, password, {
    host: host,
    dialect: 'mysql',
    pool: {
        max: 30,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    timezone: '+08:00'
});

export default sequelize;
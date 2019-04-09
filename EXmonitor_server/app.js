import Koa from 'koa';
import cors from 'koa2-cors';
import json from 'koa-json';
import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import onerror from 'koa-onerror';
const static1 = require('koa-static');
import jwt from 'koa-jwt';

import router from './routes';
import config from './config'
import sequelize from './config/db.js';

const app = new Koa();

onerror(app);

// 设置跨越cors
app.use(cors());
// 更好的形式将json数据输出
app.use(json());
app.use(static1(__dirname + '/publicFile'));
// 打印日志
app.use(logger());
// 解析body
app.use(bodyparser());

app.use(router.routes());
app.use(router.allowedMethods());

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

/**
 * listen默认是ipv6，为了获取到客户端请求的ip，故指定0.0.0.0强制指定为ipv4
 * [文档介绍]:https://iojs.org/api/net.html#net_server_listen_port_hostname_backlog_callback
 *  */
app.listen(config.app.port, '0.0.0.0', () => {
    console.log('The server is listen to http://localhost:' + config.app.port);
});

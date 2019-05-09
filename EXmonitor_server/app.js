import Koa from 'koa';
import cors from 'koa2-cors';
import json from 'koa-json';
import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import onerror from 'koa-onerror';
const static1 = require('koa-static');
import jwt from 'koa-jwt';
import KoaBody from 'koa-body';

import router from './routes';
import config from './config'
import sequelize from './config/db.js';

const app = new Koa();

onerror(app);

// 设置跨越cors
app.use(cors());
// 更好的形式将json数据输出
app.use(json());
app.use(static1(__dirname));
// 打印日志
app.use(logger());
// 处理文件上传 ctx.request.files.
// app.use(KoaBody({
//     multipart: true,
//     formidable: {
//         // maxFieldsSize: 20 * 1024 * 1024,
//     },
// }));
// 解析body
app.use(bodyparser({
    formLimit: "1024mb",
    jsonLimit: "1024mb",
    textLimit: "1024mb",
}));

app.use(router.routes());
app.use(router.allowedMethods());

/**
 * listen默认是ipv6，为了获取到客户端请求的ip，故指定0.0.0.0强制指定为ipv4
 * [文档介绍]:https://iojs.org/api/net.html#net_server_listen_port_hostname_backlog_callback
 *  */
app.listen(config.app.port, '0.0.0.0', () => {
    console.log('The server is listen to http://localhost:' + config.app.port);
});

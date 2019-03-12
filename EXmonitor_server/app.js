import Koa from 'koa';
import cors from 'koa2-cors';
import json from 'koa-json';
import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import onerror from 'koa-onerror';
import jwt from 'koa-jwt';

import router from './routes';
import config from './config'

const app = new Koa();

onerror(app);

// 设置跨越cors
app.use(cors());
// 更好的形式将json数据输出
app.use(json());
// 打印日志
app.use(logger());
// 解析body
app.use(bodyparser());

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.app.port, () => {
    console.log('The server is listen to http://localhost:' + config.app.port);
});

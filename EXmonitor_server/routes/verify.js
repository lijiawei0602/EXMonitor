import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export default async (ctx, next) => {
    const authorization = ctx.get('Authorization');
    if (!authorization) {
        ctx.response.status = 401;
        ctx.response.body = {
            code: 401,
            message: '无权限，请登录',
        }
        return;
    }
    const token = authorization.split(" ")[1];
    try {
        let tokenContent = await jwt.verify(token, config.jwtConfig.secret);
        console.log(tokenContent);
        await next();
    } catch (error) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
            ctx.response.status = 401;
            ctx.response.body = {
                code: 401,
                message: 'Token已失效，请重新登录',
            }
            return;
        }
        ctx.response.status = 401;
        ctx.response.body = {
            code: 401,
            message: 'Token非法，请重新登录',
        }
        return;
    }
}

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import util from 'util';

import userModel from '../modules/user.js';
import config from '../config/index.js';

const verify = util.promisify(jwt.verify);
const { secret } = config.jwtConfig;

/**
 * 创建用户
 * @param ctx 
 * @returns {Promise<void>}
 */
const create = async (ctx) => {
    const user = ctx.request.body;
    const { userId, password } = user;
    if (userId && password) {
        // 判断是否已存在该用户名
        const exitUser = await userModel.findUserByUserId(userId);
        if (exitUser) {
            ctx.response.status = 200;
            ctx.body = {
                code: 403,
                msg: "创建失败，该用户已存在",
            };
        } else {
            // 对密码进行加密(前端对密码已加密)
            // const salt = bcrypt.genSaltSync();
            // const hash = bcrypt.hashSync(password, salt);
            // user.password = hash;

            await userModel.create(user);
            const newUser = userModel.findUserByUserId(userId);

            // 签发token，用于后续操作鉴权
            const token = jwt.sign({
                userId,
                id: newUser.id
            }, secret, { expiresIn: '7d' });

            ctx.response.status = 200;
            ctx.body =  {
                code: 200,
                msg: "创建用户成功",
                data: {
                    userId: newUser.userId,
                    token,
                },
            };
        }
    } else {
        ctx.response.status = 200;
        ctx.body = {
            code: 400,
            msg: "创建失败，参数错误",
        }
    }
}

/**
 * 用户登录
 * @param ctx 
 */
const login = async (ctx) => {
    const params = ctx.request.body;
    let user = await userModel.findUserByUserId(params.userId);
    if (user) {
        // user = user.dataValues;
        if (user.password === params.password) {
            const payload = {
                id: user.id,
                userId: user.userId,
            };
            const token = jwt.sign(payload, secret, { expiresIn: '7d' });
            ctx.response.status = 200;
            ctx.body = {
                code: 200,
                msg: "登录成功",
                data: {
                    id: user.id,
                    userId: user.userId,
                    token,
                }
            };
        } else {
            ctx.response.status = 200;
            ctx.body = {
                code: 400,
                msg: "登录失败，密码不正确",
            }
        }
    } else {
        ctx.response.status = 200;
        ctx.body = {
            code: 400,
            msg: "登录失败，用户名不正确",
        };
    }
}

/**
 * 查询用户信息
 * @param ctx 
 */
const getUserInfo = async (ctx) => {
    const token = ctx.header.authorization;
    if (token) {
        let payload;
        try {
            payload = await verify(token.split(' ')[1], secret);
            const user = {
                id: payload.id,
                userId: payload.userId,
            };
            ctx.response.status = 200;
            ctx.body = {
                code: 200,
                msg: '查询成功',
                data: {
                    user,
                },
            };
        } catch (error) {
            console.log(error);
            ctx.response.status = 200;
            ctx.body = {
                code: 401,
                msg: "查询失败，authorization error",
            };
        }
    } else {
        ctx.response.status = 200;
        ctx.body = {
            code: 401,
            msg: "查询失败，not authorization",
        };
    }
}

const getUserByUserId = async (ctx) => {
    const userId = ctx.params.userId;
    const user = await userModel.findUserByUserId(userId);
    ctx.response.status = 200;
    ctx.body = {
        code: 200,
        msg: '查询成功',
        data: {
            user,
        },
    };
}

/**
 * 删除用户
 * @param ctx
 */
const deleteUser = async (ctx) => {
    const { id } = ctx.params;
    if (id && !isNaN(id)) {
        await userModel.deleteUserById(id);
        ctx.response.status = 200;
        ctx.body = {
            code: 200,
            msg: "删除用户成功",
        }
    } else {
        ctx.response.status = 200;
        ctx.body = {
            code: 400,
            msg: "删除用户失败，参数错误",
        }
    }
}

/**
 * 获取用户列表
 * @param ctx 
 */
const getUserList = async (ctx) => {
    const userList = await userModel.findAllUserList();
    ctx.response.status = 200;
    ctx.body = {
        code: 200,
        msg: "获取用户列表成功",
        data: {
            userList,
        },
    };
}

export default {
    create,
    login,
    getUserInfo,
    getUserByUserId,
    deleteUser,
    getUserList,
};


import Router from 'koa-router';

import config from '../config';
import userController from '../controller/user.js';

const router = new Router({
    prefix: config.app.base,
});

/**
 * 用户相关
 */
// 用户注册
router.post('/user', userController.create);
// 用户登录
router.post('/user/login', userController.login);
// 用户信息
router.get('/user', userController.getUserInfo);
// 用户列表
router.get('/user/list', userController.getUserList);
// 删除用户
router.delete('/user/:id', userController.deleteUser);


export default router;
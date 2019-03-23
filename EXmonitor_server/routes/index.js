import Router from 'koa-router';

import config from '../config';
import userController from '../controller/user.js';
import projectController from '../controller/project.js';

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

/**
 * 项目相关 
 */
// 添加项目
router.post('/project', projectController.create);
// 根据id获取项目信息
router.get('/project/:id', projectController.getProjectById);
// 获取项目列表
router.get('/project/list', projectController.getProjectList);



export default router;
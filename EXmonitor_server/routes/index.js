import Router from 'koa-router';

import config from '../config';
import userController from '../controller/user.js';
import projectController from '../controller/project.js';
import behaviorInfoController from '../controller/behaviorInfo.js';
import customerPVController from '../controller/customerPV.js';
import loadPageInfoController from '../controller/loadPageInfo.js';
import jsErrorInfoController from '../controller/jsErrorInfo.js';
import screenShotInfoController from '../controller/screenShotInfo.js';
import ignoreErrorController from '../controller/ignoreError.js';
import commonController from '../controller/common.js';
import sourceMapController from '../controller/sourceMap.js';
import mailController from '../controller/mail.js';
import generateController from '../controller/generate.js';

const router = new Router({
    prefix: config.app.base,
});


/**
 * 日志相关处理
 */
router.post('/uploadLog', commonController.uploadLog);

/**
 * 查询用户相关信息
 */
// 根据用户查询所有的行为记录
router.post('/searchBehaviorRecord', commonController.searchBehaviorRecord);
// 根据用户查询用户详细信息
router.post('/searchCustomerInfo', commonController.searchCustomerInfo);

/**
 * 用户相关
 */
// 用户注册
router.post('/user', userController.create);
// 用户登录
router.post('/user/login', userController.login);
// 用户信息
router.get('/user', userController.getUserInfo);
// router.get('/getUserByUserId/:userId', userController.getUserByUserId);
// 用户列表
router.get('/user/list', userController.getUserList);
// 删除用户
router.delete('/user/:id', userController.deleteUser);

/**
 * 生成monitorId并创建project
 */
router.post('/generate', generateController.create);

/**
 * 项目相关 
 */
// 添加项目
router.post('/project', projectController.create);
// 根据userId获取projectList
router.get('/projectList', projectController.getProjectListByUserId);
router.get('/getProjectByMonitorId', projectController.getProjectByMonitorId);
// 获取项目列表
router.get('/project/list', projectController.getProjectList);
// 根据id获取项目信息
router.get('/project/:id', projectController.getProjectById);

/**
 * 行为信息
 */
// 创建行为信息
router.post('/behaviorInfo', behaviorInfoController.create);
// 获取行为信息列表
router.get('/behaviorInfo/list', behaviorInfoController.getBehaviorInfoList);
// 根据id获取行为信息
router.get('/behaviorInfo/:id', behaviorInfoController.getBehaviorInfoDetail);
// 根据id删除行为信息
router.delete('/behaviorInfo/:id', behaviorInfoController.deleteBehaviorInfo);
// 根据id更新行为信息
router.put('/behaviorInfo/:id', behaviorInfoController.updateBehaviorInfo);

/**
 * 用户PV信息
 */
// 创建用户pv信息
router.post('/customerPV', customerPVController.create);
// 获取用户pv信息列表
router.get('/customerPV/list', customerPVController.getCustomerPVList);
// 根据id获取用户pv信息
router.get('/customerPV/:id', customerPVController.getCustomerPVDetail);
// 删除pv
router.delete('/customerPV', customerPVController.deleteCustomerPV);
// 更新pv
router.put('/customerPV', customerPVController.update);
// 获取日活量
router.get('/getCustomerCountByTime', customerPVController.getCustomerCountByTime);

/**
* 用户加载页面信息
*/
router.post('/loadPageInfo', loadPageInfoController.create);
router.get('/loadPageInfo/:id', loadPageInfoController.getLoadPageInfoList);
router.delete('/loadPageInfo/:id', loadPageInfoController.deleteLoadPageInfo);
router.put('/loadPageInfo/:id', loadPageInfoController.updateLoadPageInfo);
//获取当日页面加载的平均时间
router.post('/getLoadPageInfoTimeByDate', loadPageInfoController.getLoadPageInfoTimeByDate);


/**
* js错误信息
*/
// 创建jsErrorInfo
router.post('/jsErrorInfo', jsErrorInfoController.create);
// 获取js错误列表
router.get('/jsErrorInfoList', jsErrorInfoController.getJsErrorInfoList);
// 获取指定应用错误列表
router.get('/getJsErrorInfoListByMonitorId', jsErrorInfoController.getJsErrorInfoListByMonitorId);
// 获取js错误详情
router.get('/jsErrorInfo/:id', jsErrorInfoController.getErrorInfoDetailById);
// 删除
router.delete('/jsErrorInfo/:id', jsErrorInfoController.deleteJsErrorInfoById);
// 更新
router.put('/jsErrorInfo/:id', jsErrorInfoController.updateJsErrorInfoById);
// 获取指定天数内的jsErrorInfo数量
router.get('/getJsErrorInfoDaysAgo', jsErrorInfoController.getJsErrorInfoCountByDay);
// 获取指定时间段内的jsErrorInfo信息数量
router.get('/getJsErrorInfoTimesAgo', jsErrorInfoController.getJsErrorInfoCountByTime);
// 根据js错误数量进行分类排序
router.get('/getJsErrorInfoSort', jsErrorInfoController.getJsErrorInfoSort);
// 获取各种平台js错误信息
router.get('/getJsErrorInfoCountByOs', jsErrorInfoController.getJsErrorInfoByOs);
// 根据errorMsg获取jsErrorInfo列表
router.post('/getJsErrorInfoListByMsg', jsErrorInfoController.getJsErrorInfoByMsg);
// 根据errorMsg获取受影响的用户数量
router.post('/getJsErrorInfoListAffect', jsErrorInfoController.getJsErrorInfoAffectCount);
// 根据页面信息获取jsErrorInfo列表
router.get('/getJsErrorInfoListByPage', jsErrorInfoController.getJsErrorInfoByPage);
// 定位js错误代码
router.get('/getJsErrorInfoStackCode/:id', jsErrorInfoController.getJsErrorInfoStackCode);

/**
* js错误信息截屏
*/
router.post('/screenShotInfo', screenShotInfoController.create);
router.get('/getScreenShotInfoList', screenShotInfoController.getScreenShotInfoList);
router.get('/screenShotInfo/:id', screenShotInfoController.getScreenShotInfoDetail);
router.delete('/screenShotInfo/:id', screenShotInfoController.deleteScreenShotInfo);

/**
* 忽略js错误信息
*/
router.post('/ignoreError', ignoreErrorController.create);
router.get('/getIgnoreErrorList', ignoreErrorController.getIgnoreErrorList);
router.get('/ignoreError/:id', ignoreErrorController.getIgnoreErrorDetail);
router.put('/ignoreError/:id', ignoreErrorController.update);
router.delete('/ignoreError/:id', ignoreErrorController.deleteIgnoreError);
router.get('/getIgnoreErrorByApplication', ignoreErrorController.getIgnoreErrorInfoByApplication);

/**
 * 报警邮箱
 */
router.post('/mail', mailController.create);
router.get('/mailList',mailController.getMailListByMonitorId);
router.get('/mail/list', mailController.getMailListByUserId);
router.delete('/mail', mailController.deleteMail);
router.post('/dispatch', mailController.dispatch);

/**
 * 处理上传sourceMap文件上传
 */
// http://localhost:8086/view/sourcemap/build/index.html 上传sourcemap文件页面
router.post('/sourceMap', sourceMapController.uploadFile);

export default router;
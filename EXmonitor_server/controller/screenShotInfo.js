import multiparty from 'multiparty';
import moment from 'moment';
import fs from 'fs';
const promisify = require('util').promisify;
import config from '../config/index.js';
import screenShotInfoModel from '../modules/screenShotInfo.js';

const { screenShotConfig } = config;
const rename = promisify(fs.rename);

const create = async (ctx) => {
    // return new Promise((resolve, reject) => {
    //     // 处理上传照片
    //     const form = new multiparty.Form({ uploadDir: screenShotConfig.uploadDir });
    //     form.parse(ctx.req, async(err, fields, files) => {
    //         if (err) {
    //             console.log("Parse err", err);
    //             ctx.response.status = 500;
    //             ctx.response.body = {
    //                 code: 500,
    //                 message: err.message,
    //             }
    //         } else {
    //             if (!files.file) {
    //                 ctx.response.status = 400;
    //                 ctx.response.body = {
    //                     code: 400,
    //                     message: "创建失败，请求参数中未带文件",
    //                 }
    //                 resolve();
    //             }
    //             const screenInfo = await handleFile(ctx.req, ctx.res, files);
    //             if (screenInfo) {
    //                 let otherParams = {};
    //                 Object.entries(fields).forEach(item => {
    //                     otherParams[item[0]] = item[1][0];
    //                 });
    //                 const imgType = files.file[0].originalFilename.split('.')[1];
    //                 const params = { ...otherParams, screenInfo, imgType, };
    //                 const res = await screenShotInfoModel.create(params);
    //                 const data = await screenShotInfoModel.getScreenShotInfoDetail(res.id);
    //                 ctx.response.status = 200;
    //                 ctx.response.body = {
    //                     code: 200,
    //                     message: "创建成功",
    //                     data: {
    //                         data,
    //                     },
    //                 };
    //             }
    //             resolve();
    //         }
    //     });
    // });
    const params = ctx.request.body;
    params.screenInfo = decodeURIComponent(params.screenInfo);
    const res = await screenShotInfoModel.create(params);
    const data = await screenShotInfoModel.getScreenShotInfoDetail(res.id);
    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: "创建成功",
        data: {
            data,
        },
    };
}

const getScreenShotInfoList = async (ctx) => {
    const data =  await screenShotInfoModel.getScreenShotInfoList();
    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: "查询成功",
        data: {
            data,
        }
    };
}

const getScreenShotInfoDetail = async (ctx) => {
    const id = ctx.params.id;
    if (id) {
        const data = await screenShotInfoModel.getScreenShotInfoDetail(id);
        if (data) {
            ctx.response.status = 200;
            ctx.response.body = {
                code: 200,
                message: "查询成功",
                data: {
                    data,
                }
            };
        } else {
            ctx.response.status = 200;
            ctx.response.body = {
                code: 200,
                message: "查询结果为空",
            };
        }
        
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "查询失败，请求参数有误",
        };
    }
}


const deleteScreenShotInfo = async (ctx) => {
    const id = ctx.params.id;
    if (id) {
        await screenShotInfoModel.deleteScreenShotInfo(id);
        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "删除成功",
        };
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "删除失败，请求参数有误",
        };
    }
}

const update = async (ctx) => {
    const id = ctx.params.id;
    const param = ctx.request.body;
    if (id) {
        await screenShotInfoModel.update(id, param);
        ctx.response.status = 200;
        ctx.response.body = {
            code: 200,
            message: "更新成功",
        };
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            code: 400,
            message: "删除失败，请求参数有误",
        };
    }
}

const handleFile = async (req, res, files) => {
    const img = files.file[0];
    const { originalFilename, path } = img;
    const date = moment(new Date()).format("YYYY-MM-DD");
    const time = new Date().getTime().toString();
    const newPath = `${screenShotConfig.uploadDir}${date}_${time}.${originalFilename.split('.')[1]}`;
    const resPath = `http://${req.headers.host}/${date}_${time}.${originalFilename.split('.')[1]}`;
    await rename(path, newPath);
    return resPath;
}

export default {
    create,
    getScreenShotInfoList,
    getScreenShotInfoDetail,
    update,
    deleteScreenShotInfo,

}
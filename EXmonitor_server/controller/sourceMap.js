import path from 'path';
import fs from 'fs';

const uploadFile =  async (ctx) => {
    const file = ctx.request.files.file;
    const reader = fs.createReadStream(file.path);
    const pathName = path.resolve(__dirname, '..') + '/publicFile/' + file.name;
    const writer = fs.createWriteStream(pathName)
    reader.pipe(writer);
    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        message: '上传成功',
    }
}

export default {
    uploadFile,
}
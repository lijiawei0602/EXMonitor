import sequelize from '../config/db.js';
const Project = sequelize.import('../schema/project.js');
Project.sync({force: false});

/**
 * 创建project
 * @param {project信息} data 
 */
const createProject = async (data) => {
    return Project.create({
        ...data
    });
}

/**
 * 
 * @param {项目ID} id 
 * @param {project信息} data 
 */
const updateProject = async (id, data) => {
    Project.update({
        ...data
    }, {
        where: {
            id,
        },
        fields: Object.keys(data),  // 要更新的字段，默认为全部
    })
    return true;
}

/**
 * 获取项目列表
 * @return {Promise.<Model>}
 */
const getProjectList = async () => {
    return await Project.findAndCountAll();
}

/**
 * 根据id获取项目信息
 * @param {*} id 项目id
 * @return Promise.<Model>
 */
const getProjectById = async (id) => {
    return await Project.findOne({
        where: {
            id,
        },
    });
}

/**
 * 删除项目
 * @param {*} id 被删除项目的id
 * @return Promise.<boolean>
 */
const deleteProject = async(id) => {
    await Project.destroy({
        where: {
            id,
        }
    })
    return true;
}

export default {
    createProject,
    updateProject,
    getProjectList,
    getProjectById,
    deleteProject,
}
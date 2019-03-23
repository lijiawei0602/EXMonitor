import sequelize from '../config/db.js';

const User = sequelize.import('../schema/user.js');
User.sync({force: false});

/**
 * 创建用户
 * @param user
 * @returns {Promise.<boolean>}
 */
async function create(user) {
    let { username, password } = user;
    await User.create({
        username,
        password,
    });
    return true;
}

/**
 * 根据用户id删除用户
 * @param id userId
 * @returns {Promise.<boolean>}
 */
async function deleteUserById(id) {
    await User.destroy({
        where: {
            id,
        }
    })
    return true;
}

/**
 * 查询所有用户列表
 * @returns {Promise.<*>}
 */
async function findAllUserList() {
    return await User.findAll({
        attributes: ['id', 'username', 'createdAt', 'updatedAt'],
    });
}

/**
 * 根据用户名查询用户信息
 * @param username 用户名
 * @returns {Promise.<*>}
 */
async function findUserByName(username) {
    return await User.findOne({
        where: {
            username
        }
    });
}

export default {
    create,
    deleteUserById,
    findAllUserList,
    findUserByName,
}
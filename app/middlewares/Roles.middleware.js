const { Op, Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);
const initModels = require('../database/init');
var models = initModels(sequelize);

module.exports.checkRoles = (level = []) => {
    return async (req, res, next) => {
        const tabelUserRole = await models.user_role.findAll({
            where: {
                id_user: req.user_data.id_user,
            },
            raw: true,
        });
        console.log(tabelUserRole);
        const tabelRoles = await models.roles.findAll({
            where: {
                id_role: tabelUserRole.map((item) => item.id_role),
            },
            raw: true,
        });
        let __statusAllow = false;
        for (let i = 0; i < tabelRoles.length; i++) {
            if (level.includes(tabelRoles[i].nama_role)) {
                __statusAllow = true;
                break;
            }
        }
        if (__statusAllow) {
            return next();
        } else {
            res.status(403).send({ message: 'Not Authorized' });
        }
    }
}
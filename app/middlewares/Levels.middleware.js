const { Op, Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);
const initModels = require('../database/init');
var models = initModels(sequelize);

module.exports.checkLevels = (level = []) => {
    return async (req, res, next) => {
        if (level.length > 0 && level.includes(req.user_data.level)) {
            return next();
        } else {
            res.status(403).send({ message: 'Not Authorized' });
        }
    }
}
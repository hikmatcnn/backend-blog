const { Op, Sequelize, where, or } = require('sequelize');
const { generateToken } = require('../middlewares/Auth.middleware');
const sequelize = new Sequelize(process.env.DATABASE_URL);
const initModels = require('../database/init');
const { defineLevel } = require('../helpers/App.helper');
var models = initModels(sequelize);

module.exports.getJenisFile = async (req, res, next) => {
    try {
        const _jenisFile = await models.jenis_file_master.findAll({
            attributes: ['id', 'nama']
        });

        res.status(200).json({
            message: "Jenis File fetched successfully",
            data: _jenisFile
        });
    } catch (err) {
        var details = {
            parent: err.parent,
            name: err.name,
            message: err.message
        }
        var error = new Error("Error pada server");
        error.status = 500;
        error.data = {
            date: new Date(),
            route: req.originalUrl,
            details: details
        };
        next(error);
    }
}

module.exports.getAddressProvince = async (req, res, next) => {
    try {
        const _address = await models.regions.findAll({
            attributes: [
                [sequelize.fn('LEFT', sequelize.col('code'), 2), 'code'],
                'province'
            ],
            where: {
                index: {
                    [Op.not]: null
                },
                // code: sequelize.where(sequelize.fn('LEFT', sequelize.col('code'), 2), '32')
            },
            order: [
                ['province', 'ASC']
            ],
            group: [
                sequelize.fn('LEFT', sequelize.col('code'), 2),
                'province',
            ]
        });

        res.status(200).json({
            message: "Address fetched successfully",
            data: _address
        });
    } catch (err) {
        var details = {
            parent: err.parent,
            name: err.name,
            message: err.message
        }
        var error = new Error("Error pada server");
        error.status = 500;
        error.data = {
            date: new Date(),
            route: req.originalUrl,
            details: details
        };
        next(error);
    }
}

module.exports.getAddressCity = async (req, res, next) => {
    try {
        const _address = await models.regions.findAll({
            attributes: [
                [sequelize.fn('LEFT', sequelize.col('code'), 5), 'code'],
                'province',
                'city',
            ],
            where: {
                index: {
                    [Op.not]: null
                },
                code: sequelize.where(sequelize.fn('LEFT', sequelize.col('code'), 2), req.query.code)
            },
            order: [
                ['city', 'ASC']
            ],
            group: [
                sequelize.fn('LEFT', sequelize.col('code'), 5),
                'province',
                'city',
            ]
        });

        res.status(200).json({
            message: "Address fetched successfully",
            data: _address
        });
    } catch (err) {
        var details = {
            parent: err.parent,
            name: err.name,
            message: err.message
        }
        var error = new Error("Error pada server");
        error.status = 500;
        error.data = {
            date: new Date(),
            route: req.originalUrl,
            details: details
        };
        next(error);
    }
}

module.exports.getAddressDistrict = async (req, res, next) => {
    try {
        const _address = await models.regions.findAll({
            attributes: [
                [sequelize.fn('LEFT', sequelize.col('code'), 8), 'code'],
                'province',
                'city',
                'district'
            ],
            where: {
                index: {
                    [Op.not]: null
                },
                code: sequelize.where(sequelize.fn('LEFT', sequelize.col('code'), 5), req.query.code)
            },
            order: [
                ['district', 'ASC']
            ],
            group: [
                sequelize.fn('LEFT', sequelize.col('code'), 8),
                'province',
                'city',
                'district',
            ]
        });

        res.status(200).json({
            message: "Address fetched successfully",
            data: _address
        });
    } catch (err) {
        var details = {
            parent: err.parent,
            name: err.name,
            message: err.message
        }
        var error = new Error("Error pada server");
        error.status = 500;
        error.data = {
            date: new Date(),
            route: req.originalUrl,
            details: details
        };
        next(error);
    }
}

module.exports.getAddressSubdistrict = async (req, res, next) => {
    try {
        const _address = await models.regions.findAll({
            attributes: [
                'code',
                'province',
                'city',
                'district',
                'subdistrict'
            ],
            where: {
                index: {
                    [Op.not]: null
                },
                code: sequelize.where(sequelize.fn('LEFT', sequelize.col('code'), 8), req.query.code)
            },
            order: [
                ['subdistrict', 'ASC']
            ],
            group: [
                'code',
                'province',
                'city',
                'district',
                'subdistrict'
            ]
        });

        res.status(200).json({
            message: "Address fetched successfully",
            data: _address
        });
    } catch (err) {
        var details = {
            parent: err.parent,
            name: err.name,
            message: err.message
        }
        var error = new Error("Error pada server");
        error.status = 500;
        error.data = {
            date: new Date(),
            route: req.originalUrl,
            details: details
        };
        next(error);
    }
}
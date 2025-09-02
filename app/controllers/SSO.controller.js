const { Op, Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = new Sequelize(process.env.DATABASE_URL);
const initModels = require('../database/init');
const authChecker = require('../middlewares/Auth.middleware');
const { generateToken } = require('../middlewares/Auth.middleware');
const { defineLevel } = require('../helpers/App.helper');
var models = initModels(sequelize);

module.exports.loginSSO = async (req, res, next) => {
    try {
        let _bearer = req.headers['authorization'].split(";")[0].replace("Bearer ", "");
        let _nik = req.body.username;
        let _anotation_key = req.body.anotation_key;
    
        const validUntil = new Date(_anotation_key * 1000)
        const diffInMinune = Math.abs((new Date() - validUntil) / 1000 / 60);
    
        if(diffInMinune > 1){
            res.status(440).send({
                status: false,
                message: 'timeout',
                data: false
            })
        }

        bcrypt.compare( _nik + process.env.JWT_CONF_TOKEN_SSO, _bearer, function (err, result) {
            if(err){
                res.send({
                    status: false,
                    message: 'fail',
                    data: false
                })
            }
            if(result){
                models.master_account.findOne({
                    where: {
                        [Op.or]: {
                            email: _nik, // user email
                            username: _nik // user username
                        }
                    }
                }).then(x => {
                    if (x) {
                        res.send({
                            status: true,
                            message: 'success',
                            data: true
                        
                        })
                    } else {
                        res.send({
                            status: false,
                            message: 'fail',
                            data: false
                        
                        })
                    }
                })
                .catch((err) => {
                    res.send({
                        status: false,
                        message: 'fail',
                        data: false
                    
                    })
                })
            } else {
                res.send({
                    status: false,
                    message: 'fail',
                    data: false
                })
            }
        })
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

module.exports.autoLogin = async (req, res, next) => {
    try {
        let _bearer = req.headers['authorization'].split(";")[0].replace("Bearer ", "");
        let _nik = req.body.username;
        let _anotation_key = req.body.anotation_key;
    
    
        const validUntil = new Date(_anotation_key * 1000)
        const diffInMinune = Math.abs((new Date() - validUntil) / 1000 / 60);
    
        if(diffInMinune > 1){
            res.status(440).send({
                status: false,
                message: 'timeout',
                data: false
            })
        }

        bcrypt.compare( _nik + process.env.JWT_CONF_TOKEN_SSO, _bearer, async function (err, result) {
            if(err){
                res.send({
                    status: false,
                    message: 'fail',
                    data: false
                })
            }
            if(result){
                await models.master_account.findOne({
                    where: {
                        [Op.or]: {
                            email: _nik, // user email
                            username: _nik // user username
                        }
                    }
                }).then(x => {
                    if (x) {
                        var toToken = {
                            id_user: x.id_user,
                            level: x.level,
                        }
                        res.send({
                            status: true,
                            message: 'success',
                            data: {
                                redirect: `${process.env.URL_FRONTEND_SSO}?token=${authChecker.generateTokenSSO(toToken, 60)}&redirect=true&sso=true`
                            }
                        })
                    } else {
                        res.send({
                            status: false,
                            message: 'fail',
                            data: false
                        })
                    }
                })
                .catch((err) => {
                    res.send({
                        status: false,
                        message: 'fail',
                        data: false
                    })
                })
            } else {
                res.send({
                    status: false,
                    message: 'fail',
                    data: false
                })
            }
        })
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

module.exports.ssoAPPValidate = async (req, res, next) => {
    try {
        var arg = {
            id_user: req.user_data.id_user,
            level: req.user_data.level,
            token: req.body.firebase_token ?? null
        }
        var _user = null;

        _user = await models.master_user.findOne({
            attributes: {
                include: [
                    [sequelize.col('master_accounts.email'), 'email'],
                    [sequelize.col('master_accounts.is_admin'), 'is_admin'],
                    [sequelize.col('my_jabatans.nama_jabatan'), 'nama_jabatan'],
                    [sequelize.col('my_jabatans.level'), 'level_user'],
                ]
            },
            where: {
                id_user: arg.id_user,
                soft_delete: 0
            },
            include: [
                {
                    model: models.master_account,
                    as: 'master_accounts',
                    attributes: ['email']
                },
                {
                    model: models.jabatan,
                    as: 'my_jabatans',
                    attributes: ['nama_jabatan']
                },
            ],
            raw: true
        });

        if(_user){
            await models.user_controls.findOne({ where: { id_user: _user.id_user } })
                .then(function (obj) {
                    // update
                    if (obj)
                        return obj.update({
                            id_user: _user.id_user,
                            is_login: true,
                            last_login: new Date(),
                            last_logout: null,
                            fcm_token: arg.token
                        });
                    // insert
                    return models.user_controls.create({ id_user: _user.id_user, is_login: true, last_login: new Date(), last_logout: null, fcm_token: arg.token });
                })
                .then((response) => {
                    if (response) {
                        var toToken = {
                            id_user: _user.id_user,
                            id_jabatan: _user.id_jabatan,
                            is_admin: _user.is_admin,
                            level: _user.level_user,
                        }
                        res.send({
                            status: 200,
                            message: 'Service Auth SSO',
                            route: '/auth_service/auth',
                            level: defineLevel(_user.level_user),
                            level_int: _user.level_user,
                            data: {
                                nama: _user.nama_user,
                                nama_jabatan: _user.nama_jabatan,
                                email: _user.email,
                                id_jabatan: _user.id_jabatan,
                            },
                            accessToken: generateToken(toToken)
                        })
                    } else {
                        res.status(401).send({
                            status: 401,
                            message: "User Not Found",
                        })
                    }
                })
        } else {
            res.status(401).send({
                status: 401,
                message: "User Not Found",
            })
        }
    } catch (err) {
        console.error(err);
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
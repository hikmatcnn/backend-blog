const { Op, Sequelize } = require('sequelize');
const { generateToken } = require('../middlewares/Auth.middleware');
const sequelize = new Sequelize(process.env.DATABASE_URL);
const initModels = require('../database/init');
const { defineLevel, filterObj } = require('../helpers/App.helper');
const { sendError, sendResponse } = require('../handlers/Response.handler');
const { default: axios } = require('axios');
var models = initModels(sequelize);

module.exports.login = async (req, res, next) => {
    try {
        var _data = {
            email: req.body.email_or_username,
            password: req.body.password,
            token: req.body.token ?? null
        }

        var _account = null;
        var _user = null;

        const _getUserSSO = await axios.post(process.env.URL_LOGIN, {
            username: _data.email,
            password: _data.password,
            token: _data.token
        })
            .catch((err) => {
                sendResponse(res, err.response.status, err.response.data);
            });

        if (!_getUserSSO.data.status == 200) {
            sendResponse(res, response.status, response.data);
        }

        _account = await models.master_account.findOne({
            where: {
                [Op.or]: [
                    { username: _getUserSSO.data.data.nik ? _getUserSSO.data.data.nik : (_getUserSSO.data.data.nip ?? '') },
                    { username: _getUserSSO.data.data.nip ? _getUserSSO.data.data.nip : (_getUserSSO.data.data.nik ?? '') },
                ]
            }
        });

        if (_account) {
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
                    id_user: _account.dataValues.id_user,
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
            })
        }

        if (_user) {
            await models.user_controls.findOne({ where: { id_user: _user.id_user } })
                .then(function (obj) {
                    // update
                    if (obj)
                        return obj.update({
                            id_user: _user.id_user,
                            is_login: true,
                            last_login: new Date(),
                            last_logout: null,
                            fcm_token: _data.token
                        });
                    // insert
                    return models.user_controls.create({ id_user: _user.id_user, is_login: true, last_login: new Date(), last_logout: null, fcm_token: _data.token });
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
                            message: 'Service Auth',
                            route: '/auth_service/auth',
                            level: defineLevel(_user.level_user),
                            level_int: _user.level_user,
                            data: {
                                nama: _user.nama_user,
                                nama_jabatan: _user.nama_jabatan,
                                email: _user.email,
                                id_jabatan: _user.id_jabatan,
                                is_password_changed: _account.is_password_changed,
                                npsn: _user.npsn ?? null,
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
            sendResponse(res, 401, {
                message: "User Not Found",
                data: null,
                misc: null,
            });
        }
    } catch (err) {
        sendError(req, next, err)
    }
}

//Module Logout
module.exports.logout = async (req, res, next) => {
    try {
        await models.user_controls.findOne({ where: { id_user: req.user_data.id_user } })
            .then(function (obj) {
                // update
                if (obj)
                    return obj.update({
                        is_login: false,
                        last_logout: new Date(),
                        fcm_token: null
                    });
            })
            .then((response) => {
                res.send({
                    status: 200,
                    message: 'Logout Sukses!',
                    route: '/logout/',
                })
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

module.exports.updatePassword = async (req, res, next) => {
    try {
        const allowed = ['email', 'old_password', 'password', 'password_confirmation'];
        const filtered = filterObj(req.body, allowed);

        filtered['id_user'] = req.user_data.id_user;

        var _account = null;

        if (filtered.password === filtered.password_confirmation) {
            _account = await models.master_account.findOne({
                where: {
                    [Op.or]: {
                        email: filtered.email ?? null,
                        id_user: filtered.id_user,
                    },
                    is_admin: false
                }
            }).then(async (response) => {
                if (!response) {
                    res.status(401).send({
                        status: 401,
                        message: "User Not Found",
                    })
                } else {
                    const cond = await response.validPassword(filtered.old_password)
                    if (!cond) {
                        res.status(422).send({
                            message: 'Password lama tidak sesuai'
                        })
                    } else {
                        delete response.dataValues.password
                        return response.dataValues;
                    }
                }
            });

            if (_account) {
                await models.master_account.update({
                    password: filtered.password,
                    id_user: filtered.id_user,
                    last_update: new Date(),
                    is_password_changed: true
                }, {
                    where: {
                        id_user: filtered.id_user
                    },
                    individualHooks: true,
                }).then(async (response) => {
                    res.status(200).send({
                        status: 200,
                        message: "Password Updated",
                    })
                })
            }
        } else {
            res.status(422).send({
                message: 'Password baru tidak sama'
            })
        }
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

module.exports.getUser = async (req, res, next) => {
    try {
        await models.master_user.findOne({
            where: {
                id_user: req.user_data.id_user,
                soft_delete: 0
            },
            include: [
                {
                    model: models.master_account,
                    as: 'master_accounts',
                    attributes: ['email', 'is_password_changed'],
                },
                {
                    model: models.jabatan,
                    as: 'my_jabatans',
                    attributes: ['nama_jabatan']
                },
            ],
            raw: true
        }).then((response) => {
            if (response) {
                res.send({
                    status: 200,
                    message: 'Service Auth',
                    route: '/auth_service/user',
                    data: {
                        nama: response.nama_user,
                        nama_jabatan: response['my_jabatans.nama_jabatan'],
                        email: response['master_accounts.email'],
                        is_password_changed: response['master_accounts.is_password_changed'],
                        id_jabatan: response.id_jabatan,
                        npsn: response.npsn ?? null
                    }
                })
            } else {
                res.status(401).send({
                    status: 401,
                    message: "User Not Found",
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

module.exports.getRoles = async (req, res, next) => {
    try {
        await sequelize.query(`
                SELECT r.nama_role FROM ref.roles r
                JOIN users.user_roles ur ON r.id_role = ur.role_id
                WHERE ur.id_user = :idUser
            `, {
            replacements: {
                idUser: req.user_data.id_user
            },
            type: sequelize.QueryTypes.SELECT,
            raw: true
        }).then((response) => {
            res.send({
                status: 200,
                message: 'Service Auth',
                route: '/auth_service/roles',
                data: response
            })
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

module.exports.getPolicies = async (req, res, next) => {
    try {
        await sequelize.query(`
                SELECT p.name FROM ref.policies p
                JOIN ref.role_policies rp ON p.id = rp.policy_id
                WHERE rp.role_id IN (SELECT role_id FROM users.user_roles WHERE id_user = :idUser)
            `, {
            replacements: {
                idUser: req.user_data.id_user
            },
            type: sequelize.QueryTypes.SELECT,
            raw: true
        }).then((response) => {
            res.send({
                status: 200,
                message: 'Service Auth',
                route: '/auth_service/policies',
                data: response
            })
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

module.exports.generateUserAccount = async (req, res, next) => {
    try {
        const _dataUser = await models.master_account.findAll({
            include: [
                {
                    model: models.master_user,
                    as: 'my_master_users',
                    attributes: ['npsn'],
                    where: {
                        npsn: {
                            [Op.not]: null
                        },
                    }
                }
            ],
            where: {
                // npsn: {
                //     [Op.not]: null
                // },
                // is_password_changed: false,
                // email: {
                //     [Op.like]: '%@jabarprov.go.id'
                // }
            }
        });

        // Create promise insert or update master_account if exist by npsn
        const _dataAccount = _dataUser.map(async (user) => {
            const _account = await models.master_account.findOne({
                where: {
                    id_user: user.id_user
                }
            });

            if (!_account) {
                await models.master_account.create({
                    id_user: user.id_user,
                    email: user.npsn + '@bencana.id',
                    // username: user.npsn,
                    password: 'T3rdidikTerbaik!6Disdik',
                    is_admin: false
                })
            } else {
                await models.master_account.update({
                    email: user.npsn + '@bencana.id',
                    // username: user.npsn,
                    password: 'T3rdidikTerbaik!6Disdik',
                    last_update: new Date(),
                    is_admin: false,
                    is_password_changed: false
                }, {
                    where: {
                        id_user: user.id_user
                    },
                    individualHooks: true,
                })
            }
        });
        res.status(200).send({
            status: 200,
            message: "Data User",
            data: _dataAccount
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
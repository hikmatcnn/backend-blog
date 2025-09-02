const { Op, Sequelize, or } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);
const path_main = require('path');
const fs = require('fs');
const initModels = require('../database/init');
const { defineLevel, filterObj, getPagination, multipleOrderBySql } = require('../helpers/App.helper');
const { putFiles, deleteFiles, getFiles, deleteFilesMinio, putFilesMinio, downloadFileS3 } = require('../utils/UploadFile.util');
const { getUser } = require('../services/FetchData');
const { sendResponse, sendError } = require('../handlers/Response.handler');
const { createDetailDisaster, updateDetailDisaster } = require('../utils/ManageDetailDisaster');
var models = initModels(sequelize);

module.exports.getDashboard = async (req, res, next) => {
    try {
        const _dataUser = await getUser(req, res, next);
        // Rekap Per Bencana
        const attributesSum = [];

        Object.keys(models.master_disaster_detail.rawAttributes).forEach(attribute => {
            if([
                'is_flood',
                'is_earthquake',
                'is_landslide',
                'is_tornado',
                'is_tsunami',
                'is_eruption',
                'is_fire',
                'is_electricity_availability',
                'is_water_availability',
                'is_access_road_school',
                'is_broken_library',
                'is_broken_laboratory',
                'is_broken_principal',
                'is_broken_teacher',
                'is_broken_canteen',
                'is_broken_toilet',
                'is_broken_administration'
            ].includes(attribute)){
                attributesSum.push([sequelize.fn('COALESCE', sequelize.literal(`SUM(CASE WHEN master_disaster_details.${attribute} = true THEN 1 ELSE 0 END)`), 0), `total_${attribute}`]);
            } else {
                if (attribute !== 'id_disaster' && attribute !== 'school_npsn' && attribute !== 'id') {
                    attributesSum.push([sequelize.fn('COALESCE', sequelize.literal(`SUM(master_disaster_details.${attribute})`), 0), `total_${attribute}`]);
                }
            }
        });

        const _rekapPerBencana = await models.master_disaster.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('master_disaster.id_disaster')), 'total'],
                ...attributesSum
            ],
            include: [
                {
                    model: models.kode_kemendagri_sekolah,
                    as: 'kode_sekolah_bancana',
                    attributes: []
                },
                {
                    model: models.master_disaster_detail,
                    as: 'master_disaster_details',
                    attributes: []
                }
            ],
            group: [],
            where: {
                is_verified: true,
            }
        });

        const _rekapPerKCD = await models.master_disaster.findAll({
            attributes: [
                [sequelize.col('id_user_bancana.my_jabatans.cadisdik'), 'cadisdik'],
                [sequelize.fn('COUNT', sequelize.col('master_disaster.id_disaster')), 'total'],
                ...attributesSum
            ],
            include: [
                {
                    model: models.master_disaster_detail,
                    as: 'master_disaster_details',
                    attributes: []
                },
                {
                    model: models.master_user,
                    as: 'id_user_bancana',
                    attributes: [],
                    include: [
                        {
                            model: models.jabatan,
                            as: 'my_jabatans',
                            attributes: ['cadisdik']
                        }
                    ]
                }
            ],
            group: [
                'id_user_bancana->my_jabatans.id_jabatan',
                'id_user_bancana->my_jabatans.cadisdik',
                'master_disaster.id_user'
            ],
            where: {
                is_verified: true,
            }
        });

        const _rekapPerBencanaPerKab = await models.master_disaster.findAll({
            attributes: [
                'school_city',
                [sequelize.fn('COUNT', sequelize.col('master_disaster.id_disaster')), 'total'],
                ...attributesSum
            ],
            include: [
                {
                    model: models.kode_kemendagri_sekolah,
                    as: 'kode_sekolah_bancana',
                    attributes: []
                },
                {
                    model: models.master_disaster_detail,
                    as: 'master_disaster_details',
                    attributes: []
                }
            ],
            group: [
                'school_city'
            ],
            where: {
                is_verified: true,
            }
        });

        const _rekapPerBencanaPerKec = await models.master_disaster.findAll({
            attributes: [
                'school_city',
                'school_district',
                [sequelize.fn('COUNT', sequelize.col('master_disaster.id_disaster')), 'total'],
                ...attributesSum
            ],
            include: [
                {
                    model: models.kode_kemendagri_sekolah,
                    as: 'kode_sekolah_bancana',
                    attributes: []
                },
                {
                    model: models.master_disaster_detail,
                    as: 'master_disaster_details',
                    attributes: []
                }
            ],
            group: [
                'school_city',
                'school_district'
            ],
            where: {
                is_verified: true,
            }
        });

        sendResponse(res, 200, {
            status: true,
            message: "Dashboard fetched successfully",
            summary: {
                all: _rekapPerBencana,
                per_kcd: _rekapPerKCD,
                per_kab: _rekapPerBencanaPerKab,
                per_kec: _rekapPerBencanaPerKec
            },
            _misc: _dataUser
        });
    } catch (err) {
        sendError(req, next, err)
    }
}

module.exports.getChartDataPie = async (req, res, next) => {
    //
}

module.exports.getDashboardSchool = async (req, res, next) => {
    try {
        const _dataUser = await getUser(req, res, next);
        const attributesSum = [];

        Object.keys(models.master_disaster_detail.rawAttributes).forEach(attribute => {
            if([
                'is_flood',
                'is_earthquake',
                'is_landslide',
                'is_tornado',
                'is_tsunami',
                'is_eruption',
                'is_fire',
                'is_electricity_availability',
                'is_water_availability',
                'is_access_road_school',
                'is_broken_library',
                'is_broken_laboratory',
                'is_broken_principal',
                'is_broken_teacher',
                'is_broken_canteen',
                'is_broken_toilet',
                'is_broken_administration'
            ].includes(attribute)){
                attributesSum.push([sequelize.fn('COALESCE', sequelize.literal(`SUM(CASE WHEN master_disaster_details.${attribute} = true THEN 1 ELSE 0 END)`), 0), `total_${attribute}`]);
            } else {
                if (attribute !== 'id_disaster' && attribute !== 'school_npsn' && attribute !== 'id') {
                    attributesSum.push([sequelize.fn('COALESCE', sequelize.literal(`SUM(master_disaster_details.${attribute})`), 0), `total_${attribute}`]);
                }
            }
        });

        const _rekapPerBencana = await models.master_disaster.findAll({
            attributes: [
                'school_npsn',
                'school_name',
                'school_city',
                'school_district',
                'school_subdistrict',
                [sequelize.fn('COUNT', sequelize.col('master_disaster.id_disaster')), 'total'],
                ...attributesSum
            ],
            include: [
                {
                    model: models.kode_kemendagri_sekolah,
                    as: 'kode_sekolah_bancana',
                    attributes: []
                },
                {
                    model: models.master_disaster_detail,
                    as: 'master_disaster_details',
                    attributes: []
                }
            ],
            group: [
                'id_user',
                'master_disaster.school_npsn',
                'master_disaster.school_name',
                'master_disaster.school_city',
                'master_disaster.school_district',
                'master_disaster.school_subdistrict',
            ],
            where: {
                is_verified: true,
            }
        });
        sendResponse(res, 200, {
            status: true,
            message: "School fetched successfully",
            data: _rekapPerBencana,
            _misc: _dataUser
        });
    } catch (err) {
        sendError(req, next, err)
    }
}

module.exports.getListSchool = async (req, res, next) => {
    try {
        const allowedFilter = ['school_npsn'];
        const filteredFilter = filterObj(req.query, allowedFilter);

        // Pagination
        const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.pagination);

        // Order by
        let order = [];
        if (req.query.order_by !== undefined && req.query.order_by !== '') {
            order = multipleOrderBySql(req.query.order_by, req.query.order_type);
        }

        const _disasters = await models.master_disaster.findAll({
            attributes: {
                include: [
                    [sequelize.literal(`(SELECT COUNT(*) FROM master_file WHERE master_file.id_disaster = master_disaster.id_disaster)`), 'total_file']
                ]
            },
            include: [
                {
                    model: models.kode_kemendagri_sekolah,
                    as: 'kode_sekolah_bancana',
                }
            ],
            where: {
                is_verified: true,
                ...filteredFilter
            },
            limit: limit,
            offset: offset,
            order: order,
        });

        res.status(200).json({
            message: "List school fetched successfully",
            data: _disasters,
            _misc: req.user_data
        });
    } catch (err) {
        sendError(req, next, err)
    }
}

module.exports.getDetailRegistrations = async (req, res, next) => {
    try {
        const _disasters = await models.master_disaster.findOne({
            include: [
                {
                    model: models.master_disaster_detail,
                    as: 'master_disaster_details',
                },
                {
                    model: models.master_file,
                    attributes: {
                        exclude: [
                            'jenis_file_id',
                            'id_disaster',
                            'path',
                            'soft_delete',
                            'filename',
                        ]
                    },
                    as: 'master_files',
                    include: [
                        {
                            model: models.jenis_file_master,
                            attributes: {
                                exclude: [
                                    'path_dir',
                                    'create_date'
                                ],
                            },
                            as: 'jenis_file_master',
                        }
                    ]
                }
            ],
            where: {
                id_disaster: req.params.idDisaster
            }
        });

        sendResponse(res, 200, {
            message: "Detail school fetched successfully",
            data: _disasters,
            misc: null,
        });
    } catch (err) {
        sendError(req, next, err)
    }
}

module.exports.generateUserAccount = async (req, res, next) => {
    try {
        const _dataUser = await models.master_user.findAll({
            where: {
                npsn: {
                    [Op.not]: null
                },
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
                    email: user.npsn + '@smater.id',
                    username: user.npsn,
                    password: 'T3rdidikTerbaik!',
                    is_admin: false,
                    is_password_changed: false
                })
            } else {
                await models.master_account.update({
                    email: user.npsn + '@smater.id',
                    username: user.npsn,
                    password: 'T3rdidikTerbaik!',
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

        sendResponse(res, 200, {
            message: "Create Account successfully",
            data: _dataAccount,
            misc: null,
        });
    } catch (err) {
        sendError(req, next, err)
    }
}
const { Op, Sequelize, or, where } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);
const path_main = require('path');
const fs = require('fs');
const initModels = require('../database/init');
const { defineLevel, filterObj, getPagination, multipleOrderBySql } = require('../helpers/App.helper');
const { putFiles, deleteFiles, getFiles, deleteFilesMinio, putFilesMinio, downloadFileS3 } = require('../utils/UploadFile.util');
const { getUser } = require('../services/FetchData');
const { sendResponse, sendError } = require('../handlers/Response.handler');
const { createDetailDisaster, updateDetailDisaster } = require('../utils/ManageDetailDisaster');
const { group } = require('console');
var models = initModels(sequelize);

module.exports.getDashboard = async (req, res, next) => {
    try {
        const _dataUser = await getUser(req, res, next);
        const attributesSum = [];

        Object.keys(models.master_disaster_detail.rawAttributes).forEach(attribute => {
            if ([
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
            ].includes(attribute)) {
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
                    required: true,
                    where: {
                        ...(req.user_data.level !== 1 ? {} : { cadisdik: _dataUser.data.jabatan.cadisdik }),
                    },
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
                // ...(req.user_data.level !== 1 ? {} : { id_user: req.user_data.id_user }),
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
                    where: {
                        ...(req.user_data.level !== 1 ? {} : { cadisdik: _dataUser.data.jabatan.cadisdik }),
                    },
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
                // ...(req.user_data.level !== 1 ? {} : { id_user: req.user_data.id_user }),
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
                // ...(req.user_data.level !== 1 ? {} : { id_user: req.user_data.id_user }),
                is_verified: true,
            }
        });

        sendResponse(res, 200, {
            status: true,
            message: "Dashboard fetched successfully",
            summary: {
                all: _rekapPerBencana,
                per_kab: _rekapPerBencanaPerKab,
                per_kec: _rekapPerBencanaPerKec
            },
            _misc: _dataUser
        });
    } catch (err) {
        sendError(req, next, err)
    }
}

module.exports.getDashboardSchool = async (req, res, next) => {
    try {
        const _dataUser = await getUser(req, res, next);
        const attributesSum = [];

        Object.keys(models.master_disaster_detail.rawAttributes).forEach(attribute => {
            if ([
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
            ].includes(attribute)) {
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
                    where: {
                        ...(req.user_data.level !== 1 ? {} : { cadisdik: _dataUser.data.jabatan.cadisdik }),
                    },
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
                ...(req.user_data.level !== 1 ? {} : { id_user: req.user_data.id_user }),
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
        const _dataUser = await getUser(req, res, next);
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
                    [sequelize.literal(`(SELECT COUNT(*) FROM master_file WHERE master_file.id_disaster = master_disaster.id_disaster)`), 'total_file'],
                    [sequelize.literal(`(SELECT COALESCE(SUM(master_disaster_detail.n_broken_classroom_heavy + master_disaster_detail.n_broken_classroom_medium + master_disaster_detail.n_broken_classroom_slight), 0) FROM master_disaster_detail WHERE master_disaster_detail.id_disaster = master_disaster.id_disaster)`), `total_broken_classroom`],
                    [sequelize.literal(`(SELECT COALESCE(SUM(n_people_heavy + n_people_medium + n_people_slight + n_people_die + n_people_lost + n_people_evacuate), 0) FROM master_disaster_detail WHERE master_disaster_detail.id_disaster = master_disaster.id_disaster)`), `total_people_disaster`],
                ]
            },
            include: [
                {
                    model: models.kode_kemendagri_sekolah,
                    as: 'kode_sekolah_bancana',
                    where: {
                        ...(req.user_data.level !== 1 ? {} : { cadisdik: _dataUser.data.jabatan.cadisdik }),
                    }
                },
                {
                    model: models.master_disaster_detail,
                    as: 'master_disaster_details',
                },
            ],
            where: {
                ...(req.user_data.level === 1 ? {} : { id_user: req.user_data.id_user }),
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

module.exports.getListSchoolNotVerified = async (req, res, next) => {
    try {
        const _dataUser = await getUser(req, res, next);
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
                    [sequelize.literal(`(SELECT COUNT(*) FROM master_file WHERE master_file.id_disaster = master_disaster.id_disaster)`), 'total_file'],
                    [sequelize.literal(`(SELECT COALESCE(SUM(master_disaster_detail.n_broken_classroom_heavy + master_disaster_detail.n_broken_classroom_medium + master_disaster_detail.n_broken_classroom_slight), 0) FROM master_disaster_detail WHERE master_disaster_detail.id_disaster = master_disaster.id_disaster)`), `total_broken_classroom`],
                    [sequelize.literal(`(SELECT COALESCE(SUM(n_people_heavy + n_people_medium + n_people_slight + n_people_die + n_people_lost + n_people_evacuate), 0) FROM master_disaster_detail WHERE master_disaster_detail.id_disaster = master_disaster.id_disaster)`), `total_people_disaster`],
                ]
            },
            include: [
                {
                    model: models.kode_kemendagri_sekolah,
                    as: 'kode_sekolah_bancana',
                    required: true,
                    where: {
                        ...(req.user_data.level !== 1 ? {} : { cadisdik: _dataUser.data.jabatan.cadisdik }),
                    }
                },
                {
                    model: models.master_disaster_detail,
                    as: 'master_disaster_details',
                },
            ],
            where: {
                ...(req.user_data.level === 1 ? {} : { id_user: req.user_data.id_user }),
                [Op.or]: [{
                    is_verified: false,
                }, {
                    is_verified: null
                }],
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

module.exports.createSchoolDamaged = async (req, res, next) => {
    try {
        const _dataUser = await getUser(req, res, next);

        const _dataBody = {
            school_name: req.user_data.level === 1 ? req.body.school_name.toUpperCase() : _dataUser.data.nama,
            school_npsn: req.user_data.level === 1 ? req.body.school_npsn : _dataUser.data.npsn,

            school_address: req.body.school_address,
            address_code: req.body.address_code,
            school_province: req.body.school_province,
            school_city: req.body.school_city,
            school_district: req.body.school_district,
            school_subdistrict: req.body.school_subdistrict,
            responsible_name: req.body.responsible_name,
            responsible_contact: req.body.responsible_contact,
            ...(req.user_data.level === 1 ? { is_verified: true } : { is_verified: null }),

            disaster_topic: req.body.disaster_topic,
            disaster_description: req.body.disaster_description,
            disaster_date: req.body.disaster_date,
            disaster_duration: req.body.disaster_duration,
            id_user: req.user_data.id_user
        };

        // const _checkSchool = await models.master_disaster.findOne({
        //     where: {
        //         school_npsn: _dataUser.data.npsn || req.body.school_npsn
        //     }
        // });

        // if (_checkSchool) {
        //     var error = new Error("Sekolah sudah terdaftar");
        //     error.status = 409;
        //     error.data = _checkSchool;
        //     throw error;
        // }
        const _disaster = await models.master_disaster.create(_dataBody);

        await createDetailDisaster(_disaster, _dataBody);

        if (req.files) {
            var _data = {
                id_jenis_file: 1,
                id_disaster: _disaster.id_disaster,
                nama_dokumen: req.body.nama_plt,
                nomor_dokumen: req.body.no_surat,
                tanggal_dokumen: req.body.tanggal_surat,
                keterangan: req.body.keterangan,
            }

            const _dataJenis = await models.jenis_file_master.findOne({
                where: { id: _data.id_jenis_file },
                raw: true
            }).then(x => {
                if (x != null) {
                    return x;
                } else {
                    res.status(422).send({
                        message: 'Jenis File Tidak Valid!'
                    })
                }
            });

            const _listOldFile = await models.master_file.findAll({
                where: {
                    jenis_file_id: _data.id_jenis_file,
                    id_disaster: _data.id_disaster
                }
            });
            await putFilesMinio(req.files.attachment, _dataJenis.id, _dataJenis.path_dir, {
                fileName: 'file-bukti-',
                id_disaster: _data.id_disaster,
                id_registration: null,
                keterangan: _data.keterangan,
                nama_dokumen: _data.nama_dokumen,
                nomor_dokumen: _data.nomor_dokumen,
                tanggal_dokumen: _data.tanggal_dokumen
            }).then(async (a) => {
                if (_listOldFile.length > 0) {
                    await models.master_file.destroy({
                        where: {
                            id_file: _listOldFile.map(x => x.id_file)
                        }
                    });
                    // await deleteFiles(_listOldFile, _dataJenis.path_dir);
                }
            }).catch(async (err) => {
                await models.master_file.destroy({ where: { id_disaster: _data.id_disaster } })
                await models.master_disaster.destroy({ where: { id_disaster: _data.id_disaster } })
                var error = new Error("Gagal Upload File!");
                error.status = 422;
                throw error;
            })
        }

        sendResponse(res, 200, {
            message: "school created successfully",
            data: _disaster,
            misc: null
        }, {
            action_name: "school.create",
            action_take_by: _dataUser.data.nama,
            action_type: "create",
            value: _disaster,
            action_table: "master_disaster",
        });
    } catch (err) {
        sendError(req, next, err)
    }
}

module.exports.updateSchoolStatusVerified = async (req, res, next) => {
    try {
        const _dataUser = await getUser(req, res, next);
        const _data = {
            id_disaster: req.body.id_disaster,
            is_verified: req.body.is_verified,

            last_update: new Date()
        }

        const _oldRegistration = await models.master_disaster.findOne({
            attributes: ['id_disaster', 'is_verified'],
            where: {
                id_disaster: req.body.id_disaster
            }
        });

        const _disaster = await models.master_disaster.update(_data, {
            where: {
                id_disaster: req.body.id_disaster
            }
        });

        sendResponse(res, 200, {
            message: "school updated successfully",
            data: _disaster,
            misc: null
        }, {
            action_name: "registration.update",
            action_take_by: _dataUser.data.nama,
            action_type: "update",
            action_table: "master_disaster",
            old_value: _oldRegistration,
            value: _data
        });

    } catch (err) {
        sendError(req, next, err)
    }
}

module.exports.updateSchoolDamaged = async (req, res, next) => {
    try {
        const _dataUser = await getUser(req, res, next);
        const _data = {
            id_disaster: req.body.id_disaster,
            school_name: req.body.school_name ? (_dataUser.data.nama || req.body.school_name.toUpperCase()) : null,
            school_npsn: _dataUser.data.npsn || req.body.school_npsn,

            school_address: req.body.school_address,
            address_code: req.body.address_code,
            school_province: req.body.school_province,
            school_city: req.body.school_city,
            school_district: req.body.school_district,
            school_subdistrict: req.body.school_subdistrict,
            responsible_name: req.body.responsible_name,
            responsible_contact: req.body.responsible_contact,

            disaster_topic: req.body.disaster_topic,
            disaster_description: req.body.disaster_description,
            disaster_date: req.body.disaster_date,
            disaster_duration: req.body.disaster_duration,
            id_user: req.user_data.id_user,

            last_update: new Date()
        }

        const _oldRegistration = await models.master_disaster.findOne({
            where: {
                id_disaster: req.body.id_disaster
            }
        });

        const _disaster = await models.master_disaster.update(_data, {
            where: {
                id_disaster: req.body.id_disaster
            }
        });

        await updateDetailDisaster(_data, req.body);

        var _dataFile = {
            id_jenis_file: 1,
            id_disaster: _data.id_disaster,
            nama_dokumen: req.body.nama_plt,
            nomor_dokumen: req.body.no_surat,
            tanggal_dokumen: req.body.tanggal_surat,
            keterangan: req.body.keterangan,
        }

        if (!req.files) {
            var error = new Error("File tidak ditemukan");
            error.status = 400;
            throw error;
        }

        const _dataJenis = await models.jenis_file_master.findOne({
            where: { id: _dataFile.id_jenis_file },
            raw: true
        }).then(x => {
            if (x != null) {
                return x;
            } else {
                res.status(422).send({
                    message: 'Jenis File Tidak Valid!'
                })
            }
        })

        if (req.files && _dataJenis) {
            const _listOldFile = await models.master_file.findAll({
                where: {
                    jenis_file_id: _dataFile.id_jenis_file,
                    id_disaster: _dataFile.id_disaster
                }
            });
            await putFilesMinio(req.files.attachment, _dataJenis.id, _dataJenis.path_dir, {
                fileName: 'file-bukti-',
                id_disaster: _dataFile.id_disaster,
                id_registration: null,
                keterangan: _data.keterangan,
                nama_dokumen: _data.nama_dokumen,
                nomor_dokumen: _data.nomor_dokumen,
                tanggal_dokumen: _data.tanggal_dokumen
            }).then(async (a) => {
                if (_listOldFile.length > 0) {
                    await models.master_file.destroy({
                        where: {
                            id_file: _listOldFile.map(x => x.id_file)
                        }
                    });
                    // await deleteFiles(_listOldFile, _dataJenis.path_dir);
                }
            })
        }

        sendResponse(res, 200, {
            message: "school updated successfully",
            data: _disaster,
            misc: null
        }, {
            action_name: "registration.update",
            action_take_by: _dataUser.data.nama,
            action_type: "update",
            action_table: "master_disaster",
            old_value: _oldRegistration,
            value: _data
        });

    } catch (err) {
        sendError(req, next, err)
    }
}

module.exports.deleteSchoolDamaged = async (req, res, next) => {
    try {
        const _dataUser = await getUser(req, res, next);
        const _oldRegistration = await models.master_disaster.findOne({
            where: {
                id_disaster: req.params.idDisaster
            }
        });

        const _disaster = await models.master_disaster.destroy({
            where: {
                id_disaster: req.params.idDisaster
            }
        });

        const _disasterDetail = await models.master_disaster_detail.destroy({
            where: {
                id_disaster: req.params.idDisaster
            }
        });

        const _deletedFile = await models.master_file.findAll({
            where: {
                id_disaster: req.params.idDisaster
            }
        });

        if (_deletedFile.length > 0) {
            let _fileList = [];
            _deletedFile.map(x => {
                _fileList.push(x.path)
            })
            await models.master_file.destroy({
                where: {
                    id_file: _deletedFile.map(x => x.id_file)
                }
            });
            await deleteFilesMinio(_fileList);
        }

        sendResponse(res, 200, {
            message: "school deleted successfully",
            data: _disaster,
            misc: null
        }, {
            action_name: "master_disaster.delete",
            action_take_by: _dataUser.data.nama,
            action_type: "delete",
            action_table: "master_disaster",
            old_value: _oldRegistration,
            value: null
        });

    } catch (err) {
        sendError(req, next, err)
    }
}

module.exports.uploadFileSchoolDamaged = async (req, res, next) => {
    try {
        const _dataUser = await getUser(req, res, next);
        var _data = {
            id_jenis_file: req.body.id_jenis_file,
            id_disaster: req.body.id_disaster,
            id_file: req.body.id_file,
            nama_dokumen: req.body.nama_plt,
            nomor_dokumen: req.body.no_surat,
            tanggal_dokumen: req.body.tanggal_surat,
            keterangan: req.body.keterangan,
        }

        if (!req.files) {
            var error = new Error("File tidak ditemukan");
            error.status = 400;
            throw error;
        }

        const _dataJenis = await models.jenis_file_master.findOne({
            where: { id: _data.id_jenis_file },
            raw: true
        }).then(x => {
            if (x != null) {
                return x;
            } else {
                res.status(422).send({
                    message: 'Jenis File Tidak Valid!'
                })
            }
        })

        if (req.files && _dataJenis) {
            const _listOldFile = await models.master_file.findAll({
                where: {
                    jenis_file_id: _data.id_jenis_file,
                    id_disaster: _data.id_disaster
                }
            });
            await putFiles(req.files.attachment, _dataJenis.id, _dataJenis.path_dir, {
                fileName: 'file-bukti-',
                id_disaster: _data.id_disaster,
                keterangan: _data.keterangan,
                nama_dokumen: _data.nama_dokumen,
                nomor_dokumen: _data.nomor_dokumen,
                tanggal_dokumen: _data.tanggal_dokumen
            }).then(async (a) => {
                if (_listOldFile.length > 0) {
                    await models.master_file.destroy({
                        where: {
                            id_file: _listOldFile.map(x => x.id_file)
                        }
                    });
                    await deleteFiles(_listOldFile, _dataJenis.path_dir);
                }
                sendResponse(res, 200, {
                    message: "File berhasil diupload",
                    jenis_file: _dataJenis.nama,
                    misc: null
                }, {
                    action_name: "master_disaster.add_file",
                    action_take_by: _dataUser.data.nama,
                    action_type: "create-or-update",
                    action_table: "master_file",
                    old_value: _listOldFile,
                    value: _data
                });
            })
        }
    } catch (err) {
        sendError(req, next, err)
    }
}

module.exports.downloadFile = async (req, res, next) => {
    try {
        const _checkFile = await models.master_file.findOne({
            where: {
                id_file: req.params.idFile
            }
        });

        if (!_checkFile) {
            var error = new Error("File tidak ditemukan");
            error.status = 404;
            throw error;
        }

        const localFilePath = path_main.join(key.__pathRoot, 'tmp/downloads', _checkFile.filename);
        await downloadFileS3(_checkFile.path, localFilePath, _checkFile.filename,);

        res.download(localFilePath, _checkFile.originalname, (err) => {
            if (err) {
                console.error('Error during download:', err);
                res.status(500).send('Error downloading file');
            } else {
                console.log('File downloaded successfully');
                // Clean up the local file after sending it to the client
                fs.unlink(localFilePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log('File deleted successfully');
                    }
                });
            }
        });
    } catch (err) {
        sendError(req, next, err)
    }
}

module.exports.setStatusRegistrant = async (req, res, next) => {
    try {
        const allowed = ['is_fit', 'is_register', 'is_revoke', 'is_accepted', 'is_rejected'];
        const filtered = filterObj(req.body, allowed);

        const _dataUser = await getUser(req, res, next);
        const _oldRegistration = await models.master_disasters.findOne({
            where: {
                id_disaster: req.body.id_disaster
            }
        });
        const _disaster = await models.master_disasters.update({
            status: req.body.status,
            status_reason: req.body.status_reason ? req.body.status_reason : null,
            ...(filtered)
        }, {
            where: {
                id_disaster: req.body.id_disaster
            }
        });

        sendResponse(res, 200, {
            message: "Registration updated successfully",
            data: _disaster,
            misc: null
        }, {
            action_name: "registration.update.status",
            action_take_by: _dataUser.data.nama,
            action_type: "update",
            action_table: "master_disasters",
            old_value: _oldRegistration,
            value: req.body
        });

    } catch (err) {
        sendError(req, next, err)
    }
}
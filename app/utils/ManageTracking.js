const ShortUniqueId = require('short-unique-id');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);
const initModels = require('../database/init');
const { generateTrackingNumber } = require('../helpers/App.helper');
var models = initModels(sequelize);

module.exports = {
    AddAllTracking,
    UpdateTracking,
    CheckIsRejected,
    AddRejectTracking
}

/**
 * @param {Object} data
 * @returns boolean
 */
async function CheckIsRejected(data = {
    id_plt: null,
    customStatus: []
}) {
    return models.tracking.findOne({
        where: {
            id_plt: data.id_plt,
            is_active: true,
            id_status: {
                [Sequelize.Op.or]: [0, 8, 9, 11, 13, 99, ...data.customStatus]
            }
        }
    })
        .then(async (x) => {
            if (x) {
                return Promise.resolve(false);
            } else {
                return Promise.resolve(true);
            }
        })
};

/**
 * Create all tracking for a PLT
 * 
 * @param {Object} data 
 * @param {Number} data.id_plt id of plt
 * @param {Number} data.id_user id of user
 * @returns {Promise<Object>} {
 *     resi: string, tracking number
 *     result: Array<Object>, result of create tracking
 * }
 */
async function AddAllTracking(data = {
    id_plt: null,
    id_user: null,
}) {
    return models.list_tracking_plt.findAll()
        .then(async (tr) => {
            var _x = {
                resi: null,
                result: []
            };
            const _trackingNumber = generateTrackingNumber();
            _x.resi = _trackingNumber;

            var promises = tr.map(function (x) {
                return models.tracking.create({
                    id_plt: data.id_plt,
                    id_user: null,
                    id_status: x.id_status,
                    keterangan: null,
                    tracking_resi: _trackingNumber,
                    now_active: false,
                    is_for_plt: true,
                })
                    .then(function (z) {
                        z['success'] = true;
                        _x.result.push(z);
                    })
                    .catch(function (f) {
                        f['success'] = false;
                        _x.result.push(f);
                        return Promise.resolve();
                    });
            })

            return Promise.all(promises)
                .then(function () {
                    return Promise.resolve(_x);
                });
        })
}

/**
 * Update tracking status for a PLT
 * 
 * @param {Object} data - object with property: id_user, keterangan
 * @param {Object} where - object with property: id_plt, id_status
 * @returns {Promise<Object>} - result of update tracking
 */
async function UpdateTracking(data = {
    id_user: null,
    keterangan: null,
}, where = {
    id_plt: null,
    id_status: null,
}) {
    return models.tracking.update({
        now_active: false,
        last_update: new Date()
    }, {
        where: {
            id_plt: where.id_plt
        }
    }).then(async (x) => {
        return await models.tracking.update({
            now_active: true,
            is_active: true,
            keterangan: data.keterangan,
            id_user: data.id_user,
        }, {
            where: {
                id_plt: where.id_plt,
                id_status: where.id_status,
            }
        }).then(async (y) => {
            return models.master_plt.update({
                id_status_tracking: where.id_status
            }, {
                where: {
                    id_plt: where.id_plt
                }
            })
        })
    })
}

async function AddRejectTracking(data = {
    id_user: null,
    keterangan: null,
    resi: null,
}, where = {
    id_plt: null,
    id_status: null,
}) {
    return models.tracking.update({
        now_active: false,
        last_update: new Date()
    }, {
        where: {
            id_plt: where.id_plt
        }
    }).then(async (x) => {
        await models.tracking.findOne({
            where: {
                id_plt: where.id_plt,
                id_status: where.id_status,
            }
        }).then(async (xx) => {
            if (xx) {
                return models.tracking.update({
                    now_active: true,
                    is_active: true,
                    keterangan: data.keterangan,
                    id_user: data.id_user,
                    is_for_plt: true,
                }, {
                    where: {
                        id_plt: where.id_plt,
                        id_status: where.id_status,
                    }
                }).then(async (y) => {
                    return models.master_plt.update({
                        id_status_tracking: where.id_status
                    }, {
                        where: {
                            id_plt: where.id_plt
                        }
                    })
                })
            } else { 
                return await models.tracking.create({
                    now_active: true,
                    is_active: true,
                    keterangan: data.keterangan,
                    id_user: data.id_user,
                    id_plt: where.id_plt,
                    id_status: where.id_status,
                    is_for_plt: true,
                    tracking_resi: data.resi,
                }).then(async (y) => {
                    return models.master_plt.update({
                        id_status_tracking: where.id_status
                    }, {
                        where: {
                            id_plt: where.id_plt
                        }
                    })
                })
            }
        })
    })
}
const ShortUniqueId = require('short-unique-id');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);
const initModels = require('../database/init');
const { generateTrackingNumber } = require('../helpers/App.helper');
var models = initModels(sequelize);

/**
 * Create detail disaster
 * 
 * @param {Object} savedData - Data disaster yang sudah disimpan di database
 * @param {Object} data - Data yang akan disimpan
 * 
 * @returns {Promise} - Promise yang berisi data yang sudah disimpan
 */
module.exports.createDetailDisaster = async (savedData, data) => {
    try {
        var _data = {
            school_npsn: savedData.school_npsn,
            is_flood: data.is_flood,
            is_earthquake: data.is_earthquake,
            is_landslide: data.is_landslide,
            is_tornado: data.is_tornado,
            is_eruption: data.is_eruption,
            is_tsunami: data.is_tsunami,
            is_fire: data.is_fire,
            is_electricity_availability: data.is_electricity_availability,
            is_water_availability: data.is_water_availability,
            is_access_road_school: data.is_access_road_school,
            n_broken_classroom_heavy: data.n_broken_classroom_heavy,
            n_broken_classroom_medium: data.n_broken_classroom_medium,
            n_broken_classroom_slight: data.n_broken_classroom_slight,
            is_broken_library: data.is_broken_library,
            is_broken_laboratory: data.is_broken_laboratory,
            is_broken_principal: data.is_broken_principal,
            is_broken_teacher: data.is_broken_teacher,
            is_broken_canteen: data.is_broken_canteen,
            is_broken_toilet: data.is_broken_toilet,
            is_broken_administration: data.is_broken_administration,
            n_people_heavy: data.n_people_heavy,
            n_people_medium: data.n_people_medium,
            n_people_slight: data.n_people_slight,
            n_people_die: data.n_people_die,
            n_people_lost: data.n_people_lost,
            n_people_evacuate: data.n_people_evacuate,
            id_disaster: savedData.id_disaster
        }

        return await models.master_disaster_detail.create(_data);
    } catch (error) {
        throw error;
    }
}

/**
 * Update detail disaster
 * 
 * @param {Object} savedData - Data disaster yang tersimpan di database
 * @param {Object} data - Data yang akan diupdate
 * 
 * @returns {Promise} - Promise yang berisi data yang sudah diupdate
 */
module.exports.updateDetailDisaster = async (savedData, data) => {
    try {
        var _data = {
            school_npsn: data.school_npsn,
            is_flood: data.is_flood,
            is_earthquake: data.is_earthquake,
            is_landslide: data.is_landslide,
            is_tornado: data.is_tornado,
            is_eruption: data.is_eruption,
            is_tsunami: data.is_tsunami,
            is_fire: data.is_fire,
            is_electricity_availability: data.is_electricity_availability,
            is_water_availability: data.is_water_availability,
            is_access_road_school: data.is_access_road_school,
            n_broken_classroom_heavy: data.n_broken_classroom_heavy,
            n_broken_classroom_medium: data.n_broken_classroom_medium,
            n_broken_classroom_slight: data.n_broken_classroom_slight,
            is_broken_library: data.is_broken_library,
            is_broken_laboratory: data.is_broken_laboratory,
            is_broken_principal: data.is_broken_principal,
            is_broken_teacher: data.is_broken_teacher,
            is_broken_canteen: data.is_broken_canteen,
            is_broken_toilet: data.is_broken_toilet,
            is_broken_administration: data.is_broken_administration,
            n_people_heavy: data.n_people_heavy,
            n_people_medium: data.n_people_medium,
            n_people_slight: data.n_people_slight,
            n_people_die: data.n_people_die,
            n_people_lost: data.n_people_lost,
            n_people_evacuate: data.n_people_evacuate
        }

        return await models.master_disaster_detail.update(_data, {
            where: {
                id_disaster: savedData.id_disaster
            }
        });
    } catch (error) {
        throw error;
    }
}
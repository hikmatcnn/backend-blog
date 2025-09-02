/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('master_disaster_detail', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    school_npsn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_flood: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_earthquake: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_landslide: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_tornado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_eruption: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_tsunami: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_fire: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_electricity_availability: {
      type: DataTypes.BOOLEAN,
      defaultValue: null
    },
    is_water_availability: {
      type: DataTypes.BOOLEAN,
      defaultValue: null
    },
    is_access_road_school: {
      type: DataTypes.BOOLEAN,
      defaultValue: null
    },
    n_broken_classroom_heavy: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    n_broken_classroom_medium: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    n_broken_classroom_slight: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_broken_library: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_broken_laboratory: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_broken_principal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_broken_teacher: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_broken_canteen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_broken_toilet: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_broken_administration: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    n_people_heavy: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    n_people_medium: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    n_people_slight: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    n_people_die: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    n_people_lost: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    n_people_evacuate: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'master_disaster_detail',
    schema: 'public',
    timestamps: false
  });
};
/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('regions', {
    id: {
      type: DataTypes.UUID,
      allowNull: true,
      primaryKey: true
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    province: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('city');
        if (rawValue.includes("KOTA")) {
          return rawValue;
        } else {
          return "KAB. " + rawValue;
        }
      }
    },
    district: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    subdistrict: {
      type: DataTypes.STRING(255),
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('city');
        const rawValueDistrict = this.getDataValue('subdistrict');
        if (rawValue.includes("KOTA")) {
          return "KEL. " + rawValueDistrict;
        } else {
          return "DESA " + rawValueDistrict;
        }
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    code_disdik_province: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    code_disdik_city: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    code_disdik_district: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    code_disdik_subdistrict: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'regions',
    schema: 'ref',
    timestamps: false
  });
};

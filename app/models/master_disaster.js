/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('master_disaster', {
    id_disaster: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    school_npsn: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "NPSN Sekolah"
    },
    school_name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Nama Sekolah"
    },
    school_address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    school_province: {
      type: DataTypes.STRING,
      allowNull: true
    },
    school_city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    school_district: {
      type: DataTypes.STRING,
      allowNull: true
    },
    school_subdistrict: {
      type: DataTypes.STRING,
      allowNull: true
    },
    disaster_topic: {
      type: DataTypes.STRING,
      allowNull: true
    },
    disaster_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.fn('now')
    },
    last_update: {
      type: DataTypes.DATE,
      allowNull: true
    },
    soft_delete: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_user: {
      type: DataTypes.UUID,
      allowNull: true
    },
    responsible_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    responsible_contact: {
      type: DataTypes.STRING,
      allowNull: true
    },
    disaster_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    disaster_duration: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_verified: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    }
  }, {
    sequelize,
    tableName: 'master_disaster',
    schema: 'public',
    timestamps: false
  });
};

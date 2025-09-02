/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('master_registrations', {
    id_registration: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nisn: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    place_of_birth: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    school_npsn: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "NPSN Asal Sekolah"
    },
    school_name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Nama Asal Sekolah"
    },
    religion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    father_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mother_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    wali_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    no_rt: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    no_rw: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address_province: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address_city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address_district: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address_subdistrict: {
      type: DataTypes.STRING,
      allowNull: true
    },
    number_phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    father_occupation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mother_occupation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    wali_occupation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ijazah_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    target_school_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    target_school_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    target_school_npsn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    religion_of_family: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_fit: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true
    },
    is_register: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true
    },
    is_revoke: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true
    },
    is_accepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true
    },
    is_rejected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true
    },
    status_reason: {
      type: DataTypes.STRING,
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
    }
  }, {
    sequelize,
    tableName: 'master_registrations',
    schema: 'public',
    timestamps: false
  });
};

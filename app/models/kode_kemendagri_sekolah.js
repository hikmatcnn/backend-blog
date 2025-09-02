/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('kode_kemendagri_sekolah', {
    npsn: {
      type: DataTypes.STRING(255),
      allowNull: true,
      primaryKey: true
    },
    desa: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    kecamatan: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    kabkota: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    kecamatan_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    kota_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    desa_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cadisdik: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'kode_kemendagri_sekolah',
    schema: 'public',
    timestamps: false
  });
};

/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('master_file', {
    id_file: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    jenis_file_id: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      references: {
        schema: 'ref',
        model: 'jenis_file_master',
        key: 'id_jenis_file'
      }
    },
    filename: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    originalname: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    size: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    encoding: {
      type: DataTypes.STRING,
      allowNull: true
    },
    path: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    mimetype: {
      type: DataTypes.STRING,
      allowNull: true
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    nama_dokumen: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    nomor_dokumen: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tanggal_dokumen: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    nisn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    id_registration: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    id_user: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    id_disaster: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    alternative_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.fn('now')
    },
    soft_delete: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
  }, {
    sequelize,
    tableName: 'master_file',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "master_file_pkey",
        unique: true,
        fields: [
          { name: "id_file" },
        ]
      },
    ]
  });
};

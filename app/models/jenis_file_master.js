/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('jenis_file_master', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nama: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    create_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: Sequelize.fn('now')
    },
    path_dir: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_operator: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'jenis_file_master',
    schema: 'ref',
    timestamps: false,
    indexes: [
      {
        name: "jenis_file_master_pkey",
        unique: true,
        fields: [
          { name: "id_jenis_file" },
        ]
      },
    ]
  });
};

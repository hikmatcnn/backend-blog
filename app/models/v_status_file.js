/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('v_status_file', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nama: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    id_registration: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: Sequelize.fn('now')
    },
    status_upload: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'v_status_file',
    schema: 'public',
    timestamps: false
  });
};

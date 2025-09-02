const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('role_policies', {
    id_role: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_policy: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'role_policies',
    schema: 'ref',
    timestamps: false
  });
};

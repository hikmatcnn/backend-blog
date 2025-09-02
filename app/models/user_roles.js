const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_roles', {
    id_user: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    id_role: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'user_roles',
    schema: 'user',
    timestamps: false
  });
};

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('roles', {
    id_role: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    role_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_update: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'roles',
    schema: 'ref',
    timestamps: false,
    indexes: [
      {
        name: "roles_pkey",
        unique: true,
        fields: [
          { name: "id_tahun" },
        ]
      },
    ]
  });
};

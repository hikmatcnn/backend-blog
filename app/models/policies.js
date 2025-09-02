const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('policies', {
    id_policy: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    label: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'policies',
    schema: 'ref',
    timestamps: false,
    indexes: [
      {
        name: "policies_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};

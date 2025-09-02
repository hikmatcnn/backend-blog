const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('history_action', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    action_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    action_take_by: {
      type: DataTypes.STRING,
      allowNull: true
    },
    action_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    action_table: {
      type: DataTypes.STRING,
      allowNull: true
    },
    old_value: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    value: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
  }, {
    sequelize,
    tableName: 'history_action',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "history_action_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};

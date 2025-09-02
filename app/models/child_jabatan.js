const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('child_jabatan', {
    _id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    id_jabatan: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: 'jabatan',
        key: 'id_jabatan'
      }
    },
    id_child_jabatan: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'jabatan',
        key: 'id_jabatan'
      }
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    last_update: {
      type: DataTypes.DATE,
      allowNull: true
    },
    soft_delete: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'child_jabatan',
    schema: 'public',
    timestamps: false
  });
};

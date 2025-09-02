/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('master_usulan', {
    id_usulan: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    id_plt: {
      type: DataTypes.UUID,
      allowNull: false
    },
    nip: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    original_npsn: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    original_level: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    original_school_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    target_npsn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    target_level: {
      type: DataTypes.STRING,
      allowNull: true
    },
    target_school_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    changeover_reason: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.fn('now')
    },
    last_update: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_accepted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    is_rejected: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    is_process: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      comment: "Mengetahui masih dalam proses"
    },
    action_by_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    action_by_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    action_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'master_usulan',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "master_usulan_pk",
        unique: true,
        fields: [
          { name: "id_usulan" },
        ]
      },
    ]
  });
};

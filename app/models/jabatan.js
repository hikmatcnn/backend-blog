const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('jabatan', {
    id_jabatan: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    id_instansi: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'instansi',
        key: 'id_instansi'
      }
    },
    nama_jabatan: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    },
    level: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    cadisdik: {
      type: DataTypes.SMALLINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'jabatan',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "jabatan_pkey",
        unique: true,
        fields: [
          { name: "id_jabatan" },
        ]
      },
    ]
  });
};

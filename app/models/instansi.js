const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('instansi', {
    id_instansi: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nama_instansi: {
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
    }
  }, {
    sequelize,
    tableName: 'instansi',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "instansi_pkey",
        unique: true,
        fields: [
          { name: "id_instansi" },
        ]
      },
    ]
  });
};

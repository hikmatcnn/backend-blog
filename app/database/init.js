var DataTypes = require("sequelize").DataTypes;

var _master_account = require("../models/master_account");
var _master_user = require("../models/master_user");
var _master_registrations = require("../models/master_registrations");
var _master_file = require("../models/master_file");
var _instansi = require("../models/instansi");
var _jabatan = require("../models/jabatan");
var _child_jabatan = require("../models/child_jabatan");
var _user_controls = require("../models/user_controls");
var _regions = require("../models/regions");
var _jenis_file_master = require("../models/jenis_file_master");
var _history_action = require("../models/history_action");
var _v_status_file = require("../models/v_status_file");
var _kode_kemendagri_sekolah = require("../models/kode_kemendagri_sekolah");
var _master_disaster = require("../models/master_disaster");
var _master_disaster_detail = require("../models/master_disaster_detail");

function initModels(sequelize) {
  var master_account = _master_account(sequelize, DataTypes);
  var master_user = _master_user(sequelize, DataTypes);
  var master_registrations = _master_registrations(sequelize, DataTypes);
  var master_file = _master_file(sequelize, DataTypes);
  var instansi = _instansi(sequelize, DataTypes);
  var jabatan = _jabatan(sequelize, DataTypes);
  var child_jabatan = _child_jabatan(sequelize, DataTypes);
  var user_controls = _user_controls(sequelize, DataTypes);
  var jenis_file_master = _jenis_file_master(sequelize, DataTypes);
  var regions = _regions(sequelize, DataTypes);
  var history_action = _history_action(sequelize, DataTypes);
  var v_status_file = _v_status_file(sequelize, DataTypes);
  var kode_kemendagri_sekolah = _kode_kemendagri_sekolah(sequelize, DataTypes);
  var master_disaster = _master_disaster(sequelize, DataTypes);
  var master_disaster_detail = _master_disaster_detail(sequelize, DataTypes);

  jabatan.belongsTo(instansi, { as: "my_instansi", foreignKey: "id_instansi" });
  instansi.hasMany(jabatan, { as: "jabatans", foreignKey: "id_instansi" });
  master_user.belongsTo(jabatan, { as: "my_jabatans", foreignKey: "id_jabatan" });
  jabatan.hasMany(master_user, { as: "master_users", foreignKey: "id_jabatan" });
  child_jabatan.belongsTo(jabatan, { as: "my_jabatans", foreignKey: "id_jabatan" });
  jabatan.hasMany(child_jabatan, { as: "my_child_jabatans", foreignKey: "id_jabatan" });
  master_account.belongsTo(master_user, { as: "my_master_users", foreignKey: "id_user" });
  master_user.hasMany(master_account, { as: "master_accounts", foreignKey: "id_user" });
  user_controls.belongsTo(master_user, { as: "my_master_users", foreignKey: "id_user" });
  master_user.hasOne(user_controls, { as: "user_control", foreignKey: "id_user" });
  master_file.belongsTo(jenis_file_master, { foreignKey: "jenis_file_id" });
  jenis_file_master.hasMany(master_file, { foreignKey: "jenis_file_id" });
  master_registrations.hasMany(master_file, { foreignKey: "id_registration" });
  master_disaster.hasMany(master_file, { foreignKey: "id_disaster" });
  master_registrations.hasMany(v_status_file, { foreignKey: "id_registration" });
  master_registrations.hasOne(kode_kemendagri_sekolah, {
    foreignKey: {
      name: 'npsn',
      allowNull: true,
    },
    sourceKey: 'target_school_npsn',
    as: 'kode_kemendagri_sekolahs'
  });

  master_disaster.hasOne(master_user, {
    foreignKey: {
      name: 'id_user',
      allowNull: true,
    },
    sourceKey: 'id_user',
    as: 'id_user_bancana'
  });

  master_disaster.hasOne(kode_kemendagri_sekolah, {
    foreignKey: {
      name: 'npsn',
      allowNull: true,
    },
    sourceKey: 'school_npsn',
    as: 'kode_sekolah_bancana'
  });

  master_disaster.hasOne(master_disaster_detail, { 
    sourceKey: 'id_disaster',
    foreignKey: 'id_disaster',
    as: 'master_disaster_details'
  });

  return {
    master_account,
    master_user,
    instansi,
    jabatan,
    child_jabatan,
    user_controls,
    master_registrations,
    master_file,
    regions,
    jenis_file_master,
    history_action,
    v_status_file,
    kode_kemendagri_sekolah,
    master_disaster,
    master_disaster_detail
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
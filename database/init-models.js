var DataTypes = require("sequelize").DataTypes;
var _master_usulan = require("./master_usulan");

function initModels(sequelize) {
  var master_usulan = _master_usulan(sequelize, DataTypes);


  return {
    master_usulan,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

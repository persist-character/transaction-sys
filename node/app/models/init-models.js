var DataTypes = require("sequelize").DataTypes;
var _address = require("./address");
var _collect = require("./collect");
var _commodity = require("./commodity");
var _commodityimg = require("./commodityimg");
var _commoditytype = require("./commoditytype");
var _motion = require("./motion");
var _motionimg = require("./motionimg");
var _purchase = require("./purchase");
var _shoppingcart = require("./shoppingcart");
var _user = require("./user");

function initModels(sequelize) {
  var address = _address(sequelize, DataTypes);
  var collect = _collect(sequelize, DataTypes);
  var commodity = _commodity(sequelize, DataTypes);
  var commodityimg = _commodityimg(sequelize, DataTypes);
  var commoditytype = _commoditytype(sequelize, DataTypes);
  var motion = _motion(sequelize, DataTypes);
  var motionimg = _motionimg(sequelize, DataTypes);
  var purchase = _purchase(sequelize, DataTypes);
  var shoppingcart = _shoppingcart(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);


  return {
    address,
    collect,
    commodity,
    commodityimg,
    commoditytype,
    motion,
    motionimg,
    purchase,
    shoppingcart,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

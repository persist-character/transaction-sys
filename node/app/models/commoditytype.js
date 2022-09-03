const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('commoditytype', {
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      comment: "商品类型"
    }
  }, {
    sequelize,
    tableName: 'commoditytype',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "type" },
        ]
      },
    ]
  });
};

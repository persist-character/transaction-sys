const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('shoppingcart', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "用户id"
    },
    goodsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "商品id"
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "购买数量"
    }
  }, {
    sequelize,
    tableName: 'shoppingcart',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "userId" },
          { name: "goodsId" },
        ]
      },
    ]
  });
};

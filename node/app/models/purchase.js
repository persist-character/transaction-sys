const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('purchase', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "ID"
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "购买的用户id"
    },
    goodsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "购买的商品id"
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "购买数量"
    }
  }, {
    sequelize,
    tableName: 'purchase',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};

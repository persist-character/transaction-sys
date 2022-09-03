const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('commodity', {
    goodsId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "商品ID"
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "发布商品用户"
    },
    goodsName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "商品名称"
    },
    goodsImg: {
      type: DataTypes.BLOB,
      allowNull: false,
      comment: "商品图片"
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "商品类型"
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: "商品价格"
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "商品数量"
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "商品描述"
    },
    comment: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "商品评论"
    },
    surplusCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "剩余数量"
    }
  }, {
    sequelize,
    tableName: 'commodity',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "goodsId" },
        ]
      },
    ]
  });
};

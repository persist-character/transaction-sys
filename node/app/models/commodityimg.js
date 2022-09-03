const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('commodityimg', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "ID"
    },
    goodsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "商品ID"
    },
    imgsrc: {
      type: DataTypes.BLOB,
      allowNull: false,
      comment: "商品图片"
    }
  }, {
    sequelize,
    tableName: 'commodityimg',
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

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('collect', {
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
    }
  }, {
    sequelize,
    tableName: 'collect',
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

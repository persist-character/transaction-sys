const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('address', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "ID"
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "收货人姓名"
    },
    telephone: {
      type: DataTypes.STRING(11),
      allowNull: false,
      comment: "收货人号码"
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "收货人号码"
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "添加该纪录的用户id"
    }
  }, {
    sequelize,
    tableName: 'address',
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

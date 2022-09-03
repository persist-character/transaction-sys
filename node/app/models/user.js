const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
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
      comment: "用户名",
      unique: "name"
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "密码"
    },
    real_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "真实姓名"
    },
    telephone: {
      type: DataTypes.STRING(11),
      allowNull: true,
      comment: "电话号码"
    },
    'e-mail': {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "邮箱"
    },
    portrait: {
      type: DataTypes.BLOB,
      allowNull: true,
      comment: "头像"
    }
  }, {
    sequelize,
    tableName: 'user',
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
      {
        name: "name",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
};

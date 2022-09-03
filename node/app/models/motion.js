const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('motion', {
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
      comment: "用户id"
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "动态文字内容"
    },
    like: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "点赞用户id集合，数据形式‘[1,2,3]’"
    }
  }, {
    sequelize,
    tableName: 'motion',
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

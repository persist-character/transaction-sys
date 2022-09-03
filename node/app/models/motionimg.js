const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('motionimg', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "ID"
    },
    motionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "动态ID"
    },
    imgsrc: {
      type: DataTypes.BLOB,
      allowNull: false,
      comment: "图片的内容，blob格式"
    }
  }, {
    sequelize,
    tableName: 'motionimg',
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

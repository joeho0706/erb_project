const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// avatar資料模式
const avatarSchema = new mongoose.Schema(
  {
    name: String,
    svg: String,
  },
  {
    timestamps: true, // 自動添加 createdAt 和 updatedAt 字段
  }
);
module.exports = mongoose.model('Avatar', avatarSchema);

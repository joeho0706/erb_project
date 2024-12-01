const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// 使用者資料模式
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true, // 自動添加 createdAt 和 updatedAt 字段
  }
);

// 在保存使用者資料前,加密密碼
userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// 使用者資料模式
const userSchema = new mongoose.Schema(
  {
    username: { type: String, min :{ value: 3, message: 'Username must be at least 3 characters long, but got {VALUE}' }, required: true, unique: true, sparse: true,immutable: true },
    password: { type: String, min :{ value: 5, message: 'Password must be at least 5 characters long, but got {VALUE}' }, required: true, sparse: true },
    email: { type: String, required: true, unique: true, validate: { validator: function (v) { return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v); }, message: props => `${props.value} is not a valid email address!` }, immutable: true},

    googleId: { type: String, immutable: true },
    facebookId: { type: String, immutable: true },
    name: { type: String, min :{ value: 3, message: 'Name must be at least 3 characters long, but got {VALUE}' }, required: true },
    thumbnail: { type: String },
    role: { type: String, required: true, default: 'user' },
    loginMethod: { type: String, required: true, enum: { values: ['facebook', 'google', 'local'], message: 'Login method must be one of: facebook, google, local' }},
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

// 驗證密碼
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);

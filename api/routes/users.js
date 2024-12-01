var express = require('express');
var router = express.Router();
const { validationResult } = require('express-validator');
// const { ObjectId } = require('mongodb');
const User = require('../models/user');
const { userValidationRules } = require('../validators/user');
const { faker } = require('@faker-js/faker');

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// 生成假數據
router.get('/generate-fake-users', async (req, res) => {
  const count = parseInt(req.query.count) || 1; // 默認生成 1 個假用戶

  try {
    for (let i = 0; i < count; i++) {
      const fakeUser = new User({
        username: faker.internet.username(),
        password: faker.internet.password(),
        email: faker.internet.email(),
      });

      await fakeUser.save(); // 使用Mongoose保存假用戶
    }
    res.redirect('/users');
  } catch (error) {
    console.error(`Error inserting fake users: ${error}`);
    res.status(500).send('Error generating fake users');
  }
});

// 顯示所有用戶，支持分頁、限制返回用戶數量和排序
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; // 默認每頁顯示10個用戶
  const sort = req.query.sort || 'createdAt'; // 默認按創建時間排序
  const order = req.query.order === 'desc' ? 'desc' : 'asc'; // 默認升序排列
  const sortOrder = order === 'desc' ? -1 : 1;
  const skip = (page - 1) * limit;
  try {
    const users = await User.find()
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(limit)
      .exec();
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);
    res.render('users', { users, currentPage: page, totalPages, sort, order });
  } catch (error) {
    res.status(500).send(error);
  }
});

// 顯示添加用戶表單
router.get('/new', (req, res) => {
  res.render('new');
});

// 添加新用戶
router.post('/', userValidationRules(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newUser = new User(req.body);
  try {
    await newUser.save(); // 使用Mongoose保存用戶
    res.redirect('/users');
  } catch (error) {
    res.status(400).send(error);
  }
});

// 刪除所有用戶
router.delete('/', async (req, res) => {
  try {
    await User.deleteMany({});
    // res.redirect('/users');
    res.send('All users have been deleted.');
  } catch (error) {
    res.status(500).send(error);
  }
});

// 顯示編輯用戶表單
router.get('/:id/edit', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render('edit', { user });
  } catch (error) {
    res.status(400).send(error);
  }
});

// 顯示用戶詳細信息
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('detail', { user });
  } catch (error) {
    res.status(400).send(error);
  }
});

// 更新用戶
router.put('/:id', userValidationRules(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.redirect('/users');
  } catch (error) {
    res.status(400).send(error);
  }
});

// 刪除用戶
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users');
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

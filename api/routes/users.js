var express = require('express');
var router = express.Router();
const { validationResult } = require('express-validator');
const User = require('../models/user');
const { userValidationRules } = require('../validators/user');
const { faker } = require('@faker-js/faker');
const path = require('path');
const fs = require('fs');
const upload = require('../config/multerConfig');
const bcrypt = require('bcrypt');

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
        name: faker.person.fullName(),
        thumbnail: faker.image.avatar(),
        role: 'user',
      });

      console.log(fakeUser.password), //!!! Log the generated password if needed for debugging !!!//
        await fakeUser.save(); // 使用Mongoose保存假用戶
    }
    res.redirect('/users');
  } catch (error) {
    console.error(`Error inserting fake users: ${error}`);
    res.status(500).send(`${error}`);
  }
});

// 顯示或搜索用戶，支持分頁、限制返回用戶數量和單字段排序
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; // 默認每頁顯示10個用戶
  const sort = req.query.sort || 'createdAt'; // 默認按創建時間排序
  const order = req.query.order === 'desc' ? 'desc' : 'asc'; // 默認升序排列
  const sortOrder = order === 'desc' ? -1 : 1;
  const skip = (page - 1) * limit;
  const field = req.query.field;
  const query = req.query.query;
  let searchCriteria = {};
  if (field && query) {
    searchCriteria[field] = { $regex: query, $options: 'i' };
  }
  try {
    const users = await User.find(searchCriteria)
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(limit)
      .exec();
    const totalUsers = await User.countDocuments(searchCriteria);
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

router.post('/', async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }

  // Do not hash the password (storing in plaintext)
  const newUser = new User(req.body);
  try {
    await newUser.save(); // 使用Mongoose保存用戶
    res.redirect('/users');
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Username or email is already taken' });
    } else {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// 刪除所有用戶
router.delete('/', async (req, res) => {
  try {
    await User.deleteMany({});
    res.send('All users have been deleted.');
  } catch (error) {
    res.status(500).send(error);
  }
});

// 導出用戶數據為 JSON
router.get('/export', async (req, res) => {
  try {
    const users = await User.find().exec();
    const jsonUsers = JSON.stringify(users, null, 2);
    const filePath = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'users.json'
    ); // 確保目錄存在
    fs.mkdirSync(path.dirname(filePath), { recursive: true }); // 將 JSON 數據寫入文件
    fs.writeFileSync(filePath, jsonUsers, 'utf8');
    res.download(filePath, 'users.json');
  } catch (error) {
    res.status(500).send('Error exporting users');
  }
});

// 顯示編輯用戶表單
router.get('/:id/edit', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('edit', { user });
  } catch (error) {
    console.error(`Error fetching user for edit: ${error}`);
    res.status(400).send('Error fetching user for edit');
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

// 顯示用戶詳細信息
router.put('/:id', async (req, res) => {
  const { currentPassword, password, confirmPassword, name } = req.body;
  const userId = req.params.id;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Ensure currentPassword is provided
    if (!currentPassword) {
      return res.render('edit', {
        user,
        errorMessage: 'Current password is required', // Provide an error message
      });
    }

    // Hash the inputted currentPassword before comparing with stored hash
    // const hashedCurrentPassword = await bcrypt.hash(currentPassword, 10);

    console.log('currentPassword ', currentPassword); //!!! for debugging !!!//
    //console.log("hashedCurrentPassword ",hashedCurrentPassword); //!!! for debugging !!!//
    console.log('user.password(DB password) ', user.password); //!!! for debugging !!!//
    // Compare the hashed current password with the stored password (hashed)

    const match = bcrypt.compareSync(currentPassword, user.password); // Compare hashed passwords

    if (!match) {
      return res.render('edit', {
        user,
        errorMessage: 'Current password is incorrect', // Provide an error message if passwords don't match
      });
    }

    // Check if new password and confirm password match
    if (password !== confirmPassword) {
      return res.render('edit', {
        user,
        errorMessage: 'Passwords do not match', // Provide an error message if passwords don't match
      });
    }

    // Update the user's name
    user.name = name;

    password.trim();
    user.password=password;

 
    // Save the updated user to the database
    await user.save();
    res.redirect('/users'); // Redirect to the user list or another page
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('An error occurred. Please try again.');
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

var express = require('express');
var router = express.Router();
const { validationResult } = require('express-validator');
// const { ObjectId } = require('mongodb');
const User = require('../models/user');
const { userValidationRules } = require('../validators/user');
const { faker } = require('@faker-js/faker');
//const bcrypt = require('bcrypt');

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// 生成假數據
router.get('/generate-fake-users',  userValidationRules(), async (req, res) => {
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

      await fakeUser.save(); // 使用Mongoose保存假用戶
    }
    res.redirect('/users');
  } catch (error) {
    console.error(`Error inserting fake users: ${error}`);
    res.status(500).send(`${error}`);
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

// Update user information (PUT request)
router.put('/:id', async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }

  // Extract immutable fields and keep them unchanged
  const { googleId, facebookId, thumbnail, password, currentPassword, ...updatableData } = req.body;

  // // If password is being updated, hash it
  // if (password) {
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   updatableData.password = hashedPassword;
  // }

  // // If password is being updated, Don not hash it
  if (req.body.password) {
    updatableData.password = req.body.password; // Keep the password as is
  }

 // Check if the current password is provided
 if (!currentPassword) {
  return res.status(400).send('Current password is required');
}


try {
  // Find the user by their ID
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send('User not found');
  }

  // Compare the current password with the stored password (assuming plain text)
  if (currentPassword !== user.password) {
    return res.status(400).send('Current password is incorrect');
  }

  // // If password is being updated, Don not hash it
  if (req.body.password) {
    updatableData.password = req.body.password; // Keep the password as is
  }

  // Update the user's information with the new data
  const updatedUser = await User.findByIdAndUpdate(req.params.id, updatableData, {
    new: true, // Return the updated document
    runValidators: true, // Ensure validation before saving
  });

  if (!updatedUser) {
    return res.status(404).send('User not found');
  }

  // Redirect to the user list or another endpoint after a successful update
  res.redirect('/users'); // or res.json(updatedUser) if you prefer to return JSON
} catch (error) {
  console.error(`Error updating user: ${error.message}`);
  res.status(400).send('There was an error updating the user. Please try again.');
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

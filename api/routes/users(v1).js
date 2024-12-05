const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
router.use(methodOverride('_method'));
const { validationResult } = require('express-validator');
const User = require('../models/user');
const { userValidationRules } = require('../validators/user');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

// Generate fake users
router.get('/generate-fake-users', async (req, res) => {
  const count = parseInt(req.query.count) || 1; // Default to generating 1 fake user
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
      await fakeUser.save();
    }
    res.redirect('/users');
  } catch (error) {
    console.error(`Error inserting fake users: ${error}`);
    res.status(500).send('Error generating fake users');
  }
});

// View all users, with pagination and sorting
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; // Default to 10 users per page
  const sort = req.query.sort || 'createdAt'; // Default sort by creation time
  const order = req.query.order === 'desc' ? 'desc' : 'asc'; // Default to ascending order
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
    console.error(`Error fetching users: ${error}`);
    res.status(500).send('Error fetching users');
  }
});

// Display new user form
router.get('/new', (req, res) => {
  res.render('new');
});

// Add a new user
router.post('/', userValidationRules(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Hash password before saving user
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({ ...req.body, password: hashedPassword });

  try {
    await newUser.save();
    res.redirect('/users');
  } catch (error) {
    console.error(`Error saving user: ${error}`);
    res.status(400).send('Error saving user');
  }
});

// Delete all users
router.delete('/', async (req, res) => {
  try {
    await User.deleteMany({});
    res.send('All users have been deleted.');
  } catch (error) {
    console.error(`Error deleting users: ${error}`);
    res.status(500).send('Error deleting users');
  }
});

// Show the edit form for a user
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

// Show user details
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('detail', { user });
  } catch (error) {
    console.error(`Error fetching user details: ${error}`);
    res.status(400).send('Error fetching user details');
  }
});

// Update user information (PUT request)
router.put('/:id', async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }

  // Extract immutable fields and keep them unchanged
  const { googleId, facebookId, thumbnail, password, ...updatableData } = req.body;

  // If password is being updated, hash it
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updatableData.password = hashedPassword;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updatableData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation before saving
    });

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.redirect('/users');
  } catch (error) {
    console.error(`Error updating user: ${error.message}`);
    res.status(400).send('There was an error updating the user. Please try again.');
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.redirect('/users');
  } catch (error) {
    console.error(`Error deleting user: ${error}`);
    res.status(500).send('Error deleting user');
  }
});

module.exports = router;

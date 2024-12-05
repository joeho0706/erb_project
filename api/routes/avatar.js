var express = require('express');
var router = express.Router();
const { validationResult } = require('express-validator');
// const { ObjectId } = require('mongodb');
const User = require('../models/user');
const { userValidationRules } = require('../validators/user');
const { faker } = require('@faker-js/faker');
const path = require('path');
const fs = require('fs');
const upload = require('../config/multerConfig');

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/upload', upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/delete', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

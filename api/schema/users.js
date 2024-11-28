const { body, validationResult } = require('express-validator');

const usersInfoSchema = [
  body('name_first').notEmpty().withMessage('First name is required'),
  body('name_last').notEmpty().withMessage('Last name is required'),
  body('gender').notEmpty().withMessage('Gender is required'),
  body('dob').notEmpty().isDate().withMessage('Date of birth is required'),
  body('email').notEmpty().isEmail().withMessage('Email is required'),
  // body('avatar').notEmpty().isURL().withMessage('Avatar is required'), // TODO will be switched if fixed avatar
  body('password')
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage('Password is required'),
];

module.exports = { usersInfoSchema };

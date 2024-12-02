const { body } = require('express-validator');

const userValidationRules = () => {
  return [
    body('username')
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long'),
    body('password')
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 characters long'),
    body('email').isEmail().withMessage('Email must be valid'),

    body('googleId')
      .isLength({ min: 3 })
      .withMessage('Google ID must be at least 3 characters long'),
    body('facebookId')
      .isLength({ min: 3 })
      .withMessage('Facebook ID must be at least 3 characters long'),
    body('registerDate')
      .isDate()
      .withMessage('Register Date must be a valid date'),
    body('name')
      .isLength({ min: 3 })
      .withMessage('Name must be at least 3 characters long'),
    body('thumbnail')
      .isLength({ min: 3 })
      .withMessage('Thumbnail must be at least 3 characters long'),
    body('role').notEmpty().withMessage('Role is required'),
  ];
};

module.exports = {
  userValidationRules,
};

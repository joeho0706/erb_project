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
  ];
};

module.exports = {
  userValidationRules,
};

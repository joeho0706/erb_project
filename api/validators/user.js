const { body } = require('express-validator');

// deprecated
const userValidationRules = () => {
  return [
    body('username')
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long'),
    // body('email')
    //   .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    //   .withMessage('Email must be a valid email address'),
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
    // body('confirm-password')
    //   .custom((value, { req }) => {
    //     if (value !== req.body.password) {
    //       throw new Error('Confirm Password does not match Password');
    //     }
    //     return true;
    
    //   })
  ];
};

module.exports = {
  userValidationRules,
};

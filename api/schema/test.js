const { body, validationResult } = require('express-validator');

let testSchema = [
  body('name').isString().notEmpty(),
  body('age').isInt({ min: 0 }),
];

module.exports = testSchema;

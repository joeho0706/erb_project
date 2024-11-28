const { body, validationResult } = require('express-validator');

const jsonConvertTypes = (req, res, next) => {
  //TODO will auto change the type
  req.body.name.first = req.body.name.first;
  req.body.name.last = req.body.name.last;
  req.body.gender = req.body.gender;
  req.body.dob = new Date(req.body.dob);
  req.body.email = req.body.email;
  req.body.avatar = req.body.avatar;
  req.body.password = req.body.password;

  next();
};

// Middleware to remove non-allowed properties from the request body
const eliminateNonAllowedProps = (req, res, next) => {
  // Get the allowed properties
  const allowedProps = [
    '_id',
    'name_first',
    'name_last',
    'gender',
    'dob',
    'email',
    'avatar',
    'password',
  ];

  // Filter the request body to only keep allowed properties
  req.body = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowedProps.includes(key))
  );

  next();
};
const isValidJson = async (req, res, next) => {
  // Check content type is application/json of headers
  if (req.headers['content-type'] == 'application/json') next();
  else res.status(400).send('Invalid Content-Type. Expected application/json');
};
const manipulateJson = async (req, res, next) => {
  req.body.name = { first: req.body.name_first, last: req.body.name_last };
  delete req.body.name_first;
  delete req.body.name_last;
  next();
};
const isValidSchema = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
const bodyArray = (req, res, next) => {
  // Check array
  if (!Array.isArray(req.body)) {
    //being array
    req.body = [req.body];
  }
  next();
};

module.exports = {
  jsonConvertTypes,
  eliminateNonAllowedProps,
  isValidJson,
  manipulateJson,
  isValidSchema,
  bodyArray,
};

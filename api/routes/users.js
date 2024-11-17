var express = require('express');
var router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');
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
// const connectMongoDB = async (req, res, next) => { //TODO will be fixed connect mongodb
//   // Connect to the MongoDB client
//   await client.connect();
//   const database = client.db('mdb');
//   const usersCollection = database.collection('users');
//   return usersCollection;
//   next();
// };

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

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

/* GET users listing. */
router.get('/view', async function (req, res, next) {
  try {
    // Connect to the MongoDB client
    await client.connect();
    const database = client.db('mdb');
    const usersCollection = database.collection('users');
    // Fetch all users from the database
    const users = await usersCollection
      .find(
        {},
        {
          projection: {
            _id: 1,
            name: 1,
            gender: 1,
            dob: 1,
            email: 1,
            avatar: 1,
            password: 1,
          },
        }
      )
      .toArray();
    res.render('users', { users: users });
    // Render the users list with the fetched data
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});

/* Get adding user view. */ //[x]
router.get('/view_user_add', function (req, res, next) {
  res.render('user_add');
});

/* POST user information. */ //[x]
router.post(
  '/user_add',
  [
    isValidJson,
    eliminateNonAllowedProps,
    usersInfoSchema,
    isValidSchema,
    manipulateJson,
    jsonConvertTypes,
    bodyArray,
  ],
  async function (req, res, next) {
    try {
      // Connect to the MongoDB client
      await client.connect();
      const database = client.db('mdb');
      const usersCollection = database.collection('users');
      // TODO Check dupercated data in MangoDB before inserting
      // add code here
      // Insert the user into the database
      const result = await usersCollection.insertMany(req.body);
      // Check inserting result
      if (result.insertedCount < 1)
        return res.status(500).send('Failed to add users');
      // feedback status
      res.status(200).send(` ${result.insertedCount} Users added successfully`);
    } catch (error) {
      // Error Massage
      console.error('Error adding users:', error);
      res.status(500).send('Failed to add users');
    } finally {
      // Close the connection
      await client.close();
    }
  }
);

/* Get user details view. */ // [x]
router.get('/view_user_details', async function (req, res, next) {
  try {
    // Connect to the MongoDB client
    await client.connect();
    const database = client.db('mdb');
    const usersCollection = database.collection('users');
    // Find special user object
    const user = await usersCollection.findOne(
      { _id: new ObjectId(req.query.id) },
      {
        projection: {
          _id: 1,
          name: 1,
          gender: 1,
          dob: 1,
          email: 1,
          avatar: 1,
          password: 1,
        },
      }
    );
    // Render the user details view with the fetched data
    res.render('user_details', { user: user });
  } catch (error) {
    // Error Message
    console.error('Error getting user details:', error);
    res.status(500).json({ message: 'Failed to get user details' });
  } finally {
    // Close the connection
    await client.close();
  }
});

/* Get edit user view. */
router.get('/view_user_edit', async function (req, res, next) {
  try {
    // Connect to the MongoDB client
    await client.connect();
    const database = client.db('mdb');
    const usersCollection = database.collection('users');
    // Find special user object
    const user = await usersCollection.findOne(
      { _id: new ObjectId(req.query.id) },
      {
        projection: {
          _id: 1,
          name: 1,
          gender: 1,
          dob: 1,
          email: 1,
          avatar: 1,
          password: 1,
        },
      }
    );
    // Render the user edit view with the fetched data
    res.render('user_edit', { user: user });
  } catch (error) {
    console.error('Error getting user edit:', error);
    res.status(500).json({ message: 'Failed to get user edit' });
  } finally {
    // Close the connection
    await client.close();
  }
});

/* POST user information. */ //[x];
router.post(
  '/user_edit',
  [
    isValidJson,
    eliminateNonAllowedProps,
    usersInfoSchema,
    isValidSchema,
    manipulateJson,
    jsonConvertTypes,
    bodyArray,
  ],
  async function (req, res, next) {
    try {
      // Connect to the MongoDB client
      await client.connect();
      const database = client.db('mdb');
      const usersCollection = database.collection('users');
      // Update the documents
      console.log('🚀 ~ updateOperations ~ req.body:', req.body);
      const updateOperations = req.body.map((update) => ({
        updateOne: {
          filter: { _id: new ObjectId(update._id) },
          update: {
            $set: {
              name: { first: update.name.first, last: update.name.last },
              gender: update.gender,
              dob: update.dob,
              email: update.email,
              // avatar: update.avatar, //TODO will add avatar
              password: update.password,
            },
          },
        },
      }));
      // Connect to the MongoDB client
      const result = await usersCollection.bulkWrite(updateOperations);
      // Check editting result
      console.log('🚀 ~ result.modifiedCount:', result.modifiedCount);
      if (result.modifiedCount == 0)
        return res.status(500).send('Failed to edit users');
      // feedback status
      res.status(200).send('Users edited successfully');
    } catch (error) {
      // Error message
      console.error('Error edit user:', error);
      res.status(500).json({ message: 'Failed to edit user' });
    } finally {
      // Close the connection
      await client.close();
    }
  }
);

/* Delete user. */ //[x]
router.get('/user_delete/:id', async function (req, res, next) {
  try {
    // Connect to the MongoDB client
    await client.connect();
    const database = client.db('mdb');
    const usersCollection = database.collection('users');
    // Delete the user
    const result = await usersCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    // If the user doesn't exist, throw an error
    if (result.deletedCount != 1) {
      res.json({ deleted_count: result.deletedCount, msg: 'User not found.' });
    } else res.json({ deleted_count: result.deletedCount, msg: `id : (${req.params.id}) User deleted successfully.` });
  } catch (error) {
    // Error Message
    console.error(error);
    res.status(500).send('Internal server error.');
  } finally {
    // Close the connection
    await client.close();
  }
});

/* Delete all users. */ //[x]
router.get('/user_delete_all', async function (req, res, next) {
  try {
    // Connect to the MongoDB client
    await client.connect();
    const database = client.db('mdb');
    const usersCollection = database.collection('users');
    // Delete all users
    const result = await usersCollection.deleteMany({});
    // If the user doesn't exist, throw an error
    if (result.deletedCount == 0) {
      res.json({ deleted_count: result.deletedCount, msg: 'Users not found.' });
    } else
      res.json({
        deleted_count: result.deletedCount,
        msg: `All users deleted successfully.`,
      });
  } catch (error) {
    // Error Message
    console.error(error);
    res.status(500).send('Internal server error.');
  } finally {
    // Close Collection
    await client.close();
  }
});

let testSchema = [
  body('name').isString().notEmpty(),
  body('age').isInt({ min: 0 }),
];

router.post(
  '/test',
  [isValidJson, testSchema, isValidSchema, bodyArray],
  async function (req, res, next) {
    try {
      // Connect to the MongoDB client
      await client.connect();
      const database = client.db('mdb');
      const test_col = database.collection('test');
      await database.dropCollection('test');
      await test_col.insertMany(req.body);
      res.send('respond with a resource : ');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      await client.close();
    }
  }
);

module.exports = router;

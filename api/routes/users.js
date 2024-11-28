var express = require('express');
var router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017/mdb');
const { usersInfoSchema } = require('../schema/users');
const {
  jsonConvertTypes,
  eliminateNonAllowedProps,
  isValidJson,
  manipulateJson,
  isValidSchema,
  bodyArray,
} = require('../middleware/users');

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;

    // Connect to the MongoDB client
    const database = await req.app.locals.connectDB();
    const usersCollection = database.collection('users');

    const count = await usersCollection.countDocuments();
    const next =
      offset + limit < count
        ? `http://localhost:3000/users?offset=${offset + limit}&limit=${limit}`
        : null;
    const prev =
      offset - limit >= 0
        ? `http://localhost:3000/users?offset=${offset - limit}&limit=${limit}`
        : null;
    const ids = await usersCollection
      .find(
        {},
        {
          projection: {
            _id: 1,
            // name: 1,
            // gender: 1,
            // dob: 1,
            // email: 1,
            // avatar: 1,
            // password: 1,
          },
        }
      )
      .skip(offset)
      .limit(limit)
      .toArray();

    let results = [];
    ids.forEach((element) => {
      results.push({ url: 'http://localhost:3000/users/' + element._id });
    });

    res.status(200).json({
      count: count,
      next: next,
      prev: prev,
      results,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

/* Add user information. */
router.post(
  '/',
  [
    // isValidJson,
    eliminateNonAllowedProps,
    usersInfoSchema,
    isValidSchema,
    manipulateJson,
    // jsonConvertTypes,
    bodyArray,
  ],
  async function (req, res, next) {
    try {
      const users = req.body;
      // Connect to the MongoDB client
      const database = await req.app.locals.connectDB();
      const usersCollection = database.collection('users');
      // TODO Check dupercated data in MangoDB before inserting
      // add code here
      // Insert the user into the database
      const result = await usersCollection.insertMany(users);
      // Check inserting result
      if (result.insertedCount < 1)
        return res.status(500).send('Failed to add users');
      // feedback status
      res.status(200).send(` ${result.insertedCount} Users added successfully`);
    } catch (error) {
      // Error Massage
      console.error('Error adding users:', error);
      res.status(500).send('Failed to add users');
    }
  }
);

/* Update user. */
router.put(
  '/',
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
      const users = req.body;
      // Connect to the MongoDB client
      const database = await req.app.locals.connectDB();
      const usersCollection = database.collection('users');
      // Update the documents
      console.log('🚀 ~ updateOperations ~ req.body:', req.body);
      const updateOperations = users.map((update) => ({
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
      res.status(500).send('Failed to edit user');
    }
  }
);

/* Delete all users. */
router.delete('/', async function (req, res, next) {
  try {
    // Connect to the MongoDB client
    const database = await req.app.locals.connectDB();
    const usersCollection = database.collection('users');

    // Delete all users
    const result = await usersCollection.deleteMany({});

    // If the user doesn't exist, throw an error
    if (result.deletedCount == 0) {
      res.json({
        deleted_count: result.deletedCount,
        msg: 'Users not found.',
      });
    } else
      res.json({
        deleted_count: result.deletedCount,
        msg: `All users deleted successfully.`,
      });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error deleting users' });
  }
});

/* GET users listing. */
router.get('/view', async function (req, res, next) {
  try {
    // Connect to the MongoDB client
    const database = await req.app.locals.connectDB();
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
router.get('/user_add', function (req, res, next) {
  res.render('user_add');
});

/* Get user details view. */ // [x]
router.get('/user_details', async function (req, res, next) {
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
router.get('/user_edit', async function (req, res, next) {
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

// /* Get adding user view. */ //[x]
// router.get('/view_user_add', function (req, res, next) {
//   res.render('user_add');
// });

// /* POST user information. */ //[x]
// router.post(
//   '/user_add',
//   [
//     isValidJson,
//     eliminateNonAllowedProps,
//     usersInfoSchema,
//     isValidSchema,
//     manipulateJson,
//     jsonConvertTypes,
//     bodyArray,
//   ],
//   async function (req, res, next) {
//     try {
//       // Connect to the MongoDB client
//       await client.connect();
//       const database = client.db('mdb');
//       const usersCollection = database.collection('users');
//       // TODO Check dupercated data in MangoDB before inserting
//       // add code here
//       // Insert the user into the database
//       const result = await usersCollection.insertMany(req.body);
//       // Check inserting result
//       if (result.insertedCount < 1)
//         return res.status(500).send('Failed to add users');
//       // feedback status
//       res.status(200).send(` ${result.insertedCount} Users added successfully`);
//     } catch (error) {
//       // Error Massage
//       console.error('Error adding users:', error);
//       res.status(500).send('Failed to add users');
//     } finally {
//       // Close the connection
//       await client.close();
//     }
//   }
// );

// /* Get user details view. */ // [x]
// router.get('/view_user_details', async function (req, res, next) {
//   try {
//     // Connect to the MongoDB client
//     await client.connect();
//     const database = client.db('mdb');
//     const usersCollection = database.collection('users');
//     // Find special user object
//     const user = await usersCollection.findOne(
//       { _id: new ObjectId(req.query.id) },
//       {
//         projection: {
//           _id: 1,
//           name: 1,
//           gender: 1,
//           dob: 1,
//           email: 1,
//           avatar: 1,
//           password: 1,
//         },
//       }
//     );
//     // Render the user details view with the fetched data
//     res.render('user_details', { user: user });
//   } catch (error) {
//     // Error Message
//     console.error('Error getting user details:', error);
//     res.status(500).json({ message: 'Failed to get user details' });
//   } finally {
//     // Close the connection
//     await client.close();
//   }
// });

// /* Get edit user view. */
// router.get('/view_user_edit', async function (req, res, next) {
//   try {
//     // Connect to the MongoDB client
//     await client.connect();
//     const database = client.db('mdb');
//     const usersCollection = database.collection('users');
//     // Find special user object
//     const user = await usersCollection.findOne(
//       { _id: new ObjectId(req.query.id) },
//       {
//         projection: {
//           _id: 1,
//           name: 1,
//           gender: 1,
//           dob: 1,
//           email: 1,
//           avatar: 1,
//           password: 1,
//         },
//       }
//     );
//     // Render the user edit view with the fetched data
//     res.render('user_edit', { user: user });
//   } catch (error) {
//     console.error('Error getting user edit:', error);
//     res.status(500).json({ message: 'Failed to get user edit' });
//   } finally {
//     // Close the connection
//     await client.close();
//   }
// });

// /* POST user information. */ //[x];
// router.post(
//   '/user_edit',
//   [
//     isValidJson,
//     eliminateNonAllowedProps,
//     usersInfoSchema,
//     isValidSchema,
//     manipulateJson,
//     jsonConvertTypes,
//     bodyArray,
//   ],
//   async function (req, res, next) {
//     try {
//       // Connect to the MongoDB client
//       await client.connect();
//       const database = client.db('mdb');
//       const usersCollection = database.collection('users');
//       // Update the documents
//       console.log('🚀 ~ updateOperations ~ req.body:', req.body);
//       const updateOperations = req.body.map((update) => ({
//         updateOne: {
//           filter: { _id: new ObjectId(update._id) },
//           update: {
//             $set: {
//               name: { first: update.name.first, last: update.name.last },
//               gender: update.gender,
//               dob: update.dob,
//               email: update.email,
//               // avatar: update.avatar, //TODO will add avatar
//               password: update.password,
//             },
//           },
//         },
//       }));
//       // Connect to the MongoDB client
//       const result = await usersCollection.bulkWrite(updateOperations);
//       // Check editting result
//       console.log('🚀 ~ result.modifiedCount:', result.modifiedCount);
//       if (result.modifiedCount == 0)
//         return res.status(500).send('Failed to edit users');
//       // feedback status
//       res.status(200).send('Users edited successfully');
//     } catch (error) {
//       // Error message
//       console.error('Error edit user:', error);
//       res.status(500).json({ message: 'Failed to edit user' });
//     } finally {
//       // Close the connection
//       await client.close();
//     }
//   }
// );

// /* Delete user. */ //[x]
// router.get('/user_delete/:id', async function (req, res, next) {
//   try {
//     // Connect to the MongoDB client
//     await client.connect();
//     const database = client.db('mdb');
//     const usersCollection = database.collection('users');
//     // Delete the user
//     const result = await usersCollection.deleteOne({
//       _id: new ObjectId(req.params.id),
//     });
//     // If the user doesn't exist, throw an error
//     if (result.deletedCount != 1) {
//       res.json({ deleted_count: result.deletedCount, msg: 'User not found.' });
//     } else res.json({ deleted_count: result.deletedCount, msg: `id : (${req.params.id}) User deleted successfully.` });
//   } catch (error) {
//     // Error Message
//     console.error(error);
//     res.status(500).send('Internal server error.');
//   } finally {
//     // Close the connection
//     await client.close();
//   }
// });

// /* Delete all users. */ //[x]
// router.get('/user_delete_all', async function (req, res, next) {
//   try {
//     // Connect to the MongoDB client
//     await client.connect();
//     const database = client.db('mdb');
//     const usersCollection = database.collection('users');
//     // Delete all users
//     const result = await usersCollection.deleteMany({});
//     // If the user doesn't exist, throw an error
//     if (result.deletedCount == 0) {
//       res.json({ deleted_count: result.deletedCount, msg: 'Users not found.' });
//     } else
//       res.json({
//         deleted_count: result.deletedCount,
//         msg: `All users deleted successfully.`,
//       });
//   } catch (error) {
//     // Error Message
//     console.error(error);
//     res.status(500).send('Internal server error.');
//   } finally {
//     // Close Collection
//     await client.close();
//   }
// });

// router.get('/pagination', async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;

//   const users = [];

//   // Connect to the MongoDB client
//   await client.connect();
//   const database = client.db('mdb');
//   const usersCollection = database.collection('users');
//   usersCollection
//     .find(
//       {},
//       {
//         projection: {
//           _id: 1,
//           name: 1,
//           gender: 1,
//           dob: 1,
//           email: 1,
//           avatar: 1,
//           password: 1,
//         },
//       }
//     )
//     .skip((page - 1) * limit)
//     .limit(limit)
//     .forEach((user) => users.push(user))
//     .then(() => res.status(200).json(users))
//     .catch((err) => {
//       res.status(500).send('Error occurred');
//     });
// });

/* Get user. */
router.get('/:id', async function (req, res, next) {
  try {
    const id = req.params.id;

    // Connect to the MongoDB client
    const database = await req.app.locals.connectDB();
    const usersCollection = database.collection('users');
    // Find special user object
    const user = await usersCollection.findOne(
      { _id: new ObjectId(id) },
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
    res.status(200).json(user);
  } catch (error) {
    // Error Message
    console.error('Error getting user details:', error);
    res.status(500).json({ message: 'Failed to get user details' });
  }
});

/* Delete user. */ //[x]
router.delete('/:id', async function (req, res, next) {
  try {
    // Connect to the MongoDB client
    const database = await req.app.locals.connectDB();
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
  }
});

let testSchema = require('../schema/test');

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

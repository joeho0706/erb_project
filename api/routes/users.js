var express = require('express');
var router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

const isValidContentType = async (req, res, next) => {
  // Check content type is application/json of headers
  if (req.headers['content-type'] == 'application/json') next();
  else res.status(400).send('Invalid Content-Type. Expected application/json');
};
const connectMongoDB = async (req, res, next) => {
  // Connect to the MongoDB client
  await client.connect();
  const database = client.db('mdb');
  const usersCollection = database.collection('users');
};

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

/* GET users listing. */
router.get('/view', async function (req, res, next) {
  try {
    // Connect to the MongoDB client
    await client.connect();
    // Select the database and collection
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
    // Render the users list with the fetched data
    res.render('users', { users: users });
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
router.post('/user_add', [connectMongoDB], async function (req, res, next) {
  try {
    // Create a user object
    const user = {
      name: { first: req.body.name_first, last: req.body.name_last },
      gender: req.body.gender,
      dob: new Date(req.body.dob),
      email: req.body.email,
      avatar: req.body.avatar,
      password: req.body.password,
    };
    // TODO Check dupercated data in MangoDB before inserting
    // add code here
    // Insert the user into the database
    const result = await usersCollection.insertOne(user);
    // Check inserting result
    if (result.insertedCount < 1) throw new Error('Failed to add users');
    // feedback status
    res.status(200).send(` ${result.insertedCount} Users added successfully`);
  } catch (error) {
    // Error Massage
    console.error('Error adding user:', error);
    res.status(500).send('Failed to add users');
  } finally {
    // Close the connection
    await client.close();
  }
});

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
router.post('/user_edit', async function (req, res, next) {
  try {
    // Connect to the MongoDB client
    await client.connect();
    const database = client.db('mdb');
    const usersCollection = database.collection('users');
    // Update the user object
    const user = {
      user_id: req.body._id,
      name: { first: req.body.name_first, last: req.body.name_last },
      gender: req.body.gender,
      dob: new Date(req.body.dob),
      email: req.body.email,
      avatar: req.body.avatar,
      password: req.body.password,
    };
    // Update the user in the database
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(user.user_id) },
      { $set: user }
    );
    // Check inserting result
    if (result.modifiedCount == 0) throw new Error('Failed to edit user');
    // feedback status
    res.status(200).send('User edited successfully');
  } catch (error) {
    // Error message
    console.error('Error edit user:', error);
    res.status(500).json({ message: 'Failed to edit user' });
  } finally {
    // Close the connection
    await client.close();
  }
});

/* Delete user. */ //[ ]
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
    // // Redirect to the index page to show updated list
    // res.redirect('/user/index_by_mongodb');
  } catch (error) {
    // Error Message
    console.error(error);
    res.status(500).send('Internal server error.');
  } finally {
    // Close the connection
    await client.close();
  }
});

/* Delete all users. */ //[ ]
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
    // // Redirect to the index page to show updated list
    // res.redirect('/users');
  } catch (error) {
    // Error Message
    console.error(error);
    res.status(500).send('Internal server error.');
  } finally {
    // Close Collection
    await client.close();
  }
});

router.post('/test', [isValidContentType], async function (req, res, next) {
  try {
    console.log('🚀 ~ req.body:', req.body);
    console.log('🚀 ~ req.headers:', req.headers['content-type']);
    res.send('respond with a resource : ');
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;

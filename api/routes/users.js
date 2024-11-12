var express = require('express');
var router = express.Router();
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    // Connect to the MongoDB client
    await client.connect();
    // Select the database and collection
    const database = client.db('mdb');
    const usersCollection = database.collection('users');
    // Fetch all users from the database
    // const users = await usersCollection.find().toArray();
    const users = await usersCollection
      .find()
      // .present({
      //   user_id: 1,
      //   name: 1,
      //   gender: 1,
      //   dob: 0,
      //   email: 0,
      //   avatar: 0,
      //   password: 0,
      // })
      .toArray();
    console.log(typeof users);
    // Render the users list with the fetched data
    res.render('users', { users });
  } catch {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});

/* Get adding user view. */
router.get('/user_add', function (req, res, next) {
  res.render('user_add');
});

/* POST user information. */
router.post('/user_add', async function (req, res, next) {
  try {
    // Connect to the MongoDB client
    await client.connect();
    // Select the database and collection
    const database = client.db('mdb');
    const usersCollection = database.collection('users');
    // Create a user object
    const user = {
      user_id,
      name: { first, last },
      gender,
      dob,
      email,
      avatar,
      password,
    };
    user.user_id = req.body.user_id;
    user.name.first = req.body.first_name;
    user.name.last = req.body.last_name;
    user.gender = req.body.gender;
    user.dob = new Date(req.body.dob);
    user.email = req.body.email;
    user.avatar = req.body.avatar;
    user.password = req.body.password;
    // Insert the user into the database
    const result = await usersCollection.insertOne(user);
    // Send a response back to the client
    res
      .status(201)
      .json({ message: 'User added successfully', userId: result.insertedId });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Failed to add user' });
  } finally {
    // Close the connection
    await client.close();
  }
});

/* Get user details view. */
router.get('/user_details', async function (req, res, next) {
  try {
    // Connect to the MongoDB client
    await client.connect();
    // Select the database and collection
    const database = client.db('mdb');
    const usersCollection = database.collection('users');
    // Find special user object
    const user = usersCollection
      .findOne({ user_id: parseInt(req.query.userId) })
      .present({
        user_id: 1,
        name: 1,
        gender: 1,
        dob: 1,
        email: 1,
        avatar: 1,
        password: 0,
      });
    // Render the user details view with the fetched data
    res.render('user_details', { user: user });
  } catch (error) {
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

    // Select the database and collection
    const database = client.db('mdb');
    const usersCollection = database.collection('users');

    // Find special user object
    const user = usersCollection
      .findOne({ user_id: parseInt(req.query.userId) })
      .present({
        user_id: 1,
        name: 1,
        gender: 1,
        dob: 1,
        email: 1,
        avatar: 1,
        password: 1,
      });

    res.render('user_edit', { user: user });
  } catch (error) {
    console.error('Error getting user details:', error);
    res.status(500).json({ message: 'Failed to get user details' });
  } finally {
    // Close the connection
    await client.close();
  }
});

/* POST user information. */
router.post('/user_edit', async function (req, res, next) {
  try {
    // Connect to the MongoDB client
    await client.connect();
    // Select the database and collection
    const database = client.db('mdb');
    const usersCollection = database.collection('users');
    // Update the user object
    const user = {
      user_id: parseInt(req.body.user_id),
      name: { first: req.body.first_name, last: req.body.last_name },
      gender: req.body.gender,
      dob: new Date(req.body.dob),
      email: req.body.email,
      avatar: req.body.avatar,
      password: req.body.password,
    };
    // Update the user in the database
    const result = await usersCollection.updateOne(
      { user_id: user.user_id },
      { $set: user }
    );
    // Send a response back to the client
    res.status(200);
  } catch {
    console.error('Error edit user:', error);
    res.status(500).json({ message: 'Failed to edit user' });
  } finally {
    // Close the connection
    await client.close();
  }
});

module.exports = router;

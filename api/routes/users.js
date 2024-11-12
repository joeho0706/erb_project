var express = require('express');
var router = express.Router();
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

// const users = [
//   { id: 1, name: 'John Doe' },
//   { id: 2, name: 'Jane Doe' },
//   { id: 3, name: 'Bob Smith' },
//   { id: 4, name: 'Alice Johnson' },
//   { id: 5, name: 'Charlie Brown' },
// ];
const users = {
  results: [
    {
      gender: 'male',
      name: {
        title: 'Mr',
        first: 'Nicklas',
        last: 'Rasmussen',
      },
      location: {
        street: {
          number: 3213,
          name: 'Herluf Trolles Vej',
        },
        city: 'Sønder Stenderup',
        state: 'Syddanmark',
        country: 'Denmark',
        postcode: 32673,
        coordinates: {
          latitude: '-45.2836',
          longitude: '-88.5168',
        },
        timezone: {
          offset: '-10:00',
          description: 'Hawaii',
        },
      },
      email: 'nicklas.rasmussen@example.com',
      login: {
        uuid: 'ae154de4-d4ae-435f-98d7-b93a937ddbee',
        username: 'ticklishkoala721',
        password: 'latino',
        salt: '2sO5ou9h',
        md5: 'bd643d27812065079b2aeeca04182ceb',
        sha1: '4a2a4387637cf61784e734d745f1393e568a0208',
        sha256:
          '3050cc4427ceefa4df2b4754e22dafe0b2b68191206bef38c1a67bd1ba654bb4',
      },
      dob: {
        date: '1979-06-01T11:51:40.559Z',
        age: 45,
      },
      registered: {
        date: '2006-11-19T10:34:07.701Z',
        age: 17,
      },
      phone: '62488689',
      cell: '32048028',
      id: {
        name: 'CPR',
        value: '010679-8689',
      },
      picture: {
        large: 'https://randomuser.me/api/portraits/men/64.jpg',
        medium: 'https://randomuser.me/api/portraits/med/men/64.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/64.jpg',
      },
      nat: 'DK',
    },
  ],
  info: {
    seed: 'bd25fea2f7a88595',
    results: 1,
    page: 1,
    version: '1.4',
  },
};
const user1 = {
  gender: 'male',
  name: {
    title: 'Mr',
    first: 'Nicklas',
    last: 'Rasmussen',
  },
  location: {
    street: {
      number: 3213,
      name: 'Herluf Trolles Vej',
    },
    city: 'Sønder Stenderup',
    state: 'Syddanmark',
    country: 'Denmark',
    postcode: 32673,
    coordinates: {
      latitude: '-45.2836',
      longitude: '-88.5168',
    },
    timezone: {
      offset: '-10:00',
      description: 'Hawaii',
    },
  },
  email: 'nicklas.rasmussen@example.com',
  login: {
    uuid: 'ae154de4-d4ae-435f-98d7-b93a937ddbee',
    username: 'ticklishkoala721',
    password: 'latino',
    salt: '2sO5ou9h',
    md5: 'bd643d27812065079b2aeeca04182ceb',
    sha1: '4a2a4387637cf61784e734d745f1393e568a0208',
    sha256: '3050cc4427ceefa4df2b4754e22dafe0b2b68191206bef38c1a67bd1ba654bb4',
  },
  dob: {
    date: '1979-06-01T11:51:40.559Z',
    age: 45,
  },
  registered: {
    date: '2006-11-19T10:34:07.701Z',
    age: 17,
  },
  phone: '62488689',
  cell: '32048028',
  id: {
    name: 'CPR',
    value: '010679-8689',
  },
  picture: {
    large: 'https://randomuser.me/api/portraits/men/64.jpg',
    medium: 'https://randomuser.me/api/portraits/med/men/64.jpg',
    thumbnail: 'https://randomuser.me/api/portraits/thumb/men/64.jpg',
  },
  nat: 'DK',
};

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('users', { users: users });
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

    // Create a user object from req.body
    const user = {
      gender: req.body.gender,
      name: {
        title: req.body.title,
        first: req.body.first,
        last: req.body.last,
      },
      location: {
        street: {
          number: req.body.number,
          name: req.body.name,
        },
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        postcode: req.body.postcode,
        coordinates: {
          latitude: req.body.latitude,
          longitude: req.body.longitude,
        },
        timezone: {
          offset: req.body.offset,
          description: req.body.description,
        },
      },
      email: req.body.email,
      login: {
        uuid: req.body.uuid,
        username: req.body.username,
        password: req.body.password,
        salt: req.body.salt,
        md5: req.body.md5,
        sha1: req.body.sha1,
        sha256: req.body.sha256,
      },
      dob: {
        date: req.body.date,
        age: req.body.age,
      },
      registered: {
        date: req.body.date,
        age: req.body.age,
      },
      phone: req.body.phone,
      cell: req.body.cell,
      id: {
        name: req.body.name,
        value: req.body.value,
      },
      picture: {
        large: req.body.large,
        medium: req.body.medium,
        thumbnail: req.body.thumbnail,
      },
      nat: req.body.nat,
    };

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
router.get('/user_details', function (req, res, next) {
  res.render('user_details');
});

/* Get edit user view. */
router.get('/user_edit', function (req, res, next) {
  res.render('user_edit');
});

/* POST user information. */
router.post('/user_edit', function (req, res, next) {
  //add code here
});

module.exports = router;

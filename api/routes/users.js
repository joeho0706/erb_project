var express = require('express');
var router = express.Router();

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
router.post('/user_add', function (req, res, next) {
  //add code here
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

var express = require('express');
var router = express.Router();

/* Get user infomation from randomuser api. */ // [x]
router.get('/randomuser/user_get', function (req, res, next) {
  // Fetch data
  fetch(`https://randomuser.me/api/?results=${req.query.results}`)
    .then((response) => response.json())
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      // Error Message
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

/* Get 50 users infomation from mockaroo api. */
router.get('/mockaroo/user50_get', function (req, res, next) {
  fetch(`https://my.api.mockaroo.com/user50/v1?key=5f2b4090`)
    .then((response) => response.json())
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

/* Get a user infomation from mockaroo api. */
router.get('/mockaroo/user_get', function (req, res, next) {
  fetch(`https://my.api.mockaroo.com/user/v1?key=5f2b4090`)
    .then((response) => response.json())
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

module.exports = router;

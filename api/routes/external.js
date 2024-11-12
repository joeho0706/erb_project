var express = require('express');
var router = express.Router();

/* Get user infomation from randomuser api. */
router.get('/randomuser/user_get', function (req, res, next) {
  let results = req.query.results;

  fetch(`https://randomuser.me/api/?results=${results}`)
    .then((response) => response.json())
    .then((data) => {
      // res.render('user_add', { users: data });
      res.json(data);
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

module.exports = router;

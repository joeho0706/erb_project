const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();

// Register route
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle registration
router.post('/register', async (req, res) => {
  try {
    const { email, username, password, name } = req.body;

    // Validate that email and other fields are provided
    if (!email || !username || !password || !name) {
      return res.status(400).send('All fields are required');
    }
    const loginMethod="local";
    const newUser = new User({ loginMethod, email, username, password, name });
    await newUser.save(); 
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering new user');
  }
});

// Local login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

// Google login
router.get('/google', passport.authenticate('google', { scope: ['profile','email'],prompt:"select_account" }));

// Google callback
router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/profile',
  failureRedirect: '/'
}));

// Facebook login
router.get('/facebook', passport.authenticate('facebook', {scope:["email" /*,"photos"*/]}));

// Facebook callback
router.get('/facebook/callback', passport.authenticate('facebook',  {
  successRedirect: '/profile',
 // scope:["email"/*, "photos"*/],
  failureRedirect: '/'
}));

module.exports = router;

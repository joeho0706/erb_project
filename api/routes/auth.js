const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();

// Register route
router.get('/register', (req, res) => {
  res.render('register', {layout: false});
});


// // Handle registration 2
// router.post('/register', async (req, res) => {
//   try {
//     const { email, username, password, confirmPassword, name } = req.body;

//     // Validate that email and other fields are provided 
//     if (!email || !username || !password || !name) {
//       return res.status(400).send('All fields are required');
//     }

//     // Validate password and confirm password match 
//     if (password !== confirmPassword) {
//       return res.render('register', { email, username, name, error: 'Passwords do not match.', layout: false });
//     }

//     // Check for existing user
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.render('register', { email, username, name, error: 'Email already in use.', layout: false });
//     }

//     // Hash password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);
    
//     const loginMethod = "local";
//     const newUser = new User({ loginMethod, email, username, password: hashedPassword, name });
    
//     await newUser.save();
//     console.log('User registered successfully, redirecting to login...');
//     res.redirect('/login');
//   } catch (err) {
//     console.error(err);
//     res.render('register', { email: req.body.email, username: req.body.username, name: req.body.name, error: 'Registration failed. Please try again.', layout: false });
//   }
// });

// //Handle registration 1
// router.post('/register', async (req, res) => { 
//   try {
//     const { email, username, password, confirmPassword, name } = req.body; 
//     // Validate that email and other fields are provided 
//     if (!email || !username || !password || !name) {
//       return res.status(400).send('All fields are required'); 
//     } 
//     // Validate password and confirm password match 
//     if (password !== confirmPassword) { 
//       return res.render('register', { email, username, name, layout: false}); 
//     } 
//     // Validate that email is existed
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.render('register', { email, username, name, error: 'Email already in use.', layout: false });
//     }
//     const loginMethod = "local"; 
//     const newUser = new User({ loginMethod, email, username, name, password }); 
//     console.log(newUser);
//     await newUser.save(); 
//     console.log('User registered successfully, redirecting to login...');
//     res.redirect('/login'); 
//   } catch (err) { 
//     console.error(err); 
//     res.render('register', { 
//       email: req.body.email, 
//       username: req.body.username, 
//       name: req.body.name,  
//       error: 'Registration failed. Please try again.', 
//       layout: false });
//   } });





// Handle registration 0
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
    res.render("register", {layout: false});
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

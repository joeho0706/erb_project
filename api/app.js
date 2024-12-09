var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
// const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const ejsLayouts = require('express-ejs-layouts');

// Load environment variables from .env
dotenv.config();

const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
require('./config/passport')(passport);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Set the port number
const PORT = process.env.PORT || 3000;

// Connect to MongoDB using Mongoose
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.error('Connection error', err);
    //useNewUrlParser: true,  deprecated
    //useUnifiedTopology: true,  deprecated
  });

// // Connect to MongoDB using MongoClient
// const client = new MongoClient('mongodb://localhost:27017');
// let db;
// // 使用 then 和 catch 來處理異步操作
// client
//   .connect()
//   .then(() => {
//     db = client.db('user_management');
//     app.listen(() => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('Failed to connect to the database:', err);
//     process.exit(1); // 終止進程以防止繼續運行
//   });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// configure express-ejs-layouts
app.use(ejsLayouts);
app.set('layout', 'layouts/main'); // default layout

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'erb_project', // Replace with your actual secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Change to true for production
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// // 等待 DB 連接成功後再處理請求
// app.use((req, res, next) => {
//   if (!db) {
//     return res
//       .status(503)
//       .send('Database connection is not ready yet. Please try again later.');
//   }
//   req.db = db;
//   next();
// });

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/auth', require('./routes/auth'));
app.get('/login', (req, res) => {
  const messages = req.flash('error');
  res.render('login', { messages, layout: false });
});

app.get('/register', (req, res) => res.render('register', {layout: false}));

app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.render('profile', { user: req.user, layout: false });
});

// Start the server
app.listen(() => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {layout: false});
});

module.exports = app;

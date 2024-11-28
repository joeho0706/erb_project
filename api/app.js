var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const env = require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
var methodOverride = require('method-override');

var app = express();

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Middleware to override HTTP methods
app.use(methodOverride('_method'));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var externalRouter = require('./routes/external');
var srcRouter = require('./routes/src');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/external', externalRouter);
app.use('/src', srcRouter);

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
  res.render('error');
});

async function connectDB() {
  client = new MongoClient(process.env.DB_URL);
  await client.connect();
  console.log('MongoDB connected');
  return client.db();
}

app.locals.connectDB = connectDB;

// Close the MongoDB connection
async function closeDB() {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Gracefully close MongoDB connection on process termination
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDB();
  process.exit(0);
});

module.exports = app;

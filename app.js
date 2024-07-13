var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const configViewEngine = require('./config/viewEngine')
const connection = require('./config/database')


const port = 3000;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var HomeRouter = require('./routes/Home');
var LoginRouter = require('./routes/Login');
// var RegisterRouter = require('./routes/AdminHome');
var AdminHomeRouter = require('./routes/AdminHome');
var AuthurHomeRouter = require('./routes/AuthurHome');

var app = express();

//config req.body
app.use(express.json()) // for Json
app.use(express.urlencoded({extended: true })) // for form data

// view engine setup
configViewEngine(app);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', HomeRouter);
app.use('/Login', LoginRouter);
app.use('/AuthurHome', AuthurHomeRouter);
app.use('/AdminHome', AdminHomeRouter);
app.use('/users', usersRouter);



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





app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
module.exports = app;


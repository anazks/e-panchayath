var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const hbs =require('hbs');
const con = require('./config/Config')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adinRouter = require('./routes/admin')
var session = require('express-session')
var fileupload = require('express-fileupload')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + "/views/partials");


app.all("/admin*",function(req,res,next){
  req.app.locals.layout = "layout/adminlayout";
  next();
})
app.all("/*",function(req,res,next){
  req.app.locals.layout = "layout/userLayout";
  next();
})
app.use(logger('dev'));
app.use(express.json());
app.use(fileupload())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge:600000 }
}))
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin',adinRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

 var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

const Dishes = require('./models/dishes');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bodyParser =  require('body-parser');
var app = express();

var session = require('express-session');
var FileStore = require('session-file-store')(session);

var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');


app.use(bodyParser.json());

// const url = 'mongodb://localhost:27017/conFusion';
const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




//cookie
app.use(cookieParser('12345-67890'));
function auth (req, res, next) {
  if (!req.signedCookies.user) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');              
        err.status = 401;
        next(err);
        return;
    }
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];
    if (user == 'admin' && pass == 'password') {
        res.cookie('user','admin',{signed: true});
        next(); // authorized
    } else {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');              
        err.status = 401;
        next(err);
    }
  }
  else {
      if (req.signedCookies.user === 'admin') {
          next();
      }
      else {
          var err = new Error('You are not authenticated!');
          err.status = 401;
          next(err);
      }
  }
}
//session
app.use(session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUninitialized: false,
    resave: false,
    store: new FileStore()
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  
  function auth (req, res, next) {
      console.log(req.session);
  
      if (!req.session.user) {
          var authHeader = req.headers.authorization;
          if (!authHeader) {
              var err = new Error('You are not authenticated!');
              res.setHeader('WWW-Authenticate', 'Basic');                        
              err.status = 401;
              next(err);
              return;
          }
          var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
          var user = auth[0];
          var pass = auth[1];
          if (user == 'admin' && pass == 'password') {
              req.session.user = 'admin';
              next(); // authorized
          } else {
              var err = new Error('You are not authenticated!');
              res.setHeader('WWW-Authenticate', 'Basic');
              err.status = 401;
              next(err);
          }
      }
      else {
          if (req.session.user === 'admin') {
              console.log('req.session: ',req.session);
              next();
          }
          else {
              var err = new Error('You are not authenticated!');
              err.status = 401;
              next(err);
          }
      }
  }
  


app.use('/', indexRouter);
app.use('/users', usersRouter);
function auth (req, res, next) {
    console.log(req.session);

  if(!req.session.user) {
      var err = new Error('You are not authenticated!');
      err.status = 403;
      return next(err);
  }
  else {
    if (req.session.user === 'authenticated') {
      next();
    }
    else {
      var err = new Error('You are not authenticated!');
      err.status = 403;
      return next(err);
    }
  }
}
function auth (req, res, next){
    console.log(req.user)
    if(!req.user){
        var err = new Error('You are not authenticated!');
        err.status = 403
        next(err);

  }else{
    next();
  }
  }
  app.use(auth);


app.use('/', indexRouter);
app.use('/users', usersRouter);

const dishRouter = require('./routes/dishRouter');
app.use('/dishes', dishRouter);

const promoRouter = require('./routes/promoRouter');
app.use('/promotions', promoRouter);

const leaderRouter = require('./routes/leaderRouter');
app.use('/leaders', leaderRouter);

const bookRouter = require('./routes/booksRouter');
app.use('/books', bookRouter);

const genreRouter = require('./routes/genresRouter');
app.use('/genres', genreRouter);

const authorRouter = require('./routes/authorRouter');
app.use('/authors', authorRouter);


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

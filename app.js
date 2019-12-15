const express = require('express');
const path = require('path');
const routes = require('./routes/index');
const books = require('./routes/books');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/books', books);

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  const error = new Error("Sorry, no page with this name.");
  error.status = 404;
  next(error);
});

// error handler
app.use( (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err.status);
  if (err.status === 404) {
    res.render('page-not-found');
  } else {
    res.render('error');
  }
});
module.exports = app;
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const cors = require('cors');

const indexRouter = require('./routes/index');
const authorRouter = require('./routes/author');
const genreRouter = require('./routes/genre');
const bookRouter = require('./routes/book');
const bookInstanceRouter = require('./routes/bookInstance');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/catalog', authorRouter);
app.use('/catalog', genreRouter);
app.use('/catalog', bookRouter);
app.use('/catalog', bookInstanceRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    error: {
      ...err,
      message: err.message || 'Server error'
    }
  });
});

module.exports = app;

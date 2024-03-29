var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
var swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");
require('dotenv').config();

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/api/users');
var userRouter = require('./routes/api/users');
var roomRouter = require('./routes/api/rooms');
var bookingRouter = require('./routes/api/booking');
let passportConfig = require('./config/passport');
const sendMailService = require('./services/sendMailService');
const sendMailQueue = require('./config/bullConfigMail');

var app = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Room booking app Express API with Swagger",
      version: "0.1.0",
      description:
        "Room booking app api Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "DatNguyen",
        email: "nnd.nguyennhudat@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/api/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

sendMailQueue.process(async job => {
  sendMailService.sendConfirmationEmail(job.data);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secret_cookie'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passportConfig.passport.initialize());

app.use('/', indexRouter);
app.use('/api/v1', userRouter);
app.use('/api/v1', roomRouter);
app.use('/api/v1', bookingRouter);

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

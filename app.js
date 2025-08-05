var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const Connection = require('tedious').Connection
const Request = require('tedious').Request

require('dotenv').config()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

const username = "sa"
const db_password = process.env.DB_PASSWORD;

const config = {
  server: "localhost",
  options: {
    encrypt: false
  },
  authentication: {
    type: "default",
    options: {
      userName: username,
      password: db_password
    }
  }
}

const connection = new Connection(config)

connection.on("connect", (err) => {
  if (err) {
    console.error("Error: ", err)
  } else {
    console.log("Connected to SQL Server")
    executeStatement()
  }
})

function executeStatement() {
  request = new Request("select 42, 'hello world'", function(err, rowCount) {
    if (err) {
      console.error(err)
    } else {
      console.log(rowCount + " rows")
      connection.close()
    }
  })

  request.on("row", function(columns) {
    columns.forEach(function(column) {
      console.log(column.value)
    })
  })

  connection.execSql(request)
}

connection.connect();

console.log("Back-end server running at http://localhost:3000")

module.exports = app;

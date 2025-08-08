var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const { Sequelize, DataTypes } = require("sequelize");

require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

console.log("Back-end server running at http://localhost:3000");

/* Setup Sequelize ORM for SQL Server */
const db_username = "sa";
const db_password = process.env.DB_PASSWORD;
const host = "localhost";

let sequelize = new Sequelize(null, null, null, {
  host: host,
  dialect: "mssql",
  dialectOptions: {
    server: "localhost",
    options: {
      encrypt: false,
    },
    authentication: {
      type: "default",
      options: {
        userName: db_username,
        password: db_password,
      },
    },
  },
});

try {
  sequelize.authenticate();
  console.log("Connection established successfully.");
} catch (error) {
  console.error("Unable to connect to the database: ", error);
}

let Wave = sequelize.define(
  "Wave",
  {
    frequency: {
      type: DataTypes.INTEGER,
      field: "frequency",
    },
    frequencyMeas: {
      type: DataTypes.STRING(5),
      field: "frequency_meas",
    },
    wavelength: {
      type: DataTypes.INTEGER,
      field: "wavelength",
    },
    wavelengthMeas: {
      type: DataTypes.STRING(5),
      field: "wavelength_meas",
    },
  },
  {
    freezeTableName: true,
  }
);

async function query() {
  const wave = await Wave.create({
    frequency: 300,
    frequencyMeas: "Ghz",
    wavelength: "100000",
    wavelengthMeas: "km",
  });
  console.log("Wave id: ", wave.id);

  const waves = await Wave.findAll();
  console.log("All waves: ", JSON.stringify(waves, null, 2))
}

query()
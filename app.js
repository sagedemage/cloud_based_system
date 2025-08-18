var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const { sequelize, Wave, User } = require("./models");
const { random_string } = require("./lib")
const bcrypt = require("bcrypt");

require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var apiRouter = require("./routes/api");

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
app.use("/api", apiRouter);

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

try {
  sequelize.authenticate();
  console.log("Connection established successfully.");
} catch (error) {
  console.error("Unable to connect to the database: ", error);
}

async function query() {
  const salt_rounds = 10;
  const password = "test1000";

  const hash = await bcrypt.hash(password, salt_rounds);

  const code = random_string(26)

  // Make sure to synchronize the User model in
  // order to create an entry for it
  await User.sync();

  await Wave.sync();
  const wave = await Wave.create({
    frequency: 300,
    frequencyMeas: "Ghz",
    wavelength: "100000",
    wavelengthMeas: "km",
    signalModulation: "AM",
    userId: 1
  });
  console.log("Wave id: ", wave.id);

  const waves = await Wave.findAll();
  console.log("All waves: ", JSON.stringify(waves, null, 2))

  const users = await User.findAll();
  console.log("All users: ", JSON.stringify(users, null, 2))

  const find_user = await User.findOne({where: { username: "test1000" }})
  const match = await bcrypt.compare("test1000", find_user.password)
  console.log(match)
}

query()
var express = require("express");
var router = express.Router();
const { sequelize, Wave, User } = require("../models");
const bcrypt = require("bcrypt");
const { random_string } = require("../lib");
var jwt = require('jsonwebtoken');

/* GET users listing. */
router.post("/register", async function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  const data = req.body;
  const email = data.email;
  const username = data.username;
  const password = data.password;

  const username_exist = await User.findOne({ where: { username: username } });
  const email_exist = await User.findOne({ where: { email: email } });

  if (email_exist !== null) {
    json_response = {msg: "email exists!", status: "Error"}
    res.json(json_response);
  } else if (username_exist !== null) {
    json_response = {msg: "username exists!", status: "Error"}
    res.json(json_response);
  } else {
    const salt_rounds = 10;
    const hash = await bcrypt.hash(password, salt_rounds);
    const code = random_string(26);

    const user = await User.create({
      email: email,
      username: username,
      password: hash,
      code: code,
    });

    json_response = {msg: "registered a user", status: "Success"}
    res.json(json_response);
  }
});

router.post("/login", async function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  const data = req.body;
  const username = data.username;
  const password = data.password;

  const find_user_via_username = await User.findOne({ where: { username: username } });
  const find_user_via_email = await User.findOne({ where: { email: username } });

  if (find_user_via_username !== null) {
    const match = await bcrypt.compare(password, find_user_via_username.password)
    if (match == false) {
      res.send("Error Login!")
    } else if (match == true) {
      const token = jwt.sign({ user_id: find_user_via_username.id, code: find_user_via_username.code }, 'token');
      json_response = {msg: "Login Success", token: token}
      res.json(json_response)
    }
  } else if (find_user_via_email !== null) {
    const match = await bcrypt.compare(password, find_user_via_email.password)
    if (match == false) {
      res.send("Error Login!")
    } else if (match == true) {
      const token = jwt.sign({ user_id: find_user_via_email.id, code: find_user_via_email.code }, 'token');
      json_response = {msg: "Login Success", token: token}
      res.json(json_response)
    }
  } else {
    res.send("Error Login")
  }
});

module.exports = router;

var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
const { Wave } = require("../sql_server_models");
const { get_cookie_value } = require("../lib");

/* GET home page. */
router.get("/", function (_req, res, _next) {
  res.render("index", { title: "Home" });
});

router.get("/about", function (_req, res, _next) {
  res.render("about", { title: "About" });
});

router.get("/login", function (_req, res, _next) {
  res.render("login", { title: "Login" });
});

router.get("/register", function (_req, res, _next) {
  res.render("register", { title: "Register" });
});

router.get("/dashboard", async function (req, res, _next) {
  const cookie = req.headers.cookie;
  const token = get_cookie_value(cookie, "token");

  if (token === null) {
    res.render("dashboard", { title: "Dashboard" });
  } else {
    const decoded = jwt.verify(token, "token");
    const user_id = decoded.user_id;

    const waves = await Wave.findAll({ where: { userId: user_id }, raw: true });

    res.render("dashboard", { title: "Dashboard", waves: waves });
  }
});

router.get("/add-wave", function (_req, res, _next) {
  res.render("add_wave", { title: "Add Wave" });
});

router.get("/edit-wave", function (_req, res, _next) {
  res.render("edit_wave", { title: "Edit Wave" });
});

module.exports = router;

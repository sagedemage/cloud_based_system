var express = require("express");
var router = express.Router();
const { Wave, User } = require("../sql_server_models");
const bcrypt = require("bcrypt");
const { random_string, log_message } = require("../lib");
var jwt = require("jsonwebtoken");

/* GET users listing. */
router.post("/register", async function (req, res, _next) {
  res.setHeader("Content-Type", "application/json");
  const data = req.body;
  const email = data.email;
  const username = data.username;
  const password = data.password;

  const username_exist = await User.findOne({ where: { username: username } });
  const email_exist = await User.findOne({ where: { email: email } });

  if (email_exist !== null) {
    const json_response = { msg: "email exists!", status: "Error" };
    res.json(json_response);
  } else if (username_exist !== null) {
    const json_response = { msg: "username exists!", status: "Error" };
    res.json(json_response);
  } else {
    const salt_rounds = 10;
    const hash = await bcrypt.hash(password, salt_rounds);
    const code = random_string(26);

    await User.create({
      email: email,
      username: username,
      password: hash,
      code: code,
    });

    const json_response = { msg: "registered a user", status: "Success" };
    res.json(json_response);
  }
});

router.post("/login", async function (req, res, _next) {
  res.setHeader("Content-Type", "application/json");
  const data = req.body;
  const username = data.username;
  const password = data.password;

  const find_user_via_username = await User.findOne({
    where: { username: username },
  });
  const find_user_via_email = await User.findOne({
    where: { email: username },
  });

  if (find_user_via_username !== null) {
    const match = await bcrypt.compare(
      password,
      find_user_via_username.password
    );
    if (match === false) {
      const err_msg = "Error Login: Incorrect password!";
      log_message(err_msg);

      const json_response = { msg: "Error Login!", status: "Error" };
      res.json(json_response);
    } else if (match === true) {
      const token = jwt.sign(
        {
          user_id: find_user_via_username.id,
          code: find_user_via_username.code,
        },
        "token"
      );
      const json_response = {
        msg: "Login Success",
        status: "Success",
        token: token,
      };
      res.json(json_response);
    }
  } else if (find_user_via_email !== null) {
    const match = await bcrypt.compare(password, find_user_via_email.password);
    if (match === false) {
      const err_msg = "Error Login: Incorrect password!";
      log_message(err_msg);

      res.send("Error Login!");
    } else if (match === true) {
      const token = jwt.sign(
        { user_id: find_user_via_email.id, code: find_user_via_email.code },
        "token"
      );
      const json_response = {
        msg: "Login Success",
        status: "Success",
        token: token,
      };
      res.json(json_response);
    }
  } else {
    const err_msg = "Error Login: Account does not exist!";
    log_message(err_msg);
    const json_response = { msg: "Error Login!", status: "Error" };
    res.json(json_response);
  }
});

router.post("/auth", async function (req, res, _next) {
  res.setHeader("Content-Type", "application/json");
  const data = req.body;
  const token = data.token;

  const decoded = jwt.verify(token, "token");

  const user_id = decoded.user_id;
  const code = decoded.code;

  const find_user = await User.findOne({ where: { id: user_id } });

  const user_code = find_user.code;

  if (code === user_code) {
    const json_response = {
      msg: "User is authenticated",
      auth: true,
      user_id: user_id,
    };
    res.json(json_response);
  } else if (code !== user_code) {
    const json_response = { msg: "User is not authenticated", auth: false };
    res.json(json_response);
  }
});

router.post("/add-wave", async function (req, res, _next) {
  res.setHeader("Content-Type", "application/json");
  const data = req.body;
  const frequency = data.frequency;
  const frequency_meas = data.frequency_meas;
  const wavelength = data.wavelength;
  const wavelength_meas = data.wavelength_meas;
  const signal_modulation = data.signal_modulation;
  const user_id = data.user_id;

  await Wave.create({
    frequency: frequency,
    frequencyMeas: frequency_meas,
    wavelength: wavelength,
    wavelengthMeas: wavelength_meas,
    signalModulation: signal_modulation,
    userId: user_id,
  });

  const json_response = { msg: "Wave added", status: "Success" };
  res.json(json_response);
});

router.post("/get-wave", async function (req, res, _next) {
  res.setHeader("Content-Type", "application/json");
  const data = req.body;
  const wave_id = data.wave_id;

  const find_wave = await Wave.findOne({ where: { id: wave_id }, raw: true });

  const json_response = {
    frequency: find_wave.frequency,
    frequency_meas: find_wave.frequencyMeas,
    wavelength: find_wave.wavelength,
    wavelength_meas: find_wave.wavelengthMeas,
    signal_modulation: find_wave.signalModulation,
  };
  res.json(json_response);
});

router.patch("/edit-wave", async function (req, res, _next) {
  res.setHeader("Content-Type", "application/json");
  const data = req.body;
  const wave_id = data.wave_id;
  const frequency = data.frequency;
  const frequency_meas = data.frequency_meas;
  const wavelength = data.wavelength;
  const wavelength_meas = data.wavelength_meas;
  const signal_modulation = data.signal_modulation;

  await Wave.update(
    {
      frequency: frequency,
      frequencyMeas: frequency_meas,
      wavelength: wavelength,
      wavelengthMeas: wavelength_meas,
      signalModulation: signal_modulation,
    },
    { where: { id: wave_id } }
  );

  const json_response = { msg: "Updated the wave", status: "Success" };
  res.json(json_response);
});

router.delete("/delete-wave", async function (req, res, _next) {
  res.setHeader("Content-Type", "application/json");
  const data = req.body;
  const wave_id = data.wave_id;

  await Wave.destroy({
    where: { id: wave_id },
  });

  const json_response = { msg: "Deleted the wave", status: "Success" };
  res.json(json_response);
});

module.exports = router;

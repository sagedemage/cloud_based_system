const { randomBytes } = require("node:crypto");
let { models } = require("./cassandra_models");
const LoginLogsService = require(`./modules/login_logs/service/login_logs.service`);

function random_string(length) {
  if (length % 2 !== 0) {
    length += 1;
  }
  return randomBytes(length / 2).toString("hex");
}

function get_cookie_value(cookie, cname) {
  let values = {};

  if (cookie === undefined) {
    return null;
  }

  let temp_values = cookie.split("; ");
  for (const value of temp_values) {
    let key_value = value.split("=");
    const key = key_value[0];
    values[key] = key_value[1];
  }
  return values[cname];
}

async function log_message(err_msg) {
  let log = new models.instance.Log({
    msg: err_msg,
    created: Date.now(),
  });

  log.save(function (err) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(err_msg);
  });

  const response = await LoginLogsService.create(err_msg);

  if (response.$metadata.httpStatusCode === 200) {
    console.log("Added Login Log");
  } else {
    console.log("Unable to add a Login Log");
  }
}

module.exports = {
  random_string,
  get_cookie_value,
  log_message,
};

const { randomBytes } = require("node:crypto");

function random_string(length) {
  if (length % 2 !== 0) {
    length += 1;
  }
  return randomBytes(length / 2).toString("hex");
}

function get_cookie_value(cookie, cname) {
  let values = {};
  let temp_values = cookie.split("; ");
  for (const value of temp_values) {
    let key_value = value.split("=");
    const key = key_value[0];
    values[key] = key_value[1];
  }
  return values[cname];
}

module.exports = {
  random_string,
  get_cookie_value,
};

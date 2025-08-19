const { randomBytes } = require("node:crypto");

function random_string(length) {
  if (length % 2 !== 0) {
    length += 1
  }
  return randomBytes(length / 2).toString("hex")
}

module.exports = {
    random_string
}
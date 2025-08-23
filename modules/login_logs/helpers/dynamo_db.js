let { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { fromEnv } = require("@aws-sdk/credential-providers");

require("dotenv").config();

const db = new DynamoDBClient({
  region: process.env.REGION,
  credentials: fromEnv(),
});

module.exports = db;

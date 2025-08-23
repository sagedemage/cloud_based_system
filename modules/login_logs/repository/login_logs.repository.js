const db = require(`../helpers/dynamo_db`);
const { v4: uuidv4 } = require("uuid");
let { PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");

class LoginLogsRepository {
  constructor() {
    this.tableName = "LoginLogs";
  }

  async find_by_id(logid) {
    const params = {
      TableName: this.tableName,
      Key: {
        logid: { S: logid },
      },
    };
    const command = new GetItemCommand(params);
    const response = await db.send(command);

    return response;
  }

  async create(msg) {
    const params = {
      TableName: this.tableName,
      Item: {
        logid: { S: uuidv4() },
        msg: { S: msg },
      },
    };

    const command = new PutItemCommand(params);
    const response = await db.send(command);

    return response;
  }
}

module.exports = new LoginLogsRepository();

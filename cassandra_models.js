let ExpressCassandra = require("express-cassandra");

let models = ExpressCassandra.createClient({
  clientOptions: {
    contactPoints: ["127.0.0.1"],
    localDataCenter: "datacenter-1",
    protocolOptions: { port: 9042 },
    keyspace: "logger",
    queryOptions: { consistency: ExpressCassandra.consistencies.one },
    socketOptions: { readTimeout: 60000 },
  },
  ormOptions: {
    defaultReplicationStrategy: {
      class: "SimpleStrategy",
      replication_factor: 1,
    },
    migration: "safe",
  },
});

let LogModel = models.loadSchema("Log", {
  fields: {
    id: {
      type: "uuid",
      default: { $db_function: "uuid()" },
    },
    msg: "text",
    created: "timestamp",
  },
  key: ["id"],
});

LogModel.syncDB(function (err, _result) {
  if (err) {
    throw err;
  }
});

module.exports = {
  models,
  LogModel,
};

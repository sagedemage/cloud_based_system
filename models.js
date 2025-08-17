const { Sequelize, DataTypes } = require("sequelize");

require("dotenv").config();

const db_username = "sa";
const db_password = process.env.DB_PASSWORD;
const host = "localhost";

let sequelize = new Sequelize(null, null, null, {
  host: host,
  dialect: "mssql",
  dialectOptions: {
    server: "localhost",
    options: {
      encrypt: false,
      database: "radio_waves",
      port: 1433,
    },
    authentication: {
      type: "default",
      options: {
        userName: db_username,
        password: db_password,
      },
    },
  },
});

const Wave = sequelize.define(
  "Wave",
  {
    frequency: {
      type: DataTypes.INTEGER,
      field: "frequency",
    },
    frequencyMeas: {
      type: DataTypes.STRING(5),
      field: "frequency_meas",
    },
    wavelength: {
      type: DataTypes.INTEGER,
      field: "wavelength",
    },
    wavelengthMeas: {
      type: DataTypes.STRING(5),
      field: "wavelength_meas",
    },
    signalModulation: {
      type: DataTypes.STRING(2),
      field: "signal_modulation",
    },
    userId: {
      type: DataTypes.INTEGER,
      field: "user_id"
    }
  },
  {
    freezeTableName: true,
  }
);

const User = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      field: "email",
    },
    username: {
      type: DataTypes.STRING,
      field: "username",
    },
    password: {
      type: DataTypes.STRING,
      field: "password",
    },
    code: {
      type: DataTypes.STRING(26),
      field: "code",
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = {
    sequelize,
    Wave,
    User
}
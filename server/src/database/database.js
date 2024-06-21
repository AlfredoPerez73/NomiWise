import Sequelize from "sequelize";

export const sequelize = new Sequelize(
  "nomiwise2",
  "postgres",
  "123",
  {
    host: "localhost",
    dialect: "postgres",
  }
);
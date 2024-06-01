import Sequelize from "sequelize";

export const sequelize = new Sequelize(
  "nomiwise",
  "postgres",
  "123",
  {
    host: "localhost",
    dialect: "postgres",
  }
);
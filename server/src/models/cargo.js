import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Empleado } from "../models/empleado.js";

export const Cargo = sequelize.define(
  "cargos",
  {
    idCargo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nCargo: {
      type: DataTypes.STRING,
    },
    fechaRegistro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    idUsuario: {
      type: DataTypes.INTEGER,
    },

  },
);

Cargo.hasMany(Empleado, {
  foreignKey: "idCargo",
  sourceKey: "idCargo",
});

Empleado.belongsTo(Cargo, {
  foreignKey: "idCargo",
  targetID: "idCargo",
});
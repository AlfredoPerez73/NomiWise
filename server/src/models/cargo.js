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
  {
    timestamps: false,
  }
);

Empleado.hasMany(Cargo, {
    foreignKey: "idEmpleado",
    sourceKey: "idEmpleado",
  });
  
Cargo.belongsTo(Empleado, {
    foreignKey: "idEmpleado",
    targetID: "idEmpleado",
  });
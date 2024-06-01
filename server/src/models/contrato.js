import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Empleado } from "../models/empleado.js";

export const Contrato = sequelize.define(
  "contratos",
  {
    idContrato: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fechaInicio: {
        type: DataTypes.DATE,
    },
    fechaFin: {
        type: DataTypes.DATE,
    },
    salario: {
        type: DataTypes.NUMBER,
    },
    tipoContrato: {
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

Empleado.hasMany(Contrato, {
    foreignKey: "idEmpleado",
    sourceKey: "idEmpleado",
  });
  
Contrato.belongsTo(Empleado, {
    foreignKey: "idEmpleado",
    targetID: "idEmpleado",
  });
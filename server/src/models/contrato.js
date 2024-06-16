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
        type: DataTypes.DECIMAL,
    },
    tipoContrato: {
        type: DataTypes.STRING,
    },
    fechaRegistro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    idSUsuario: {
        type: DataTypes.INTEGER,
    },
  },
);

Contrato.hasMany(Empleado, {
    foreignKey: "idContrato",
    sourceKey: "idContrato",
  });
  
Empleado.belongsTo(Contrato, {
    foreignKey: "idContrato",
    targetID: "idContrato",
  });
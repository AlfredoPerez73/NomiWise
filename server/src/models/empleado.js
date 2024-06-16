import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { DetalleLiquidacion } from "../models/detalleLiquidacion.js";

export const Empleado = sequelize.define(
  "empleados",
  {
    idEmpleado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    documento: {
        type: DataTypes.STRING,
    },
    nombre: {
        type: DataTypes.STRING,
    },
    estado: {
        type: DataTypes.STRING,
    },
    fechaRegistro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    idCargo: {
        type: DataTypes.INTEGER,
    },
    idContrato: {
        type: DataTypes.INTEGER,
    },
    idUsuario: {
        type: DataTypes.INTEGER,
    },
    idSUsuario: {
      type: DataTypes.INTEGER,
      unique: true
    },
  },
);

Empleado.hasMany(DetalleLiquidacion, {
    foreignKey: "idEmpleado",
    sourceKey: "idEmpleado",
  });
  
DetalleLiquidacion.belongsTo(Empleado, {
    foreignKey: "idEmpleado",
    targetID: "idEmpleado",
  });
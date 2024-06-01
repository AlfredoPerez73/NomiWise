import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const DetalleLiquidacion = sequelize.define(
  "detalleLiquidaciones",
  {
    idDetalleLiquidacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idEmpleado: {
        type: DataTypes.INTEGER,
    },
    idLiquidacion: {
        type: DataTypes.INTEGER,
    },
    idUsuario: {
        type: DataTypes.INTEGER,
    },
    diasTrabajados: {
        type: DataTypes.INTEGER,
    },
    horasExtras: {
        type: DataTypes.INTEGER,
    },
    salud: {
        type: DataTypes.NUMBER,
    },
    pension: {
        type: DataTypes.NUMBER,
    },
    auxTransporte: {
        type: DataTypes.NUMBER,
    },
    bonificacionServicio: {
        type: DataTypes.NUMBER,
    },
    auxAlimentacion: {
        type: DataTypes.NUMBER,
    },
    primaNavidad: {
        type: DataTypes.NUMBER,
    },
    vacaciones: {
        type: DataTypes.NUMBER,
    },
    cesantias: {
        type: DataTypes.NUMBER,
    },
    interesesCesantias: {
        type: DataTypes.NUMBER,
    },
    devengado: {
        type: DataTypes.NUMBER,
    },
    fechaRegistro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);
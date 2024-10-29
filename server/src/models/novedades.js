import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { DetalleLiquidacion } from "../models/detalleLiquidacion.js";

export const Novedad = sequelize.define(
  "novedades",
  {
    idNovedad: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    prestamos: {
        type: DataTypes.DECIMAL,
    },
    descuentos: {
        type: DataTypes.DECIMAL,
    },
    meses: {
      type: DataTypes.INTEGER,
    },
    intereses: {
      type: DataTypes.DECIMAL,
    },
    fechaRegistro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    idEmpleado: {
        type: DataTypes.INTEGER,
    },
    idCargo: {
        type: DataTypes.INTEGER,
    },
    idContrato: {
        type: DataTypes.INTEGER,
    },
    idUsuario: {
        type: DataTypes.INTEGER,
    }
  },
);

Novedad.hasMany(DetalleLiquidacion, {
    foreignKey: "idNovedad",
    sourceKey: "idNovedad",
  });
  
DetalleLiquidacion.belongsTo(Novedad, {
    foreignKey: "idNovedad",
    targetID: "idNovedad",
  });
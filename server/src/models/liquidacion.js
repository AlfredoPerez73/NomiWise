import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { DetalleLiquidacion } from "../models/detalleLiquidacion.js";

export const Liquidacion = sequelize.define(
  "liquidaciones",
  {
    idLiquidacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    salarioTotal: {
        type: DataTypes.DECIMAL,
    },
    saludTotal: {
        type: DataTypes.DECIMAL,
    },
    pensionTotal: {
        type: DataTypes.DECIMAL,
    },
    auxTransporteTotal: {
        type: DataTypes.DECIMAL,
    },
    bonificacionServicioTotal: {
        type: DataTypes.DECIMAL,
    },
    auxAlimentacionTotal: {
        type: DataTypes.DECIMAL,
    },
    primaNavidadTotal: {
        type: DataTypes.DECIMAL,
    },
    vacacionesTotal: {
        type: DataTypes.DECIMAL,
    },
    cesantiasTotal: {
        type: DataTypes.DECIMAL,
    },
    interesesCesantiasTotal: {
        type: DataTypes.DECIMAL,
    },
    total: {
        type: DataTypes.DECIMAL,
    },
    fechaRegistro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
  },
);


Liquidacion.hasMany(DetalleLiquidacion, {
    foreignKey: "idLiquidacion",
    sourceKey: "idLiquidacion",
  });
  
DetalleLiquidacion.belongsTo(Liquidacion, {
    foreignKey: "idLiquidacion",
    targetID: "idLiquidacion",
  });
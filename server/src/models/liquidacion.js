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
        type: DataTypes.NUMBER,
    },
    saludTotal: {
        type: DataTypes.NUMBER,
    },
    pensionTotal: {
        type: DataTypes.NUMBER,
    },
    auxTransporteTotal: {
        type: DataTypes.NUMBER,
    },
    bonificacionServicioTotal: {
        type: DataTypes.NUMBER,
    },
    auxAlimentacionTotal: {
        type: DataTypes.NUMBER,
    },
    primaNavidadTotal: {
        type: DataTypes.NUMBER,
    },
    vacacionesTotal: {
        type: DataTypes.NUMBER,
    },
    cesantiasTotal: {
        type: DataTypes.NUMBER,
    },
    interesesCesantiasTotal: {
        type: DataTypes.NUMBER,
    },
    total: {
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


DetalleLiquidacion.hasMany(Liquidacion, {
    foreignKey: "idLiquidacion",
    sourceKey: "idLiquidacion",
  });
  
Liquidacion.belongsTo(DetalleLiquidacion, {
    foreignKey: "idLiquidacion",
    targetID: "idLiquidacion",
  });
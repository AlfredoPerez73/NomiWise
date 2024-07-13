import { DataTypes } from "sequelize";
import { DetalleLiquidacion } from "../models/detalleLiquidacion.js";
import { sequelize } from "../database/database.js";

export const Liquidacion = sequelize.define(
  "liquidaciones",
  {
    idLiquidacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    año: {
        type: DataTypes.INTEGER,
    },
    mes: {
        type: DataTypes.INTEGER,
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
    idUsuario: {
        type: DataTypes.INTEGER,
    },
  },
);


Liquidacion.hasMany(DetalleLiquidacion, {
    foreignKey: "idLiquidacion",
    sourceKey: "idLiquidacion",
});

DetalleLiquidacion.belongsTo(Liquidacion, {
    foreignKey: "idLiquidacion",
    targetKey: "idLiquidacion",
});
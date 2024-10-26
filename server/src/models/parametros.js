import { DataTypes } from "sequelize";
import { DetalleLiquidacion } from "../models/detalleLiquidacion.js";
import { sequelize } from "../database/database.js";

export const Parametros = sequelize.define(
  "parametros",
  {
    idParametro: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    salarioMinimo: {
        type: DataTypes.DECIMAL,
    },
    salud: {
        type: DataTypes.DECIMAL,
    },
    pension: {
        type: DataTypes.DECIMAL,
    },
    auxTransporte: {
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


Parametros.hasMany(DetalleLiquidacion, {
    foreignKey: "idParametro",
    sourceKey: "idParametro",
});

DetalleLiquidacion.belongsTo(Parametros, {
    foreignKey: "idParametro",
    targetKey: "idParametro",
});
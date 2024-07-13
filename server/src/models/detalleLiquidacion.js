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
        año: {
            type: DataTypes.INTEGER,
        },
        mes: {
            type: DataTypes.INTEGER,
        },
        diasTrabajados: {
            type: DataTypes.INTEGER,
        },
        horasExtras: {
            type: DataTypes.INTEGER,
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
        bonificacionServicio: {
            type: DataTypes.DECIMAL,
        },
        auxAlimentacion: {
            type: DataTypes.DECIMAL,
        },
        primaNavidad: {
            type: DataTypes.DECIMAL,
        },
        vacaciones: {
            type: DataTypes.DECIMAL,
        },
        cesantias: {
            type: DataTypes.DECIMAL,
        },
        interesesCesantias: {
            type: DataTypes.DECIMAL,
        },
        devengado: {
            type: DataTypes.DECIMAL,
        },
        fechaRegistro: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
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
    },
);
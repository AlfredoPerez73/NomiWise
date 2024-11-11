import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Evaluacion = sequelize.define(
    "evaluaciones",
    {
        idEvaluacion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        productividad: {
            type: DataTypes.INTEGER,
        },
        puntualidad: {
            type: DataTypes.INTEGER,
        },
        trabajoEnEquipo: {
            type: DataTypes.INTEGER,
        },
        adaptabilidad: {
            type: DataTypes.INTEGER,
        },
        conocimientoTecnico: {
            type: DataTypes.INTEGER,
        },
        promedioEval: {
            type: DataTypes.INTEGER,
        },
        fechaRegistro: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        idEmpleado: {
            type: DataTypes.INTEGER,
        },
        idUsuario: {
            type: DataTypes.INTEGER,
        },
    },
);
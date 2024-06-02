import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Permiso = sequelize.define(
  "permisos",
  {
    idPermiso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nPermiso: {
        type: DataTypes.DATE,
    },
    fechaRegistro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    idRol: {
        type: DataTypes.INTEGER,
    },
    idUsuario: {
        type: DataTypes.INTEGER,
    },
  },
);
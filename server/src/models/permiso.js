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
      type: DataTypes.STRING,
    },
    idRol: {
      type: DataTypes.INTEGER,
    },
    idSUsuario: {
      type: DataTypes.INTEGER,
    },
    fechaRegistro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
);
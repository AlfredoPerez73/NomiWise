import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Permiso } from "../models/permiso.js";

export const Rol = sequelize.define(
  "roles",
  {
    idRol: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nRol: {
      type: DataTypes.STRING,
    },
    fechaRegistro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    idUsuario: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
  }
);

Permiso.hasMany(Rol, {
  foreignKey: "idPermiso",
  sourceKey: "idPermiso",
});

Rol.belongsTo(Permiso, {
  foreignKey: "idPermiso",
  targetID: "idPermiso",
});
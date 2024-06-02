import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Permiso } from "../models/permiso.js";
import { Usuario } from "../models/usuario.js";

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
  },
);

Rol.hasMany(Permiso, {
  foreignKey: "idRol",
  sourceKey: "idRol",
});

Permiso.belongsTo(Rol, {
  foreignKey: "idRol",
  targetID: "idRol",
});

Rol.hasMany(Usuario, {
  foreignKey: "idRol",
  sourceKey: "idRol",
});

Usuario.belongsTo(Rol, {
  foreignKey: "idRol",
  targetID: "idRol",
});
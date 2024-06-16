import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Empleado } from "./empleado.js";
import { Cargo } from "./cargo.js";
import { Contrato } from "./contrato.js";
import { Usuario } from "./usuario.js";
import { Permiso } from "./permiso.js";
import { Rol } from "./rol.js";
import { DetalleLiquidacion } from "./detalleLiquidacion.js";

export const SUsuario = sequelize.define(
  "susuarios",
  {
    idSUsuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    documento: {
        type: DataTypes.STRING,
    },
    nombre: {
      type: DataTypes.STRING,
    },
    correo: {
      type: DataTypes.STRING,
    },
    contraseña: {
      type: DataTypes.STRING,
    },
    fechaRegistro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
  },
);

SUsuario.hasMany(Empleado, {
  foreignKey: "idSUsuario",
  sourceKey: "idSUsuario",
});

Empleado.belongsTo(SUsuario, {
  foreignKey: "idSUsuario",
  targetKey: "idSUsuario",
});

SUsuario.hasMany(Cargo, {
  foreignKey: "idSUsuario",
  sourceKey: "idSUsuario",
});

Cargo.belongsTo(SUsuario, {
  foreignKey: "idSUsuario",
  targetKey: "idSUsuario",
});

SUsuario.hasMany(Contrato, {
  foreignKey: "idSUsuario",
  sourceKey: "idSUsuario",
});

Contrato.belongsTo(SUsuario, {
  foreignKey: "idSUsuario",
  targetKey: "idSUsuario",
});

SUsuario.hasMany(Usuario, {
  foreignKey: "idSUsuario",
  sourceKey: "idSUsuario",
});

Usuario.belongsTo(SUsuario, {
  foreignKey: "idSUsuario",
  targetKey: "idSUsuario",
});

Usuario.hasMany(Rol, {
  foreignKey: "idUsuario",
  sourceKey: "idUsuario",
});

Rol.belongsTo(Usuario, {
  foreignKey: "idUsuario",
  targetKey: "idUsuario",
});

Usuario.hasMany(Permiso, {
  foreignKey: "idUsuario",
  sourceKey: "idUsuario",
});

Permiso.belongsTo(Usuario, {
  foreignKey: "idUsuario",
  targetKey: "idUsuario",
});

Empleado.hasMany(DetalleLiquidacion, {
  foreignKey: "idSUsuario",
  sourceKey: "idSUsuario",
});

DetalleLiquidacion.belongsTo(Empleado, {
  foreignKey: "idSUsuario",
  targetKey: "idSUsuario",
});

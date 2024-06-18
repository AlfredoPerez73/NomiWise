import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Empleado } from "./empleado.js";
import { Cargo } from "./cargo.js";
import { Contrato } from "./contrato.js";
import { DetalleLiquidacion } from "./detalleLiquidacion.js";

export const Usuario = sequelize.define(
  "usuarios",
  {
    idUsuario: {
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
    idSUsuario: {
      type: DataTypes.INTEGER,
      unique: true
    },
    idRol: {
      type: DataTypes.INTEGER,
    },
  },
);


Usuario.hasMany(Empleado, {
  foreignKey: "idUsuario",
  sourceKey: "idUsuario",
});

Empleado.belongsTo(Usuario, {
  foreignKey: "idUsuario",
  targetKey: "idUsuario",
});

Usuario.hasMany(Cargo, {
  foreignKey: "idUsuario",
  sourceKey: "idUsuario",
});

Cargo.belongsTo(Usuario, {
  foreignKey: "idUsuario",
  targetKey: "idUsuario",
});

Usuario.hasMany(Contrato, {
  foreignKey: "idUsuario",
  sourceKey: "idUsuario",
});

Cargo.belongsTo(Usuario, {
  foreignKey: "idUsuario",
  targetKey: "idUsuario",
});

Usuario.hasMany(Contrato, {
  foreignKey: "idUsuario",
  sourceKey: "idUsuario",
});

Contrato.belongsTo(Usuario, {
  foreignKey: "idUsuario",
  targetKey: "idUsuario",
});

Empleado.hasMany(DetalleLiquidacion, {
  foreignKey: "idEmpleado",
  sourceKey: "idEmpleado",
});

DetalleLiquidacion.belongsTo(Empleado, {
  foreignKey: "idEmpleado",
  targetKey: "idEmpleado",
});

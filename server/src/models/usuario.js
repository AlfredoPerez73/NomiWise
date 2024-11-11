import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Empleado } from "./empleado.js";
import { Cargo } from "./cargo.js";
import { Contrato } from "./contrato.js";
import { DetalleLiquidacion } from "./detalleLiquidacion.js";
import { Liquidacion } from "./liquidacion.js";
import { Parametros } from "./parametros.js";
import { Novedad } from "./novedades.js";
import { Evaluacion } from "./evaluaciones.js";

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

Usuario.hasMany(Evaluacion, {
  foreignKey: "idUsuario",
  sourceKey: "idUsuario",
});

Evaluacion.belongsTo(Usuario, {
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

Usuario.hasMany(DetalleLiquidacion, {
  foreignKey: "idUsuario",
  sourceKey: "idUsuario",
});

DetalleLiquidacion.belongsTo(Usuario, {
  foreignKey: "idUsuario",
  targetKey: "idUsuario",
});

Usuario.hasMany(Parametros, {
  foreignKey: "idUsuario",
  sourceKey: "idUsuario",
});

Parametros.belongsTo(Usuario, {
  foreignKey: "idUsuario",
  targetKey: "idUsuario",
});

Usuario.hasMany(Novedad, {
  foreignKey: "idUsuario",
  sourceKey: "idUsuario",
});

Novedad.belongsTo(Usuario, {
  foreignKey: "idUsuario",
  targetKey: "idUsuario",
});

Usuario.hasMany(Liquidacion, {
  foreignKey: "idUsuario",
  sourceKey: "idUsuario",
});

Liquidacion.belongsTo(Usuario, {
  foreignKey: "idUsuario",
  targetKey: "idUsuario",
});

import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { DetalleLiquidacion } from "../models/detalleLiquidacion.js";
import { Novedad } from "../models/novedades.js";
import { Evaluacion } from "./evaluaciones.js";

export const Empleado = sequelize.define(
  "empleados",
  {
    idEmpleado: {
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
    estado: {
        type: DataTypes.STRING,
    },
    fechaRegistro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    idCargo: {
        type: DataTypes.INTEGER,
    },
    idContrato: {
        type: DataTypes.INTEGER,
    },
    idUsuario: {
        type: DataTypes.INTEGER,
    }
  },
);

Empleado.hasMany(DetalleLiquidacion, {
    foreignKey: "idEmpleado",
    sourceKey: "idEmpleado",
  });
  
DetalleLiquidacion.belongsTo(Empleado, {
    foreignKey: "idEmpleado",
    targetID: "idEmpleado",
  });

Empleado.hasMany(Novedad, {
  foreignKey: "idEmpleado",
  sourceKey: "idEmpleado",
});

Novedad.belongsTo(Empleado, {
  foreignKey: "idEmpleado",
  targetID: "idEmpleado",
});

Empleado.hasMany(Evaluacion, {
  foreignKey: "idEmpleado",
  sourceKey: "idEmpleado",
});

Evaluacion.belongsTo(Empleado, {
  foreignKey: "idEmpleado",
  targetID: "idEmpleado",
});
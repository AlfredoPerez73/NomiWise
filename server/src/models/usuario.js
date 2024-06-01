import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Empleado } from "./empleado.js";
import { Cargo } from "./cargo.js";
import { Contrato } from "./contrato.js";
import { Permiso } from "./permiso.js";
import { Rol } from "./rol.js";
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
  },
  {
    timestamps: false,
  }
);

Usuario.hasMany(Empleado, {
  foreignKey: "idUsuario",
  sourceKey: "idUsuario",
});

Empleado.belongsTo(Usuario, {
  foreignKey: "idUsuario",
  targetID: "idUsuario",
});

Usuario.hasMany(Cargo, {
    foreignKey: "idUsuario",
    targetID: "idUsuario",
  });
  
Cargo.belongsTo(Usuario, {
    foreignKey: "idUsuario",
    targetID: "idUsuario",
  });
  
  
Usuario.hasMany(Contrato, {
    foreignKey: "idUsuario",
    targetID: "idUsuario",
  });

Contrato.belongsTo(Usuario, {
    foreignKey: "idUsuario",
    targetID: "idUsuario",
  });
  
Usuario.hasMany(Permiso, {
    foreignKey: "idUsuario",
    targetID: "idUsuario",
  });
  
Permiso.belongsTo(Usuario, {
    foreignKey: "idUsuario",
    targetID: "idUsuario",
  });

    
Usuario.hasMany(Rol, {
    foreignKey: "idUsuario",
    targetID: "idUsuario",
  });
  
Rol.belongsTo(Usuario, {
    foreignKey: "idUsuario",
    targetID: "idUsuario",
  });
  
    
Usuario.hasMany(Permiso, {
    foreignKey: "idUsuario",
    targetID: "idUsuario",
  });
  
Permiso.belongsTo(Usuario, {
    foreignKey: "idUsuario",
    targetID: "idUsuario",
  });

Empleado.hasMany(DetalleLiquidacion, {
    foreignKey: "idUsuario",
    sourceKey: "idUsuario",
  });
  
DetalleLiquidacion.belongsTo(Empleado, {
    foreignKey: "idUsuario",
    targetID: "idUsuario",
  });
import app from "./app.js";
import { sequelize } from "./database/database.js";
import './models/usuario.js'
import './models/susuario.js'
import './models/cargo.js'
import './models/contrato.js'
import './models/empleado.js'
import './models/permiso.js'
import './models/rol.js'
import './models/liquidacion.js'
import './models/detalleLiquidacion.js' 

async function main() {
  try {
    await sequelize.sync({ force: false });
    app.listen(4000);
    console.log("Server corriendo en el puerto 4000");
  } catch (error) {
    console.error("Server Errrr: ", error);
  }
}

main();

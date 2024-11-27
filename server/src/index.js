import app from "./app.js";
import { sequelize } from "./database/database.js";
import dotenv from "dotenv";

// Cargar variables de entorno al inicio
dotenv.config();

async function main() {
  try {
    //sincronizamos la base de datos
    await sequelize.sync({ force: false });
    //Ajustar el puerto a render
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Server Error: ", error);
  }
}

main();
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

import rolRoutes from "./routes/rol.routes.js";
import permisoRoutes from "./routes/permiso.routes.js";
import cargoRoutes from "./routes/cargo.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import empleadoRoutes from "./routes/empleado.routes.js";
import contratoRoutes from "./routes/contrato.routes.js";
import detallesRoutes from "./routes/detalleLiquidacion.routes.js";
import parametrosRoutes from "./routes/parametros.routes.js";
import novedadesRoutes from "./routes/novedades.routes.js";
import nominaRoutes from "./routes/liquidacion.routes.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api", usuarioRoutes);
app.use("/api", rolRoutes);
app.use("/api", permisoRoutes);
app.use("/api", cargoRoutes);
app.use("/api", empleadoRoutes);
app.use("/api", contratoRoutes);
app.use("/api", detallesRoutes);
app.use("/api", parametrosRoutes);
app.use("/api", novedadesRoutes);
app.use("/api", nominaRoutes);

export default app;

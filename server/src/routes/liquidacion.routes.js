import { Router } from "express";
import {
    getNomina
} from "../controllers/liquidacion.controllers.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();

router.get("/nomina", usuarioRequerido, getNomina); // obtener todas las categorias

export default router;
import { Router } from "express";
import {
    getNomina,
    procesarTodasLasNominas
} from "../controllers/liquidacion.controllers.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();

router.get("/nomina", usuarioRequerido, getNomina);
router.post("/procesarNomina", usuarioRequerido, procesarTodasLasNominas); 

export default router;
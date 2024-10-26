import { Router } from "express";
import {
    postParametro,
    getParametro,
} from "../controllers/parametros.controller.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();

router.post("/parametros", postParametro); //crear categoria
router.get("/parametros", getParametro); //obtener categoria

export default router;
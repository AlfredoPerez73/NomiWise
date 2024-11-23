import { Router } from "express";
import {
    postDetalle,
    getDetalle
} from "../controllers/detalleLiquidacion.controllers.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();

router.post("/detalles", usuarioRequerido, postDetalle);
router.get("/detalles", usuarioRequerido, getDetalle);
//router.get("/detallesPruebas", getDetalle);

export default router;
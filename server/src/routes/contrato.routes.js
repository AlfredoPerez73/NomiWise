import { Router } from "express";
import {
    getContrato,
} from "../controllers/contrato.controller.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();

router.get("/contratos", usuarioRequerido, getContrato);

export default router;
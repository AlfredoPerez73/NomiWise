import { Router } from "express";
import {
    postNovedades,
    getNovedad,
} from "../controllers/novedades.controller.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();

router.post("/novedades", usuarioRequerido,  postNovedades);
router.get("/novedades", usuarioRequerido, getNovedad);

export default router;
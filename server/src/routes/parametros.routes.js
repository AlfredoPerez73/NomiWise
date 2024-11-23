import { Router } from "express";
import {
    postParametro,
    getParametro,
    putParametro,
    deleteParametro,
} from "../controllers/parametros.controller.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();

router.post("/parametros", usuarioRequerido,  postParametro);
router.get("/parametros", usuarioRequerido, getParametro);
router.put("/parametros/:idParametro", usuarioRequerido, putParametro);
router.delete("/parametros/:idParametro", usuarioRequerido, deleteParametro);

export default router;
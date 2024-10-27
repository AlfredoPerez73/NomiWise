import { Router } from "express";
import {
    postParametro,
    getParametro,
    putParametro,
    deleteParametro,
} from "../controllers/parametros.controller.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();

router.post("/parametros", usuarioRequerido,  postParametro); //crear categoria
router.get("/parametros", usuarioRequerido, getParametro); //obtener categoria
router.put("/parametros/:idParametro", usuarioRequerido, putParametro); //modificar una categoria
router.delete("/parametros/:idParametro", usuarioRequerido, deleteParametro); //eliminar una categoria

export default router;
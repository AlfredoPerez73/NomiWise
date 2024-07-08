import { Router } from "express";
import {
    getContrato,
} from "../controllers/contrato.controller.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();

router.get("/contratos", usuarioRequerido, getContrato); // obtener todas las categorias
/* router.put("/cargos/:idCargo", usuarioRequerido, putCargo); //modificar una categoria
router.delete("/cargos/:idCargo", usuarioRequerido, deleteCargo); //eliminar una categoria */

export default router;
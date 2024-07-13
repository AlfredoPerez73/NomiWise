import { Router } from "express";
import {
    postDetalle,
    getDetalle
} from "../controllers/detalleLiquidacion.controllers.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();

router.post("/detalles", usuarioRequerido, postDetalle); //crear categoria
router.get("/detalles", usuarioRequerido, getDetalle); // obtener todas las categorias
/* router.put("/empleados/:idEmpleado", usuarioRequerido, putEmpleado); //modificar una categoria
router.delete("/empleados/:idEmpleado", usuarioRequerido, deleteEmpleado); //eliminar una categoria */

export default router;
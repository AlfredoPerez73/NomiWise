import { Router } from "express";
import {
    getEmpleado,
    getEmpleadosByUsuario,
    postEmpleado
} from "../controllers/empleado.controllers.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();

router.post("/empleados", usuarioRequerido, postEmpleado); //crear categoria
router.get("/empleados", usuarioRequerido, getEmpleado); // obtener todas las categorias
/* router.put("/cargos/:idCargo", usuarioRequerido, putCargo); //modificar una categoria
router.delete("/cargos/:idCargo", usuarioRequerido, deleteCargo); //eliminar una categoria */

export default router;
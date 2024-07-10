import { Router } from "express";
import {
    getEmpleado,
    postEmpleado,
    putEmpleado,
    deleteEmpleado
} from "../controllers/empleado.controllers.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();

router.post("/empleados", usuarioRequerido, postEmpleado); //crear categoria
router.get("/empleados", usuarioRequerido, getEmpleado); // obtener todas las categorias
router.put("/empleados/:idEmpleado", usuarioRequerido, putEmpleado); //modificar una categoria
router.delete("/empleados/:idEmpleado", usuarioRequerido, deleteEmpleado); //eliminar una categoria

export default router;
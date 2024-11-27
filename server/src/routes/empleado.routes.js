import { Router } from "express";
import {
    getEmpleado,
    postEmpleado,
    putEmpleado,
    deleteEmpleado
} from "../controllers/empleado.controllers.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();

router.post("/empleados", usuarioRequerido, postEmpleado);
router.get("/empleadosPublicos", getEmpleado);
router.get("/empleados", usuarioRequerido, getEmpleado);
router.put("/empleados/:idEmpleado", usuarioRequerido, putEmpleado);
router.delete("/empleados/:idEmpleado", usuarioRequerido, deleteEmpleado);

export default router;
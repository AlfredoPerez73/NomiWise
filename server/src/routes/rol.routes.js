import { Router } from "express";
import {
  deleteRol,
  getRol,
  postRol,
  putRol,
} from "../controllers/rol.controllers.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();

router.post("/roles", usuarioRequerido, postRol); //crear categoria
router.get("/roles", usuarioRequerido, getRol); // obtener todas las categorias
router.put("/roles/:idRol", usuarioRequerido, putRol); //modificar una categoria
router.delete("/roles/:idRol", usuarioRequerido, deleteRol); //eliminar una categoria

export default router;
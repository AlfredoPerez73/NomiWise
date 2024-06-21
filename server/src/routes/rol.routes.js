import { Router } from "express";
import {
  deleteRol,
  getRol,
  postRol,
  putRol,
} from "../controllers/rol.controllers.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();

router.post("/roles", postRol); //crear categoria
router.get("/roles", getRol); // obtener todas las categorias
router.put("/roles/:idRol", putRol); //modificar una categoria
router.delete("/roles/:idRol", deleteRol); //eliminar una categoria

export default router;
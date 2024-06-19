import { Router } from "express";
import {
  deletePermiso,
  getPermiso,
  postPermiso,
  putPermiso,
} from "../controllers/permiso.controllers.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();

router.post("/permisos", usuarioRequerido, postPermiso); //crear categoria
router.get("/permisos", usuarioRequerido, getPermiso); // obtener todas las categorias
router.put("/permisos/:idPermiso", usuarioRequerido, putPermiso); //modificar una categoria
router.delete("/permisos/:idPermiso", usuarioRequerido, deletePermiso); //eliminar una categoria

export default router;
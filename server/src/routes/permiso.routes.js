import { Router } from "express";
import {
  deletePermiso,
  getPermiso,
  postPermiso,
  putPermiso,
} from "../controllers/permiso.controllers.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();

router.post("/permisos", postPermiso); //crear categoria
router.get("/permisos", getPermiso); // obtener todas las categorias
router.put("/permisos/:idPermiso", putPermiso); //modificar una categoria
router.delete("/permisos/:idPermiso", deletePermiso); //eliminar una categoria

export default router;
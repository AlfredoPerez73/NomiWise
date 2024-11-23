import { Router } from "express";
import {
  deletePermiso,
  getPermiso,
  postPermiso,
  putPermiso,
} from "../controllers/permiso.controllers.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();

router.post("/permisos", postPermiso);
router.get("/permisos", getPermiso);
router.put("/permisos/:idPermiso", putPermiso);
router.delete("/permisos/:idPermiso", deletePermiso);

export default router;
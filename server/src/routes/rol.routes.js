import { Router } from "express";
import {
  deleteRol,
  getRol,
  postRol,
  putRol,
} from "../controllers/rol.controllers.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();

router.post("/roles", postRol);
router.get("/roles", getRol);
router.put("/roles/:idRol", putRol);
router.delete("/roles/:idRol", deleteRol);

export default router;
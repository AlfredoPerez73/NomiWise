import { Router } from "express";
import {
  postRegistroUsuario,
  getUsuario,
  putUsuario,
  deleteUsuario,
  postCerrarSesion,
  postIniciarSesion,
  verifyToken
} from "../controllers/usuario.controllers.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();



router.post("/usuarios", usuarioRequerido, postRegistroUsuario);
router.get("/usuarios", usuarioRequerido, getUsuario);
router.put("/usuarios/:idUsuario", usuarioRequerido, putUsuario);
router.delete("/usuarios/:idUsuario", usuarioRequerido, deleteUsuario);


router.post("/loginUsuario", postIniciarSesion);
router.get("/verifyUsuario", verifyToken);
router.post("/logout", postCerrarSesion);

export default router;
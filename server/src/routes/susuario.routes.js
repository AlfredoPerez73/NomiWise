import { Router } from "express";
import {
  postRegistroUsuario,
  postCerrarSesion,
  postIniciarSesion,
  verifyToken
} from "../controllers/susuario.controllers.js";

const router = Router();


router.post("/login", postIniciarSesion);
router.post("/register", postRegistroUsuario);
router.get("/verify", verifyToken);
router.post("/logout", postCerrarSesion);

export default router;
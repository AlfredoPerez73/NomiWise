import { Router } from "express";
import {
  deleteEval,
  getEval,
  postEval,
  putEval,
} from "../controllers/evaluacion.controller.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();

router.post("/evaluaciones", usuarioRequerido, postEval); //crear categoria
router.get("/evaluaciones", usuarioRequerido, getEval); // obtener todas las categorias
router.put("/evaluaciones/:idEvaluacion", usuarioRequerido, putEval); //modificar una categoria
router.delete("/evaluaciones/:idEvaluacion", usuarioRequerido, deleteEval); //eliminar una categoria

export default router;
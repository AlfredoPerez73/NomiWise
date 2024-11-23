import { Router } from "express";
import {
  deleteEval,
  getEval,
  postEval,
  putEval,
} from "../controllers/evaluacion.controller.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();

router.post("/evaluaciones", usuarioRequerido, postEval);
router.get("/evaluaciones", usuarioRequerido, getEval);
router.put("/evaluaciones/:idEvaluacion", usuarioRequerido, putEval);
router.delete("/evaluaciones/:idEvaluacion", usuarioRequerido, deleteEval);

export default router;
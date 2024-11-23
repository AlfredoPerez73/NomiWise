import { Router } from "express";
import {
  deleteCargo,
  getCargo,
  postCargo,
  putCargo,
} from "../controllers/cargo.controllers.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();

router.post("/cargos", usuarioRequerido, postCargo);
router.get("/cargos", usuarioRequerido, getCargo);
router.put("/cargos/:idCargo", usuarioRequerido, putCargo);
router.delete("/cargos/:idCargo", usuarioRequerido, deleteCargo);

export default router;
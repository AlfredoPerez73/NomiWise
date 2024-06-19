import { Router } from "express";
import {
  deleteCargo,
  getCargo,
  postCargo,
  putCargo,
} from "../controllers/cargo.controllers.js";
import { usuarioRequerido } from "../middlewares/usuario.middleware.js";

const router = Router();

router.post("/cargos", usuarioRequerido, postCargo); //crear categoria
router.get("/cargos", usuarioRequerido, getCargo); // obtener todas las categorias
router.put("/cargos/:idCargo", usuarioRequerido, putCargo); //modificar una categoria
router.delete("/cargos/:idCargo", usuarioRequerido, deleteCargo); //eliminar una categoria

export default router;
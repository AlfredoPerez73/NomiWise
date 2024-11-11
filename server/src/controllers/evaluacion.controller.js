import * as evalService from "../services/evaluacion.service.js";

export async function postEval(req, res) {
    console.log("Datos recibidos en el backend:", req.body); // Verifica qué datos están llegando
    const idUsuario = req.usuario.idUsuario;
    const { idEmpleado, productividad, puntualidad, trabajoEnEquipo, adaptabilidad, conocimientoTecnico } = req.body;
    try {
        const newEval = await evalService.crearEvaluacion(
            idEmpleado,
            idUsuario,
            productividad, 
            puntualidad, 
            trabajoEnEquipo, 
            adaptabilidad, 
            conocimientoTecnico
        );
        res.json(newEval);
    } catch (error) {
        console.error("Error en el servidor:", error.message);
        res.status(500).json({ message: error.message });
    }
}


export async function getEval(req, res) {
    try {
        const evals = await evalService.obtenerEvals();
        res.json(evals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function putEval(req, res) {
    const idUsuario = req.usuario.idUsuario;
    const { idEmpleado, idEvaluacion } = req.params;
    const { productividad, puntualidad, trabajoEnEquipo, adaptabilidad, conocimientoTecnico } = req.body;
    try {
        const evalActualizada = await evalService.actualizarEval(
            idEvaluacion,
            idEmpleado,
            idUsuario,
            productividad, 
            puntualidad, 
            trabajoEnEquipo, 
            adaptabilidad, 
            conocimientoTecnico
        );
        res.json(evalActualizada);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function deleteEval(req, res) {
    const { idEvaluacion } = req.params;
    try {
        await evalService.eliminarEval(idEvaluacion);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
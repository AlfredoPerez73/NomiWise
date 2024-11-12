import { Evaluacion } from "../models/evaluaciones.js";
import { EvaluacionDTO } from "../dtos/evaluaciones.dto.js";

export async function crearEvaluacion(idEmpleado, idUsuario, productividad, puntualidad, trabajoEnEquipo, adaptabilidad, conocimientoTecnico) {
    try {

        const promedioEvals = Math.round((productividad + puntualidad + trabajoEnEquipo + adaptabilidad + conocimientoTecnico) / 5);

        const newEval = await Evaluacion.create({
            idEmpleado,
            idUsuario,
            productividad,
            puntualidad,
            trabajoEnEquipo,
            adaptabilidad,
            conocimientoTecnico,
            promedioEval: promedioEvals
        });
        return new EvaluacionDTO(
            newEval.idEmpleado,
            newEval.idUsuario,
            newEval.productividad,
            newEval.puntualidad,
            newEval.trabajoEnEquipo,
            newEval.adaptabilidad,
            newEval.conocimientoTecnico,
            newEval.promedioEval
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function obtenerEvals() {
    try {
        const evalss = await Evaluacion.findAll();
        return evalss.map(
            (evals) =>
                new EvaluacionDTO(
                    evals.idEvaluacion,
                    evals.idEmpleado,
                    evals.idUsuario,
                    evals.productividad,
                    evals.puntualidad,
                    evals.trabajoEnEquipo,
                    evals.adaptabilidad,
                    evals.conocimientoTecnico,
                    evals.promedioEval,
                    evals.fechaRegistro
                )
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function actualizarEval(idEvaluacion, idEmpleado, idUsuario, productividad, puntualidad, trabajoEnEquipo, adaptabilidad, conocimientoTecnico) {
    try {
        const evals = await Evaluacion.findOne({
            where: {
                idEvaluacion: idEvaluacion,
            },
        });

        if (!evals) {
            throw new Error('La evaluacion no existe.');
        }
        
        const promedioEvals = Math.round((productividad + puntualidad + trabajoEnEquipo + adaptabilidad + conocimientoTecnico) / 5);

        evals.idEmpleado = idEmpleado;
        evals.idUsuario = idUsuario;
        evals.productividad = productividad;
        evals.puntualidad = puntualidad;
        evals.trabajoEnEquipo = trabajoEnEquipo;
        evals.adaptabilidad = adaptabilidad;
        evals.conocimientoTecnico = conocimientoTecnico;
        evals.promedioEval = promedioEvals;
        await evals.save();

        // Retornar el DTO actualizado
        return new EvaluacionDTO(
            evals.idEvaluacion,
            evals.idEmpleado,
            evals.idUsuario,
            evals.productividad,
            evals.puntualidad,
            evals.trabajoEnEquipo,
            evals.adaptabilidad,
            evals.conocimientoTecnico,
            evals.promedioEval,
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function eliminarEval(idEvaluacion) {
    try {
        const evals = await Evaluacion.findOne({
            where: {
                idEvaluacion: idEvaluacion,
            },
        });

        if (!evals) {
            throw new Error('La evaluacion no existe.');
        }

        await evals.destroy();
    } catch (error) {
        throw new Error(error.message);
    }
}
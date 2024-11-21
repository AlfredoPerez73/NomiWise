import * as liquidacionService from "../services/liquidacion.services.js";
import * as detalleLiquidacionService from "../services/detalleLiquidacion.services.js";

export async function getNomina(req, res) {
    try {
        const liquidaciones = await liquidacionService.obtenerNomina();
        res.json(liquidaciones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function procesarTodasLasNominas(req, res) {
    try {
        // Obtener las nóminas del cuerpo de la solicitud
        const nominas = req.body;
        // Enviar las nóminas al sistema de Finanzas
        const errores = await detalleLiquidacionService.enviarVariasNominasAFinanzas(nominas);

        // Responde con éxito y cualquier error encontrado
        if (errores.length > 0) {
            return res.status(207).json({
                message: "Se procesaron algunas nóminas con errores.",
                errores,
            });
        }

        res.status(200).json({ message: "Todas las nóminas fueron enviadas correctamente" });
    } catch (error) {
        console.error("Error al procesar las nóminas:", error.message);
        res.status(500).json({ error: "Hubo un error al procesar las nóminas" });
    }
}

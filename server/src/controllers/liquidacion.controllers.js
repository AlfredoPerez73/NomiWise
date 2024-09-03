import * as liquidacionService from "../services/liquidacion.services.js";

export async function getNomina(req, res) {
    try {
        const liquidaciones = await liquidacionService.obtenerNomina();
        res.json(liquidaciones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
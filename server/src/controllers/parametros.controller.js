import * as parametroServices from "../services/parametros.services.js";

export async function postParametro(req, res) {
    const {             
        salarioMinimo,
        salud,
        pension,
        auxTransporte, 
    } = req.body;
    try {
        const newParametro = await parametroServices.crearParametro(
            salarioMinimo,
            salud,
            pension,
            auxTransporte,
        );
        res.json(newParametro);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getParametro(req, res) {
    try {
        const parametros = await parametroServices.obtenerParametro();
        res.json(parametros);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
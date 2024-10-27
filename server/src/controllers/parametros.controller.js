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

export async function putParametro(req, res) {
    const {             
        salarioMinimo,
        salud,
        pension,
        auxTransporte, 
    } = req.body;
    const { idParametro } = req.params;
    try {
        const parametroActualizado = await parametroServices.actualizarParametro(
            idParametro,
            salarioMinimo,
            salud,
            pension,
            auxTransporte,
        );
        res.json(parametroActualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function deleteParametro(req, res) {
    const { idParametro } = req.params;
    try {
        await parametroServices.eliminarParametro(idParametro);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
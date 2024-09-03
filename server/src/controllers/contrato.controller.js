import * as contratoService from '../services/contrato.services.js';

export async function getContrato(req, res) {
    try {
        const contratos = await contratoService.obtenerContratos();
        res.json(contratos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

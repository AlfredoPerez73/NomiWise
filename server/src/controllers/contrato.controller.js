import * as contratoService from '../services/contrato.services.js';

export async function getContrato(req, res) {
    try {
        const idUsuario = req.usuario.idUsuario;
        const contratos = await contratoService.obtenerContratos(idUsuario);
        res.json(contratos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

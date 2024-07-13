import * as detalleLiquidacionService from "../services/detalleLiquidacion.services.js";

export async function postDetalle (req, res) {
    try {
        const idUsuario = req.usuario.idUsuario;
        const { idEmpleado, horasExtras, diasTrabajados } = req.body;
        const detalle = { idEmpleado, diasTrabajados,horasExtras }; 
        const nuevoDetalle = await detalleLiquidacionService.createDetalleLiquidacion(detalle, idUsuario);
        res.json(nuevoDetalle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export async function getDetalle(req, res) {
    try {
        const idUsuario = req.usuario.idUsuario;
        const detalles = await detalleLiquidacionService.obtenerDetalles(idUsuario);
        res.json(detalles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
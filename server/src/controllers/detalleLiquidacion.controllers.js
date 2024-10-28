import * as detalleLiquidacionService from "../services/detalleLiquidacion.services.js";

export async function postDetalle(req, res) {
    try {
        const idUsuario = req.usuario.idUsuario;
        const { idEmpleado, horasExtras, diasTrabajados, idParametro, idNovedad } = req.body;
        const detalle = { idEmpleado, diasTrabajados, horasExtras, idParametro, idNovedad }; 
        const nuevoDetalle = await detalleLiquidacionService.createDetalleLiquidacion(detalle, idParametro, idNovedad, idUsuario);
        
        res.json(nuevoDetalle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export async function getDetalle(req, res) {
    try {
        const detalles = await detalleLiquidacionService.obtenerDetalles();
        res.json(detalles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
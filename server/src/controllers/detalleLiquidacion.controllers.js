import * as detalleLiquidacionService from "../services/detalleLiquidacion.services.js";

export async function postDetalle(req, res) {
    try {
        const idUsuario = req.usuario.idUsuario;
        const { idEmpleado, horasExtras, diasTrabajados, idParametro, idNovedades } = req.body;

        // Verifica que `idNovedades` sea un array
        if (!Array.isArray(idNovedades) || idNovedades.length === 0) {
            return res.status(400).json({ message: "Debe proporcionar al menos una novedad en `idNovedades`." });
        }

        const detalle = { idEmpleado, diasTrabajados, horasExtras, idParametro, idNovedades }; 
        const nuevoDetalle = await detalleLiquidacionService.createDetalleLiquidacion(detalle, idParametro, idNovedades, idUsuario);
        
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
import * as novedadesServices from "../services/novedades.services.js";

export async function postNovedades(req, res) {
    const idUsuario = req.usuario.idUsuario;
    const {             
        idEmpleado, idCargo, idContrato, prestamos, descuentos, meses, intereses
    } = req.body;
    try {
        const newNovedad = await novedadesServices.crearNovedad(
            idEmpleado,
            idCargo,
            idContrato,
            idUsuario,
            prestamos,
            descuentos,
            meses,
            intereses,
        );
        res.json(newNovedad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getNovedad(req, res) {
    try {
        const novedades = await novedadesServices.obtenerNovedadesEmpleado();
        res.json(novedades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

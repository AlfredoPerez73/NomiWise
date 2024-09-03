import * as cargoService from "../services/cargo.services.js";

export async function postCargo(req, res) {
    const idUsuario = req.usuario.idUsuario;
    const { nCargo } = req.body;
    try {
        const newCargo = await cargoService.crearCargo(
            idUsuario,
            nCargo
        );
        res.json(newCargo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getCargo(req, res) {
    try {
        const cargos = await cargoService.obtenerCargo();
        res.json(cargos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function putCargo(req, res) {
    const idUsuario = req.usuario.idUsuario;
    const { nCargo } = req.body;
    const { idCargo } = req.params;
    try {
        const cargoActualizado = await cargoService.actualizarCargo(
            idCargo,
            idUsuario,
            nCargo
        );
        res.json(cargoActualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function deleteCargo(req, res) {
    const { idCargo } = req.params;
    const idUsuario = req.usuario.idUsuario;
    try {
        await cargoService.eliminarCargo(idCargo, idUsuario);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
import * as cargoService from "../services/cargo.services.js";

export async function postCargo(req, res) {
    const idSUsuario = req.susuario.idSUsuario;
    const { nCargo } = req.body;
    try {
        const newCargo = await cargoService.crearCargo(
            idSUsuario,
            nCargo
        );
        res.json(newCargo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getCargo(req, res) {
    const idSUsuario = req.susuario.idSUsuario;
    try {
        const cargos = await cargoService.obtenerCargo(idSUsuario);
        res.json(cargos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function putCargo(req, res) {
    const idSUsuario = req.susuario.idSUsuario;
    const { nCargo } = req.body;
    const { idCargo } = req.params;
    try {
        const cargoActualizado = await cargoService.actualizarCargo(
            idCargo,
            idSUsuario,
            nCargo
        );
        res.json(cargoActualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function deleteCargo(req, res) {
    const { idCargo } = req.params;
    const idSUsuario = req.susuario.idSUsuario;
    try {
        await cargoService.eliminarCargo(idCargo, idSUsuario);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
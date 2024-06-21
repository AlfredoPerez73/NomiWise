import * as rolService from "../services/rol.services.js";

export async function postRol(req, res) {
    const { nRol } = req.body;
    try {
        const newRol = await rolService.crearRol(
            nRol
        );
        res.json(newRol);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getRol(req, res) {
    try {
        const roles = await rolService.obtenerRol();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function putRol(req, res) {
    const { nRol } = req.body;
    const { idRol } = req.params;
    try {
        const rolActualizado = await rolService.actualizarRol(
            idRol,
            nRol
        );
        res.json(rolActualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function deleteRol(req, res) {
    const { idRol } = req.params;
    try {
        await rolService.eliminarRol(idRol);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
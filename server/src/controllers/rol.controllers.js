import * as rolService from "../services/rol.services.js";

export async function postRol(req, res) {
    const idSUsuario = req.susuario.idSUsuario;
    const { nRol } = req.body;
    try {
        const newRol = await rolService.crearRol(
            idSUsuario,
            nRol
        );
        res.json(newRol);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getRol(req, res) {
    const idSUsuario = req.susuario.idSUsuario;
    try {
        const roles = await rolService.obtenerRol(idSUsuario);
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function putRol(req, res) {
    const idSUsuario = req.susuario.idSUsuario;
    const { nRol } = req.body;
    const { idRol } = req.params;
    try {
        const rolActualizado = await rolService.actualizarRol(
            idRol,
            idSUsuario,
            nRol
        );
        res.json(rolActualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function deleteRol(req, res) {
    const { idRol } = req.params;
    const idSUsuario = req.susuario.idSUsuario;
    try {
        await rolService.eliminarRol(idRol, idSUsuario);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
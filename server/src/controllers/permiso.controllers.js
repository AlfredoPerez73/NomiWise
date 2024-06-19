import * as permisoService from "../services/permiso.services.js";

export async function postPermiso(req, res) {
    const idSUsuario = req.susuario.idSUsuario;
    const { nPermiso, idRol } = req.body;
    try {
        const newPermiso = await permisoService.crearPermiso(
            idSUsuario,
            nPermiso,
            idRol
        );
        res.json(newPermiso);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getPermiso(req, res) {
    const idSUsuario = req.susuario.idSUsuario;
    try {
        const permisos = await permisoService.obtenerPermiso(idSUsuario);
        res.json(permisos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function putPermiso(req, res) {
    const idSUsuario = req.susuario.idSUsuario;
    const { idPermiso } = req.params;
    const { nPermiso, idRol } = req.body;
    try {
        const permisoActualizado = await permisoService.actualizarPermiso(
            idPermiso,
            idSUsuario,
            nPermiso,
            idRol
        );
        res.json(permisoActualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function deletePermiso(req, res) {
    const { idPermiso } = req.params;
    const idSUsuario = req.susuario.idSUsuario;
    try {
        await permisoService.eliminarPermiso(idPermiso, idSUsuario);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

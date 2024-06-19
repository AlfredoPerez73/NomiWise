import { Permiso } from "../models/permiso.js";
import { PermisoDTO } from "../dtos/permiso.dto.js";

/* async function validarPermisos(nRol, idSUsuario) {
    const empleadoEncontrado = await Empleado.findOne({
        where: { correo: correo },
      });
    
    if (empleadoEncontrado) {
        throw new Error("El correo ya está en uso por un empleado");
    }
    
    const rolEncontrado = await Rol.findOne({
        where: { nRol: nRol, idSUsuario: idSUsuario },
    });

    if (rolEncontrado) {
        throw new Error("El rol ya está en registrado");
    }
} */

export async function crearPermiso(idSUsuario, nPermiso, idRol) {
    try {
        const newPermiso = await Permiso.create({
            idRol,
            idSUsuario,
            nPermiso,
        });

        return new PermisoDTO(
            newPermiso.idPermiso,
            newPermiso.idRol,
            newPermiso.idSUsuario,
            newPermiso.nPermiso,
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function obtenerPermiso(idSUsuario) {
    try {
        const permisos = await Permiso.findAll({
            where: {
                idSUsuario: idSUsuario,
            },
        });
        return permisos.map(
            (permiso) =>
                new PermisoDTO(
                    permiso.idPermiso,
                    permiso.idRol,
                    permiso.idSUsuario,
                    permiso.nPermiso,
                    permiso.fechaRegistro
                )
        );
    } catch (error) {
        throw new Error(error.message);
    }
}


export async function actualizarPermiso(
    idPermiso,
    idSUsuario,
    nPermiso,
    idRol
) {
    try {
        const permiso = await Permiso.findOne({
            where: {
                idPermiso: idPermiso,
                idSUsuario: idSUsuario,
            },
        });

        permiso.nPermiso = nPermiso;
        permiso.idRol = idRol;
        await permiso.save();
        return new PermisoDTO(
            permiso.idPermiso,
            permiso.idRol,
            permiso.idSUsuario,
            permiso.nPermiso
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function eliminarPermiso(idPermiso, idSUsuario) {
    try {
        await Permiso.destroy({
            where: {
                idPermiso: idPermiso,
                idSUsuario: idSUsuario,
            },
        });
    } catch (error) {
        throw new Error(error.message);
    }
}
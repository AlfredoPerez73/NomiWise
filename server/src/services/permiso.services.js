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

export async function crearPermiso(nPermiso, idRol) {
    try {
        const newPermiso = await Permiso.create({
            idRol,
            nPermiso,
        });

        return new PermisoDTO(
            newPermiso.idPermiso,
            newPermiso.idRol,
            newPermiso.nPermiso,
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function obtenerPermiso() {
    try {
        const permisos = await Permiso.findAll();
        return permisos.map(
            (permiso) =>
                new PermisoDTO(
                    permiso.idPermiso,
                    permiso.idRol,
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
    nPermiso,
    idRol
) {
    try {
        const permiso = await Permiso.findOne({
            where: {
                idPermiso: idPermiso,
            },
        });

        permiso.nPermiso = nPermiso;
        permiso.idRol = idRol;
        await permiso.save();
        return new PermisoDTO(
            permiso.idPermiso,
            permiso.idRol,
            permiso.nPermiso
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function eliminarPermiso(idPermiso) {
    try {
        await Permiso.destroy({
            where: {
                idPermiso: idPermiso,
            },
        });
    } catch (error) {
        throw new Error(error.message);
    }
}
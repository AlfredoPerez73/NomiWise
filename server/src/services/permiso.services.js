import { Permiso } from "../models/permiso.js";
import { PermisoDTO } from "../dtos/permiso.dto.js";
import { Op } from 'sequelize';

async function validarPermisoUnico(nPermiso, idRol) {
    const permisoExistente = await Permiso.findOne({
        where: {
            nPermiso: nPermiso,
            idRol: idRol
        }
    });

    if (permisoExistente) {
        throw new Error("La combinación de permiso y rol ya está registrada");
    }
}

export async function crearPermiso(nPermiso, idRol) {
    try {
        await validarPermisoUnico(nPermiso, idRol);

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
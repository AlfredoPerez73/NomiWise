import { Rol } from "../models/rol.js";
import { Usuario } from "../models/usuario.js";
import { Permiso } from "../models/permiso.js";
import { RolDTO } from "../dtos/rol.dto.js";

async function validarRol(nRol, idSUsuario) {
    const rolEncontrado = await Rol.findOne({
        where: { nRol: nRol, idSUsuario: idSUsuario },
    });

    if (rolEncontrado) {
        throw new Error("El rol ya está en registrado");
    }
}

export async function crearRol(idSUsuario, nRol) {
    try {
        await validarRol(nRol, idSUsuario);

        const newRol = await Rol.create({
            idSUsuario,
            nRol,
        });
        return new RolDTO(
            newRol.idRol,
            newRol.idSUsuario,
            newRol.nRol
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function obtenerRol(idSUsuario) {
    try {
        const roles = await Rol.findAll({
            where: {
                idSUsuario: idSUsuario,
            },
        });
        return roles.map(
            (rol) =>
                new RolDTO(
                    rol.idRol,
                    rol.idSUsuario,
                    rol.nRol,
                    rol.fechaRegistro
                )
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function actualizarRol(
    idRol,
    idSUsuario,
    nRol
) {
    try {
        const rol = await Rol.findOne({
            where: {
                idRol: idRol,
                idSUsuario: idSUsuario,
            },
        });
        rol.nRol = nRol;
        await rol.save();
        return new RolDTO(
            rol.idRol,
            rol.idSUsuario,
            rol.nRol
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function eliminarRol(idRol, idSUsuario) {
    try {
        const usuario = await Usuario.findAll({
            where: {
                idRol: idRol,
                idSUsuario: idSUsuario,
            },
        });

        if (usuario.length > 0) {
            throw new Error("El rol tiene usuarios asociados");
        }

        const permiso = await Permiso.findAll({
            where: {
                idRol: idRol,
            },
        });

        if (permiso.length > 0) {
            throw new Error("El rol tiene permisos asociados");
        }

        await Rol.destroy({
            where: {
                idRol: idRol,
                idSUsuario: idSUsuario,
            },
        });
    } catch (error) {
        throw new Error(error.message);
    }
}
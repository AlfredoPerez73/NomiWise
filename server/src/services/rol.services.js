import { Rol } from "../models/rol.js";
import { Usuario } from "../models/usuario.js";
import { Permiso } from "../models/permiso.js";
import { RolDTO } from "../dtos/rol.dto.js";

async function validarRol(nRol) {
    const rolEncontrado = await Rol.findOne({
        where: { nRol: nRol },
    });

    if (rolEncontrado) {
        throw new Error("El rol ya está en registrado");
    }
}

export async function crearRol(nRol) {
    try {
        await validarRol(nRol);

        const newRol = await Rol.create({
            nRol,
        });
        return new RolDTO(
            newRol.idRol,
            newRol.nRol
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function obtenerRol() {
    try {
        const roles = await Rol.findAll();
        return roles.map(
            (rol) =>
                new RolDTO(
                    rol.idRol,
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
    nRol
) {
    try {
        const rol = await Rol.findOne({
            where: {
                idRol: idRol,
            },
        });
        rol.nRol = nRol;
        await rol.save();
        return new RolDTO(
            rol.idRol,
            rol.nRol
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function eliminarRol(idRol) {
    try {
        const usuario = await Usuario.findAll({
            where: {
                idRol: idRol,
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
            },
        });
    } catch (error) {
        throw new Error(error.message);
    }
}
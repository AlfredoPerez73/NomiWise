import { Cargo } from "../models/cargo.js";
import { Usuario } from "../models/usuario.js";
import { Empleado } from "../models/empleado.js";
import { CargoDTO } from "../dtos/cargo.dto.js";

async function validarCargo(nCargo, idSUsuario) {
    const cargoEncontrado = await Cargo.findOne({
        where: { nCargo: nCargo, idSUsuario: idSUsuario },
    });

    if (cargoEncontrado) {
        throw new Error("El cargo ya está en registrado");
    }
}

export async function crearCargo(idSUsuario, nCargo) {
    try {
        await validarCargo(nCargo, idSUsuario);

        const newCargo = await Cargo.create({
            idSUsuario,
            nCargo,
        });
        return new CargoDTO(
            newCargo.idCargo,
            newCargo.idSUsuario,
            newCargo.nCargo
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function obtenerCargo(idSUsuario) {
    try {
        const cargos = await Cargo.findAll({
            where: {
                idSUsuario: idSUsuario,
            },
        });
        return cargos.map(
            (cargo) =>
                new CargoDTO(
                    cargo.idCargo,
                    cargo.idSUsuario,
                    cargo.nCargo,
                    cargo.fechaRegistro
                )
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function actualizarCargo(
    idCargo,
    idSUsuario,
    nCargo
) {
    try {
        const cargo = await Cargo.findOne({
            where: {
                idCargo: idCargo,
                idSUsuario: idSUsuario,
            },
        });
        cargo.nCargo = nCargo;
        await cargo.save();
        return new CargoDTO(
            rol.idCargo,
            rol.idSUsuario,
            rol.nCargo
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function eliminarCargo(idCargo, idSUsuario) {
    try {
        const empleado = await Empleado.findAll({
            where: {
                idCargo: idCargo,
            },
        });

        if (empleado.length > 0) {
            throw new Error("El cargo tiene empleados asociados");
        }

        await Cargo.destroy({
            where: {
                idCargo: idCargo,
                idSUsuario: idSUsuario,
            },
        });
    } catch (error) {
        throw new Error(error.message);
    }
}
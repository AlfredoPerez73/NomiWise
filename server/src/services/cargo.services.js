import { Cargo } from "../models/cargo.js";
import { Usuario } from "../models/usuario.js";
import { Empleado } from "../models/empleado.js";
import { CargoDTO } from "../dtos/cargo.dto.js";

async function validarCargo(nCargo, idUsuario) {
    const cargoEncontrado = await Cargo.findOne({
        where: { nCargo: nCargo, idUsuario: idUsuario },
    });

    if (cargoEncontrado) {
        throw new Error("El cargo ya está registrado");
    }
}

export async function crearCargo(idUsuario, nCargo) {
    try {
        await validarCargo(nCargo, idUsuario);

        const newCargo = await Cargo.create({
            idUsuario,
            nCargo,
        });
        return new CargoDTO(
            newCargo.idCargo,
            newCargo.idUsuario,
            newCargo.nCargo
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function crearCargo(nCargo) {
    try {
        const newCargo = await Cargo.create({
            nCargo,
        });
        return new CargoDTO(
            newCargo.idCargo,
            newCargo.nCargo
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function obtenerCargo() {
    try {
        const cargos = await Cargo.findAll();
        return cargos.map(
            (cargo) =>
                new CargoDTO(
                    cargo.idCargo,
                    cargo.idUsuario,
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
    idUsuario,
    nCargo
) {
    try {
        const cargo = await Cargo.findOne({
            where: {
                idCargo: idCargo,
                idUsuario: idUsuario,
            },
        });
        cargo.nCargo = nCargo;
        await cargo.save();
        return new CargoDTO(
            rol.idCargo,
            rol.idUsuario,
            rol.nCargo
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function eliminarCargo(idCargo, idUsuario) {
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
                idUsuario: idUsuario,
            },
        });
    } catch (error) {
        throw new Error(error.message);
    }
}
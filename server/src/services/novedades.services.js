import { Novedad } from "../models/novedades.js"; // Importa el modelo Novedad
import { NovedadesDTO } from "../dtos/novedades.dto.js"; // Importa el DTO de novedades

export async function crearNovedad(idEmpleado, idCargo, idContrato, idUsuario, prestamos, descuentos) {
    try {
        const nuevaNovedad = await Novedad.create({
            idEmpleado,
            idCargo,
            idContrato,
            idUsuario,
            prestamos,
            descuentos,
        });

        return new NovedadesDTO(
            nuevaNovedad.idNovedad,
            nuevaNovedad.idEmpleado,
            nuevaNovedad.idCargo,
            nuevaNovedad.idContrato,
            nuevaNovedad.idUsuario,
            nuevaNovedad.prestamos,
            nuevaNovedad.descuentos,
            nuevaNovedad.fechaRegistro
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function obtenerNovedadesEmpleado() {
    try {
        const novedades = await Novedad.findAll();
        return novedades.map(
            (novedad) =>
                new NovedadesDTO(
                    novedad.idNovedad,
                    novedad.idEmpleado,
                    novedad.idCargo,
                    novedad.idContrato,
                    novedad.idUsuario,
                    novedad.prestamos,
                    novedad.descuentos,
                    novedad.fechaRegistro
                )
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

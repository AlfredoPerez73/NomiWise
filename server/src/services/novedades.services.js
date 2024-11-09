import { Novedad } from "../models/novedades.js"; // Importa el modelo Novedad
import { NovedadesDTO } from "../dtos/novedades.dto.js"; // Importa el DTO de novedades

export async function crearNovedad(idEmpleado, idCargo, idContrato, idUsuario, nuevosPrestamos = 0, nuevosDescuentos = 0, meses, intereses) {
    try {
        // Verificar si ya existe una novedad para el empleado
        const novedadExistente = await Novedad.findOne({ where: { idEmpleado } });

        // Convierte a número y asegura que sean 0 si no tienen valor
        const prestamosNuevos = parseFloat(nuevosPrestamos) || 0;
        const descuentosNuevos = parseFloat(nuevosDescuentos) || 0;

        let novedadActualizada;

        if (novedadExistente) {
            // Si existe, sumar los valores de préstamos y descuentos
            const prestamosActualizados = parseFloat(novedadExistente.prestamos || 0) + prestamosNuevos;
            const descuentosActualizados = parseFloat(novedadExistente.descuentos || 0) + descuentosNuevos;

            // Actualizar la novedad existente con meses e intereses si se proporcionan
            await novedadExistente.update({
                prestamos: prestamosActualizados,
                descuentos: descuentosActualizados,
                ...(meses && { meses }), // Actualizar meses si es diferente de null o undefined
                ...(intereses && { intereses }) // Actualizar intereses si es diferente de null o undefined
            });

            novedadActualizada = novedadExistente;
        } else {
            // Si no existe, crear una nueva novedad
            novedadActualizada = await Novedad.create({
                idEmpleado,
                idCargo,
                idContrato,
                idUsuario,
                prestamos: prestamosNuevos,
                descuentos: descuentosNuevos,
                meses: meses || 0, // Asignar 0 si no se proporciona meses
                intereses: intereses || 0 // Asignar 0 si no se proporciona intereses
            });
        }

        // Retornar la novedad actualizada o creada en formato DTO
        return new NovedadesDTO(
            novedadActualizada.idNovedad,
            novedadActualizada.idEmpleado,
            novedadActualizada.idCargo,
            novedadActualizada.idContrato,
            novedadActualizada.idUsuario,
            novedadActualizada.prestamos,
            novedadActualizada.descuentos,
            novedadActualizada.meses,
            novedadActualizada.intereses,
            novedadActualizada.fechaRegistro
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
                    novedad.meses,
                    novedad.intereses,
                    novedad.fechaRegistro
                )
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

import { Parametros } from "../models/parametros.js";
import { ParametrosDTO } from "../dtos/parametros.dtos.js";
import { DetalleLiquidacion } from "../models/detalleLiquidacion.js";

async function validarParametroUnico(salarioMinimo, salud, pension, auxTransporte) {
    const parametroExistente = await Parametros.findOne({
        where: {
            salarioMinimo: salarioMinimo,
            salud: salud,
            pension: pension,
            auxTransporte: auxTransporte
        }
    });

    if (parametroExistente) {
        throw new Error("El parametro ya se encuentra en el sistema");
    }
}

export async function crearParametro(salarioMinimo, salud, pension, auxTransporte) {
    try {
        await validarParametroUnico(salarioMinimo, salud, pension, auxTransporte);

        const newParametro = await Parametros.create({
            salarioMinimo,
            salud,
            pension,
            auxTransporte,
        });

        return new ParametrosDTO(
            newParametro.idPermiso,
            newParametro.salarioMinimo,
            newParametro.salud,
            newParametro.pension,
            newParametro.auxTransporte,
            newParametro.fechaRegistro,
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function obtenerParametro() {
    try {
        const parametros = await Parametros.findAll();
        return parametros.map(
            (parametro) =>
                new ParametrosDTO(
                    parametro.idParametro,
                    parametro.salarioMinimo,
                    parametro.salud,
                    parametro.pension,
                    parametro.auxTransporte,
                    parametro.fechaRegistro
                )
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function actualizarParametro(idParametro, salud, pension, auxTransporte) {
    try {
        // Verificar si el parámetro está asociado a algún detalle de liquidación
        const existeEnDetalleLiquidacion = await DetalleLiquidacion.findOne({
            where: {
                idParametro: idParametro,
            },
        });

        if (existeEnDetalleLiquidacion) {
            // Lanzar un error si el parámetro está en uso
            throw new Error('No se puede actualizar el parámetro porque está siendo utilizado en uno o más detalles de liquidación.');
        }

        // Si el parámetro no está en uso, procedemos a actualizarlo
        const parametro = await Parametros.findOne({
            where: {
                idParametro: idParametro,
            },
        });

        if (!parametro) {
            throw new Error('El parámetro no existe.');
        }

        // Actualizar los valores del parámetro
        parametro.salud = salud;
        parametro.pension = pension;
        parametro.auxTransporte = auxTransporte;
        await parametro.save();

        // Retornar el DTO actualizado
        return new ParametrosDTO(
            parametro.idParametro,
            parametro.salud,
            parametro.pension,
            parametro.auxTransporte
        );
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function eliminarParametro(idParametro) {
    try {
        // Verificar si el parámetro está asociado a alguna liquidación
        const existeEnLiquidacion = await DetalleLiquidacion.findOne({
            where: {
                idParametro: idParametro,
            },
        });

        if (existeEnLiquidacion) {
            // Lanzar un error si el parámetro está en uso
            throw new Error('No se puede eliminar el parámetro porque está siendo utilizado en una o más liquidaciones.');
        }

        // Si el parámetro no está en uso, procedemos a eliminarlo
        const parametro = await Parametros.findOne({
            where: {
                idParametro: idParametro,
            },
        });

        if (!parametro) {
            throw new Error('El parámetro no existe.');
        }

        await parametro.destroy();
    } catch (error) {
        throw new Error(error.message);
    }
}
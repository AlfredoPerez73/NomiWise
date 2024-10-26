import { Parametros } from "../models/parametros.js";
import { ParametrosDTO } from "../dtos/parametros.dtos.js";

async function validarParametroUnico(nPasalarioMinimo, salud, pension, auxTransportrametro) {
    const parametroExistente = await Parametros.findOne({
        where: {
            nPermiso: nParametro
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
            fechaRegistro,
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

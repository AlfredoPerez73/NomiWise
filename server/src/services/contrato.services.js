import { Contrato } from "../models/contrato.js"; // Asegúrate de importar tu modelo de Contrato
import { ContratoDTO } from "../dtos/contrato.dto.js";

export async function obtenerContratos(idUsuario) {
    try {

        const contratos = await Contrato.findAll({
            where: {
                idUsuario: idUsuario
            }
        });
        return contratos.map(
            (contratos) =>
                new ContratoDTO(
                    contratos.idContrato, 
                    contratos.idUsuario,
                    contratos.fechaInicio, 
                    contratos.fechaFin, 
                    contratos.salario, 
                    contratos.tipoContrato
                )
        );
    } catch (error) {
        throw new Error(error.message);
    }
}
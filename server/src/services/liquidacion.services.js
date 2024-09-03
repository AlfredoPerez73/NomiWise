import { Liquidacion } from "../models/liquidacion.js";
import { LiquidacionDTO } from "../dtos/liquidacion.dto.js";

export async function obtenerNomina() {
    try {
        const liquidaciones = await Liquidacion.findAll();
        return liquidaciones.map(
            (liquidacion) =>
                new LiquidacionDTO(
                    liquidacion.idLiquidacion,
                    liquidacion.año,
                    liquidacion.mes,
                    liquidacion.salarioTotal,
                    liquidacion.saludTotal,
                    liquidacion.pensionTotal,
                    liquidacion.auxTransporteTotal,
                    liquidacion.bonificacionServicioTotal,
                    liquidacion.auxAlimentacionTotal,
                    liquidacion.primaNavidadTotal,
                    liquidacion.vacacionesTotal,
                    liquidacion.cesantiasTotal,
                    liquidacion.interesesCesantiasTotal,
                    liquidacion.total,
                    liquidacion.fechaRegistro,
                    liquidacion.idUsuario,
                )
        );
    } catch (error) {
        throw new Error(error.message);
    }
}
import { DetalleLiquidacion } from "../models/detalleLiquidacion.js";
import { Liquidacion } from "../models/liquidacion.js";
import { Empleado } from "../models/empleado.js";
import { Contrato } from "../models/contrato.js";
import { DetalleLiquidacionDTO } from "../dtos/detalleLiquidacion.dto.js";
import { sequelize } from '../database/database.js';

const calcularValoresAutomaticos = async (detalle, idEmpleado) => {
    const empleado = await Empleado.findOne({
        where: { idEmpleado: idEmpleado },
    });

    const contrato = await Contrato.findByPk(empleado.idContrato);

    if (!contrato) {
        throw new Error("Contrato no encontrado para el empleado");
    }

    const salario = contrato.salario;
    const diasTrabajados = detalle.diasTrabajados;
    const horasExtras = detalle.horasExtras;
    const mesLiquidacion = new Date(detalle.fechaRegistro).getMonth() + 1;

    let salud = salario * 0.04;
    let pension = salario * 0.04;
    let auxTransporte = salario <= (1300000 * 2) ? 162000 : 0;
    let auxAlimentacion = salario / diasTrabajados;
    let bonificacionServicio = 0;
    let primaServicios = 0;
    let primaNavidad = 0;
    let vacaciones = 0;
    let cesantias = 0;
    let interesesCesantias = 0;
    let valorHorasExtra = horasExtras > 0 ? salario / horasExtras : 0;

    if (contrato.tipoContrato === "TERMINO FIJO" || contrato.tipoContrato === "TERMINO INDEFINIDO") {
        bonificacionServicio = salario < 1400000 ? salario * 0.5 : 0;
        primaServicios = mesLiquidacion === 6 ? (salario * diasTrabajados) / 180 :
            mesLiquidacion === 12 ? (salario * diasTrabajados) / 360 : 0;
        primaNavidad = mesLiquidacion === 12 ? salario * 0.5 : 0;
        vacaciones = (salario * diasTrabajados) / 720;
        cesantias = (salario * diasTrabajados) / 360;
        interesesCesantias = cesantias * 0.12;
    } else if (contrato.tipoContrato === "PRESTACION DE SERVICIO") {
        salud = 0;
        pension = 0;
        auxTransporte = 0;
        auxAlimentacion = 0;
        valorHorasExtra = 0;
    }

    const devengado = salario - salud - pension + auxTransporte + bonificacionServicio +
        primaServicios + auxAlimentacion + primaNavidad + valorHorasExtra + cesantias +
        interesesCesantias + vacaciones;

    return {
        salud,
        pension,
        auxTransporte,
        bonificacionServicio,
        auxAlimentacion,
        primaNavidad,
        vacaciones,
        cesantias,
        interesesCesantias,
        devengado,
    };
};

const actualizarTotalesLiquidacion = async (año, mes) => {
    const detalles = await DetalleLiquidacion.findAll({ where: { año, mes } });

    const totales = detalles.reduce((totales, detalle) => {
        totales.salarioTotal += parseFloat(detalle.devengado);
        totales.saludTotal += parseFloat(detalle.salud);
        totales.pensionTotal += parseFloat(detalle.pension);
        totales.auxTransporteTotal += parseFloat(detalle.auxTransporte);
        totales.bonificacionServicioTotal += parseFloat(detalle.bonificacionServicio);
        totales.auxAlimentacionTotal += parseFloat(detalle.auxAlimentacion);
        totales.primaNavidadTotal += parseFloat(detalle.primaNavidad);
        totales.vacacionesTotal += parseFloat(detalle.vacaciones);
        totales.cesantiasTotal += parseFloat(detalle.cesantias);
        totales.interesesCesantiasTotal += parseFloat(detalle.interesesCesantias);
        totales.total = totales.salarioTotal + totales.saludTotal + totales.pensionTotal + totales.auxTransporteTotal + totales.bonificacionServicioTotal + totales.auxAlimentacionTotal + totales.primaNavidadTotal + totales.vacacionesTotal + totales.cesantiasTotal + totales.interesesCesantiasTotal;
        return totales;
    }, {
        salarioTotal: 0,
        saludTotal: 0,
        pensionTotal: 0,
        auxTransporteTotal: 0,
        bonificacionServicioTotal: 0,
        auxAlimentacionTotal: 0,
        primaNavidadTotal: 0,
        vacacionesTotal: 0,
        cesantiasTotal: 0,
        interesesCesantiasTotal: 0,
        total: 0,
    });

    await Liquidacion.update(totales, { where: { año, mes } });
};

export async function createDetalleLiquidacion(detalle, idUsuario) {
    const t = await sequelize.transaction();

    const now = new Date();
    const mes = now.getMonth() + 1;
    const año = now.getFullYear();

    try {
        const detalleExistente = await DetalleLiquidacion.findOne({
            where: {
                idEmpleado: detalle.idEmpleado,
                mes: mes,
                año: año
            }
        });

        if (detalleExistente) {
            throw new Error(`El empleado con el codigo ${detalle.idEmpleado} ya ha sido liquidado en el mes ${mes} del año ${año}`);
        }

        let liquidacionExistente = await Liquidacion.findOne({
            where: {
                mes: mes,
                año: año
            }
        });

        let idLiquidacion;

        if (liquidacionExistente) {
            idLiquidacion = liquidacionExistente.idLiquidacion;
        } else {
            const newLiquidacion = new Liquidacion({
                año: año,
                mes: mes,
                salarioTotal: 0,
                saludTotal: 0,
                pensionTotal: 0,
                auxTransporteTotal: 0,
                bonificacionServicioTotal: 0,
                auxAlimentacionTotal: 0,
                primaNavidadTotal: 0,
                vacacionesTotal: 0,
                cesantiasTotal: 0,
                interesesCesantiasTotal: 0,
                total: 0,
                idUsuario: idUsuario
            });

            const liquidacionGuardada = await newLiquidacion.save({ transaction: t });
            idLiquidacion = liquidacionGuardada.idLiquidacion;
        }

        const valoresCalculados = await calcularValoresAutomaticos(detalle, detalle.idEmpleado);

        const newDetalleLiquidacion = new DetalleLiquidacion({
            año: año,
            mes: mes,
            ...detalle,
            ...valoresCalculados,
            idEmpleado: detalle.idEmpleado,
            idLiquidacion: idLiquidacion,
            idUsuario: idUsuario
        });

        await newDetalleLiquidacion.save({ transaction: t });

        await actualizarTotalesLiquidacion(año, mes);

        await t.commit();

        return new DetalleLiquidacionDTO(
            newDetalleLiquidacion.idLiquidacion,
            newDetalleLiquidacion.idEmpleado,
            newDetalleLiquidacion.idUsuario,
            newDetalleLiquidacion.año,
            newDetalleLiquidacion.mes,
            newDetalleLiquidacion.diasTrabajados,
            newDetalleLiquidacion.horasExtras,
            newDetalleLiquidacion.salud,
            newDetalleLiquidacion.pension,
            newDetalleLiquidacion.auxTransporte,
            newDetalleLiquidacion.bonificacionServicio,
            newDetalleLiquidacion.auxAlimentacion,
            newDetalleLiquidacion.primaNavidad,
            newDetalleLiquidacion.vacaciones,
            newDetalleLiquidacion.cesantias,
            newDetalleLiquidacion.interesesCesantias,
            newDetalleLiquidacion.devengado,
        );
    } catch (error) {
        await t.rollback();
        throw new Error(`Error creando DetalleLiquidacion: ${error.message}`);
    }
};

export async function obtenerDetalles(idUsuario) {
    try {
        const detalles = await DetalleLiquidacion.findAll({
            where: {
                idUsuario: idUsuario
            }
        });
        return detalles.map(
            (detalle) =>
                new DetalleLiquidacionDTO(
                    detalle.idDetalleLiquidacion,
                    detalle.idLiquidacion,
                    detalle.idEmpleado,
                    detalle.idUsuario,
                    detalle.año,
                    detalle.mes,
                    detalle.diasTrabajados,
                    detalle.horasExtras,
                    detalle.salud,
                    detalle.pension,
                    detalle.auxTransporte,
                    detalle.bonificacionServicio,
                    detalle.auxAlimentacion,
                    detalle.primaNavidad,
                    detalle.vacaciones,
                    detalle.cesantias,
                    detalle.interesesCesantias,
                    detalle.devengado,
                    detalle.fechaRegistro,
                )
        );
    } catch (error) {
        throw new Error(error.message);
    }
}
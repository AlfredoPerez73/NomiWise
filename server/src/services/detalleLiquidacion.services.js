import { DetalleLiquidacion } from "../models/detalleLiquidacion.js";
import { Liquidacion } from "../models/liquidacion.js";
import { Empleado } from "../models/empleado.js";
import { Contrato } from "../models/contrato.js";
import { Parametros } from "../models/parametros.js";
import { Novedad } from "../models/novedades.js";
import { DetalleLiquidacionDTO } from "../dtos/detalleLiquidacion.dto.js";
import { sequelize } from '../database/database.js';
import { spawn } from "child_process";
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const actualizarTotalesLiquidacion = async (año, mes, t) => {
    const detalles = await DetalleLiquidacion.findAll({ 
        where: { 
            año, 
            mes 
        },
        transaction: t
    });

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

    await Liquidacion.update(totales, { where: { año, mes }, transaction: t });
};

async function verificarPython() {
    return new Promise((resolve) => {
        const pythonProcess = spawn('python', ['--version']);
        
        pythonProcess.on('error', () => {
            resolve({ instalado: false, comando: 'python' });
        });
        
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                resolve({ instalado: true, comando: 'python' });
            } else {
                const python3Process = spawn('python3', ['--version']);
                
                python3Process.on('error', () => {
                    resolve({ instalado: false, comando: null });
                });
                
                python3Process.on('close', (code) => {
                    resolve({ instalado: code === 0, comando: 'python3' });
                });
            }
        });
    });
}

export async function calcularValoresAutomaticosPython(detalle, parametro, novedades) {
    try {
        const camposRequeridos = ['idEmpleado', 'salario', 'diasTrabajados', 'horasExtras', 'tipoContrato', 'fechaRegistro'];
        const camposFaltantes = camposRequeridos.filter(campo => !(campo in detalle));
        
        if (camposFaltantes.length > 0) {
            throw new Error(`Faltan los siguientes campos requeridos: ${camposFaltantes.join(', ')}`);
        }

        const detalleNormalizado = {
            ...detalle,
            salario: Number(detalle.salario),
            diasTrabajados: Number(detalle.diasTrabajados),
            horasExtras: Number(detalle.horasExtras)
        };

        const parametrosNormalizado = {
            ...parametro,
            salarioMinimo: Number(parametro.salarioMinimo),
            salud: Number(parametro.salud),
            pension: Number(parametro.pension),
            auxTransporte: Number(parametro.auxTransporte)
        };

        // Verifica que `novedades` sea un arreglo y acumula los valores
        const novedadesArray = Array.isArray(novedades) ? novedades : [novedades];
        const novedadesAcumuladas = novedadesArray.reduce((acc, nov) => {
            acc.prestamo += Number(nov.prestamo || 0);
            acc.descuento += Number(nov.descuento || 0);
            return acc;
        }, { prestamo: 0, descuento: 0 });

        const pythonStatus = await verificarPython();
        if (!pythonStatus.instalado) {
            throw new Error('Python no está instalado o no está disponible en el PATH del sistema');
        }

        const scriptPath = path.join(__dirname, 'calculosLiquidacion.services.py');

        return new Promise((resolve, reject) => {
            const pythonProcess = spawn(pythonStatus.comando, [
                scriptPath,
                JSON.stringify(detalleNormalizado),
                JSON.stringify(parametrosNormalizado),
                JSON.stringify(novedadesAcumuladas)
            ]);

            let stdoutData = '';
            let stderrData = '';

            pythonProcess.stdout.on('data', (chunk) => {
                stdoutData += chunk.toString();
            });

            pythonProcess.stderr.on('data', (chunk) => {
                stderrData += chunk.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error(`El proceso Python terminó con código ${code}. Error: ${stderrData}`));
                    return;
                }

                try {
                    const resultado = JSON.parse(stdoutData);
                    resolve(resultado);
                } catch (parseError) {
                    reject(new Error(`Error al analizar la salida del script Python: ${parseError.message}. Salida: ${stdoutData}`));
                }
            });
        });
    } catch (error) {
        throw new Error(`Error en calcularValoresAutomaticosPython: ${error.message}`);
    }
}



export async function createDetalleLiquidacion(detalle, idParametro, idNovedades, idUsuario) {
    const t = await sequelize.transaction();

    const now = new Date();
    const mes = now.getMonth() + 1;
    const año = now.getFullYear();

    try {
        const empleado = await Empleado.findByPk(detalle.idEmpleado);
        if (!empleado) {
            throw new Error(`No se encontró el empleado con ID ${detalle.idEmpleado}`);
        }
        const contrato = await Contrato.findByPk(empleado.idContrato);
        if (!contrato) {
            throw new Error(`No se encontró el contrato del empleado con la ID ${detalle.idEmpleado}`);
        }

        const parametro = await Parametros.findByPk(idParametro);
        if (!parametro) {
            throw new Error(`No se encontró el parámetro con ID ${idParametro}`);
        }

        // Busca todas las novedades asociadas al empleado según los IDs proporcionados
        const novedades = await Novedad.findAll({
            where: {
                idNovedad: idNovedades,
            },
        });

        if (!novedades || novedades.length === 0) {
            throw new Error(`No se encontraron novedades para los IDs ${idNovedades.join(", ")}`);
        }

        // Calcula los totales de préstamos y descuentos
        const totalPrestamos = novedades.reduce((acc, nov) => acc + parseFloat(nov.prestamo || 0), 0);
        const totalDescuentos = novedades.reduce((acc, nov) => acc + parseFloat(nov.descuento || 0), 0);

        const detalleCompleto = {
            ...detalle,
            salario: contrato.salario,
            tipoContrato: contrato.tipoContrato,
            fechaRegistro: now.toISOString().split("T")[0],
            diasTrabajados: detalle.diasTrabajados,
            horasExtras: detalle.horasExtras,
        };

        const parametros = {
            salarioMinimo: parametro.salarioMinimo,
            salud: parametro.salud,
            pension: parametro.pension,
            auxTransporte: parametro.auxTransporte,
        };

        const novedadesTotales = {
            prestamo: totalPrestamos,
            descuento: totalDescuentos,
        };

        const detalleExistente = await DetalleLiquidacion.findOne({
            where: {
                idEmpleado: detalleCompleto.idEmpleado,
                mes: mes,
                año: año,
            },
        });

        if (detalleExistente) {
            throw new Error(`El empleado con el código ${detalleCompleto.idEmpleado} ya ha sido liquidado en el mes ${mes} del año ${año}`);
        }

        let liquidacionExistente = await Liquidacion.findOne({
            where: {
                mes: mes,
                año: año,
            },
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
                idUsuario: idUsuario,
            });

            const liquidacionGuardada = await newLiquidacion.save({ transaction: t });
            idLiquidacion = liquidacionGuardada.idLiquidacion;
        }

        // Cálculo de valores
        const valoresCalculados = await calcularValoresAutomaticosPython(detalleCompleto, parametros, novedadesTotales);

        const newDetalleLiquidacion = new DetalleLiquidacion({
            año: año,
            mes: mes,
            ...detalleCompleto,
            ...valoresCalculados,
            idParametro: detalle.idParametro,
            idNovedades: JSON.stringify(idNovedades), // Guarda el array de IDs de novedades
            idLiquidacion: idLiquidacion,
            idUsuario: idUsuario,
        });

        await newDetalleLiquidacion.save({ transaction: t });

        // Actualizar los valores de novedad después de liquidar
        for (const novedad of novedades) {
            // Resta el valor pagado de préstamo y descuento de cada novedad
            const nuevoPrestamo = Math.max(0, novedad.prestamo - (valoresCalculados.prestamo / novedades.length));
            const nuevoDescuento = Math.max(0, novedad.descuento - (valoresCalculados.descuento / novedades.length));

            await novedad.update(
                { prestamo: nuevoPrestamo, descuento: nuevoDescuento },
                { transaction: t }
            );
        }

        await actualizarTotalesLiquidacion(año, mes, t);

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
            newDetalleLiquidacion.prestamo,
            newDetalleLiquidacion.descuento,
            newDetalleLiquidacion.devengado,
        );
    } catch (error) {
        await t.rollback();
        throw new Error(`Error creando DetalleLiquidacion: ${error.message}`);
    }
}

export async function obtenerDetalles() {
    try {
        const detalles = await DetalleLiquidacion.findAll();
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
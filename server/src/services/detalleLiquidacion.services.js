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
    return totales
};

export async function enviarVariasNominasAFinanzas(nominas) {
    const errores = [];

    for (const nomina of nominas) {
        try {
            const fechaActual = new Date();
            const fecha = fechaActual.toISOString().split('T')[0];
            const hora = fechaActual.toTimeString().split(' ')[0].slice(0, 5);

            const payload = {
                Monto: nomina.total,
                Categoria: "Nómina",
                Proveedor: "RRHH",
                Fecha: fecha,
                Hora: hora
            };

            const response = await fetch("https://finanzasbackend-dw9a.onrender.com/api/addGastos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Error al enviar nómina con ID ${nomina.idLiquidacion}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`Nómina con ID ${nomina.idLiquidacion} enviada correctamente:`, data);
        } catch (error) {
            console.error(`Error al enviar nómina con ID ${nomina.idLiquidacion}:`, error.message);
            errores.push({ id: nomina.idLiquidacion, error: error.message });
        }
    }

    return errores; // Devuelve errores si los hay
}

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

async function calcularValoresAutomaticosPython(detalle, parametro, novedad) {
    try {
        // Validar que todos los campos necesarios estén presentes
        const camposRequeridos = ['idEmpleado', 'salario', 'diasTrabajados', 'horasExtras', 'tipoContrato', 'fechaRegistro'];
        const camposFaltantes = camposRequeridos.filter(campo => !(campo in detalle));
        
        if (camposFaltantes.length > 0) {
            throw new Error(`Faltan los siguientes campos requeridos: ${camposFaltantes.join(', ')}`);
        }

        // Asegurarse de que los valores numéricos sean números y no strings
        const detalleNormalizado = {
            ...detalle,
            salario: Number(detalle.salario),
            diasTrabajados: Number(detalle.diasTrabajados),
            horasExtras: Number(detalle.horasExtras)
        };
        // Asegurarse de que los valores numéricos sean números y no strings
        const parametrosNormalizado = {
            ...parametro,
            salarioMinimo: Number(parametro.salarioMinimo),
            salud: Number(parametro.salud),
            pension: Number(parametro.pension),
            auxTransporte: Number(parametro.auxTransporte)
        };

        const novedadesNormalizada = {
            ...novedad,
            prestamos: Number(novedad.prestamos),
            descuentos: Number(novedad.descuentos),
            meses: Number(novedad.meses),
            intereses: Number(novedad.intereses),
        };
        

        // Resto del código para ejecutar Python...
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
                JSON.stringify(novedadesNormalizada)
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

export async function createDetalleLiquidacion(detalle, idParametro, idNovedad, idUsuario) {
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
        
        // Verificar si existe la novedad o crearla con valores en 0
        let novedad = await Novedad.findByPk(idNovedad);
        if (!novedad) {
            novedad = await Novedad.create({
                idEmpleado: detalle.idEmpleado,
                idCargo: empleado.idCargo,
                idContrato: empleado.idContrato,
                idUsuario: idUsuario,
                prestamos: 0,
                descuentos: 0,
                meses: 0,
                intereses: 0
            }, { transaction: t });
        }

        const detalleCompleto = {
            ...detalle,
            salario: contrato.salario,
            tipoContrato: contrato.tipoContrato,
            fechaRegistro: now.toISOString().split('T')[0],
            diasTrabajados: detalle.diasTrabajados,
            horasExtras: detalle.horasExtras,
        };

        const parametros = {
            salarioMinimo: parametro.salarioMinimo,
            salud: parametro.salud,
            pension: parametro.pension,
            auxTransporte: parametro.auxTransporte,
        };

        const novedades = {
            prestamos: novedad.prestamos,
            descuentos: novedad.descuentos,
            meses: novedad.meses,
            intereses: novedad.intereses
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

        const valoresCalculados = await calcularValoresAutomaticosPython(detalleCompleto, parametros, novedades);

        const newDetalleLiquidacion = new DetalleLiquidacion({
            año: año,
            mes: mes,
            ...detalleCompleto,
            ...valoresCalculados,
            idParametro: detalle.idParametro,
            idNovedad: novedad.idNovedad, // Usar la ID de novedad existente o recién creada
            idLiquidacion: idLiquidacion,
            idUsuario: idUsuario,
        });

        await newDetalleLiquidacion.save({ transaction: t });

        novedad.prestamos -= valoresCalculados.prestamos;
        novedad.descuentos -= valoresCalculados.descuentos;
        
        novedad.prestamos = Math.max(novedad.prestamos, 0);
        novedad.descuentos = Math.max(novedad.descuentos, 0);

        await novedad.save({ transaction: t });
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
            newDetalleLiquidacion.prestamos,
            newDetalleLiquidacion.descuentos,
            newDetalleLiquidacion.devengado,
            newDetalleLiquidacion.fechaRegistro,
        );
    } catch (error) {
        await t.rollback();
        throw new Error(`Error creando DetalleLiquidacion: ${error.message}`);
    }
};

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
                    detalle.prestamos,
                    detalle.descuentos,
                    detalle.devengado,
                    detalle.fechaRegistro,
                )
        );
    } catch (error) {
        throw new Error(error.message);
    }
}
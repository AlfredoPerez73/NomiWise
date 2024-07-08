import { Empleado } from "../models/empleado.js";
import { Contrato } from "../models/contrato.js"; // Asegúrate de importar tu modelo de Contrato
import { EmpleadoDTO } from "../dtos/empleado.dto.js";
import { sequelize } from '../database/database.js'; // Importa la conexión a tu base de datos si estás usando Sequelize
import { Op } from 'sequelize';

async function validarEmpleado(documento) {
  const empleadoEmpleado = await Empleado.findOne({
    where: { documento: documento },
  });

  if (empleadoEmpleado) {
    throw new Error("El empleado ya se encuentra registrado");
  }
}

export async function registrarEmpleado(documento, nombre, estado, idCargo, detallesContrato, idUsuario) {
  const t = await sequelize.transaction();

  try {
    await validarEmpleado(documento);

    // Crear el contrato primero
    if (!detallesContrato.fechaInicio || !detallesContrato.fechaFin || !detallesContrato.salario || !detallesContrato.tipoContrato) {
      throw new Error("Faltan detalles del contrato");
    }

    const newContrato = new Contrato({
      fechaInicio: detallesContrato.fechaInicio,
      fechaFin: detallesContrato.fechaFin,
      salario: detallesContrato.salario,
      tipoContrato: detallesContrato.tipoContrato,
      idUsuario: idUsuario
    });
    const contratoGuardado = await newContrato.save({ transaction: t });

    // Crear el empleado con el id del contrato recién creado
    const newEmpleado = new Empleado({
      documento,
      nombre,
      estado,
      idCargo,
      idContrato: contratoGuardado.idContrato, // Asegúrate de que el ID del contrato se asigne correctamente
      idUsuario: idUsuario, // Suponiendo que el ID del usuario no es necesario en el momento de la creación
    });
    const empleadoGuardado = await newEmpleado.save({ transaction: t });

    // Si todo es correcto, confirma la transacción
    await t.commit();

    return new EmpleadoDTO(
      empleadoGuardado.idCargo,
      empleadoGuardado.idContrato,
      empleadoGuardado.idUsuario,
      empleadoGuardado.documento,
      empleadoGuardado.nombre,
      empleadoGuardado.estado,
    );
  } catch (error) {
    await t.rollback();
    throw new Error(error.message);
  }
}

export async function obtenerEmpleados(idUsuario) {
  try {

    const hoy = new Date();

    // Obtener todos los empleados del usuario con contratos expirados
    const empleadosConContratosExpirados = await Empleado.findAll({
        where: {
            idUsuario: idUsuario
        },
        include: [{
            model: Contrato,
            where: {
                fechaFin: {
                    [Op.lt]: hoy
                }
            }
        }]
    });

    // Actualizar el estado de estos empleados
    for (const empleado of empleadosConContratosExpirados) {
        await empleado.update({ estado: 'INACTIVO' });
    }

    const empleados = await Empleado.findAll({
      where: {
        idUsuario: idUsuario
      }
    });
    return empleados.map(
      (empleados) =>
        new EmpleadoDTO(
          empleados.idEmpleado,
          empleados.idCargo,
          empleados.idContrato,
          empleados.idUsuario,
          empleados.documento,
          empleados.nombre,
          empleados.estado,
          empleados.fechaRegistro,
        )
    );
  } catch (error) {
    throw new Error(error.message);
  }
}

export const obtenerEmpleadosActualizadosPorUsuario = async (idUsuario) => {
  try {
    // Obtener la fecha actual
    const hoy = new Date();

    // Actualizar estados de empleados con contratos expirados para un usuario específico
    await Empleado.update(
      { estado: 'INACTIVO' },
      {
        where: {
          '$Contrato.fechaFin$': {
            [Op.lt]: hoy
          },
          idUsuario: idUsuario // Filtrar por ID de usuario
        },
        include: [{
          model: Contrato,
          required: true
        }]
      }
    );

    // Obtener todos los empleados del usuario junto con su contrato actualizado
    const empleados = await Empleado.findAll({
      where: {
        idUsuario: idUsuario // Filtrar por ID de usuario
      },
      include: [{
        model: Contrato
      }]
    });
    return empleados.map(
      (empleados) =>
        new EmpleadoDTO(
          empleados.idEmpleado,
          empleados.idCargo,
          empleados.idContrato,
          empleados.idUsuario,
          empleados.documento,
          empleados.nombre,
          empleados.estado,
          empleados.fechaRegistro,
        )
    );
  } catch (error) {
    throw new Error('Error al obtener empleados actualizados: ' + error.message);
  }
};

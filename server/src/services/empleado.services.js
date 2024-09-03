  import { Empleado } from "../models/empleado.js";
  import { Contrato } from "../models/contrato.js";
  import { EmpleadoDTO } from "../dtos/empleado.dto.js";
  import { sequelize } from '../database/database.js';
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

      const newEmpleado = new Empleado({
        documento,
        nombre,
        estado,
        idCargo,
        idContrato: contratoGuardado.idContrato,
        idUsuario: idUsuario,
      });
      const empleadoGuardado = await newEmpleado.save({ transaction: t });

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

  export async function obtenerEmpleados() {
    try {

      const hoy = new Date();

      const empleadosConContratosExpirados = await Empleado.findAll({
        include: [{
          model: Contrato,
          where: {
            fechaFin: {
              [Op.lt]: hoy
            }
          }
        }]
      });

      for (const empleado of empleadosConContratosExpirados) {
        await empleado.update({ estado: 'INACTIVO' });
      }

      const empleados = await Empleado.findAll();
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

  export async function actualizarEmpleado(idEmpleado, idUsuario, nombre, idCargo, detallesContrato) {
    try {
      const empleado = await Empleado.findOne({
        where: {
          idEmpleado: idEmpleado,
          idUsuario: idUsuario,
        },
      });

      if (!empleado) {
        throw new Error('Empleado no encontrado');
      }

      empleado.nombre = nombre;
      empleado.idCargo = idCargo;

      const contrato = await Contrato.findOne({
        where: {
          idContrato: empleado.idContrato,
          idUsuario: idUsuario
        }
      });

      if (!contrato) {
        throw new Error('Contrato no encontrado');
      }

      contrato.fechaInicio = detallesContrato.fechaInicio;
      contrato.fechaFin = detallesContrato.fechaFin;
      contrato.salario = detallesContrato.salario;
      contrato.tipoContrato = detallesContrato.tipoContrato;
      await contrato.save();

      const fechaActual = new Date();
      if (new Date(contrato.fechaFin) < fechaActual) {
        empleado.estado = 'INACTIVO';
      } else {
        empleado.estado = 'ACTIVO';
      }
      
      await empleado.save();
      return new EmpleadoDTO(
        empleado.idCargo,
        empleado.idContrato,
        empleado.idUsuario,
        empleado.documento,
        empleado.nombre,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }


  export async function eliminarEmpleado(idEmpleado, idUsuario) {
    try {
      const empleado = await Empleado.findOne({
        where: {
          idEmpleado: idEmpleado,
          idUsuario: idUsuario,
        },
      });

      if (!empleado) {
        throw new Error('Empleado no encontrado');
      }

      const contrato = await Contrato.findOne({
        where: {
          idContrato: empleado.idContrato,
          idUsuario: idUsuario
        }
      });

      if (contrato) {
        await contrato.destroy({
          where: {
            idContrato: contrato.idContrato,
            idUsuario: idUsuario,
          },
        });
      }

      await empleado.destroy({
        where: {
          idEmpleado: idEmpleado,
          idUsuario: idUsuario,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
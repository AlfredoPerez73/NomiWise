export class DetalleLiquidacionDTO {
    constructor(idDetalleLiquidacion, idLiquidacion, idEmpleado, idUsuario,
        año, mes, diasTrabajados, horasExtras, salud, pension, auxTransporte, bonificacionServicio, auxAlimentacion,
        primaNavidad, vacaciones, cesantias, interesesCesantias, prestamos, descuentos, devengado, fechaRegistro) {
      this.idDetalleLiquidacion = idDetalleLiquidacion;
      this.idLiquidacion = idLiquidacion;
      this.idEmpleado = idEmpleado;
      this.idUsuario = idUsuario;
      this.año = año;
      this.mes = mes;
      this.diasTrabajados = diasTrabajados;
      this.horasExtras = horasExtras;
      this.salud = salud;
      this.pension = pension;
      this.auxTransporte = auxTransporte;
      this.bonificacionServicio = bonificacionServicio;
      this.auxAlimentacion = auxAlimentacion;
      this.primaNavidad = primaNavidad;
      this.vacaciones = vacaciones;
      this.cesantias = cesantias;
      this.interesesCesantias = interesesCesantias;
      this.prestamos = prestamos;
      this.descuentos = descuentos;
      this.devengado = devengado;
      this.fechaRegistro = fechaRegistro;
    }
  }
export class LiquidacionDTO {
    constructor(idLiquidacion, salarioTotal, año, mes,
        saludTotal, pensionTotal, auxTransporteTotal, bonificacionServicioTotal, auxAlimentacionTotal,
        primaNavidadTotal, vacacionesTotal, cesantiasTotal, interesesCesantiasTotal, total, fechaRegistro, idUsuario) {
      this.idLiquidacion = idLiquidacion;
      this.año = año;
      this.mes = mes;
      this.salarioTotal = salarioTotal;
      this.saludTotal = saludTotal;
      this.pensionTotal = pensionTotal;
      this.auxTransporteTotal = auxTransporteTotal;
      this.bonificacionServicioTotal = bonificacionServicioTotal;
      this.auxAlimentacionTotal = auxAlimentacionTotal;
      this.primaNavidadTotal = primaNavidadTotal;
      this.vacacionesTotal = vacacionesTotal;
      this.cesantiasTotal = cesantiasTotal;
      this.interesesCesantiasTotal = interesesCesantiasTotal;
      this.total = total;
      this.fechaRegistro = fechaRegistro;
      this.idUsuario = idUsuario;
    }
  }
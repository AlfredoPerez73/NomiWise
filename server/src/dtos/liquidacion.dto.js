export class DetalleLiquidacionDTO {
    constructor(idLiquidacion, 
        saludTotal, pensionTotal, auxTransporteTotal, bonificacionServicioTotal, auxAlimentacionTotal,
        primaNavidadTotal, vacacionesTotal, cesantiasTotal, interesesCesantiasTotal, total, fechaRegistro) {
      this.idLiquidacion = idLiquidacion;
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
    }
  }
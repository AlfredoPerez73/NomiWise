export class ParametrosDTO {
    constructor(idParametro, salarioMinimo, salud, pension, auxTransporte, fechaRegistro) {
      this.idParametro = idParametro;
      this.salarioMinimo = salarioMinimo;
      this.salud = salud;
      this.pension = pension;
      this.auxTransporte = auxTransporte;
      this.fechaRegistro = fechaRegistro;
    }
  }
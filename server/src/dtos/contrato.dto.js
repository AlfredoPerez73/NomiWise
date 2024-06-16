export class ContratoDTO {
    constructor(idContrato, idUsuario, fechaInicio, fechaFin, salario, tipoContrato) {
      this.idContrato = idContrato;
      this.idUsuario = idUsuario;
      this.fechaInicio = fechaInicio;
      this.fechaFin = fechaFin;
      this.salario = salario;
      this.tipoContrato = tipoContrato;
    }
  }
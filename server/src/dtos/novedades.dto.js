export class NovedadesDTO {
    constructor(idNovedad, idEmpleado, idCargo, idContrato, idUsuario, prestamos, descuentos, fechaRegistro) {
      this.idNovedad = idNovedad;
      this.idEmpleado = idEmpleado;
      this.idCargo = idCargo;
      this.idContrato = idContrato;
      this.idUsuario = idUsuario;
      this.prestamos = prestamos;
      this.descuentos = descuentos;
      this.fechaRegistro = fechaRegistro;
    }
  }
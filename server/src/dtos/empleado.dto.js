export class EmpleadoDTO {
    constructor(idEmpleado, idCargo, idContrato, idUsuario, documento, nombre, estado, fechaRegistro) {
      this.idEmpleado = idEmpleado;
      this.idCargo = idCargo;
      this.idContrato = idContrato;
      this.idUsuario = idUsuario;
      this.documento = documento;
      this.nombre = nombre;
      this.estado = estado;
      this.fechaRegistro = fechaRegistro;
    }
  }
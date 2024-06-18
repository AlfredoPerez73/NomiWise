export class UsuarioDTO {
    constructor(idUsuario, idRol, idSUsuario, nombre, documento, correo, fechaRegistro, token) {
      this.idUsuario = idUsuario;
      this.idRol = idRol;
      this.idSUsuario = idSUsuario;
      this.documento = documento;
      this.nombre = nombre;
      this.correo = correo;
      this.fechaRegistro = fechaRegistro;
      this.token = token;
    }
  }
export class SUsuarioDTO {
    constructor(idUsuario, nombre, documento, correo, token) {
      this.idUsuario = idUsuario;
      this.documento = documento;
      this.nombre = nombre;
      this.correo = correo;
      this.token = token;
    }
  }
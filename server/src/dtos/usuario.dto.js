export class UsuarioDTO {
    constructor(idUsuario, idRol, idSUsuario, nombre, documento, correo, token) {
      this.idUsuario = idUsuario;
      this.idRol = idRol;
      this.idSUsuario = idSUsuario;
      this.documento = documento;
      this.nombre = nombre;
      this.correo = correo;
      this.token = token;
    }
  }
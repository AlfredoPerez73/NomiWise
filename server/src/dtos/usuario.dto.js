export class UsuarioDTO {
    constructor(idUsuario, idRol, documento, nombre, correo, contraseña, fechaRegistro, token) {
      this.idUsuario = idUsuario;
      this.idRol = idRol;
      this.documento = documento;
      this.nombre = nombre;
      this.correo = correo;
      this.contraseña = contraseña;
      this.fechaRegistro = fechaRegistro;
      this.token = token;
    }
  }
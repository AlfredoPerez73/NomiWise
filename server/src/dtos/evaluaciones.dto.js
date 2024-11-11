export class EvaluacionDTO {
    constructor(idEvaluacion, idEmpleado, idUsuario, productividad, puntualidad, trabajoEnEquipo, adaptabilidad, conocimientoTecnico, promedioEval, fechaRegistro) {
      this.idEvaluacion = idEvaluacion;
      this.idEmpleado = idEmpleado;
      this.idUsuario = idUsuario;
      this.productividad = productividad;
      this.puntualidad = puntualidad;
      this.trabajoEnEquipo = trabajoEnEquipo;
      this.adaptabilidad = adaptabilidad;
      this.conocimientoTecnico = conocimientoTecnico;
      this.promedioEval = promedioEval;
      this.fechaRegistro = fechaRegistro;
    }
  }
import * as empleadoService from '../services/empleado.services.js';

export async function postEmpleado(req, res) {
    try {
        const idUsuario = req.usuario.idUsuario;
        const { documento, nombre, estado, idCargo, fechaInicio, fechaFin, salario, tipoContrato } = req.body;
        const detallesContrato = { fechaInicio, fechaFin, salario, tipoContrato };

        const newEmpleado = await empleadoService.registrarEmpleado(
            documento, 
            nombre, 
            estado, 
            idCargo, 
            detallesContrato, 
            idUsuario
        );
        res.json(newEmpleado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getEmpleado(req, res) {
    try {
        const idUsuario = req.usuario.idUsuario;
        const empleados = await empleadoService.obtenerEmpleados(idUsuario);
        res.json(empleados);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getEmpleadosByUsuario(req, res) {
    try {
        const idUsuario = req.usuario.idUsuario;
        const empleados = await empleadoService.obtenerEmpleadosActualizadosPorUsuario(idUsuario);
        res.json(empleados);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

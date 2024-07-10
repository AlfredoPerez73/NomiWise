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

export async function putEmpleado(req, res) {
    try {
        const idUsuario = req.usuario.idUsuario;
        const { idEmpleado } = req.params;
        const { nombre, idCargo, detallesContrato } = req.body;
        const empleadoActualizado = await empleadoService.actualizarEmpleado(idEmpleado, idUsuario, nombre, idCargo, detallesContrato);
        res.json(empleadoActualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function deleteEmpleado(req, res) {
    try {
        const idUsuario = req.usuario.idUsuario;
        const { idEmpleado } = req.params;
        await empleadoService.eliminarEmpleado(idEmpleado, idUsuario);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

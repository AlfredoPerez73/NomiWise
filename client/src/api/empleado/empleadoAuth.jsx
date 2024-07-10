import axios from "../axios";

export const createEmpleadosRequest = (empleado) => axios.post('/empleados', empleado);
export const getEmpleadoRequest = () => axios.get('/empleados');
export const deleteEmpleadosRequest = (idEmpleado) => axios.delete(`/empleados/${idEmpleado}`);
export const updateEmpleadosRequest = (idEmpleado,empleado) => axios.put(`/empleados/${idEmpleado}`, empleado);
import axios from "../axios";

export const createEmpleadosRequest = (empleado) => axios.post('/empleados', empleado);
export const getEmpleadoRequest = () => axios.get('/empleados');
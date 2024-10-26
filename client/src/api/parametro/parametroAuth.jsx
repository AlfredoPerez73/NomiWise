import axios from "../axios";

export const createParametroRequest = (parametros) => axios.post('/parametros', parametros);
export const getParametroRequest = () => axios.get('/parametros');
import axios from "../axios";

export const createParametroRequest = (parametros) => axios.post('/parametros', parametros);
export const getParametroRequest = () => axios.get('/parametros');
export const deleteParametrosRequest = (idParametro) => axios.delete(`/parametros/${idParametro}`);
export const updateParametrosRequest = (idParametro,parametros) => axios.put(`/parametros/${idParametro}`, parametros);
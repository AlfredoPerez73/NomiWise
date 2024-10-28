import axios from "../axios";

export const createnovedadesRequest = (novedades) => axios.post('/novedades', novedades);
export const getnovedadesRequest = () => axios.get('/novedades');
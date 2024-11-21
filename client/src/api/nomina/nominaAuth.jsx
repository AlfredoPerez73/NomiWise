import axios from "../axios";

export const getNominaRequest = () => axios.get('/nomina');
export const getProcesamientoNominaRequest = (nominas) => axios.post('/procesarNomina', nominas);
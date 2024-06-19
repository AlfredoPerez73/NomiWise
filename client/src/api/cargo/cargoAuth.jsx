import axios from "../axios";

export const getCargosRequest = () => axios.get('/cargos');
export const createCargosRequest = (cargo) => axios.post('/cargos', cargo);
export const deleteCargosRequest = (idCargo) => axios.delete(`/cargos/${idCargo}`);
export const updateCargosRequest = (idCargo,cargo) => axios.put(`/cargos/${idCargo}`, cargo);
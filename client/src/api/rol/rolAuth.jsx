import axios from "../axios";

export const getRolesRequest = () => axios.get('/roles');
export const createRolesRequest = (rol) => axios.post('/roles', rol);
export const deleteRolesRequest = (idRol) => axios.delete(`/roles/${idRol}`);
export const updateRolesRequest = (idRol,rol) => axios.put(`/roles/${idRol}`, rol);
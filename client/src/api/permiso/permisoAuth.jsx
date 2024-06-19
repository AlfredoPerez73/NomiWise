import axios from "../axios";

export const getPermisosRequest = () => axios.get('/permisos');
export const createPermisosRequest = (permiso) => axios.post('/permisos', permiso);
export const deletePermisosRequest = (idPermiso) => axios.delete(`/permisos/${idPermiso}`);
export const updatePermisosRequest = (idPermiso,permiso) => axios.put(`/permisos/${idPermiso}`, permiso);
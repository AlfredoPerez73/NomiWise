import axios from "../axios";

export const getUsuariosRequest = () => axios.get('/usuarios');
export const createUsuariosRequest = (user) => axios.post('/usuarios', user);
export const deleteUsuariosRequest = (idUsuario) => axios.delete(`/usuarios/${idUsuario}`);
export const updateUsuariosRequest = (idUsuario,user) => axios.put(`/usuarios/${idUsuario}`, user);

export const loginRequestUsuario = (usuario) => axios.post(`/loginUsuario`, usuario)
export const verityTokenRequestUsuario = () => axios.get('/verifyUsuario')
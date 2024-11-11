import axios from "../axios";

export const getEvalRequest = () => axios.get('/evaluaciones');
export const createEvalRequest = (evaluacion) => axios.post('/evaluaciones', evaluacion);
export const deleteEvalRequest = (idEvaluacion) => axios.delete(`/evaluaciones/${idEvaluacion}`);
export const updateEvalsRequest = (idEvaluacion,evaluacion) => axios.put(`/evaluaciones/${idEvaluacion}`, evaluacion);
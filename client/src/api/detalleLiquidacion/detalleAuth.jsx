import axios from "../axios";

export const createDetalleLiquidacionRequest = (detalle) => axios.post('/detalles', detalle);
export const getDetalleLiquidacionRequest = () => axios.get('/detalles');
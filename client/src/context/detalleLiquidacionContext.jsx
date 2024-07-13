import { createContext, useContext, useState } from "react";
import {
    createDetalleLiquidacionRequest,
    getDetalleLiquidacionRequest
} from '../api/detalleLiquidacion/detalleAuth';

const DetalleLiquidacionContext  = createContext();

export const useDetalle = () => {
    const context = useContext(DetalleLiquidacionContext);
    if(!context){
        throw new Error("useDetalle ya esta usado");
    }
    return context;
}

export function DetalleProvider({ children }) {
    const [detalles, setDetalles] = useState([]);

    const getDetalles = async () => {
        try {
            const res = await getDetalleLiquidacionRequest();
            setDetalles(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    const createDetalle = async (detalles) => {
        try {
            const res = await createDetalleLiquidacionRequest(detalles);
            console.log(res);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return(
        <DetalleLiquidacionContext.Provider value={{
            detalles,
            createDetalle,
            getDetalles,
        }}>
            {children}
        </DetalleLiquidacionContext.Provider>
    )
}
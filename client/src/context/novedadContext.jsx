import React, { createContext, useContext, useState } from 'react';
import { 
    createnovedadesRequest,
    getnovedadesRequest 
} from '../api/novedad/novedadAuth';

const NovedadesContext = createContext();

export const useNovedades  = () => {
    const context = useContext(NovedadesContext);
    if(!context){
        throw new Error("useNovedades ya esta usado");
    }
    return context;
}

export const NovedadesProvider = ({ children }) => {
    const [novedades, setNovedades] = useState([]);
    
    const getNovedades = async (idEmpleado) => {
        try {
            const res = await getnovedadesRequest(idEmpleado);
            setNovedades(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const createNovedad = async (novedad) => {
        try {
            const res = await createnovedadesRequest(novedad);
            console.log(res);
        } catch (error) {
            throw error;
        }
    };

    return (
        <NovedadesContext.Provider value={{ 
            novedades, 
            createNovedad,
            getNovedades, 
        }}>
            {children}
        </NovedadesContext.Provider>
    );
};

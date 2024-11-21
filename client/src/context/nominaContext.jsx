import { createContext, useContext, useState } from "react";
import {
    getNominaRequest,
    getProcesamientoNominaRequest
} from '../api/nomina/nominaAuth';

const NominaContext  = createContext();

export const useNomina = () => {
    const context = useContext(NominaContext);
    if(!context){
        throw new Error("useNomina ya esta usado");
    }
    return context;
}

export function NominaProvider({ children }) {
    const [nominas, setNomina] = useState([]);

    const getNominas = async () => {
        try {
            const res = await getNominaRequest();
            setNomina(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    const procesarNomina = async (nominas) => {
        try {
            const res = await getProcesamientoNominaRequest(nominas); // Llama al endpoint
            console.log("Nómina procesada con éxito:", res.data);
        } catch (error) {
            console.error("Error al procesar la nómina:", error);
        }
    };

    return(
        <NominaContext.Provider value={{
            nominas,
            getNominas,
            procesarNomina
        }}>
            {children}
        </NominaContext.Provider>
    )
}
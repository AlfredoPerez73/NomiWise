import { createContext, useContext, useState } from "react";
import {
    getNominaRequest
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

    return(
        <NominaContext.Provider value={{
            nominas,
            getNominas
        }}>
            {children}
        </NominaContext.Provider>
    )
}
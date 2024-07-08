import { createContext, useContext, useState } from "react";
import {
    getContratoRequest,
} from '../api/contrato/contratoAuth';

const ContratoContext  = createContext();

export const useContrato = () => {
    const context = useContext(ContratoContext);
    if(!context){
        throw new Error("useContrato ya esta usado");
    }
    return context;
}

export function ContratoProvider({ children }) {
    const [contratos, setContratos] = useState([]);

    const getContrato = async () => {
        try {
            const res = await getContratoRequest();
            setContratos(res.data);
        } catch (error) {
            console.log(error)
        }

    }

    return(
        <ContratoContext.Provider value={{
            contratos,
            getContrato
        }}>
            {children}
        </ContratoContext.Provider>
    )
}
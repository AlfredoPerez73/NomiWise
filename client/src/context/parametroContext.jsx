import { createContext, useContext, useState } from "react";
import {
    createParametroRequest,
    getParametroRequest,
} from '../api/parametro/parametroAuth';

const ParametroContext  = createContext();

export const useParametro = () => {
    const context = useContext(ParametroContext);
    if(!context){
        throw new Error("useParametro ya esta usado");
    }
    return context;
}

export function ParametrosProvider({ children }) {
    const [parametros, setParametros] = useState([]);

    const getParametro = async () => {
        try {
            const res = await getParametroRequest();
            setParametros(res.data);
        } catch (error) {
            console.log(error)
        }

    }

    const createParametro = async (parametro) => {
        const res = await createParametroRequest(parametro);
        console.log(res);
    }

    return(
        <ParametroContext.Provider value={{
            parametros,
            createParametro,
            getParametro,
        }}>
            {children}
        </ParametroContext.Provider>
    )
}
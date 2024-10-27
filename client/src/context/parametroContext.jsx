import { createContext, useContext, useState } from "react";
import {
    createParametroRequest,
    getParametroRequest,
    deleteParametrosRequest,
    updateParametrosRequest,
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

    const deleteParametro = async (idParametro) => {
        try {
          const res = await deleteParametrosRequest(idParametro);
          if (res.status == 204) {
            setParametros(parametros.filter((parametros) => parametros.idParametro != idParametro));
          }
        } catch (error) {
          throw error;
        }
      };
      

    const updateParametro = async (idParametro, parametros) => {
        try {
            await updateParametrosRequest(idParametro, parametros);
        } catch (error) {
            throw error;
        }
    }

    return(
        <ParametroContext.Provider value={{
            parametros,
            createParametro,
            getParametro,
            updateParametro,
            deleteParametro
        }}>
            {children}
        </ParametroContext.Provider>
    )
}
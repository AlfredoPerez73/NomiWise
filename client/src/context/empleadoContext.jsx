import { createContext, useContext, useState } from "react";
import {
    createEmpleadosRequest,
    getEmpleadoRequest,
    deleteEmpleadosRequest,
    updateEmpleadosRequest
} from '../api/empleado/empleadoAuth';

const EmpleadoContext  = createContext();

export const useEmpleado = () => {
    const context = useContext(EmpleadoContext);
    if(!context){
        throw new Error("useEmpleado ya esta usado");
    }
    return context;
}

export function EmpleadoProvider({ children }) {
    const [empleados, setEmpleado] = useState([]);

    const getEmpleado = async () => {
        try {
            const res = await getEmpleadoRequest();
            setEmpleado(res.data);
        } catch (error) {
            console.log(error)
        }

    }

    const createEmpleado = async (empleado) => {
        const res = await createEmpleadosRequest(empleado);
        console.log(res);
    }

    const deleteEmpleado = async (idEmpleado) => {
        try {
          const res = await deleteEmpleadosRequest(idEmpleado);
          if (res.status == 204) {
            setEmpleado(empleados.filter((e) => e.idEmpleado != idEmpleado));
          }
        } catch (error) {
          throw error;
        }
      };
      

    const updateEmpleado = async (idEmpleado, empleado) => {
        try {
            await updateEmpleadosRequest(idEmpleado, empleado);
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <EmpleadoContext.Provider value={{
            empleados,
            createEmpleado,
            updateEmpleado,
            deleteEmpleado,
            getEmpleado
        }}>
            {children}
        </EmpleadoContext.Provider>
    )
}
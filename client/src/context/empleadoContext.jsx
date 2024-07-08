import { createContext, useContext, useState } from "react";
import {
    createEmpleadosRequest,
    getEmpleadoRequest
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

/*     const deleteRol = async (idRol) => {
        try {
          const res = await deleteRolesRequest(idRol);
          if (res.status == 204) {
            setRol(roles.filter((rol) => rol.idRol != idRol));
          }
        } catch (error) {
          throw error;
        }
      };
      

    const updateRol = async (idRol, rol) => {
        try {
            await updateRolesRequest(idRol, rol);
        } catch (error) {
            console.log(error);
        }
    } */

    return(
        <EmpleadoContext.Provider value={{
            empleados,
            createEmpleado,
            getEmpleado

        }}>
            {children}
        </EmpleadoContext.Provider>
    )
}
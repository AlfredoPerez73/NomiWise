import { createContext, useContext, useState } from "react";
import {
    createRolesRequest,
    getRolesRequest,
    deleteRolesRequest,
    updateRolesRequest 
} from '../api/rol/rolAuth';

const RolContext  = createContext();

export const useRol = () => {
    const context = useContext(RolContext);
    if(!context){
        throw new Error("useRol ya esta usado");
    }
    return context;
}

export function RolProvider({ children }) {
    const [roles, setRol] = useState([]);

    const getRol = async () => {
        try {
            const res = await getRolesRequest();
            setRol(res.data);
        } catch (error) {
            console.log(error)
        }

    }

    const createRol = async (rol) => {
        const res = await createRolesRequest(rol);
        console.log(res);
    }

    const deleteRol = async (idRol) => {
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
    }

    return(
        <RolContext.Provider value={{
            roles,
            createRol,
            deleteRol,
            updateRol,
            getRol
        }}>
            {children}
        </RolContext.Provider>
    )
}
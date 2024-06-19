import { createContext, useContext, useState } from "react";
import {
    createPermisosRequest,
    getPermisosRequest,
    deletePermisosRequest,
    updatePermisosRequest 
} from '../api/permiso/permisoAuth';

const PermisoContext  = createContext();

export const usePermiso = () => {
    const context = useContext(PermisoContext);
    if(!context){
        throw new Error("usePermiso ya esta usado");
    }
    return context;
}

export function PermisosProvider({ children }) {
    const [permisos, setPermisos] = useState([]);

    const getPermiso = async () => {
        try {
            const res = await getPermisosRequest();
            setPermisos(res.data);
        } catch (error) {
            console.log(error)
        }

    }

    const createPermiso = async (permiso) => {
        const res = await createPermisosRequest(permiso);
        console.log(res);
    }

    const deletePermiso = async (idPermiso) => {
        try {
          const res = await deletePermisosRequest(idPermiso);
          if (res.status == 204) {
            setPermisos(permisos.filter((permiso) => permiso.idPermiso != idPermiso));
          }
        } catch (error) {
          throw error;
        }
      };
      

    const updatePermiso = async (idPermiso, permiso) => {
        try {
            await updatePermisosRequest(idPermiso, permiso);
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <PermisoContext.Provider value={{
            permisos,
            createPermiso,
            deletePermiso,
            updatePermiso,
            getPermiso
        }}>
            {children}
        </PermisoContext.Provider>
    )
}
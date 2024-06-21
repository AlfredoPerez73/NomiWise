import { createContext, useContext, useState } from "react";
import {
    createUsuariosRequest,
    getUsuariosRequest,
    deleteUsuariosRequest,
    updateUsuariosRequest 
} from '../api/usuario/usuarioAuth';

const UsuarioContext  = createContext();

export const useUsuario = () => {
    const context = useContext(UsuarioContext);
    if(!context){
        throw new Error("useUsuario ya esta usado");
    }
    return context;
}

export function UsuarioProvider({ children }) {
    const [usuarios, setUsuario] = useState([]);

    const getUsuario = async () => {
        try {
            const res = await getUsuariosRequest();
            setUsuario(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    const createUsuario = async (usuario) => {
        const res = await createUsuariosRequest(usuario);
        console.log(res);
    }

    const deleteUsuario = async (idUsuario) => {
        try {
          const res = await deleteUsuariosRequest(idUsuario);
          if (res.status == 204) {
            setUsuario(usuarios.filter((u) => u.idUsuario != idUsuario));
          }
        } catch (error) {
          throw error;
        }
    };
      
    const updateUsuario = async (idUsuario, usuario) => {
        try {
            await updateUsuariosRequest(idUsuario, usuario);
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <UsuarioContext.Provider value={{
            usuarios,
            createUsuario,
            deleteUsuario,
            updateUsuario,
            getUsuario
        }}>
            {children}
        </UsuarioContext.Provider>
    )
}
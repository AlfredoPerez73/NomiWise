import { createContext, useContext, useState } from "react";
import {
    createCargosRequest,
    getCargosRequest,
    deleteCargosRequest,
    updateCargosRequest 
} from '../api/cargo/cargoAuth';

const CargoContext  = createContext();

export const useCargo = () => {
    const context = useContext(CargoContext);
    if(!context){
        throw new Error("useCargo ya esta usado");
    }
    return context;
}

export function CargoProvider({ children }) {
    const [cargos, setCargos] = useState([]);

    const getCargo = async () => {
        try {
            const res = await getCargosRequest();
            setCargos(res.data);
        } catch (error) {
            console.log(error)
        }

    }

    const createCargo = async (cargo) => {
        const res = await createCargosRequest(cargo);
        console.log(res);
    }

    const deleteCargo = async (idCargo) => {
        try {
          const res = await deleteCargosRequest(idCargo);
          if (res.status == 204) {
            setCargos(cargos.filter((cargo) => cargo.idCargo != idCargo));
          }
        } catch (error) {
          throw error;
        }
      };
      

    const updateCargo = async (idRol, rol) => {
        try {
            await updateCargosRequest(idRol, rol);
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <CargoContext.Provider value={{
            cargos,
            createCargo,
            deleteCargo,
            updateCargo,
            getCargo
        }}>
            {children}
        </CargoContext.Provider>
    )
}
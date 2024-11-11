import { createContext, useContext, useState } from "react";
import {
    createEvalRequest,
    getEvalRequest,
    deleteEvalRequest,
    updateEvalsRequest 
} from '../api/evals/evalsAuth';

const EvalContext  = createContext();

export const useEval = () => {
    const context = useContext(EvalContext);
    if(!context){
        throw new Error("useEval ya esta usado");
    }
    return context;
}

export function EvalProvider({ children }) {
    const [evals, setEvals] = useState([]);

    const getEval = async () => {
        try {
            const res = await getEvalRequest();
            setEvals(res.data);
        } catch (error) {
            console.log(error)
        }

    }

    const createEval = async (evals) => {
        const res = await createEvalRequest(evals);
        console.log(res);
    }

    const deleteEval = async (idEvaluacion) => {
        try {
          const res = await deleteEvalRequest(idEvaluacion);
          if (res.status == 204) {
            setEvals(evals.filter((e) => e.idEvaluacion != idEvaluacion));
          }
        } catch (error) {
          throw error;
        }
      };
      

    const updateEvals = async (idEvaluacion, evals) => {
        try {
            await updateEvalsRequest(idEvaluacion, evals);
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <EvalContext.Provider value={{
            evals,
            createEval,
            deleteEval,
            updateEvals,
            getEval
        }}>
            {children}
        </EvalContext.Provider>
    )
}
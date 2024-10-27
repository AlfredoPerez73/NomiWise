import React, { useState, useEffect } from "react";
import "../css/components.css";
import { useParametro } from "../context/parametroContext";
import { Toaster, toast } from "react-hot-toast";

const RegistroParametroForm = ({ onClose, parametroEdit, isReadOnly }) => {
    const [formData, setFormData] = useState({
        salarioMinimo: "",
        salud: "",
        pension: "",
        auxTransporte: ""
    });

    const [error, setError] = useState("");
    const { createParametro, getParametro, updateParametro, deleteParametro } = useParametro();

    useEffect(() => {
        if (parametroEdit) {
            setFormData({
                salarioMinimo: parametroEdit.salarioMinimo,
                salud: parametroEdit.salud,
                pension: parametroEdit.pension,
                auxTransporte: parametroEdit.auxTransporte,
            });
        }
    }, [parametroEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (parametroEdit) {
                console.log("Actualizando parámetro:", parametroEdit.idParametro, formData); // Depuración
                await updateParametro(parametroEdit.idParametro, formData);
                toast.success(<b>El parámetro fue actualizado con éxito!</b>);
            } else {
                await createParametro(formData);
                toast.success(<b>El parámetro ha sido registrado correctamente.</b>);
            }
            await getParametro();
            onClose();
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            toast.error(<b>Error: {error.response?.data?.message || error.message}</b>);
        }
    };
    

    return (
        <div className="w-full h-full">
            <Toaster />
            <div className="form-comp">
                <div className="header-comp">
                    <h1 className="title-comp">{parametroEdit ? "Actualizar Parametro" : "Registrar Parametro"}</h1>
                </div>
                <div className="card-grid card-centered">
                    <h1 className="sub-titles-copm">Nuevo Parametro</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="grid-container">
                            <div className="input-container">
                                <input
                                    type="number"
                                    id="salarioMinimo"
                                    name="salarioMinimo"
                                    value={formData.salarioMinimo}
                                    onChange={handleChange}
                                    required
                                    placeholder=" "
                                    autoComplete="off"
                                    disabled={isReadOnly}
                                />
                                <label htmlFor="documento">Salario Minimo</label>
                            </div>
                            <div className="input-container">
                                <input
                                    type="number"
                                    id="salud"
                                    name="salud"
                                    value={formData.salud}
                                    onChange={handleChange}
                                    required
                                    placeholder=" "
                                    autoComplete="off"
                                />
                                <label htmlFor="nombre">Salud %</label>
                            </div>
                            <div className="input-container">
                                <input
                                    type="number"
                                    id="pension"
                                    name="pension"
                                    value={formData.pension}
                                    onChange={handleChange}
                                    required
                                    placeholder=" "
                                    autoComplete="off"
                                />
                                <label htmlFor="correo">Pension %</label>
                            </div>
                            <div className="input-container">
                                <input
                                    type="number"
                                    id="auxTransporte"
                                    name="auxTransporte"
                                    value={formData.auxTransporte}
                                    onChange={handleChange}
                                    placeholder=" "
                                    autoComplete="off"
                                />
                                <label htmlFor="contraseña">Aux de transporte</label>
                            </div>
                        </div>
                        <button type={parametroEdit ? "submit_2" : "submit_2"}>
                            {parametroEdit ? "Actualizar" : "Registrar"}
                        </button>
                        <button type="button" onClick={onClose}>
                            Cancelar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistroParametroForm;

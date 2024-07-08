import React, { useState, useEffect } from "react";
import "../css/components.css";
import { useEmpleado } from "../context/empleadoContext";
import { useContrato } from "../context/contratoContext";
import { Toaster, toast } from "react-hot-toast";

const RegistroEmpleadoForm = ({ onClose, empleadoToEdit, cargos, contratos }) => {
    const [formData, setFormData] = useState({
        documento: "",
        nombre: "",
        estado: "ACTIVO",
        idCargo: "",
        fechaInicio: "",
        fechaFin: "",
        salario: "",
        tipoContrato: "",
    });
    const tcontratos = [
        "TERMINO INDEFINIDO",
        "TERMINO FIJO",
        "PERSTACION DE SERVICIOS"
    ];
    const [error, setError] = useState("");

    const { createEmpleado, getEmpleado } = useEmpleado();
    const { getContrato } = useContrato();

/*     useEffect(() => {
        if (empleadoToEdit) {
            setFormData({
                documento: empleadoToEdit.documento,
                nombre: empleadoToEdit.nombre,
                idCargo: empleadoToEdit.idCargo,
                fechaInicio: empleadoToEdit.fechaInicio,
                fechaFin: empleadoToEdit.fechaFin,
                salario: empleadoToEdit.salario,
                tipoContato: empleadoToEdit.tipoContato,

            });
        }
    }, [empleadoToEdit]);
 */
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
            await createEmpleado(formData);
            toast.success(<b>El empleado ha sido registrado correctamente.</b>);
/*             if (usuarioToEdit) {
                await updateUsuario(usuarioToEdit.idUsuario, formData);
                toast.success(<b>El usuario fue actualizado con éxito!</b>);
            } else {

            } */
            await getEmpleado();
            await getContrato();
            onClose();
        } catch (error) {
            setError(error.response.data.message);
            toast.error(`Error: ${error.response.data.message}`);
        }
    };

    return (
        <div className="w-full h-full">
            <Toaster />
            <div className="form-comp">
                <div className="header-comp">
                    <h1 className="title-comp">{empleadoToEdit ? "Actualizar Empleado" : "Registrar Empleado"}</h1>
                </div>  
                <div className="card-grid card-centered">
                    <h1 className="sub-titles-copm">Nuevo Empleado</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="grid-container">
                            <div className="input-container">
                                <input
                                    type="number"
                                    id="documento"
                                    name="documento"
                                    value={formData.documento}
                                    onChange={handleChange}
                                    required
                                    placeholder=" "
                                    autoComplete="off"
                                />
                                <label htmlFor="documento">Documento</label>
                            </div>
                            <div className="input-container">
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    placeholder=" "
                                    autoComplete="off"
                                />
                                <label htmlFor="nombre">Nombre</label>
                            </div>
                                <select
                                    id="idCargo"
                                    name="idCargo"
                                    value={formData.idCargo}
                                    onChange={handleChange}
                                    required
                                    placeholder=" "
                                >
                                    <option value="">Seleccionar Cargo</option>
                                    {cargos.map((c) => (
                                        <option key={c.idCargo} value={c.idCargo}>
                                            {c.nCargo}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="date"
                                    id="fechaInicio"
                                    name="fechaInicio"
                                    value={formData.fechaInicio}
                                    onChange={handleChange}
                                    required
                                    placeholder=" "
                                    autoComplete="off"
                                />
                                
                                <input
                                    type="date"
                                    id="fechaFin"
                                    name="fechaFin"
                                    value={formData.fechaFin}
                                    onChange={handleChange}
                                    required
                                    placeholder=" "
                                    autoComplete="off"
                                />
                                
                                <div className="input-container">
                                <input
                                    type="number"
                                    id="salario"
                                    name="salario"
                                    value={formData.salario}
                                    onChange={handleChange}
                                    required
                                    placeholder=" "
                                    autoComplete="off"
                                />
                                <label htmlFor="salario">Salario</label>
                            </div>
                            <select
                                    id="tipoContrato"
                                    name="tipoContrato"
                                    value={formData.tipoContrato}
                                    onChange={handleChange}
                                    required
                                    placeholder=" "
                                >
                                <option value="">
                                    Seleccionar Contrato
                                </option>
                                {tcontratos.map((modulo, index) => (
                                    <option key={index} value={modulo}>
                                        {modulo}
                                    </option>
                                ))}
                                </select>
                        </div>
                        <button type={empleadoToEdit ? "submit_2" : "submit_2"}>
                            {empleadoToEdit ? "Actualizar" : "Registrar"}
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

export default RegistroEmpleadoForm;

import React, { useState, useEffect } from "react";
import "../css/components.css";
import { useEmpleado } from "../context/empleadoContext";
import { useContrato } from "../context/contratoContext";
import { Toaster, toast } from "react-hot-toast";
import { format } from "date-fns";

const RegistroEmpleadoForm = ({ onClose, empleadoToEdit, cargos, isReadOnly }) => {
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

    const { createEmpleado, getEmpleado, updateEmpleado } = useEmpleado();
    const { getContrato } = useContrato();

    useEffect(() => {
        if (empleadoToEdit) {
            const contrato = empleadoToEdit.contrato || {};
            setFormData({
                documento: empleadoToEdit.documento,
                nombre: empleadoToEdit.nombre,
                idCargo: empleadoToEdit.idCargo,
                fechaInicio: contrato.fechaInicio ? format(new Date(contrato.fechaInicio), "yyyy-MM-dd") : "",
                fechaFin: contrato.fechaFin ? format(new Date(contrato.fechaFin), "yyyy-MM-dd") : "",
                salario: contrato.salario || "",
                tipoContrato: contrato.tipoContrato || "",
            });
        }
    }, [empleadoToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const validateDates = () => {
        const { fechaInicio, fechaFin } = formData;
        const startDate = new Date(fechaInicio);
        const endDate = new Date(fechaFin);
        const oneMonthLater = new Date(startDate);
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

        if (endDate <= startDate) {
            return <b>La fecha de fin no puede ser menor o igual a la fecha de inicio.</b>
        }
        if (endDate < oneMonthLater) {
            return <b>La fecha de fin debe ser al menos un mes después de la fecha de inicio.</b>
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dateError = validateDates();
        if (dateError) {
            setError(dateError);
            toast.error(dateError);
            return;
        }
        try {
            if (empleadoToEdit) {
                await updateEmpleado(empleadoToEdit.idEmpleado, {
                    nombre: formData.nombre,
                    idCargo: formData.idCargo,
                    detallesContrato: {
                        fechaInicio: formData.fechaInicio,
                        fechaFin: formData.fechaFin,
                        salario: formData.salario,
                        tipoContrato: formData.tipoContrato
                    }
                });
                toast.success(<b>El empleado fue actualizado con éxito!</b>);
            } else {
                await createEmpleado(formData);
                toast.success(<b>El empleado ha sido registrado correctamente.</b>);
            }
            await getEmpleado();
            await getContrato();
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
                                    disabled={isReadOnly}
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
                                    disabled={isReadOnly}
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
                                    disabled={isReadOnly}
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
                                    disabled={isReadOnly}
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
                                    disabled={isReadOnly}
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
                                    disabled={isReadOnly}
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
                                    disabled={isReadOnly}
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

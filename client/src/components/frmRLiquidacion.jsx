import React, { useState, useEffect } from "react";
import "../css/components.css";
import { useEmpleado } from "../context/empleadoContext";
import { useContrato } from "../context/contratoContext";
import { useDetalle } from "../context/detalleLiquidacionContext";
import { Toaster, toast } from "react-hot-toast";
import { format } from "date-fns";

const RegistroLiquidacionForm = ({ onClose, empleadoToEdit, cargos }) => {
    const [formData, setFormData] = useState({
        idEmpleado: "",
        diasTrabajados: "",
        horasExtras: ""
    });
    const tcontratos = [
        "TERMINO INDEFINIDO",
        "TERMINO FIJO",
        "PERSTACION DE SERVICIOS"
    ];
    const [error, setError] = useState("");
    const { createDetalle } = useDetalle();
    const { getEmpleado } = useEmpleado();
    const { getContrato } = useContrato();
    const { getDetalles } = useDetalle();

    useEffect(() => {
        if (empleadoToEdit) {
            setFormData({
                idEmpleado: empleadoToEdit.idEmpleado,
                diasTrabajados: "",
                horasExtras: ""
            });
        }
    }, [empleadoToEdit]);

    useEffect(() => {
        getEmpleado();
        getContrato();
    }, []);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const { diasTrabajados, horasExtras } = formData;
        if (diasTrabajados <= 0 || diasTrabajados > 30) {
             return <b>Los días trabajados deben ser mayores a 0 y menores o iguales a 30.</b>;
        }
        if (horasExtras < 0) {
            return <b>Las horas extras no pueden ser negativas.</b>
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dateError = validateForm();
        if (dateError) {
            setError(dateError);
            toast.error(dateError);
            return;
        }
        try {
            await createDetalle(formData);
            toast.success(<b>La liquidación ha sido registrada correctamente.</b>);
            getDetalles();
            onClose();
        } catch (error) {
            setError(error.message);
            toast.error(<b>Error: {error.response?.data?.message || error.message}</b>);
        }
    };

    return (
        <div className="w-full h-full">
            <Toaster />
            <div className="form-comp">
                <div className="header-comp">
                    <h1 className="title-comp">{empleadoToEdit ? "Liquidar Empleado" : "Registrar Empleado"}</h1>
                </div>
                <div className="card-grid card-centered">
                    <h1 className="sub-titles-copm">Empleado</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="grid-container">
                            <div className="input-container">
                                <input
                                    type="number"
                                    id="id"
                                    name="id"
                                    value={formData.idEmpleado}
                                    onChange={handleChange}
                                    required
                                    placeholder=" "
                                    autoComplete="off"
                                    readOnly
                                />
                                <label htmlFor="id">Codigo</label>
                            </div>
                            <div className="input-container">
                                <input
                                    type="number"
                                    id="documento"
                                    name="documento"
                                    value={empleadoToEdit ? empleadoToEdit.documento : ""}
                                    onChange={handleChange}
                                    required
                                    placeholder=" "
                                    autoComplete="off"
                                    readOnly
                                />
                                <label htmlFor="documento">Documento</label>
                            </div>
                            <div className="input-container">
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={empleadoToEdit ? empleadoToEdit.nombre : ""}
                                    onChange={handleChange}
                                    required
                                    placeholder=" "
                                    autoComplete="off"
                                    readOnly

                                />
                                <label htmlFor="nombre">Nombre</label>
                            </div>
                            <select
                                id="idCargo"
                                name="idCargo"
                                value={empleadoToEdit ? empleadoToEdit.idCargo : ""}
                                onChange={handleChange}
                                required
                                placeholder=" "
                                readOnly

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
                                value={empleadoToEdit ? format(new Date(empleadoToEdit.contrato.fechaInicio), "yyyy-MM-dd") : ""}
                                onChange={handleChange}
                                required
                                placeholder=" "
                                autoComplete="off"
                                readOnly

                            />

                            <input
                                type="date"
                                id="fechaFin"
                                name="fechaFin"
                                value={empleadoToEdit ? format(new Date(empleadoToEdit.contrato.fechaFin), "yyyy-MM-dd") : ""}
                                onChange={handleChange}
                                required
                                placeholder=" "
                                autoComplete="off"
                                readOnly

                            />

                            <div className="input-container">
                                <input
                                    type="number"
                                    id="salario"
                                    name="salario"
                                    value={empleadoToEdit ? empleadoToEdit.contrato.salario : ""}
                                    onChange={handleChange}
                                    required
                                    placeholder=" "
                                    autoComplete="off"
                                    readOnly

                                />
                                <label htmlFor="salario">Salario</label>
                            </div>
                            <select
                                id="tipoContrato"
                                name="tipoContrato"
                                value={empleadoToEdit ? empleadoToEdit.contrato.tipoContrato : ""}
                                onChange={handleChange}
                                required
                                placeholder=" "
                                readOnly

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

                            <div className="input-container">
                                <input
                                    type="number"
                                    id="diasTrabajados"
                                    name="diasTrabajados"
                                    value={formData.diasTrabajados}
                                    onChange={handleChange}
                                    required
                                    placeholder=" "
                                    autoComplete="off"
                                />
                                <label htmlFor="diasTrabajados">Días Trabajados</label>
                            </div>
                            <div className="input-container">
                                <input
                                    type="number"
                                    id="horasExtras"
                                    name="horasExtras"
                                    value={formData.horasExtras}
                                    onChange={handleChange}
                                    required
                                    placeholder=" "
                                    autoComplete="off"
                                />
                                <label htmlFor="horasExtras">Horas Extras</label>
                            </div>
                        </div>
                        <button type={empleadoToEdit ? "submit_2" : "submit_2"}>
                            {empleadoToEdit ? "Liquidar" : "Registrar"}
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

export default RegistroLiquidacionForm;

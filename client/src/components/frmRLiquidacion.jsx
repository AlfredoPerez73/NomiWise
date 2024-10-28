import React, { useState, useEffect } from "react";
import "../css/components.css";
import { useEmpleado } from "../context/empleadoContext";
import { useContrato } from "../context/contratoContext";
import { useDetalle } from "../context/detalleLiquidacionContext";
import { useNovedades } from "../context/novedadContext";
import { Toaster, toast } from "react-hot-toast";
import { format } from "date-fns";
import { getYear } from "date-fns";

const RegistroLiquidacionForm = ({ onClose, empleadoToEdit, cargos, parametros }) => {
    const [formData, setFormData] = useState({
        idEmpleado: "",
        diasTrabajados: "",
        horasExtras: "",
        idParametro: "",
        idNovedades: [],
        prestamos: 0,  // Campo para almacenar el monto del préstamo
        descuentos: 0  // Campo para almacenar el monto del descuento
    });
    const [selectedParametro, setSelectedParametro] = useState(null);
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
    const { novedades } = useNovedades();

    useEffect(() => {
        if (empleadoToEdit) {
            setFormData({
                idEmpleado: empleadoToEdit.idEmpleado,
                diasTrabajados: "",
                horasExtras: "",
                idParametro: "", // Se actualizará automáticamente
                idNovedades: [],
                prestamos: 0,
                descuentos: 0
            });
            fetchNovedadesEmpleado(empleadoToEdit.idEmpleado);
        }

        // Obtiene el parámetro correspondiente al año actual
        const year = getYear(new Date());
        const parametroDelAño = parametros.find(param => getYear(new Date(param.fechaRegistro)) === year);

        if (parametroDelAño) {
            setFormData(prevState => ({
                ...prevState,
                idParametro: parametroDelAño.idParametro // Asigna el id del parámetro encontrado
            }));
            setSelectedParametro(parametroDelAño); // Guarda el parámetro encontrado en el estado
        } else {
            setError("No se encontró un parámetro para el año actual");
            toast.error("No se encontró un parámetro para el año actual");
        }

    }, [empleadoToEdit, parametros]);

    const fetchNovedadesEmpleado = (idEmpleado) => {
        const novedadesEmpleado = novedades.filter(nov => nov.idEmpleado === idEmpleado);
        const totalPrestamos = novedadesEmpleado.reduce((acc, nov) => acc + parseFloat(nov.prestamos || 0), 0);
        const totalDescuentos = novedadesEmpleado.reduce((acc, nov) => acc + parseFloat(nov.descuentos || 0), 0);
        const idNovedades = novedadesEmpleado.map(nov => nov.idNovedad); // Extrae los IDs de las novedades

        setFormData(prevState => ({
            ...prevState,
            prestamos: totalPrestamos,
            descuentos: totalDescuentos,
            idNovedades // Almacena los IDs de las novedades en el formData
        }));
    };
    
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
                            <div className="input-container">
                                <input
                                    type="text"
                                    id="prestamos"
                                    name="prestamos"
                                    value={`$ ${formData.prestamos.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
                                    readOnly
                                    placeholder=" "
                                />
                                <label htmlFor="prestamos">Préstamos</label>
                            </div>

                            <div className="input-container">
                                <input
                                    type="text"
                                    id="descuentos"
                                    name="descuentos"
                                    value={`$ ${formData.descuentos.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
                                    readOnly
                                    placeholder=" "
                                />
                                <label htmlFor="descuentos">Descuentos</label>
                            </div>
                            {/* Mostrar detalles del parámetro seleccionado automáticamente */}
                            {selectedParametro && (
                                <>
                                    <div className="input-container">
                                        <input
                                            type="number"
                                            id="salarioMinimo"
                                            name="salarioMinimo"
                                            value={selectedParametro.salarioMinimo}
                                            readOnly
                                            placeholder=" "
                                        />
                                        <label htmlFor="salarioMinimo">Salario Mínimo</label>
                                    </div>

                                    <div className="input-container">
                                        <input
                                            type="number"
                                            id="salud"
                                            name="salud"
                                            value={selectedParametro.salud}
                                            readOnly
                                            placeholder=" "
                                        />
                                        <label htmlFor="salud">Salud (%)</label>
                                    </div>

                                    <div className="input-container">
                                        <input
                                            type="number"
                                            id="pension"
                                            name="pension"
                                            value={selectedParametro.pension}
                                            readOnly
                                            placeholder=" "
                                        />
                                        <label htmlFor="pension">Pensión (%)</label>
                                    </div>

                                    <div className="input-container">
                                        <input
                                            type="number"
                                            id="auxTransporte"
                                            name="auxTransporte"
                                            value={selectedParametro.auxTransporte}
                                            readOnly
                                            placeholder=" "
                                        />
                                        <label htmlFor="auxTransporte">Aux. Transporte</label>
                                    </div>
                                </>
                            )}

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

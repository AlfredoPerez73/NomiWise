import React, { useEffect, useState } from "react";
import "../css/components.css";
import toast, { Toaster } from "react-hot-toast";
import { useEmpleado } from "../context/empleadoContext";
import { useEval } from "../context/evalContext";
import { useCargo } from "../context/cargoContext";
import { useRol } from "../context/rolContext";
import { useAuth } from "../context/authContext";
import { useUsuario } from "../context/usuarioContext";
import { useContrato } from "../context/contratoContext";
import { format } from "date-fns";
import ReactPaginate from 'react-paginate';

const EvaluacionEmpleados = () => {
    const [filteredEmpleados, setFilteredEmpleados] = useState([]);
    const [filterValueCargo, setFilterValueCargo] = useState("");
    const [filterValueContrato, setFilterValueContrato] = useState("");
    const [filterValueEstado, setFilterValueEstado] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);
    const [empleadoToEvaluate, setEmpleadoToEvaluate] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [showAllEvaluations, setShowAllEvaluations] = useState(false);
    const [editEval, setEditEval] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage] = useState(10); // Cambia esto al número de elementos por página que desees

    const { usuario } = useAuth();
    const { usuarios } = useUsuario();
    const { roles } = useRol();
    const { getCargo, cargos } = useCargo();
    const { getContrato, contratos } = useContrato();
    const { getEmpleado, empleados } = useEmpleado();
    const { getEval, evals, createEval, updateEvals, deleteEval } = useEval();
    const sEstado = ["ACTIVO", "INACTIVO"];
    const tcontratos = ["TERMINO INDEFINIDO", "TERMINO FIJO", "PERSTACION DE SERVICIOS"];

    const handleCloseModal = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            setIsExiting(false);
            setSelectedEmpleado(null);
            setEmpleadoToEvaluate(null);
            setEditEval(null);
        }, 500);
    };

    const handleEvaluacionClose = () => {
        setIsFormOpen(false);
        setEditEval(null);
        setSelectedEmpleado(null);
        setEmpleadoToEvaluate(null);
    };

    const handleEvaluateEmpleado = (empleado) => {
        setSelectedEmpleado(empleado);
        setEmpleadoToEvaluate({
            idEmpleado: empleado.idEmpleado,
            idUsuario: usuario.idUsuario,
            productividad: 10,
            puntualidad: 10,
            trabajoEnEquipo: 10,
            adaptabilidad: 10,
            conocimientoTecnico: 10,
        });
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const evalData = {
            idEmpleado: selectedEmpleado.idEmpleado,
            idUsuario: empleadoToEvaluate.idUsuario,
            productividad: Math.round(empleadoToEvaluate.productividad),
            puntualidad: Math.round(empleadoToEvaluate.puntualidad),
            trabajoEnEquipo: Math.round(empleadoToEvaluate.trabajoEnEquipo),
            adaptabilidad: Math.round(empleadoToEvaluate.adaptabilidad),
            conocimientoTecnico: Math.round(empleadoToEvaluate.conocimientoTecnico)
        };
        try {
            if (editEval) {
                await updateEvals(editEval.idEvaluacion, evalData);
                toast.success(`Evaluación actualizada correctamente.`);
            } else {
                await createEval(evalData);
                toast.success(`Evaluación de ${selectedEmpleado.nombre} registrada correctamente.`);
            }
            getEval();
            handleEvaluacionClose();
        } catch (error) {
            toast.error(`Error al guardar la evaluación: ${error.message}`);
        }
    };


    const handleEditEvaluacion = (evaluacion) => {
        setEmpleadoToEvaluate(evaluacion);
        setEditEval(evaluacion); // Establecer la evaluación en edición
        setIsFormOpen(true);
    };

    const handleDeleteEvaluacion = async (idEvaluacion) => {
        try {
            await deleteEval(idEvaluacion);
            toast.success("Evaluación eliminada correctamente.");
            getEval(); // Recargar evaluaciones después de eliminar
            // Actualizar el estado local para reflejar la eliminación
            setEmpleadoToEvaluate(prevEvaluaciones =>
                prevEvaluaciones.filter(evaluacion => evaluacion.idEvaluacion !== idEvaluacion)
            );
        } catch (error) {
            toast.error(`Error al eliminar la evaluación: ${error.message}`);
        }
    };

    useEffect(() => {
        getEval();
        getEmpleado();
        getCargo();
        getContrato();
    }, []);

    const getEmpleadoInfo = (idEmpleado, empleados) => {
        return empleados.find((empleado) => empleado.idEmpleado === idEmpleado) || {};
    };

    const getContratoInfo = (idContrato) => {
        const contrato = contratos.find((c) => c.idContrato === idContrato) || {};
        return {
            tipoContrato: contrato.tipoContrato || "Desconocido",
            fechaInicio: contrato.fechaInicio ? format(new Date(contrato.fechaInicio), "dd/MM/yyyy") : "Desconocida",
            fechaFin: contrato.fechaFin ? format(new Date(contrato.fechaFin), "dd/MM/yyyy") : "Desconocida",
            salario: contrato.salario || "Desconocido",
        };
    };

    useEffect(() => {
        setFilteredEmpleados(empleados);
    }, [empleados]);

    useEffect(() => {
        applyFilters();
    }, [empleados, filterValueEstado]);

    const applyFilters = () => {
        const filtered = empleados.filter((n) => {
            const matchesEstado = filterValueEstado ? n.estado.toLowerCase() === filterValueEstado.toLowerCase() : true;
            return matchesEstado;
        });
        setFilteredEmpleados(filtered);
    };

    const handleFilterChangeCargo = (e) => {
        const query = e.target.value.toLowerCase();
        setFilterValueCargo(e.target.value);
        setFilteredEmpleados(
            empleados.filter((empleado) =>
                String(empleado.idCargo).toLowerCase().includes(query)
            )
        );
    };

    const handleFilterChangeContrato = (e) => {
        const query = e.target.value.toLowerCase();
        setFilterValueContrato(e.target.value);
        setFilteredEmpleados(
            empleados.filter((empleado) =>
                getContratoInfo(empleado.idContrato).tipoContrato.toLowerCase().includes(query)
            )
        );
    };

    const handleFilterChange = (e) => {
        const query = e.target.value.toLowerCase();
        setFilterValue(query);
        setFilteredEmpleados(
            empleados.filter((n) =>
                n.documento.toLowerCase().includes(query) ||
                n.nombre.toLowerCase().includes(query) ||
                getContratoInfo(n.idContrato).tipoContrato.toLowerCase().includes(query) ||
                getCargoName(n.idCargo).toLowerCase().includes(query) ||
                getContratoInfo(n.idContrato).salario.toLowerCase().includes(query)
            )
        );
    };

    const handleFilterChangeEstado = (e) => {
        setFilterValueEstado(e.target.value);
    };

    const formatFecha = (fecha) => {
        return format(new Date(fecha), "dd/MM/yyyy");
    };

    const getCargoName = (idCargo) => {
        const cargo = cargos.find((c) => c.idCargo === idCargo);
        return cargo ? cargo.nCargo : "Desconocido";
    };

    const getRolName = (idRol) => {
        const rol = roles.find((r) => r.idRol === idRol);
        return rol ? rol.nRol : "Desconocido";
    };

    const getUsuarioName = (idUsuario) => {
        const u = usuarios.find((c) => c.idUsuario === idUsuario);
        return u ? u.nombre : "Desconocido";
    };

    const handleRowClick = (empleado) => {
        setSelectedEmpleado(empleado);
        const evaluaciones = evals.filter((e) => e.idEmpleado === empleado.idEmpleado);
        setEmpleadoToEvaluate(evaluaciones);
        setIsVisible(true);
    };

    const toggleShowAllEvaluations = () => {
        setShowAllEvaluations(!showAllEvaluations);
    };

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const offset = currentPage * perPage;
    const currentEmpleados = filteredEmpleados.slice(offset, offset + perPage);
    const pageCount = Math.max(Math.ceil(filteredEmpleados.length / perPage), 1);

    return (
        <div className="w-full h-full">
            <Toaster />
            {isFormOpen ? (
                <form className="evaluation-form" onSubmit={handleFormSubmit}>
                    <h2>Evaluación de {selectedEmpleado.nombre}</h2>
                    <p className="form-description">Evalúa cada aspecto de desempeño deslizando el control a la puntuación deseada.</p>

                    {["productividad", "puntualidad", "trabajoEnEquipo", "adaptabilidad", "conocimientoTecnico"].map((metric) => (
                        <div key={metric} className="metric-card">
                            <label>{metric.charAt(0).toUpperCase() + metric.slice(1)}</label>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                step="1"
                                value={empleadoToEvaluate[metric]}
                                onChange={(e) => setEmpleadoToEvaluate({ ...empleadoToEvaluate, [metric]: e.target.value })}
                            />
                            <span className="metric-value">{empleadoToEvaluate[metric]}</span>
                        </div>
                    ))}

                    <button type="submit" className="submit-button">Evaluar</button>
                    <button type="button" className="close-button" onClick={handleEvaluacionClose}>Cerrar</button>

                </form>
            ) : (
                <div className="form-comp">
                    <div className="header-comp">
                        <h1 className="title-comp">Evaluación de Empleados</h1>
                    </div>
                    <div className="table-card-empleados">
                        <h1 className="sub-titles-copm">Empleados Registrados</h1>
                        <div className="search-bar">
                            <input
                                type="text"
                                id="empleado-filter"
                                name="empleado-filter"
                                placeholder="Filtrar empleados"
                                autoComplete="off"
                                value={filterValue}
                                onChange={handleFilterChange}
                            />
                            <select
                                id="cargo-filter"
                                name="cargo-filter"
                                value={filterValueCargo}
                                onChange={handleFilterChangeCargo}
                            >
                                <option value="">Seleccionar Cargo</option>
                                {cargos.map((cargo) => (
                                    <option key={cargo.idCargo} value={cargo.idCargo}>
                                        {cargo.nCargo}
                                    </option>
                                ))}
                            </select>
                            <select
                                id="contrato-filter"
                                name="contrato-filter"
                                value={filterValueContrato}
                                onChange={handleFilterChangeContrato}
                            >
                                <option value="">Seleccionar Contrato</option>
                                {tcontratos.map((modulo, index) => (
                                    <option key={index} value={modulo}>
                                        {modulo}
                                    </option>
                                ))}
                            </select>
                            <select
                                id="estado-filter"
                                name="estado-filter"
                                value={filterValueEstado}
                                onChange={handleFilterChangeEstado}
                            >
                                <option value="">Seleccionar Estado</option>
                                {sEstado.map((modulo, index) => (
                                    <option key={index} value={modulo}>
                                        {modulo}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Documento</th>
                                    <th>Empleado</th>
                                    <th>Cargo</th>
                                    <th>Contrato</th>
                                    <th>Fecha de Fin</th>
                                    <th>Estado</th>
                                    <th>Fecha de registro</th>
                                    {getRolName(usuario.idRol) !== "EMPLEADO USUARIO" && (
                                        <th>Acciones</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {currentEmpleados.map((val, key) => {
                                    const empleadoInfo = getEmpleadoInfo(val.idEmpleado, empleados);
                                    return (
                                        <tr key={val.idEmpleado} onClick={() => handleRowClick(empleadoInfo)}>
                                            <td>{val?.documento || "Desconocido"}</td>
                                            <td>{val?.nombre || "Desconocido"}</td>
                                            <td>{getCargoName(empleadoInfo?.idCargo)}</td>
                                            <td>{getContratoInfo(empleadoInfo?.idContrato).tipoContrato}</td>
                                            <td>{getContratoInfo(empleadoInfo?.idContrato).fechaFin}</td>
                                            <td>
                                                <span className={val?.estado === "ACTIVO" ? "estado-activo" : "estado-inactivo"}>
                                                    {val?.estado === "ACTIVO" ? (
                                                        <i className="fi fi-br-time-check icon-style-components"></i>
                                                    ) : (
                                                        <i className="fi fi-br-time-delete icon-style-components"></i>
                                                    )}
                                                </span>
                                            </td>
                                            <td>{formatFecha(val.fechaRegistro)}</td>
                                            <td>
                                                {getRolName(usuario.idRol) !== "EMPLEADO USUARIO" && (
                                                    <button
                                                        className="evaluate-button"
                                                        onClick={() => handleEvaluateEmpleado(empleadoInfo)}
                                                    >
                                                        <i className="fi fi-br-assessment icon-style-components"></i>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <ReactPaginate
                            previousLabel={<i className="fi fi-br-angle-double-small-left icon-style-pagination"></i>}
                            nextLabel={<i className="fi fi-br-angle-double-small-right icon-style-pagination"></i>}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"}
                            forcePage={Math.min(currentPage, pageCount - 1)}
                        />
                        {selectedEmpleado && (
                            <div className={`overlay ${isExiting ? "hidden" : "visible"}`} onClick={handleCloseModal}>
                                <div className={`detalle-liquidacion-card ${isExiting ? "exiting" : ""}`} onClick={(e) => e.stopPropagation()}>
                                    <h2>Información del Empleado</h2>
                                    <p><strong>Documento:</strong> {selectedEmpleado.documento}</p>
                                    <p><strong>Empleado:</strong> {selectedEmpleado.nombre}</p>
                                    <p><strong>Cargo:</strong> {getCargoName(selectedEmpleado.idCargo)}</p>
                                    <p><strong>Fecha de Inicio:</strong> {getContratoInfo(selectedEmpleado.idContrato).fechaInicio}</p>
                                    <p><strong>Fecha de Fin:</strong> {getContratoInfo(selectedEmpleado.idContrato).fechaFin}</p>
                                    <p><strong>Salario:</strong> {"$ " + Number(getContratoInfo(selectedEmpleado.idContrato).salario).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                    <p><strong>Contrato:</strong> {getContratoInfo(selectedEmpleado.idContrato).tipoContrato}</p>
                                    <p><strong>Estado:</strong>
                                        <span className={selectedEmpleado.estado === "ACTIVO" ? "estado-activo" : "estado-inactivo"}>
                                            {selectedEmpleado.estado === "ACTIVO" ? (
                                                <i className="fi fi-br-time-check icon-style-components"></i>
                                            ) : (
                                                <i className="fi fi-br-time-delete icon-style-components"></i>
                                            )}
                                        </span>
                                    </p>
                                    <h3>Evaluaciones</h3>
                                    {empleadoToEvaluate.length > 0 ? (
                                        <>
                                            <p><strong>Productividad:</strong> {empleadoToEvaluate.slice(0, 4).map(e => e.productividad).join(', ')}</p>
                                            <p><strong>Puntualidad:</strong> {empleadoToEvaluate.slice(0, 4).map(e => e.puntualidad).join(', ')}</p>
                                            <p><strong>Trabajo en Equipo:</strong> {empleadoToEvaluate.slice(0, 4).map(e => e.trabajoEnEquipo).join(', ')}</p>
                                            <p><strong>Adaptabilidad:</strong> {empleadoToEvaluate.slice(0, 4).map(e => e.adaptabilidad).join(', ')}</p>
                                            <p><strong>Conocimientos Técnicos:</strong> {empleadoToEvaluate.slice(0, 4).map(e => e.conocimientoTecnico).join(', ')}</p>
                                            <p><strong>Promedio de Evaluacion:</strong> {empleadoToEvaluate.slice(0, 4).map(e => e.promedioEval).join(', ')}</p>
                                            {empleadoToEvaluate.length === 1 && (
                                                <p><strong>Evaluador:</strong> {getUsuarioName(empleadoToEvaluate[0].idUsuario)}</p>
                                            )}
                                            {empleadoToEvaluate.length > 1 && (
                                                <button onClick={toggleShowAllEvaluations} className="ver-todas-evaluaciones-button">
                                                    {showAllEvaluations ? "Ver menos" : "Ver todas las evaluaciones"}
                                                </button>
                                            )}
                                            {showAllEvaluations && (
                                                <div className="todas-evaluaciones-card">
                                                    <h3>Todas las Evaluaciones</h3>
                                                    {empleadoToEvaluate.map((evals, index) => (
                                                        <div key={index} className="detalle-evaluacion-completa">
                                                            <p><strong>Productividad:</strong> {evals.productividad}</p>
                                                            <p><strong>Puntualidad:</strong> {evals.puntualidad}</p>
                                                            <p><strong>Trabajo en Equipo:</strong> {evals.trabajoEnEquipo}</p>
                                                            <p><strong>Adaptabilidad:</strong> {evals.adaptabilidad}</p>
                                                            <p><strong>Conocimientos Técnicos:</strong> {evals.conocimientoTecnico}</p>
                                                            <p><strong>Promedio de Evaluación:</strong> {evals.promedioEval}</p>
                                                            <p><strong>Fecha de registro:</strong> {formatFecha(evals.fechaRegistro)}</p>
                                                            <p><strong>Evaluador:</strong> {getUsuarioName(evals.idUsuario)}</p>
                                                            <button
                                                                className="edit-button-card"
                                                                onClick={(e) => { e.stopPropagation(); handleEditEvaluacion(evals); }}
                                                            >
                                                                <i className="fi fi-br-customize-edit icon-style-components"></i>
                                                            </button>
                                                            <button
                                                                className="delete-button-card"
                                                                onClick={(e) => { e.stopPropagation(); handleDeleteEvaluacion(evals.idEvaluacion); }}
                                                            >
                                                                <i className="fi fi-br-clear-alt icon-style-components"></i>
                                                            </button>
                                                            <p><strong></strong></p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p>No hay evaluaciones para este empleado.</p>
                                    )}
                                    <button className="cerrar-button" onClick={handleCloseModal}>Cerrar</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EvaluacionEmpleados;

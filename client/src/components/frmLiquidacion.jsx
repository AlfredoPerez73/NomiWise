import React, { useEffect, useState } from "react";
import "../css/components.css";
import toast, { Toaster } from "react-hot-toast";
import { useEmpleado } from "../context/empleadoContext";
import { useCargo } from "../context/cargoContext";
import { useContrato } from "../context/contratoContext";
import { useDetalle } from "../context/detalleLiquidacionContext"
import { format } from "date-fns";
import GuardarLiquidaciones from "./frmLiquidar";
import ReactPaginate from 'react-paginate';

const RegistroLiquidaciones = () => {
    const [editar, setEditar] = useState(false);
    const [filteredEmpleados, setFilteredEmpleados] = useState([]);
    const [filteredDetalle, setFilteredDetalle] = useState([]);
    const [filterValueCargo, setFilterValueCargo] = useState("");
    const [filterValueEstado, setFilterValueEstado] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [empleadoToEdit, setEmpleadoToEdit] = useState(null);
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);
    const [selectedDetalle, setSelectedDetalle] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage] = useState(10);

    const { getEmpleado, empleados } = useEmpleado();
    const { getCargo, cargos } = useCargo();
    const { getContrato, contratos } = useContrato();
    const { getDetalles, detalles } = useDetalle();
    const sEstado = ["ACTIVO", "INACTIVO"];

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEmpleadoToEdit(null);
    };

    useEffect(() => {
        getDetalles();
        getEmpleado();
        getCargo();
        getContrato();
    }, []);

    useEffect(() => {
        if (detalles) {
            setFilteredDetalle(detalles);
        }
    }, [detalles]);

    useEffect(() => {
        applyFilters();
    }, [empleados, filterValueEstado]);

    const applyFilters = () => {
        if (empleados) {
            const filtered = empleados.filter((n) => {
                const matchesEstado = filterValueEstado ? n.estado.toLowerCase() === filterValueEstado.toLowerCase() : true;
                return matchesEstado;
            });
            setFilteredEmpleados(filtered);
        }
    };

    const handleFilterChangeCargo = (e) => {
        const query = e.target.value.toLowerCase();
        setFilterValueCargo(e.target.value);
        if (empleados) {
            setFilteredEmpleados(
                empleados.filter((empleado) => String(empleado.idCargo).toLowerCase().includes(query))
            );
        }
    };

    const handleFilterChange = (e) => {
        const query = e.target.value.toLowerCase();
        setFilterValue(query);
        if (empleados) {
            setFilteredEmpleados(
                empleados.filter((n) =>
                    n.documento.toLowerCase().includes(query) ||
                    n.nombre.toLowerCase().includes(query) ||
                    getContratoTipo(n.idContrato).toLowerCase().includes(query) ||
                    getCargoName(n.idCargo).toLowerCase().includes(query) ||
                    getContratoSalario(n.idContrato).toLowerCase().includes(query)
                )
            );
        }
    };

    const handleFilterChangeEstado = (e) => {
        setFilterValueEstado(e.target.value);
    };

    const formatFecha = (fecha) => {
        return format(new Date(fecha), "dd/MM/yyyy");
    };

    const getEmpleadoInfo = (idEmpleado, empleados) => {
        return empleados.find((empleado) => empleado.idEmpleado === idEmpleado) || {};
    };

    const getCargoName = (idCargo) => {
        const cargo = cargos.find((c) => c.idCargo === idCargo);
        return cargo ? cargo.nCargo : "Desconocido";
    };

    const getContratoFechaInicio = (idContrato) => {
        const contrato = contratos.find((c) => c.idContrato === idContrato);
        return contrato ? format(new Date(contrato.fechaInicio), "dd/MM/yyyy") : "Desconocida";
    };

    const getContratoFechaFin = (idContrato) => {
        const contrato = contratos.find((c) => c.idContrato === idContrato);
        return contrato ? format(new Date(contrato.fechaFin), "dd/MM/yyyy") : "Desconocida";
    };

    const getContratoSalario = (idContrato) => {
        const contrato = contratos.find((c) => c.idContrato === idContrato);
        return contrato ? contrato.salario : "Desconocido";
    };

    const getContratoTipo = (idContrato) => {
        const contrato = contratos.find((c) => c.idContrato === idContrato);
        return contrato ? contrato.tipoContrato : "Desconocido";
    };

    const handleRowClick = (empleado) => {
        setSelectedEmpleado(empleado);
        const detallesEmpleado = detalles ? detalles.filter((detalle) => detalle.idEmpleado === empleado.idEmpleado) : [];
        setSelectedDetalle(detallesEmpleado);
        setIsVisible(true);
    };

    const handleCloseModal = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            setIsExiting(false);
            setSelectedEmpleado(null);
            setSelectedDetalle([]);
        }, 500);
    };

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const offset = currentPage * perPage;
    const currentDetalles = filteredDetalle ? filteredDetalle.slice(offset, offset + perPage) : [];
    const pageCount = filteredDetalle ? Math.max(Math.ceil(filteredDetalle.length / perPage), 1) : 1;

    return (
        <div className="w-full h-full">
            <Toaster />
            {isFormOpen ? (
                <GuardarLiquidaciones onClose={handleFormClose} empleadoToEdit={empleadoToEdit} cargos={cargos} />
            ) : (
                <div className="form-comp">
                    <div className="header-comp">
                        <h1 className="title-comp">Registro de Liquidaciones</h1>
                    </div>
                    <button type="button" className="open-modal-button" onClick={() => setIsFormOpen(true)}>Liquidacion</button>
                    <div className="table-card-empleados">
                        <h1 className="sub-titles-copm">Liquidaciones Registradas</h1>
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
                                <option value="">
                                    Seleccionar Cargo
                                </option>
                                {cargos.map((cargo) => (
                                    <option key={cargo.idCargo} value={cargo.idCargo}>
                                        {cargo.nCargo}
                                    </option>
                                ))}
                            </select>
                            <select
                                id="estado-filter"
                                name="estado-filter"
                                value={filterValueEstado}
                                onChange={handleFilterChangeEstado}
                            >
                                <option value="">
                                    Seleccionar Estado
                                </option>
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
                                    <th>Estado</th>
                                    <th>Cargo</th>
                                    <th>Contrato</th>
                                    <th>Fecha de Fin</th>
                                    <th>Fecha de Registro</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentDetalles.map((val, key) => {
                                    const empleadoInfo = getEmpleadoInfo(val.idEmpleado, empleados);
                                    return (
                                        <tr key={val.idDetalleLiquidacion} onClick={() => handleRowClick(empleadoInfo)}>
                                            <td>{empleadoInfo?.documento || "Desconocido"}</td>
                                            <td>{empleadoInfo?.nombre || "Desconocido"}</td>
                                            <td>
                                                <span className={empleadoInfo?.estado === "ACTIVO" ? "estado-activo" : "estado-inactivo"}>
                                                    {empleadoInfo?.estado === "ACTIVO" ? (
                                                        <i className="fi fi-br-time-check icon-style-components"></i>
                                                    ) : (
                                                        <i className="fi fi-br-time-delete icon-style-components"></i>
                                                    )}
                                                </span>
                                            </td>
                                            <td>{getCargoName(empleadoInfo?.idCargo)}</td>
                                            <td>{getContratoTipo(empleadoInfo?.idContrato)}</td>
                                            <td>{getContratoFechaFin(empleadoInfo?.idContrato)}</td>
                                            <td>{formatFecha(val.fechaRegistro)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <ReactPaginate
                            previousLabel={
                                <i className="fi fi-br-angle-double-small-left icon-style-pagination" ></i>
                            }
                            nextLabel={
                                <i className="fi fi-br-angle-double-small-right icon-style-pagination"></i>
                            }
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
                        {selectedDetalle.length > 0 && (
                            <div className={`overlay ${isExiting ? "hidden" : "visible"}`} onClick={handleCloseModal}>
                                <div className={`detalle-liquidacion-card ${isExiting ? "exiting" : ""}`} onClick={(e) => e.stopPropagation()}>
                                    <h2>Información del Empleado</h2>
                                    <p><strong>Documento:</strong> {selectedEmpleado.documento}</p>
                                    <p><strong>Empleado:</strong> {selectedEmpleado.nombre}</p>
                                    <p><strong>Cargo:</strong> {getCargoName(selectedEmpleado.idCargo)}</p>
                                    <p><strong>Fecha de Inicio:</strong> {getContratoFechaInicio(selectedEmpleado.idContrato)}</p>
                                    <p><strong>Fecha de Fin:</strong> {getContratoFechaFin(selectedEmpleado.idContrato)}</p>
                                    <p><strong>Salario:</strong> {"$ " + Number(getContratoSalario(selectedEmpleado.idContrato)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                    {selectedDetalle.map((detalle, index) => (
                                        <div key={index}>
                                            <p><strong>Año:</strong> {detalle.año}</p>
                                            <p><strong>Mes:</strong> {detalle.mes}</p>
                                            <p><strong>Dias Trabajados:</strong> {detalle.diasTrabajados}</p>
                                            <p><strong>Horas Extras:</strong> {detalle.horasExtras}</p>
                                            <p><strong>Salud:</strong> {"$ " + Number(detalle.salud).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                            <p><strong>Pension:</strong> {"$ " + Number(detalle.pension).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                            <p><strong>Aux. Transporte:</strong> {"$ " + Number(detalle.auxTransporte).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                            <p><strong>Bon. de servicios:</strong> {"$ " + Number(detalle.bonificacionServicio).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                            <p><strong>Aux. Alimentacion:</strong> {"$ " + Number(detalle.auxAlimentacion).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                            <p><strong>Prima de Navidad:</strong> {"$ " + Number(detalle.primaNavidad).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                            <p><strong>Vacaciones:</strong> {"$ " + Number(detalle.vacaciones).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                            <p><strong>Cesantias:</strong> {"$ " + Number(detalle.cesantias).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                            <p><strong>Int. Cesantias:</strong> {"$ " + Number(detalle.interesesCesantias).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                            <p><strong>Devengado:</strong> {"$ " + Number(detalle.devengado).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                        </div>
                                    ))}
                                    <p><strong>Contrato:</strong> {getContratoTipo(selectedEmpleado.idContrato)}</p>
                                    <p><strong>Estado:</strong>
                                        <span className={selectedEmpleado.estado === "ACTIVO" ? "estado-activo" : "estado-inactivo"}>
                                            {selectedEmpleado.estado === "ACTIVO" ? (
                                                <i className="fi fi-br-time-check icon-style-components"></i>
                                            ) : (
                                                <i className="fi fi-br-time-delete icon-style-components"></i>
                                            )}
                                        </span>
                                    </p>
                                    <p><strong>Fecha de registro:</strong> {formatFecha(selectedEmpleado.fechaRegistro)}</p>
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

export default RegistroLiquidaciones;

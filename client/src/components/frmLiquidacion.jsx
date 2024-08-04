import React, { useEffect, useState } from "react";
import "../css/components.css";
import toast, { Toaster } from "react-hot-toast";
import { useEmpleado } from "../context/empleadoContext";
import { useCargo } from "../context/cargoContext";
import { useContrato } from "../context/contratoContext";
import { useDetalle } from "../context/detalleLiquidacionContext"
import { format, startOfDay, endOfDay } from "date-fns";
import GuardarLiquidaciones from "./frmLiquidar";
import ReactPaginate from 'react-paginate';

const RegistroLiquidaciones = () => {
    const [filteredDetalle, setFilteredDetalle] = useState([]);
    const [filterValueCargo, setFilterValueCargo] = useState("");
    const [filterValueContrato, setFilterValueContrato] = useState("");
    const [filterValueEstado, setFilterValueEstado] = useState("");
    const [filterValueAño, setFilterValueAño] = useState("");
    const [filterValueMes, setFilterValueMes] = useState("");
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
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

    const uniqueYears = [...new Set(detalles.map(detalle => detalle.año))].sort();
    const uniqueMonths = [...new Set(detalles.map(detalle => detalle.mes))].sort((a, b) => a - b);

    const tcontratos = [
        "TERMINO INDEFINIDO",
        "TERMINO FIJO",
        "PERSTACION DE SERVICIOS"
    ];

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

    const clearFilters = () => {
        setFilterValueCargo("");
        setFilterValueContrato("");
        setFilterValueEstado("");
        setFilterValueAño("");
        setFilterValueMes("");
        setFechaInicio(null);
        setFechaFin(null);
        setFilterValue("");
        setFilteredDetalle(detalles);
    };

    useEffect(() => {
        if (detalles) {
            setFilteredDetalle(detalles);
        }
    }, [detalles]);

    useEffect(() => {
        setFilteredDetalle(
            detalles.filter((detalle) => {
                const fecha = new Date(detalle.fechaRegistro);
                const isWithinDateRange =
                    (!fechaInicio || fecha >= startOfDay(new Date(fechaInicio))) &&
                    (!fechaFin || fecha <= endOfDay(new Date(fechaFin)));
                return isWithinDateRange;
            })
        );
    }, [detalles, filterValue, fechaInicio, fechaFin]);


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
        applyFilters();
    }, [detalles, filterValueEstado, filterValueAño, filterValueMes]);

    const applyFilters = () => {
        if (detalles) {
            const filtered = detalles.filter((n) => {
                const empleadoInfo = getEmpleadoInfo(n.idEmpleado, empleados);
                const matchesEstado = filterValueEstado ? empleadoInfo.estado.toLowerCase() === filterValueEstado.toLowerCase() : true;
                const matchesAño = filterValueAño ? String(n.año).includes(filterValueAño) : true;
                const matchesMes = filterValueMes ? String(n.mes).includes(filterValueMes) : true;
                return matchesEstado && matchesAño && matchesMes;
            });
            setFilteredDetalle(filtered);
        }
    };

    const handleFilterChangeCargo = (e) => {
        const query = e.target.value.toLowerCase();
        setFilterValueCargo(e.target.value);
        if (detalles) {
            const filtered = detalles.filter((detalle) => {
                const empleado = getEmpleadoInfo(detalle.idEmpleado, empleados);
                return String(empleado.idCargo).toLowerCase().includes(query);
            });
            setFilteredDetalle(filtered);
        }
    };

    const handleFilterChangeContrato = (e) => {
        const query = e.target.value.toLowerCase();
        setFilterValueContrato(e.target.value);
        if (detalles) {
            const filtered = detalles.filter((detalle) => {
                const empleado = getEmpleadoInfo(detalle.idEmpleado, empleados);
                return getContratoInfo(empleado.idContrato).tipoContrato.toLowerCase().includes(query);
            });
            setFilteredDetalle(filtered);
        }
    };

    const handleFilterChangeAño = (e) => {
        setFilterValueAño(e.target.value);
    };

    const handleFilterChangeMes = (e) => {
        setFilterValueMes(e.target.value);
    };

    const handleFilterChange = (e) => {
        const query = e.target.value.toLowerCase();
        setFilterValue(e.target.value);
        if (detalles) {
            const filtered = detalles.filter((detalle) => {
                const empleado = getEmpleadoInfo(detalle.idEmpleado, empleados);
                return empleado.documento.toLowerCase().includes(query) ||
                    empleado.nombre.toLowerCase().includes(query) ||
                    getContratoInfo(empleado.idContrato).tipoContrato.toLowerCase().includes(query) ||
                    getCargoName(empleado.idCargo).toLowerCase().includes(query) ||
                    getContratoInfo(empleado.idContrato).salario.toLowerCase().includes(query)
            });
            setFilteredDetalle(filtered);
        }
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
                        <div className="search-bar-2">
                            <input
                                type="date"
                                id="fecha-inicio"
                                name="fecha-inicio"
                                placeholder="Fecha inicio"
                                autoComplete="off"
                                onChange={(e) =>
                                    setFechaInicio(e.target.value ? startOfDay(new Date(e.target.value)) : null)
                                }
                            />
                            <input
                                type="date"
                                id="fecha-fin"
                                name="fecha-fin"
                                placeholder="Fecha fin"
                                autoComplete="off"
                                onChange={(e) =>
                                    setFechaFin(e.target.value ? endOfDay(new Date(e.target.value)) : null)
                                }
                            />
                            <select
                                id="año-filter"
                                name="año-filter"
                                value={filterValueAño}
                                onChange={handleFilterChangeAño}
                            >
                                <option value="">
                                    Seleccionar el Año
                                </option>
                                {uniqueYears.map((año, index) => (
                                    <option key={index} value={año}>
                                        {año}
                                    </option>
                                ))}
                            </select>
                            <select
                                id="mes-filter"
                                name="mes-filter"
                                value={filterValueMes}
                                onChange={handleFilterChangeMes}
                            >
                                <option value="">
                                    Seleccionar el Mes
                                </option>
                                {uniqueMonths.map((mes, index) => (
                                    <option key={index} value={mes}>
                                        {mes}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                                id="contrato-filter"
                                name="contrato-filter"
                                value={filterValueContrato}
                                onChange={handleFilterChangeContrato}
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
                                            <td>{getContratoInfo(empleadoInfo?.idContrato).tipoContrato}</td>
                                            <td>{getContratoInfo(empleadoInfo?.idContrato).fechaFin}</td>
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
                                    <p><strong>Fecha de Inicio:</strong> {getContratoInfo(selectedEmpleado.idContrato).fechaInicio}</p>
                                    <p><strong>Fecha de Fin:</strong> {getContratoInfo(selectedEmpleado.idContrato).fechaInicio}</p>
                                    <p><strong>Salario:</strong> {"$ " + Number(getContratoInfo(selectedEmpleado.idContrato).salario).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
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
                                            <p><strong>Fecha de registro:</strong> {formatFecha(detalle.fechaRegistro)}</p>
                                        </div>
                                    ))}
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

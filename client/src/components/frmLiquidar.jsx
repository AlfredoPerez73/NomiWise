import React, { useEffect, useState } from "react";
import "../css/components.css";
import toast, { Toaster } from "react-hot-toast";
import { useEmpleado } from "../context/empleadoContext";
import { useCargo } from "../context/cargoContext";
import { useContrato } from "../context/contratoContext";
import { format } from "date-fns";
import RegistroEmpleadoForm from "./frmREmpleado";
import LiquidarEmpleadoForm from "./frmRLiquidacion";
import ReactPaginate from 'react-paginate';

const GuardarLiquidaciones = ({ onClose }) => {
    const [editar, setEditar] = useState(false);
    const [filteredEmpleados, setFilteredEmpleados] = useState([]);
    const [filterValueCargo, setFilterValueCargo] = useState("");
    const [filterValueEstado, setFilterValueEstado] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLiquidarFormOpen, setIsLiquidarFormOpen] = useState(false);
    const [empleadoToEdit, setEmpleadoToEdit] = useState(null);
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage] = useState(10); // Cambia esto al número de elementos por página que desees

    const { getEmpleado, empleados, deleteEmpleado } = useEmpleado();
    const { getCargo, cargos } = useCargo();
    const { getContrato, contratos } = useContrato();
    const sEstado = [
        "ACTIVO", 
        "INACTIVO"
    ];

    const handleDeleteEmpleado = (val) => {
        toast(
            (t) => (
                <div style={{ textAlign: "center", fontWeight: "bold" }}>
                    <p>¿Realmente desea eliminar a <strong>{val.nombre}</strong>?</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                        <button className="toast-button-confirmed" onClick={() => {
                            deleteEmpleado(val.idEmpleado)
                                .then(() => {
                                    toast.dismiss(t.id);
                                    toast.success(<b>El empleado {val.nombre} fue eliminado exitosamente!</b>);
                                    getEmpleado();
                                })
                                .catch((error) => {
                                    toast.error(<b>Error: {error.response.data.message}</b>);
                                });
                        }}>
                            Confirmar
                        </button>
                        <button className="toast-button-delete" onClick={() => toast.dismiss(t.id)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            ),
            {
                duration: 8000,
            }
        );
    };

    const setEmpleado = (val, showExtra = false) => {
        const contrato = contratos.find(c => c.idContrato === val.idContrato) || {};
        setEditar(true);
        setEmpleadoToEdit({
                ...val,
                contrato
            }
        );
        setIsFormOpen(true);
        setIsLiquidarFormOpen(showExtra);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEmpleadoToEdit(null);
    };

    useEffect(() => {
        getEmpleado();
        getCargo();
        getContrato();
    }, []);

    useEffect(() => {
        setFilteredEmpleados(empleados);
    }, [empleados]);

    useEffect(() => {
        applyFilters();
    }, [empleados, filterValueEstado]);

    const applyFilters = () => {
        const filtered = empleados.filter((n) => {
            const matchesEstado = filterValueEstado ? n.estado.toLowerCase() === filterValueEstado.toLowerCase() : true;

            return (
                matchesEstado
            );
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

    const handleFilterChange = (e) => {
        const query = e.target.value.toLowerCase();
        setFilterValue(query);
        setFilteredEmpleados(
            empleados.filter((n) =>
                n.documento.toLowerCase().includes(query) ||
                n.nombre.toLowerCase().includes(query) ||
                getContratoTipo(n.idContrato).toLowerCase().includes(query) ||
                getCargoName(n.idCargo).toLowerCase().includes(query) ||
                getContratoSalario(n.idContrato).toLowerCase().includes(query)
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
        setIsVisible(true);
    };

    const handleCloseModal = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            setIsExiting(false);
            setSelectedEmpleado(null);
        }, 500);
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
                isLiquidarFormOpen ? (
                    <LiquidarEmpleadoForm onClose={handleFormClose} empleadoToEdit={empleadoToEdit} cargos={cargos} />
                ) : (
                    <RegistroEmpleadoForm onClose={handleFormClose} empleadoToEdit={empleadoToEdit} cargos={cargos} isReadOnly={false} />
                )
            ) : (
                <div className="form-comp">
                    <div className="header-comp">
                        <h1 className="title-comp">Registro de Empleados</h1>
                    </div>
                    <button type="button" className="open-modal-button" onClick={onClose}>Cerrar</button>
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
                                    <th>Contato</th>
                                    <th>Fecha de Fin</th>
                                    <th>Fecha de registro</th>
                                    <th>Acciones</th>
                                    </tr>
                            </thead>
                            <tbody>
                                {currentEmpleados.map((val, key) => (
                                    <tr key={val.idEmpleado} onClick={() => handleRowClick(val)}>
                                        <td>{val.documento}</td>
                                        <td>{val.nombre}</td>
                                        <td>
                                            <span className={val.estado === "ACTIVO" ? "estado-activo" : "estado-inactivo"}>
                                                {val.estado === "ACTIVO" ? (
                                                    <i className="fi fi-br-time-check icon-style-components"></i>
                                                ) : (
                                                    <i className="fi fi-br-time-delete icon-style-components"></i>
                                                )}
                                            </span>
                                        </td>
                                        <td>{getCargoName(val.idCargo)}</td>
                                        <td>{getContratoTipo(val.idContrato)}</td>
                                        <td>{getContratoFechaFin(val.idContrato)}</td>
                                        <td>{formatFecha(val.fechaRegistro)}</td>
                                        <td>
                                            <button
                                                className="edit-button"
                                                onClick={(e) => { e.stopPropagation(); setEmpleado(val, false); }}
                                            >
                                                <i className="fi fi-br-customize-edit icon-style-components"></i>
                                            </button>
                                            <button
                                                className="delete-button"
                                                onClick={(e) => { e.stopPropagation(); handleDeleteEmpleado(val); }}
                                            >
                                                <i className="fi fi-br-clear-alt icon-style-components"></i>
                                            </button>
                                            <button
                                                className="liquidar-button"
                                                onClick={(e) => { e.stopPropagation(); setEmpleado(val, true); }}
                                            >
                                                <i className="fi fi-br-usd-circle icon-style-components"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
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
                        {selectedEmpleado && (
                            <div className={`overlay ${isExiting ? "hidden" : "visible"}`} onClick={handleCloseModal}>
                                <div className={`detalle-empleado-card ${isExiting ? "exiting" : ""}`} onClick={(e) => e.stopPropagation()}>
                                    <h2>Información del Empleado</h2>
                                    <p><strong>Documento:</strong> {selectedEmpleado.documento}</p>
                                    <p><strong>Empleado:</strong> {selectedEmpleado.nombre}</p>
                                    <p><strong>Cargo:</strong> {getCargoName(selectedEmpleado.idCargo)}</p>
                                    <p><strong>Fecha de Inicio:</strong> {getContratoFechaInicio(selectedEmpleado.idContrato)}</p>
                                    <p><strong>Fecha de Fin:</strong> {getContratoFechaFin(selectedEmpleado.idContrato)}</p>
                                    <p><strong>Salario:</strong> {"$ " + Number(getContratoSalario(selectedEmpleado.idContrato)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
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

export default GuardarLiquidaciones;

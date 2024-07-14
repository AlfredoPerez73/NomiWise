import React, { useEffect, useState } from "react";
import "../css/components.css";
import { useNomina } from "../context/nominaContext";
import { format, startOfDay, endOfDay } from "date-fns";
import ReactPaginate from 'react-paginate';

const Nomina = () => {
    const [filteredNomina, setFilteredNomina] = useState([]);
    const [filterValueAño, setFilterValueAño] = useState("");
    const [filterValueMes, setFilterValueMes] = useState("");
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const [filterValue, setFilterValue] = useState("");
    const [selectedNomina, setSelectedNomina] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage] = useState(10);

    const { getNominas, nominas } = useNomina();

    const uniqueYears = [...new Set(nominas.map(nomina => nomina.año))].sort();
    const uniqueMonths = [...new Set(nominas.map(nomina => nomina.mes))].sort((a, b) => a - b);

    useEffect(() => {
        getNominas();
    }, []);

    useEffect(() => {
        if (nominas) {
            setFilteredNomina(nominas);
        }
    }, [nominas]);

    useEffect(() => {
        setFilteredNomina(
            nominas.filter((nomina) => {
                const fecha = new Date(nomina.fechaRegistro);
                const isWithinDateRange =
                    (!fechaInicio || fecha >= startOfDay(fechaInicio)) &&
                    (!fechaFin || fecha <= endOfDay(fechaFin));
                return isWithinDateRange;
            })
        );
    }, [nominas, filterValue, fechaInicio, fechaFin]);

    useEffect(() => {
        applyFilters();
    }, [nominas, filterValueAño, filterValueMes]);

    const applyFilters = () => {
        if (nominas) {
            const filtered = nominas.filter((n) => {
                const matchesAño = filterValueAño ? String(n.año).includes(filterValueAño) : true;
                const matchesMes = filterValueMes ? String(n.mes).includes(filterValueMes) : true;
                return matchesAño && matchesMes;
            });
            setFilteredNomina(filtered);
        }
    };

    const handleFilterChangeAño = (e) => {
        setFilterValueAño(e.target.value);
    };

    const handleFilterChangeMes = (e) => {
        setFilterValueMes(e.target.value);
    };

    const formatFecha = (fecha) => {
        return format(new Date(fecha), "dd/MM/yyyy");
    };

    const handleCloseModal = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            setIsExiting(false);
            setSelectedNomina(null);
        }, 500);
    };

    const handleRowClick = (nomina) => {
        setSelectedNomina(nomina);
        setIsVisible(true);
    };

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const offset = currentPage * perPage;
    const currentDetalles = filteredNomina ? filteredNomina.slice(offset, offset + perPage) : [];
    const pageCount = filteredNomina ? Math.max(Math.ceil(filteredNomina.length / perPage), 1) : 1;

    return (
        <div className="w-full h-full">
                <div className="form-comp">
                    <div className="header-comp">
                        <h1 className="title-comp">Registro de Nomina</h1>
                    </div>
                    <div className="table-card-empleados">
                        <h1 className="sub-titles-copm">Nominas Registradas</h1>
                        <div className="search-bar">
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
                        <table>
                            <thead>
                                <tr>
                                    <th>Año</th>
                                    <th>Mes</th>
                                    <th>Total del mes</th>
                                    <th>Fecha de Registro</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentDetalles.map((val, key) => {
                                    return (
                                        <tr key={val.idLiquidacion} onClick={() => handleRowClick(val)}>
                                            <td>{val?.año}</td>
                                            <td>{val?.mes}</td>
                                            <td>{"$ " + Number(val.total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
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
                        {selectedNomina && (
                            <div className={`overlay ${isExiting ? "hidden" : "visible"}`} onClick={handleCloseModal}>
                                <div className={`detalle-nomina-card ${isExiting ? "exiting" : ""}`} onClick={(e) => e.stopPropagation()}>
                                    <h2>Información de Nomina</h2>
                                    <p><strong>Año:</strong> {selectedNomina.año}</p>
                                    <p><strong>Mes:</strong> {selectedNomina.mes}</p>
                                    <p><strong>Salario Total:</strong> {"$ " + Number(selectedNomina.salarioTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                    <p><strong>Salud Total:</strong> {"$ " + Number(selectedNomina.saludTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                    <p><strong>Pension Total:</strong> {"$ " + Number(selectedNomina.pensionTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                    <p><strong>Aux. transporte Total:</strong> {"$ " + Number(selectedNomina.auxTransporteTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                    <p><strong>Bonificacion Servicios Total:</strong> {"$ " + Number(selectedNomina.bonificacionServicioTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                    <p><strong>Aux. Alimentacion Total:</strong> {"$ " + Number(selectedNomina.auxAlimentacionTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                    <p><strong>Prima de Navidad Total:</strong> {"$ " + Number(selectedNomina.primaNavidadTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                    <p><strong>Vacaciones:</strong> {"$ " + Number(selectedNomina.vacacionesTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                    <p><strong>Cesantias:</strong> {"$ " + Number(selectedNomina.cesantiasTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                    <p><strong>Intereses de Cesantias:</strong> {"$ " + Number(selectedNomina.interesesCesantiasTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                    <p><strong>Total del mes:</strong> {"$ " + Number(selectedNomina.total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                    <p><strong>Fecha de registro:</strong> {formatFecha(selectedNomina.fechaRegistro)}</p>
                                    <button className="cerrar-button" onClick={handleCloseModal}>Cerrar</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
        </div>
    );
};

export default Nomina;

import React, { useEffect, useState } from "react";
import "../css/components.css";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/authContext";
import { useEmpleado } from "../context/empleadoContext";
import { useCargo } from "../context/cargoContext";
import { useContrato } from "../context/contratoContext";
import { useDetalle } from "../context/detalleLiquidacionContext"
import { format, startOfDay, endOfDay } from "date-fns";
import GuardarLiquidaciones from "./frmLiquidar";
import ReactPaginate from 'react-paginate';
import jsPDF from "jspdf";
import "jspdf-autotable";

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
    const [selectedDetalle, setSelectedDetalle] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage] = useState(10);

    const { usuario } = useAuth();
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

    const userName = usuario ? usuario.nombre : "Desconocido";

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

    const formatFecha2 = (date) => {
        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    };

    const getCargoName = (idCargo) => {
        const cargo = cargos.find((c) => c.idCargo === idCargo);
        return cargo ? cargo.nCargo : "Desconocido";
    };

    const handleRowClick = (empleado, val) => {
        setSelectedEmpleado(empleado);
        setSelectedDetalle(val);
        setIsVisible(true);
    };

    const handleCloseModal = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            setIsExiting(false);
            setSelectedEmpleado(null);
            setSelectedDetalle(null);
        }, 500);
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Encabezado
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(15);
        doc.text("Liquidacion #203483", 14, 15);
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8);
        doc.text(formatFecha2(new Date()), 14, 19);

        // Logo y nombre de la compañía
        doc.setFontSize(10);
        doc.setFont("Helvetica", "bold");
        doc.text("OneDoc, Inc.", 175.5, 28);
        doc.setFont("Helvetica", "normal");
        doc.text("1600 Valledupar Cesar VVCC,", 150, 33);
        doc.text("Bogota,", 185.5, 38);
        doc.text("DC 20001", 182, 43);
        doc.text("La Gran Colombia Unida", 159, 48);
        doc.setDrawColor(207, 207, 207);
        doc.setLineWidth(0.4);
        doc.line(15, 54, 195, 54);
        // Datos del cliente
        doc.setFontSize(10);
        doc.setFont("Helvetica", "bold");
        doc.text("Reporde de Liquidacion:", 14, 60);
        doc.setFont("Helvetica", "normal");
        doc.text("NomiWise", 14, 65);
        doc.text("Valledupar 20001,", 14, 70);
        doc.text("Departamento del Cesar,", 14, 75);
        doc.text("La Gran Colombia Unida", 14, 80);
        doc.setDrawColor(207, 207, 207);
        doc.setLineWidth(0.4);
        doc.line(15, 86, 195, 86);
        // Descripción de los ítems
        doc.setFontSize(10);
        doc.text("En este PDF se tratara de presentar un reporte de todas las liquidaciones de un Empleado,", 14, 93);
        doc.text("Teniendo en cuenta como datos importantes su salario final y contratos.", 14, 98);

        // Tabla
        const tableColumn = ["Documento", "Empleado", "Devengado", "Cargo", "Contrato", "Fecha de Fin"];
        const tableRows = [];
    
        // Puedes personalizar estos datos como lo desees
        const items = detalles.map((detalle) => {
            const empleadoInfo = getEmpleadoInfo(detalle.idEmpleado, empleados);
        
            // Dividir el nombre completo en partes
            const nombreCompleto = empleadoInfo.nombre;
            const partesNombre = nombreCompleto.split(' ');
        
            // Extraer el primer nombre y el primer apellido
            const primerNombre = partesNombre[0] || '';
            const primerApellido = partesNombre[2] || '';
        
            // Formar el nombre final
            const nombreFormateado = `${primerNombre} ${primerApellido}`;
        
            return [
                empleadoInfo.documento,
                nombreFormateado,
                "$ " + Number(detalle?.devengado).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                getCargoName(empleadoInfo?.idCargo),
                getContratoInfo(empleadoInfo?.idContrato).tipoContrato,
                getContratoInfo(empleadoInfo?.idContrato).fechaFin,
            ];
        });
    
        items.forEach(item => {
            tableRows.push(item);
        });
    
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 105,
            theme: 'plain',
            headStyles: { fillColor: [245, 245, 245] },
            styles: { 
                cellPadding: 1, 
                fontSize: 8,
                overflow: 'linebreak',
                cellWidth: 'wrap'
            },
            columnStyles: {
                0: { cellWidth: 20 },  // Documento
                1: { cellWidth: 30 },  // Empleado
                3: { cellWidth: 50 },  // Devengado
                4: { cellWidth: 50 },  // Cargo
                5: { cellWidth: 40 },  // Contrato
                6: { cellWidth: 25 },  // Fecha de Fin
            }
        });

        // Nota final
        // Definir el color de fondo del rectángulo
        doc.setFillColor(215, 234, 255);

        // Definir el color del texto
        doc.setTextColor(0, 0, 0); // Color negro para el texto
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(10);

        // Coordenadas x, y de la esquina superior izquierda del rectángulo
        const x = 14;
        const y = doc.lastAutoTable.finalY + 20;
        const width = 182;
        const height = 10;
        const radius = 2.5; // Radio para las esquinas redondeadas

        // Dibujar un rectángulo con esquinas redondeadas
        doc.roundedRect(x, y, width, height, radius, radius, 'F');

        // Agregar texto dentro del panel
        doc.setTextColor(44, 104, 172);
        doc.text("Este PDF fue generado por: " + userName, x + 5, y + 6);

        // Pie de página
        doc.setTextColor(0, 0, 0);
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8);
        doc.text("1. Este Reporte no incluye los detalle de liquidacion.", 14, doc.lastAutoTable.finalY + 40);
        doc.setDrawColor(207, 207, 207);
        doc.setLineWidth(0.4);
        doc.line(15, doc.lastAutoTable.finalY + 45, 195, doc.lastAutoTable.finalY + 45);
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(179, 179, 179);
        doc.setFontSize(8);
        doc.text("Reporte de Liquidacion #203483", 14, doc.lastAutoTable.finalY + 55);
        // Guardar el PDF
        doc.save(`reporte_liquidaciones_${new Date().toLocaleDateString()}.pdf`);
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
                    <div className="button-container">
                        <button type="button" className="open-modal-button" onClick={() => setIsFormOpen(true)}>Liquidacion</button>
                    </div>
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
                                    <th>Devengado</th>
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
                                        <tr key={val.idDetalleLiquidacion} onClick={() => handleRowClick(empleadoInfo, val)}>
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
                                            <td>{"$ " + Number(val?.devengado).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
                                            <td>{getCargoName(empleadoInfo?.idCargo)}</td>
                                            <td>{getContratoInfo(empleadoInfo?.idContrato).tipoContrato}</td>
                                            <td>{getContratoInfo(empleadoInfo?.idContrato).fechaFin}</td>
                                            <td>{formatFecha(val.fechaRegistro)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className="button-container">
                            <button type="button" className="open-PDF-button" onClick={generatePDF}>
                                <i class="fi fi-rr-file-medical-alt icon-style-pdf"></i>
                            </button>
                        </div>
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
                        {selectedDetalle && (
                            <div className={`overlay ${isExiting ? "hidden" : "visible"}`} onClick={handleCloseModal}>
                                <div className={`detalle-liquidacion-card ${isExiting ? "exiting" : ""}`} onClick={(e) => e.stopPropagation()}>
                                    <h2>Información del Empleado</h2>
                                    <p><strong>Documento:</strong> {selectedEmpleado.documento}</p>
                                    <p><strong>Empleado:</strong> {selectedEmpleado.nombre}</p>
                                    <p><strong>Cargo:</strong> {getCargoName(selectedEmpleado.idCargo)}</p>
                                    <p><strong>Fecha de Inicio:</strong> {getContratoInfo(selectedEmpleado.idContrato).fechaInicio}</p>
                                    <p><strong>Fecha de Fin:</strong> {getContratoInfo(selectedEmpleado.idContrato).fechaFin}</p>
                                    <p><strong>Salario:</strong> {"$ " + Number(getContratoInfo(selectedEmpleado.idContrato).salario).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                    <div>
                                        <p><strong>Año:</strong> {selectedDetalle.año}</p>
                                        <p><strong>Mes:</strong> {selectedDetalle.mes}</p>
                                        <p><strong>Dias Trabajados:</strong> {selectedDetalle.diasTrabajados}</p>
                                        <p><strong>Horas Extras:</strong> {selectedDetalle.horasExtras}</p>
                                        <p><strong>Salud:</strong> {"$ " + Number(selectedDetalle.salud).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                        <p><strong>Pension:</strong> {"$ " + Number(selectedDetalle.pension).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                        <p><strong>Aux. Transporte:</strong> {"$ " + Number(selectedDetalle.auxTransporte).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                        <p><strong>Bon. de servicios:</strong> {"$ " + Number(selectedDetalle.bonificacionServicio).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                        <p><strong>Aux. Alimentacion:</strong> {"$ " + Number(selectedDetalle.auxAlimentacion).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                        <p><strong>Prima de Navidad:</strong> {"$ " + Number(selectedDetalle.primaNavidad).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                        <p><strong>Vacaciones:</strong> {"$ " + Number(selectedDetalle.vacaciones).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                        <p><strong>Cesantias:</strong> {"$ " + Number(selectedDetalle.cesantias).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                        <p><strong>Int. Cesantias:</strong> {"$ " + Number(selectedDetalle.interesesCesantias).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                        <p><strong>Devengado:</strong> {"$ " + Number(selectedDetalle.devengado).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                                        <p><strong>Fecha de registro:</strong> {formatFecha(selectedDetalle.fechaRegistro)}</p>
                                    </div>
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
                                    <div className="button-container">
                                        <button type="button" className="open-PDF-button-2" onClick={generatePDF}>
                                            <i class="fi fi-rr-file-medical-alt icon-style-pdf"></i>
                                        </button>
                                    </div>
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

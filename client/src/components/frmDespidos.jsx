import React, { useEffect, useState } from "react";
import "../css/components.css";
import toast, { Toaster } from "react-hot-toast";
import { useEmpleado } from "../context/empleadoContext";
import { useCargo } from "../context/cargoContext";
import { useContrato } from "../context/contratoContext";
import { useDetalle } from "../context/detalleLiquidacionContext"
import { useAuth } from "../context/authContext";
import { format } from "date-fns";
import ReactPaginate from 'react-paginate';
import logo from '../assets/logoPDF.png'
import jsPDF from "jspdf";
import "jspdf-autotable";

const RegistroEmpleados = () => {
    const [formData, setFormData] = useState({
        estado: "ACTIVO"
    });
    const [filteredEmpleados, setFilteredEmpleados] = useState([]);
    const [filterValueCargo, setFilterValueCargo] = useState("");
    const [filterValueContrato, setFilterValueContrato] = useState("");
    const [filterValueEstado, setFilterValueEstado] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage] = useState(10); // Cambia esto al número de elementos por página que desees

    const { usuario } = useAuth();
    const { getCargo, cargos } = useCargo();
    const { detalles } = useDetalle();
    const { getContrato, contratos } = useContrato();
    const { getEmpleado, empleados, updateEmpleado } = useEmpleado();
    const sEstado = [
        "ACTIVO",
        "INACTIVO"
    ];
    const tcontratos = [
        "TERMINO INDEFINIDO",
        "TERMINO FIJO",
        "PERSTACION DE SERVICIOS"
    ];

    const userName = usuario ? usuario.nombre : "Desconocido";

    const handleEstadoUpdate = async (empleado) => {
        if (!empleado) {
            toast.error(<b>Error: No se ha seleccionado un empleado para actualizar.</b>);
            return;
        }

        // Verificar si el empleado ya está en estado "INACTIVO"
        if (empleado.estado === "INACTIVO") {
            toast.error(<b>Error: El empleado ya está despedido.</b>);
            return; // Evitar el despido nuevamente
        }

        try {
            // Buscar en la lista `detalles` si el empleado tiene una liquidación
            // Obtener el mes y año actuales
            const fechaActual = new Date();
            const mesActual = fechaActual.getMonth();
            const añoActual = fechaActual.getFullYear();

            // Buscar en la lista `detalles` si el empleado tiene una liquidación del mes y año actuales
            const tieneLiquidacionMesActual = detalles.some((detalle) => {
                const fechaLiquidacion = new Date(detalle.fechaRegistro); // Suponiendo que `fechaLiquidacion` es el campo de fecha en `detalles`
                return (
                    detalle.idEmpleado === empleado.idEmpleado &&
                    fechaLiquidacion.getMonth() === mesActual &&
                    fechaLiquidacion.getFullYear() === añoActual
                );
            });

            if (!tieneLiquidacionMesActual) {
                toast.error(<b>Error: No se puede despedir al empleado sin haberlo liquidado para el mes actual.</b>);
                return; // No permitir el despido
            }

            // Si se ha liquidado, continuar con el cambio de estado
            const nuevoEstado = "INACTIVO";
            const contrato = contratos.find((c) => c.idContrato === empleado.idContrato);

            if (!contrato) {
                toast.error(<b>Error: No se encontró el contrato asociado al empleado.</b>);
                return;
            }

            const detallesContrato = {
                fechaInicio: contrato.fechaInicio,
                fechaFin: nuevoEstado === "INACTIVO" ? new Date() : contrato.fechaFin,
                salario: contrato.salario,
                tipoContrato: contrato.tipoContrato
            };

            const datosParaActualizar = {
                idUsuario: empleado.idUsuario,
                nombre: empleado.nombre,
                idCargo: empleado.idCargo,
                detallesContrato,
                estado: nuevoEstado
            };

            await updateEmpleado(empleado.idEmpleado, datosParaActualizar);

            setFilteredEmpleados((prevEmpleados) =>
                prevEmpleados.map((emp) =>
                    emp.idEmpleado === empleado.idEmpleado ? { ...emp, estado: nuevoEstado } : emp
                )
            );

            toast.success(<b>El estado del empleado ha sido cambiado a {nuevoEstado} correctamente.</b>);

        } catch (error) {
            console.log("Error al actualizar el estado del empleado:", error);
            toast.error(<b>Error al actualizar el estado: {error.response?.data?.message || error.message}</b>);
        }
    };

    useEffect(() => {
        getEmpleado();
        getCargo();
        getContrato();
    }, []);

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

    function generarCodigoAleatorio() {
        // Generar un número aleatorio entre 100000 y 999999
        const codigo = Math.floor(100000 + Math.random() * 900000);
        return codigo.toString();
    }

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setProperties({
            title: `Reporte_Empleados_${new Date().toLocaleDateString()}`,
        });
        const codigoLiquidacion = generarCodigoAleatorio();
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(15);
        doc.text(`Reporte #${codigoLiquidacion}`, 14, 15);
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8);
        doc.text(formatFecha2(new Date()), 14, 19);

        const img = new Image();
        img.src = logo;

        img.onload = function () {
            doc.addImage(img, 'PNG', 151.5, 1, 50, 50);

            doc.setFontSize(9);
            doc.setFont("Helvetica", "bold");
            doc.text("OneDoc, Inc.", 175.5, 33);
            doc.setFont("Helvetica", "normal");
            doc.text("1600 Valledupar Cesar VVCC,", 153, 38);
            doc.text("Bogota,", 185.5, 43);
            doc.text("DC 20001", 182, 48);
            doc.text("La Gran Colombia Unida", 161, 53);
            doc.setDrawColor(207, 207, 207);
            doc.setLineWidth(0.4);
            doc.line(15, 59, 195, 59);
            doc.setFontSize(9);
            doc.setFont("Helvetica", "bold");
            doc.text("Reporde de Empleados:", 14, 65);
            doc.setFont("Helvetica", "normal");
            doc.text("NomiWise", 14, 70);
            doc.text("Valledupar 20001,", 14, 75);
            doc.text("Departamento del Cesar,", 14, 80);
            doc.text("La Gran Colombia Unida", 14, 85);
            doc.setDrawColor(207, 207, 207);
            doc.setLineWidth(0.4);
            doc.line(15, 91, 195, 91);
            doc.setFontSize(9);
            doc.text("En este PDF se tratara de presentar un reporte de todas la info de un Empleado,", 14, 98);
            doc.text("Teniendo en cuenta como datos importantes su salario base y contratos.", 14, 103);

            // Cambia detalles por filteredDetalle
            const tableColumn = ["Documento", "Empleado", "Devengado", "Cargo", "Contrato", "Fecha de Fin"];
            const tableRows = [];

            // Usar los datos filtrados (filteredDetalle) que se muestran en la tabla
            const items = filteredEmpleados.map((detalle) => {

                const nombreCompleto = detalle.nombre;
                const partesNombre = nombreCompleto.split(' ');

                const primerNombre = partesNombre[0] || '';
                const primerApellido = partesNombre[2] || '';

                const nombreFormateado = `${primerNombre} ${primerApellido}`;

                return [
                    detalle.documento,
                    nombreFormateado,
                    "$ " + Number(getContratoInfo(detalle.idContrato).salario).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                    getCargoName(detalle?.idCargo),
                    getContratoInfo(detalle?.idContrato).tipoContrato,
                    getContratoInfo(detalle?.idContrato).fechaFin,
                ];
            });

            items.forEach(item => {
                tableRows.push(item);
            });

            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 110,
                theme: 'plain',
                headStyles: { fillColor: [245, 245, 245] },
                styles: {
                    cellPadding: 1,
                    fontSize: 7,
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

            doc.setFillColor(215, 234, 255);

            doc.setTextColor(0, 0, 0);
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(9);

            const x = 14;
            const y = doc.lastAutoTable.finalY + 20;
            const width = 182;
            const height = 10;
            const radius = 2.5;

            doc.roundedRect(x, y, width, height, radius, radius, 'F');

            doc.setTextColor(44, 104, 172);
            doc.text("Este PDF fue generado por: " + userName, x + 5, y + 6);

            doc.setTextColor(0, 0, 0);
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(8);
            doc.text("1. Este Reporte no incluye los detalle de liquidacion.", 14, doc.lastAutoTable.finalY + 45);
            doc.setDrawColor(207, 207, 207);
            doc.setLineWidth(0.4);
            doc.line(15, doc.lastAutoTable.finalY + 50, 195, doc.lastAutoTable.finalY + 50);
            doc.setFont("Helvetica", "normal");
            doc.setTextColor(179, 179, 179);
            doc.setFontSize(8);
            doc.text(`Reporte de Empleados #${codigoLiquidacion}`, 14, doc.lastAutoTable.finalY + 60);
            doc.autoPrint();
            doc.output('dataurlnewwindow');
        };
    };

    const offset = currentPage * perPage;
    const currentEmpleados = filteredEmpleados.slice(offset, offset + perPage);
    const pageCount = Math.max(Math.ceil(filteredEmpleados.length / perPage), 1);

    return (
        <div className="w-full h-full">
            <Toaster />
            <div className="form-comp">
                <div className="header-comp">
                    <h1 className="title-comp">Registro de Empleados</h1>
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
                                    <td>{formatFecha(val.fechaRegistro)}</td>
                                    <td>
                                        <button className="novedad-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEstadoUpdate(val)
                                            }}>
                                            <i class="fi fi-br-person-circle-minus icon-style-components"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
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
                    {selectedEmpleado && (
                        <div className={`overlay ${isExiting ? "hidden" : "visible"}`} onClick={handleCloseModal}>
                            <div className={`detalle-empleado-card ${isExiting ? "exiting" : ""}`} onClick={(e) => e.stopPropagation()}>
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
                                <p><strong>Fecha de registro:</strong> {formatFecha(selectedEmpleado.fechaRegistro)}</p>
                                <button className="cerrar-button" onClick={handleCloseModal}>Cerrar</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegistroEmpleados;

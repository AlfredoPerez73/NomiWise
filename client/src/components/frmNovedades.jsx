import React, { useEffect, useState } from "react";
import "../css/components.css";
import toast, { Toaster } from "react-hot-toast";
import { useEmpleado } from "../context/empleadoContext";
import { useCargo } from "../context/cargoContext";
import { useRol } from "../context/rolContext";
import { useContrato } from "../context/contratoContext";
import { useAuth } from "../context/authContext";
import { useNovedades } from "../context/novedadContext";
import { format, startOfDay, endOfDay } from "date-fns";
import ReactPaginate from 'react-paginate';
import logo from '../assets/logoPDF.png'
import jsPDF from "jspdf";
import "jspdf-autotable";

const RegistroNovedad = () => {
    // Estados comunes
    const [monto, setMonto] = useState({});
    const [tipoAccion, setTipoAccion] = useState({});
    const [meses, setMeses] = useState("");
    const [intereses, setIntereses] = useState("");
    const [accionPorEmpleado, setAccionPorEmpleado] = useState({});

    // Estados para la primera tabla (Empleados)
    const [filteredEmpleados, setFilteredEmpleados] = useState([]);
    const [filterValueCargo, setFilterValueCargo] = useState("");
    const [filterValueContrato, setFilterValueContrato] = useState("");
    const [filterValueEstado, setFilterValueEstado] = useState("");
    const [filterValueAño, setFilterValueAño] = useState("");
    const [filterValueMes, setFilterValueMes] = useState("");
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const [filterValue, setFilterValue] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage] = useState(5);

    // Estados para la segunda tabla (Novedades)
    const [filteredNovedad, setFilteredNovedad] = useState([]);
    const [filterNovedadValue, setFilterNovedadValue] = useState("");
    const [filterNovedadCargo, setFilterNovedadCargo] = useState("");
    const [filterNovedadContrato, setFilterNovedadContrato] = useState("");
    const [filterTipoAccion, setFilterTipoAccion] = useState("");
    const [novedadFechaInicio, setNovedadFechaInicio] = useState(null);
    const [novedadFechaFin, setNovedadFechaFin] = useState(null);
    const [currentPage2, setCurrentPage2] = useState(0);
    const [perPage2] = useState(5);

    // Contextos
    const { getEmpleado, empleados } = useEmpleado();
    const { usuario } = useAuth();
    const { getCargo, cargos } = useCargo();
    const { getContrato, contratos } = useContrato();
    const { roles } = useRol();
    const { getNovedades, novedades, createNovedad } = useNovedades();

    // Datos estáticos
    const sEstado = ["ACTIVO", "INACTIVO"];
    const tcontratos = ["TERMINO INDEFINIDO", "TERMINO FIJO", "PERSTACION DE SERVICIOS"];
    const mesesOptions = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
    ];
    const uniqueYears = [...new Set(empleados.map(emp => new Date(emp.fechaRegistro).getFullYear()))];
    const uniqueMonths = Array.from({ length: 12 }, (_, i) => i + 1);

    // Efectos y funciones auxiliares (mantener los existentes)
    useEffect(() => {
        getNovedades();
        getEmpleado();
        getCargo();
        getContrato();
    }, []);

    useEffect(() => {
        setFilteredEmpleados(empleados);
        setFilteredNovedad(novedades);
    }, [empleados, novedades]);

    const getContratoInfo = (idContrato) => {
        const contrato = contratos.find((c) => c.idContrato === idContrato) || {};
        return {
            tipoContrato: contrato.tipoContrato || "Desconocido",
            fechaInicio: contrato.fechaInicio ? format(new Date(contrato.fechaInicio), "dd/MM/yyyy") : "Desconocida",
            fechaFin: contrato.fechaFin ? format(new Date(contrato.fechaFin), "dd/MM/yyyy") : "Desconocida",
            salario: contrato.salario || "Desconocido",
        };
    };

    const getEmpleadoInfo = (idEmpleado, empleados) => {
        return empleados.find((empleado) => empleado.idEmpleado === idEmpleado) || {};
    };

    const getRolName = (idRol) => {
        const rol = roles.find((r) => r.idRol === idRol);
        return rol ? rol.nRol : "Desconocido";
    };

    const getCargoName = (idCargo) => {
        const cargo = cargos.find((c) => c.idCargo === idCargo);
        return cargo ? cargo.nCargo : "Desconocido";
    };

    const userName = usuario ? usuario.nombre : "Desconocido";

    const applyEmpleadoFilters = () => {
        const filtered = empleados.filter((empleado) => {
            // Obtener la información completa del cargo y contrato
            const cargoInfo = getCargoName(empleado.idCargo);
            const contratoInfo = getContratoInfo(empleado.idContrato);

            const matchesEstado = filterValueEstado ? empleado.estado.toLowerCase() === filterValueEstado.toLowerCase() : true;

            // Corregir la comparación del cargo usando el nombre del cargo
            const matchesCargo = filterValueCargo ?
                cargoInfo.toLowerCase().includes(filterValueCargo.toLowerCase()) : true;

            // Corregir la comparación del contrato usando el tipo de contrato
            const matchesContrato = filterValueContrato ?
                contratoInfo.tipoContrato.toLowerCase().includes(filterValueContrato.toLowerCase()) : true;

            const matchesNombre = filterValue ?
                empleado.nombre.toLowerCase().includes(filterValue.toLowerCase()) : true;

            const fechaRegistro = new Date(empleado.fechaRegistro);
            const matchesFechaInicio = fechaInicio ?
                fechaRegistro >= startOfDay(new Date(fechaInicio)) : true;
            const matchesFechaFin = fechaFin ?
                fechaRegistro <= endOfDay(new Date(fechaFin)) : true;

            const matchesAño = filterValueAño ?
                fechaRegistro.getFullYear() === Number(filterValueAño) : true;
            const matchesMes = filterValueMes ?
                (fechaRegistro.getMonth() + 1) === Number(filterValueMes) : true;

            return matchesEstado && matchesCargo && matchesContrato && matchesNombre &&
                matchesFechaInicio && matchesFechaFin && matchesAño && matchesMes;
        });
        setFilteredEmpleados(filtered);
    };

    const applyNovedadFilters = () => {
        const esEmpleadoUsuario = getRolName(usuario.idRol) === "EMPLEADO USUARIO";
        const documentoEmpleado = usuario ? usuario.documento : "Desconocido";

        let baseNovedades = novedades;

        // Si es "EMPLEADO USUARIO", filtrar solo las novedades del empleado logueado
        if (esEmpleadoUsuario && documentoEmpleado) {
            baseNovedades = novedades.filter(novedad => {
                const empleadoInfo = getEmpleadoInfo(novedad.idEmpleado, empleados);
                return empleadoInfo.documento?.trim().toLowerCase() === documentoEmpleado.trim().toLowerCase();
            });
        }

        // Filtrar por rango de fechas
        baseNovedades = baseNovedades.filter(novedad => {
            const fechaRegistro = new Date(novedad.fechaRegistro);
            return (
                (!novedadFechaInicio || fechaRegistro >= new Date(novedadFechaInicio)) &&
                (!novedadFechaFin || fechaRegistro <= new Date(novedadFechaFin))
            );
        });

        // Filtrar por cargo, contrato, tipo de acción y nombre
        baseNovedades = baseNovedades.filter(novedad => {
            const empleadoInfo = getEmpleadoInfo(novedad.idEmpleado, empleados);
            const cargoInfo = getCargoName(novedad.idCargo);
            const contratoInfo = getContratoInfo(novedad.idContrato);

            const matchesNombre = filterNovedadValue ?
                empleadoInfo.nombre.toLowerCase().includes(filterNovedadValue.toLowerCase()) : true;

            const matchesTipoAccion = filterTipoAccion ?
                (filterTipoAccion === "Préstamo" ? novedad.prestamos > 0 : novedad.descuentos > 0) : true;

            const matchesCargo = filterNovedadCargo ?
                cargoInfo.toLowerCase().includes(filterNovedadCargo.toLowerCase()) : true;

            const matchesContrato = filterNovedadContrato ?
                contratoInfo.tipoContrato.toLowerCase().includes(filterNovedadContrato.toLowerCase()) : true;

            return matchesNombre && matchesTipoAccion && matchesCargo && matchesContrato;
        });

        setFilteredNovedad(baseNovedades);
    };

    // Efectos para los filtros
    useEffect(() => {
        applyEmpleadoFilters();
    }, [filterValueEstado, filterValueCargo, filterValueContrato, filterValue, fechaInicio, fechaFin, filterValueAño, filterValueMes]);

    useEffect(() => {
        applyNovedadFilters();
    }, [novedades, empleados, usuario, novedadFechaInicio, novedadFechaFin, filterNovedadValue, filterTipoAccion, filterNovedadCargo, filterNovedadContrato]);

    const handleTipoChange = (idEmpleado, tipo) => {
        setAccionPorEmpleado(prev => ({
            ...prev,
            [idEmpleado]: { ...prev[idEmpleado], tipoAccion: tipo, meses: "", intereses: "" }
        }));
    };

    const handleMontoChange = (idEmpleado, value) => {
        setMonto((prevMonto) => ({
            ...prevMonto,
            [idEmpleado]: value,
        }));
    };

    const handleMesesChange = (idEmpleado, meses) => {
        setAccionPorEmpleado(prev => ({
            ...prev,
            [idEmpleado]: { ...prev[idEmpleado], meses }
        }));
    };

    const handleInteresesChange = (idEmpleado, intereses) => {
        if (parseFloat(intereses) > 1 || !intereses.includes(".")) {
            setAccionPorEmpleado(prev => ({
                ...prev,
                [idEmpleado]: { ...prev[idEmpleado], intereses }
            }));
        } else {
            toast.error("No se permiten decimales para valores menores o iguales a 1.");
        }
    };

    const handleAgregar = async (empleado) => {
        const empleadoAccion = accionPorEmpleado[empleado.idEmpleado] || {};
        const montoValue = parseFloat(monto[empleado.idEmpleado]) || 0;
    
        if (!empleadoAccion.tipoAccion) {
            toast.error("Por favor selecciona el tipo de acción (Préstamo o Descuento).");
            return;
        }
        if (montoValue <= 0) {
            toast.error("Por favor ingresa un monto válido.");
            return;
        }
        if (empleadoAccion.tipoAccion === "Préstamo" && (!empleadoAccion.meses || !empleadoAccion.intereses)) {
            toast.error("Por favor ingresa el número de meses y el interés.");
            return;
        }
    
        const formDataToSave = {
            idEmpleado: empleado.idEmpleado,
            idCargo: empleado.idCargo,
            idContrato: empleado.idContrato,
            idUsuario: empleado.idUsuario,
            prestamos: empleadoAccion.tipoAccion === "Préstamo" ? montoValue : 0,
            descuentos: empleadoAccion.tipoAccion === "Descuento" ? montoValue : 0,
            meses: empleadoAccion.tipoAccion === "Préstamo" ? empleadoAccion.meses : 0,
            intereses: empleadoAccion.tipoAccion === "Préstamo" ? empleadoAccion.intereses : 0,
        };
    
        try {
            await createNovedad(formDataToSave);
            getNovedades();
            toast.success(`Se ha añadido un ${empleadoAccion.tipoAccion.toLowerCase()} de $${montoValue.toFixed(2)} para ${empleado.nombre}.`);
            setMonto((prevMonto) => ({ ...prevMonto, [empleado.idEmpleado]: "" }));
            setAccionPorEmpleado((prev) => ({
                ...prev,
                [empleado.idEmpleado]: { tipoAccion: "", meses: "", intereses: "" }
            }));
            setFilteredEmpleados(empleados);
        } catch (error) {
            toast.error("Hubo un error al registrar la novedad.");
        }
    };

    const calcularEstado = (prestamos = 0, descuentos = 0) => {
        if (Number(prestamos) === 0 && Number(descuentos) === 0) return "Sin novedades";
        if (Number(prestamos) > 0 && Number(descuentos) === 0) return "Préstamo activo";
        if (Number(prestamos) === 0 && Number(descuentos) > 0) return "Descuento activo";
        return "Ambos activos";
    };

    const formatFecha2 = (date) => {
        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    };

    function generarCodigoAleatorio() {
        // Generar un número aleatorio entre 100000 y 999999
        const codigo = Math.floor(100000 + Math.random() * 900000);
        return codigo.toString();
    }

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setProperties({
            title: `Reporte_Novedades_${new Date().toLocaleDateString()}`,
        });
        const codigoLiquidacion = generarCodigoAleatorio();
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(15);
        doc.text(`Novedad #${codigoLiquidacion}`, 14, 15);
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
            doc.text("Reporde de Novedades:", 14, 65);
            doc.setFont("Helvetica", "normal");
            doc.text("NomiWise", 14, 70);
            doc.text("Valledupar 20001,", 14, 75);
            doc.text("Departamento del Cesar,", 14, 80);
            doc.text("La Gran Colombia Unida", 14, 85);
            doc.setDrawColor(207, 207, 207);
            doc.setLineWidth(0.4);
            doc.line(15, 91, 195, 91);
            doc.setFontSize(9);
            doc.text("En este PDF se tratara de presentar un reporte de todas las novedades de un Empleado,", 14, 98);
            doc.text("Teniendo en cuenta como datos importantes sus prestamos, descuento y contratos.", 14, 103);

            // Cambia detalles por filteredDetalle
            const tableColumn = ["Documento", "Empleado", "Prestamo", "Descuento", "Contrato", "Estado"];
            const tableRows = [];

            // Usar los datos filtrados (filteredDetalle) que se muestran en la tabla
            const items = filteredNovedad.map((detalle) => {
                const empleadoInfo = getEmpleadoInfo(detalle.idEmpleado, empleados);

                const nombreCompleto = empleadoInfo.nombre;
                const partesNombre = nombreCompleto.split(' ');

                const primerNombre = partesNombre[0] || '';
                const primerApellido = partesNombre[2] || '';

                const nombreFormateado = `${primerNombre} ${primerApellido}`;
                const estadoPrestamoDescuento = calcularEstado(detalle.prestamos, detalle.descuentos);

                return [
                    empleadoInfo.documento,
                    nombreFormateado,
                    "$ " + Number(detalle?.prestamos).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                    "$ " + Number(detalle?.descuentos).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                    getContratoInfo(empleadoInfo?.idContrato).tipoContrato,
                    estadoPrestamoDescuento
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
                    3: { cellWidth: 40 },  // Prestamo
                    4: { cellWidth: 40 },  // Descuento
                    5: { cellWidth: 40 },  // Contrato
                    6: { cellWidth: 30 },  // Estado
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
            doc.text(`Novedad #${codigoLiquidacion}`, 14, doc.lastAutoTable.finalY + 60);
            doc.autoPrint();
            doc.output('dataurlnewwindow');
        };
    };

    const formatFecha = (fecha) => {
        return format(new Date(fecha), "dd/MM/yyyy");
    };

    const handlePageClick = ({ selected }) => setCurrentPage(selected);
    const handlePageClick2 = ({ selected }) => setCurrentPage2(selected);

    const offset = currentPage * perPage;
    const currentEmpleados = filteredEmpleados.slice(offset, offset + perPage);
    const pageCount = Math.ceil(filteredEmpleados.length / perPage);

    const offset2 = currentPage2 * perPage2;
    const currentNovedades = filteredNovedad.slice(offset2, offset2 + perPage2);
    const pageCount2 = Math.ceil(filteredNovedad.length / perPage2);

    return (
        <div className="w-full h-full">
            <Toaster />
            <div className="form-comp">
                {/* Sección de Empleados */}
                <div className="header-comp">
                    <h1 className="title-comp">Gestión de Préstamos y Descuentos</h1>
                    {getRolName(usuario.idRol) !== "EMPLEADO USUARIO" && (
                        <div className="empleados-filters">
                            <div className="search-bar-2">
                                <input
                                    type="date"
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                    placeholder="Fecha inicio"
                                />
                                <input
                                    type="date"
                                    onChange={(e) => setFechaFin(e.target.value)}
                                    placeholder="Fecha fin"
                                />
                                <select
                                    value={filterValueAño}
                                    onChange={(e) => setFilterValueAño(e.target.value)}
                                >
                                    <option value="">Seleccionar Año</option>
                                    {uniqueYears.map((año, index) => (
                                        <option key={index} value={año}>{año}</option>
                                    ))}
                                </select>
                                <select
                                    value={filterValueMes}
                                    onChange={(e) => setFilterValueMes(e.target.value)}
                                >
                                    <option value="">Seleccionar Mes</option>
                                    {uniqueMonths.map((mes) => (
                                        <option key={mes} value={mes}>{mes}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>
                {/* Tabla de Empleados */}

                <div className="table-card-empleados">
                    {getRolName(usuario.idRol) !== "EMPLEADO USUARIO" && (
                        <>
                            <div className="search-bar">
                                <input
                                    type="text"
                                    placeholder="Filtrar empleados"
                                    value={filterValue}
                                    onChange={(e) => setFilterValue(e.target.value)}
                                />
                                <select
                                    value={filterValueCargo}
                                    onChange={(e) => setFilterValueCargo(e.target.value)}
                                >
                                    <option value="">Seleccionar Cargo</option>
                                    {cargos.map(cargo => (
                                        <option key={cargo.idCargo} value={cargo.nCargo}>
                                            {cargo.nCargo}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={filterValueContrato}
                                    onChange={(e) => setFilterValueContrato(e.target.value)}
                                >
                                    <option value="">Seleccionar Contrato</option>
                                    {tcontratos.map((tipo, index) => (
                                        <option key={index} value={tipo}>
                                            {tipo}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={filterValueEstado}
                                    onChange={(e) => setFilterValueEstado(e.target.value)}
                                >
                                    <option value="">Seleccionar Estado</option>
                                    {sEstado.map((estado, index) => (
                                        <option key={index} value={estado}>{estado}</option>
                                    ))}
                                </select>
                            </div>

                            <table>
                                <thead>
                                    <tr>
                                        <th>Documento</th>
                                        <th>Nombre</th>
                                        <th>Salario Base</th>
                                        <th>Cargo</th>
                                        <th>Contrato</th>
                                        <th>Acciones</th>
                                        <th>Fecha de registro</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEmpleados.map((empleado) => {
                                        return (
                                            <tr key={empleado.idEmpleado}>
                                                <td>{empleado.documento}</td>
                                                <td>{empleado.nombre}</td>
                                                <td>{"$ " + Number(getContratoInfo(empleado?.idContrato).salario).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
                                                <td>{getCargoName(empleado?.idCargo)}</td>
                                                <td>{getContratoInfo(empleado?.idContrato).tipoContrato}</td>
                                                <td>
                                                    <input
                                                        className="monto-input"
                                                        type="number"
                                                        name="monto"
                                                        required
                                                        placeholder="Monto"
                                                        value={monto[empleado.idEmpleado] || ""}
                                                        onChange={(e) => handleMontoChange(empleado.idEmpleado, e.target.value)}
                                                    />
                                                    <select
                                                        className="tipo-select"
                                                        value={accionPorEmpleado[empleado.idEmpleado]?.tipoAccion || ""}
                                                        required
                                                        onChange={(e) => handleTipoChange(empleado.idEmpleado, e.target.value)}
                                                    >
                                                        <option value="">Seleccionar Tipo</option>
                                                        <option value="Préstamo">Préstamo</option>
                                                        <option value="Descuento">Descuento</option>
                                                    </select>
                                                    {accionPorEmpleado[empleado.idEmpleado]?.tipoAccion === "Préstamo" && (
                                                        <>
                                                            <select
                                                                className="tipo-select"
                                                                value={accionPorEmpleado[empleado.idEmpleado]?.meses || ""}
                                                                onChange={(e) => handleMesesChange(empleado.idEmpleado, e.target.value)}
                                                                required
                                                            >
                                                                <option value="">A cuantos Meses</option>
                                                                {mesesOptions.map((mes, index) => (
                                                                    <option key={index} value={mes}>{mes}</option>
                                                                ))}
                                                            </select>
                                                            <input
                                                                className="monto-input"
                                                                type="number"
                                                                name="intereses"
                                                                value={accionPorEmpleado[empleado.idEmpleado]?.intereses || ""}
                                                                onChange={(e) => handleInteresesChange(empleado.idEmpleado, e.target.value)}
                                                                placeholder="Intereses"
                                                                required
                                                            />
                                                        </>
                                                    )}
                                                    <button className="novedad-button" onClick={() => handleAgregar(empleado)}><i className="fi fi-rr-apps-add icon-style-components"></i></button>
                                                </td>
                                                <td>{formatFecha(empleado.fechaRegistro)}</td>
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
                        </>
                    )}

                    {/* Sección de Novedades */}
                    <h1 className="sub-titles-comp">Registro de Prestamos y Descuentos</h1>
                    <div className="novedades-filters">
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Filtrar por nombre"
                                value={filterNovedadValue}
                                onChange={(e) => setFilterNovedadValue(e.target.value)}
                            />
                            <input
                                type="date"
                                onChange={(e) => setNovedadFechaInicio(e.target.value)}
                                placeholder="Fecha inicio"
                            />
                            <input
                                type="date"
                                onChange={(e) => setNovedadFechaFin(e.target.value)}
                                placeholder="Fecha fin"
                            />
                            <select
                                value={filterTipoAccion}
                                onChange={(e) => setFilterTipoAccion(e.target.value)}
                            >
                                <option value="">Seleccionar Tipo</option>
                                <option value="Préstamo">Préstamo</option>
                                <option value="Descuento">Descuento</option>
                            </select>
                            <select
                                value={filterNovedadCargo}
                                onChange={(e) => setFilterNovedadCargo(e.target.value)}
                            >
                                <option value="">Seleccionar Cargo</option>
                                {cargos.map(cargo => (
                                    <option key={cargo.idCargo} value={cargo.nCargo}>
                                        {cargo.nCargo}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={filterNovedadContrato}
                                onChange={(e) => setFilterNovedadContrato(e.target.value)}
                            >
                                <option value="">Seleccionar Contrato</option>
                                {tcontratos.map((tipo, index) => (
                                    <option key={index} value={tipo}>
                                        {tipo}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Tabla de Novedades */}
                    <table>
                        <thead>
                            <tr>
                                <th>Documento</th>
                                <th>Nombre</th>
                                <th>Cargo</th>
                                <th>Salario</th>
                                <th>Contrato</th>
                                <th>Prestamo</th>
                                <th>Descuento</th>
                                <th>Meses</th>
                                <th>Interés %</th>
                                <th>Estado</th>
                                <th>Fecha de registro</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentNovedades.map((novedad) => {
                                const empleadoInfo = getEmpleadoInfo(novedad.idEmpleado, empleados);
                                return (
                                    <tr key={novedad.idNovedad}>
                                        <td>{empleadoInfo.documento}</td>
                                        <td>{empleadoInfo.nombre}</td>
                                        <td>{getCargoName(novedad.idCargo)}</td>
                                        <td>{"$ " + Number(getContratoInfo(novedad.idContrato).salario).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
                                        <td>{getContratoInfo(novedad.idContrato).tipoContrato}</td>
                                        <td>{"$ " + Number(novedad.prestamos).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
                                        <td>{"$ " + Number(novedad.descuentos).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
                                        <td>{novedad.meses + " Meses"}</td>
                                        <td>{novedad.intereses + " %"}</td>
                                        <td>
                                            <div className={`estado-container ${calcularEstado(novedad.prestamos, novedad.descuentos)}`}>
                                                {calcularEstado(novedad.prestamos, novedad.descuentos) === "Sin novedades" && (
                                                    <div className="icon-container sin-novedades-icon">
                                                        <i className="fi fi-br-empty-set icon-style-components"></i>
                                                    </div>
                                                )}
                                                {calcularEstado(novedad.prestamos, novedad.descuentos) === "Préstamo activo" && (
                                                    <div className="icon-container prestamo-icon">
                                                        <i className="fi fi-br-calendar-payment-loan icon-style-components"></i>
                                                    </div>
                                                )}
                                                {calcularEstado(novedad.prestamos, novedad.descuentos) === "Descuento activo" && (
                                                    <div className="icon-container descuento-icon">
                                                        <i className="fi fi-br-pizza-slice icon-style-components"></i>
                                                    </div>
                                                )}
                                                {calcularEstado(novedad.prestamos, novedad.descuentos) === "Ambos activos" && (
                                                    <>
                                                        <div className="icon-container prestamo-icon">
                                                            <i className="fi fi-br-calendar-payment-loan icon-style-components"></i>
                                                        </div>
                                                        <div className="icon-container descuento-icon">
                                                            <i className="fi fi-br-pizza-slice icon-style-components"></i>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td>{formatFecha(novedad.fechaRegistro)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="button-container">
                        <button type="button" className="open-PDF-button" onClick={generatePDF}>
                            <i className="fi fi-rr-file-medical-alt icon-style-pdf"></i>
                        </button>
                    </div>
                    <ReactPaginate
                        previousLabel={<i className="fi fi-br-angle-double-small-left icon-style-pagination"></i>}
                        nextLabel={<i className="fi fi-br-angle-double-small-right icon-style-pagination"></i>}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={pageCount2}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick2}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"}
                        forcePage={Math.min(currentPage2, pageCount2 - 1)}
                    />

                </div>
            </div>
        </div>
    );
};

export default RegistroNovedad;
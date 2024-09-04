import React, { useEffect, useState } from "react";
import "../css/components.css";
import { useAuth } from "../context/authContext";
import { useNomina } from "../context/nominaContext";
import { format, startOfDay, endOfDay } from "date-fns";
import ReactPaginate from 'react-paginate';
import logo from '../assets/logoPDF.png'
import jsPDF from "jspdf";
import "jspdf-autotable";

const Nomina = () => {
    const [filteredNomina, setFilteredNomina] = useState([]);
    const [filterValueAño, setFilterValueAño] = useState("");
    const [filterValueMes, setFilterValueMes] = useState("");
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const [filterValue, setFilterValue] = useState("");
    const [selectedNomina, setSelectedNomina] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage] = useState(10);

    const { getNominas, nominas } = useNomina();
    const { usuario } = useAuth();

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

    const userName = usuario ? usuario.nombre : "Desconocido";

    const handleFilterChangeAño = (e) => {
        setFilterValueAño(e.target.value);
    };

    const handleFilterChangeMes = (e) => {
        setFilterValueMes(e.target.value);
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

    function generarCodigoAleatorio() {
        // Generar un número aleatorio entre 100000 y 999999
        const codigo = Math.floor(100000 + Math.random() * 900000);
        return codigo.toString();
    }

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setProperties({
            title: `Reporte_Nomina${new Date().toLocaleDateString()}`,
        });
        const codigoLiquidacion = generarCodigoAleatorio();
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(15);
        doc.text(`Nomina #${codigoLiquidacion}`, 14, 15);
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
            doc.text("Reporde de Nomina:", 14, 65);
            doc.setFont("Helvetica", "normal");
            doc.text("NomiWise", 14, 70);
            doc.text("Valledupar 20001,", 14, 75);
            doc.text("Departamento del Cesar,", 14, 80);
            doc.text("La Gran Colombia Unida", 14, 85);
            doc.setDrawColor(207, 207, 207);
            doc.setLineWidth(0.4);
            doc.line(15, 91, 195, 91);
            doc.setFontSize(9);
            doc.text("En este PDF se tratara de presentar un reporte de todas las Nominas del negocio o Empresa,", 14, 98);
            doc.text("Teniendo en cuenta como datos importantes los devengados y demas componentes salariales.", 14, 103);

            const tableColumn = ["Año", "Mes", "Nomina", "Fecha de Registro"];
            const tableRows = [];

            const items = nominas.map((nomina) => {
                return [
                    nomina.año,
                    nomina.mes,
                    "$ " + Number(nomina?.total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                    formatFecha(nomina.fechaRegistro)
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
                    0: { cellWidth: 50 },  // Documento
                    1: { cellWidth: 50 },  // Empleado
                    3: { cellWidth: 30 },  // Devengado
                    6: { cellWidth: 10 },  // Fecha de Fin
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
            doc.text("1. Este Reporte no incluye los detalle de la nomina.", 14, doc.lastAutoTable.finalY + 45);
            doc.setDrawColor(207, 207, 207);
            doc.setLineWidth(0.4);
            doc.line(15, doc.lastAutoTable.finalY + 50, 195, doc.lastAutoTable.finalY + 50);
            doc.setFont("Helvetica", "normal");
            doc.setTextColor(179, 179, 179);
            doc.setFontSize(8);
            doc.text(`Liquidacion #${codigoLiquidacion}`, 14, doc.lastAutoTable.finalY + 60);
            doc.autoPrint();
            doc.output('dataurlnewwindow');
        };
    };

    const generatePDFdetalle = () => {
        const doc = new jsPDF();
        doc.setProperties({
            title: `Reporte_Liquidacion_${new Date().toLocaleDateString()}`,
        });

        const codigoLiquidacion = generarCodigoAleatorio();
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(15);
        doc.text(`Liquidacion #${codigoLiquidacion}`, 14, 15);
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
            doc.text("Reporte de Liquidacion:", 14, 65);
            doc.setFont("Helvetica", "normal");
            doc.text("NomiWise", 14, 70);
            doc.text("Valledupar 20001,", 14, 75);
            doc.text("Departamento del Cesar,", 14, 80);
            doc.text("La Gran Colombia Unida", 14, 85);
            doc.setDrawColor(207, 207, 207);
            doc.setLineWidth(0.4);
            doc.line(15, 91, 195, 91);
            doc.setFontSize(9);
            doc.text("En este PDF se tratara de presentar un reporte del detalle de la liquidaciones de un Empleado,", 14, 98);
            doc.text("Teniendo en cuenta como datos importantes su salario final, contrato y los de mas componentes salariales.", 14, 103);

            // Información adicional de la nomina
            doc.setFontSize(12);
            doc.setFont("Helvetica", "bold");
            doc.text("Fecha de la Nomina", 14, 115);
            doc.setDrawColor(207, 207, 207);
            doc.setLineWidth(0.4);
            doc.line(15, 130, 195, 130);
            doc.setFontSize(12);
            doc.setFont("Helvetica", "bold");
            doc.text("Informacion Nomial del Negocio", 14, 140);
            doc.setFontSize(9);
            doc.setFont("Helvetica", "normal");
            doc.text("Año: " + selectedNomina.año, 14, 120);
            doc.text("Mes: " + selectedNomina.mes, 14, 125);
            doc.text("Salud Total: $ " + Number(selectedNomina.saludTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'), 14, 145);
            doc.text("Pensión Total: $ " + Number(selectedNomina.pensionTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'), 14, 150);
            doc.text("Aux. Transporte Total: $ " + Number(selectedNomina.auxTransporteTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'), 14, 155);
            doc.text("Bon. de Servicios Total: $ " + Number(selectedNomina.bonificacionServicioTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'), 14, 160);
            doc.text("Aux. Alimentación Total: $ " + Number(selectedNomina.auxAlimentacionTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'), 14, 165);
            doc.text("Prima de Navidad Total: $ " + Number(selectedNomina.primaNavidadTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'), 14, 170);
            doc.text("Vacaciones Total: $ " + Number(selectedNomina.vacacionesTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'), 14, 175);
            doc.text("Cesantías Total: $ " + Number(selectedNomina.cesantiasTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'), 14, 180);
            doc.text("Int. Cesantías Total: $ " + Number(selectedNomina.interesesCesantiasTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'), 14, 185);
            doc.text("Total: $ " + Number(selectedNomina.total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'), 14, 190);

            doc.setFillColor(215, 234, 255);
            doc.setTextColor(0, 0, 0);
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(9);

            const x = 14;
            const yNote = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 255;
            const width = 182;
            const height = 10;
            const radius = 2.5;

            doc.roundedRect(x, yNote, width, height, radius, radius, 'F');

            doc.setTextColor(44, 104, 172);
            doc.text("Este PDF fue generado por: " + userName, x + 5, yNote + 6);

            doc.setTextColor(0, 0, 0);
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(8);
            doc.text("1. Este Reporte incluye los detalle de liquidacion.", 14, doc.lastAutoTable ? doc.lastAutoTable.finalY + 45 : 275);
            doc.setDrawColor(207, 207, 207);
            doc.setLineWidth(0.4);
            doc.line(15, doc.lastAutoTable ? doc.lastAutoTable.finalY + 50 : 280, 195, doc.lastAutoTable ? doc.lastAutoTable.finalY + 50 : 280);
            doc.setFont("Helvetica", "normal");
            doc.setTextColor(179, 179, 179);
            doc.setFontSize(8);
            doc.text(`Liquidacion #${codigoLiquidacion}`, 14, doc.lastAutoTable ? doc.lastAutoTable.finalY + 60 : 285);
            doc.autoPrint();
            doc.output('dataurlnewwindow');
        };
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
                                <div className="button-container">
                                    <button type="button" className="open-PDF-button-2" onClick={generatePDFdetalle}>
                                        <i class="fi fi-rr-file-medical-alt icon-style-pdf"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Nomina;

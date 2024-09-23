import React, { useEffect, useState } from "react";
import { useUsuario } from "../context/usuarioContext";
import { useEmpleado } from "../context/empleadoContext";
import { useCargo } from "../context/cargoContext";
import { useNomina } from "../context/nominaContext";
import { useDetalle } from "../context/detalleLiquidacionContext";
import { useContrato } from "../context/contratoContext";
import { NominaFechaChart, EmpleadosMasLiquidadosChart, EmpleadosMasHorasChart, EmpleadosPorContratoChart } from './Charts';
import { format, isToday } from "date-fns";
import "../css/dashboard.css";

const DashboardCards = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [selectedDetalle, setSelectedDetalle] = useState(null);
  const [selectedNomina, setSelectedNomina] = useState(null);
  const [modalMessage, setModalMessage] = useState("");

  const [filteredNominas, setFilteredNominas] = useState([]);
  const [filteredDetalles, setFilteredDetalles] = useState([]);
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const [stats, setStats] = useState({
    usuarios: 0,
    empleados: 0,
    totalSalario: 0,
    totalNomina: 0,
    mayorLiquidacion: null,
    liquMes: null,
    mayorNomina: null,
    totalDiasTrabajados: 0,
    totalHorasExtras: 0,
    valorTotalHorasExtras: 0,
    horasExtrasPorEmpleado: 0,
    top3Meses: 0,
    promedioHorasExtras: 0,
    promedioDiasTrabajados: 0
  });
  const [selectedCargo, setSelectedCargo] = useState("");
  const [selectedContrato, setSelectedContrato] = useState("");

  const tcontratos = [
    "TERMINO INDEFINIDO",
    "TERMINO FIJO",
    "PERSTACION DE SERVICIOS"
  ];

  const { usuarios, getUsuario } = useUsuario();
  const { empleados, getEmpleado } = useEmpleado();
  const { contratos, getContrato } = useContrato();
  const { nominas, getNominas } = useNomina();
  const { getCargo, cargos } = useCargo();
  const { detalles, getDetalles } = useDetalle();

  useEffect(() => {
    const fetchStats = async () => {
      await getUsuario();
      await getEmpleado();
      await getContrato();
      await getNominas();
      await getDetalles();
      await getCargo();
    };

    fetchStats();
  }, []);

  const filterData = (empleados, detalles, nominas, selectedCargo, selectedContrato) => {
    const filteredEmpleados = empleados.filter(e =>
      (selectedCargo ? e.idCargo === parseInt(selectedCargo, 10) : true) &&
      (selectedContrato ? getContratoInfo(e.idContrato).tipoContrato === selectedContrato : true)
    );

    const filteredDetalles = detalles.filter(d =>
      filteredEmpleados.some(e => e.idEmpleado === d.idEmpleado)
    );

    const groupedNominas = nominas.map(nomina => {
      const totalFilteredNomina = filteredDetalles
        .filter(d => {
          const fechaDetalle = new Date(d.fechaRegistro).toISOString().split('T')[0];
          const fechaNomina = new Date(nomina.fechaRegistro).toISOString().split('T')[0];
          return fechaNomina === fechaDetalle;
        })
        .reduce((sum, detail) => sum + Number(detail.devengado) +
          Number(detail.salud) +
          Number(detail.pension) +
          Number(detail.auxTransporte) +
          Number(detail.bonificacionServicio) +
          Number(detail.auxAlimentacion) +
          Number(detail.primaNavidad) +
          Number(detail.vacaciones) +
          Number(detail.cesantias) +
          Number(detail.interesesCesantias), 0);

      return {
        ...nomina,
        total: totalFilteredNomina,
      };
    });

    return { filteredEmpleados, filteredDetalles, filteredNominas: groupedNominas };
  };


  useEffect(() => {
    if (usuarios.length > 0 && empleados.length > 0 && nominas.length > 0 && detalles.length > 0) {
      const { filteredEmpleados, filteredDetalles, filteredNominas } = filterData(empleados, detalles, nominas, selectedCargo, selectedContrato);

      const totalSalario = filteredDetalles.reduce((sum, item) => sum + Number(item.devengado), 0);
      const totalNomina = filteredNominas.length > 0
        ? filteredNominas.reduce((sum, item) => sum + Number(item.total), 0)
        : null;
      const mayorLiquidacion = filteredDetalles.length > 0
        ? filteredDetalles.reduce((max, item) => max.devengado > Number(item.devengado) ? max : item, { devengado: 0 })
        : null;
      const currentMonth = new Date().getMonth();
      const liquidacionesMesActual = filteredDetalles.filter(item => new Date(item.fechaRegistro).getMonth() === currentMonth);
      const liquMes = liquidacionesMesActual.length > 0
        ? liquidacionesMesActual.reduce((max, item) => max.devengado > Number(item.devengado) ? max : item, { devengado: 0 })
        : null;
      const mayorNomina = filteredNominas.length > 0
        ? filteredNominas.reduce((max, item) => max.total > Number(item.total) ? max : item, { total: 0 })
        : null;
      const totalHorasExtras = filteredDetalles.reduce((sum, item) => sum + Number(item.horasExtras), 0);
      const totalDiasTrabajados = filteredDetalles.reduce((sum, item) => sum + Number(item.diasTrabajados), 0);
      const valorTotalHorasExtras = filteredDetalles.reduce((total, empl) => {
        const e = getEmpleadoInfo(empl.idEmpleado, empleados);
        const salarioEmpleado = getContratoInfo(e.idContrato).salario;
        const valorHorasExtra = empl.horasExtras > 0 ? (salarioEmpleado / 240) * 1.25 * empl.horasExtras : 0;
        return total + valorHorasExtra;
      }, 0);
      const promedioHorasExtras = filteredDetalles.length > 0
        ? parseFloat((totalHorasExtras / filteredDetalles.length).toFixed(2))
        : 0;
      const promedioDiasTrabajados = filteredDetalles.length > 0
        ? parseFloat((totalDiasTrabajados / filteredDetalles.length).toFixed(2))
        : 0;

      const horasExtrasPorEmpleado = filteredDetalles.reduce((acc, detalle) => {
        const idEmpleado = detalle.idEmpleado;
        if (!acc[idEmpleado]) {
          acc[idEmpleado] = 0;
        }
        acc[idEmpleado] += Number(detalle.horasExtras);
        return acc;
      }, {});

      const empleadosConCeroHorasExtras = Object.values(horasExtrasPorEmpleado).filter(horasExtras => horasExtras === 0).length;

      const diasPorMes = filteredDetalles.reduce((acc, item) => {
        const mes = new Date(item.fechaRegistro).toLocaleString('default', { month: 'long' }).toLowerCase();
        if (!acc[mes]) {
          acc[mes] = 0;
        }
        acc[mes] += Number(item.diasTrabajados);
        return acc;
      }, {});

      const mesesOrdenados = Object.entries(diasPorMes).sort((a, b) => b[1] - a[1]);
      const top3Meses = mesesOrdenados.slice(0, 3).reduce((acc, [mes, totalDias]) => {
        const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
        acc[mesCapitalizado] = totalDias;
        return acc;
      }, {});

      setStats({
        usuarios: usuarios.length,
        empleados: filteredEmpleados.length,
        totalSalario,
        totalNomina,
        mayorLiquidacion,
        liquMes,
        mayorNomina,
        totalDiasTrabajados,
        totalHorasExtras,
        valorTotalHorasExtras,
        empleadosConCeroHorasExtras,
        top3Meses,
        promedioHorasExtras,
        promedioDiasTrabajados,
      });
      setFilteredEmpleados(filteredEmpleados);
      setFilteredDetalles(filteredDetalles);
      setFilteredNominas(filteredNominas);
    }
  }, [usuarios, empleados, nominas, detalles, selectedCargo, selectedContrato]);

  const getTop5Empleados = () => {
    return [...filteredDetalles]
      .sort((a, b) => b.devengado - a.devengado)
      .slice(0, 5)
      .map((detalle) => {
        const empleado = getEmpleadoInfo(detalle.idEmpleado, filteredEmpleados);
        return {
          ...detalle,
          nombre: `${empleado.nombre}`,
          estado: empleado.estado
        };
      });
  };

  const handleCardClick = (item, type) => {
    if (!item) {
      let message = "";
      switch (type) {
        case "mayorLiquidacion":
          message = "No hay datos de la mayor Liquidacion.";
          break;
        case "mayorLiquidacionDelMes":
          message = "No hay Liquidacion realizadas en el mes.";
          break;
        case "mayorNomina":
          message = "No hay nomina generadas.";
          break;
        default:
          message = "No hay información disponible.";
      }
      setModalMessage(message);
      setIsVisible(true);
    } else {
      switch (type) {
        case "mayorLiquidacion":
        case "mayorLiquidacionDelMes":
          const empleado = getEmpleadoInfo(item.idEmpleado, empleados);
          setSelectedEmpleado(empleado);
          setSelectedDetalle(item);
          break;
        case "mayorNomina":
          setSelectedNomina(item);
          break;
      }
      setModalMessage("");
      setIsVisible(true);
    }
  };

  const handleCloseModal = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      setSelectedEmpleado(null);
      setSelectedDetalle(null);
      setSelectedNomina(null);
    }, 500);
  };

  const getEmpleadoInfo = (idEmpleado, empleados) => {
    return empleados.find((empleado) => empleado.idEmpleado === idEmpleado) || {};
  };

  const getCargoName = (idCargo) => {
    const cargo = cargos.find((c) => c.idCargo === idCargo);
    return cargo ? cargo.nCargo : "Desconocido";
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

  const formatCurrency = (value) => `$ ${Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  const formatFecha = (fecha) => format(new Date(fecha), "dd/MM/yyyy");

  return (
    <div className="dashboard-cards">
      <div className="filtro-dashboard-1">
        <div className="card-info">
          <div className="search-bar-2-dashboard">
            <select
              id="tipocontrato-filter"
              name="tipocontrato-filter"
              value={selectedContrato}
              onChange={(e) => setSelectedContrato(e.target.value)}
            >
              <option value="">Seleccionar el Contrato</option>
              {tcontratos.map((contrato, index) => (
                <option key={index} value={contrato}>
                  {contrato}
                </option>
              ))}
            </select>

            <select
              id="cargo-filter"
              name="cargo-filter"
              value={selectedCargo}
              onChange={(e) => setSelectedCargo(e.target.value)}
            >
              <option value="">Seleccionar Cargo</option>
              {cargos.map((c) => (
                <option key={c.idCargo} value={c.idCargo}>
                  {c.nCargo}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="card-container">
        <div className="card-dashboard-1">
          <i className="fi fi-br-user-ninja card-icon"></i>
          <div className="card-info">
            <p>Usuarios</p>
            <h3>{stats.usuarios}</h3>
          </div>
        </div>
        <div className="card-dashboard-2">
          <i className="fi fi-br-employee-man card-icon"></i>
          <div className="card-info">
            <p>Empleados</p>
            <h3>{stats.empleados}</h3>
          </div>
        </div>
        <div className="card-dashboard-3">
          <i className="fi fi-br-chart-pie-simple-circle-dollar card-icon"></i>
          <div className="card-info">
            <p>Nómina Total</p>
            <h3>{stats.totalNomina ? formatCurrency(stats.totalNomina) : "N/A"}</h3>
          </div>
        </div>
        <div className="card-dashboard-detalle" onClick={() => handleCardClick(stats.mayorLiquidacion, "mayorLiquidacion")}>
          <i className="fi fi-br-search-dollar card-icon"></i>
          <div className="card-info">
            <p>M. Liquidación</p>
            <h3>{stats.mayorLiquidacion ? formatCurrency(stats.mayorLiquidacion.devengado) : "N/A"}</h3>
          </div>
        </div>
        <div className="card-dashboard-detalle-1" onClick={() => handleCardClick(stats.liquMes, "mayorLiquidacionDelMes")}>
          <i className="fi fi-br-funnel-dollar card-icon"></i>
          <div className="card-info">
            <p>Liqu. del Mes</p>
            <h3>{stats.liquMes ? formatCurrency(stats.liquMes.devengado) : "N/A"}</h3>
          </div>
        </div>
        <div className="card-dashboard-detalle-2" onClick={() => handleCardClick(stats.mayorNomina, "mayorNomina")}>
          <i className="fi fi-br-coin-up-arrow card-icon"></i>
          <div className="card-info">
            <p>Mayor Nómina</p>
            <h3>{stats.mayorNomina ? formatCurrency(stats.mayorNomina.total) : "N/A"}</h3>
          </div>
        </div>
      </div>
      <div class="main-container">
        <div class="chart-container">
          <div className="card-dashboard-chart-1">
            <div className="chart-info">
              <p>Nómina</p>
              <NominaFechaChart datos={filteredNominas} />
            </div>
          </div>
        </div>
        <div class="chart-group">
          <div class="chart-container">
            <div className="card-dashboard-chart-11">
              <div className="chart-info-2">
                <p>Empleados + Liquidados</p>
                <EmpleadosMasLiquidadosChart detalles={filteredDetalles} empleados={filteredEmpleados} />
              </div>
            </div>
          </div>
          <div class="chart-container">
            <div className="card-dashboard-chart-22">
              <div className="chart-info-3">
                <p>Contratos con + empleados</p>
                <EmpleadosPorContratoChart empleados={filteredEmpleados} contratos={contratos} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="table-card-dashboard">
        <p>Top 5 Empleados Mejores Pagados</p>
        <table>
          <thead>
            <tr>
              <th>Empleado</th>
              <th>Devengado</th>
              <th>Estado</th>
              <th>Fecha de Registro</th>
            </tr>
          </thead>
          <tbody>
            {getTop5Empleados().map((detalle, index) => (
              <tr
                key={index}
                onClick={() => {
                  const empleado = getEmpleadoInfo(detalle.idEmpleado, empleados);
                  setSelectedDetalle(detalle);
                  setSelectedEmpleado(empleado);
                  setIsVisible(true);
                }}
              >
                <td>{detalle.nombre}</td>
                <td>{formatCurrency(detalle.devengado)}</td>
                <td>
                  <span className={detalle.estado === "ACTIVO" ? "estado-activo" : "estado-inactivo"}>
                    {detalle.estado === "ACTIVO" ? (
                      <i className="fi fi-br-time-check icon-style-components"></i>
                    ) : (
                      <i className="fi fi-br-time-delete icon-style-components"></i>
                    )}
                  </span>
                </td>
                <td>{formatFecha(detalle.fechaRegistro)}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
      <div className="card-container-2">
        <div className="card-dashboard-detalle-3">
          <i class="fi fi-sr-trash-can-clock card-icon-2"></i>
          <div className="card-info-2">
            <p>Empl con 0 Horas Extras</p>
            <h3>{stats.empleadosConCeroHorasExtras}</h3>
          </div>
          <i class="fi fi-sr-time-quarter-past card-icon-3"></i>
          <div className="card-info-3">
            <p>Prom de horas extras</p>
            <h3>{stats.promedioHorasExtras}</h3>
          </div>
        </div>
        <div className="card-dashboard-detalle-4">
          <i class="fi fi-br-calendar-exclamation card-icon-2"></i>
          <div className="card-info-2">
            <p>Trend de Días trabajados</p>
            {Object.entries(stats.top3Meses).map(([mes, dias]) => (
              <li key={mes}>
                {mes}: {dias} días
              </li>
            ))}
          </div>
          <i class="fi fi-sr-challenge card-icon-3"></i>
          <div className="card-info-3">
            <p>Prom de Dias trabajados</p>
            <h3>{stats.promedioDiasTrabajados}</h3>
          </div>
        </div>
        <div className="card-dashboard-detalle-5">
          <i className="fi fi-br-calculator-money card-icon-2"></i>
          <div className="card-info-2">
            <p>Total valor horas extras</p>
            <h3>{stats.valorTotalHorasExtras ? formatCurrency(stats.valorTotalHorasExtras) : "N/A"}</h3>
          </div>
          <i className="fi fi-br-hourglass-end card-icon-3"></i>
          <div className="card-info-3">
            <p>Total de horas extras</p>
            <h3>{stats.totalHorasExtras}</h3>
          </div>
        </div>
        <div className="card-dashboard-detalle-6">
          <i className="fi fi-br-calculator-bill card-icon-2"></i>
          <div className="card-info-2">
            <p>Total valor de salario</p>
            <h3>{stats.totalSalario ? formatCurrency(stats.totalSalario) : "N/A"}</h3>
          </div>
          <i className="fi fi-br-calendar-payment-loan card-icon-3"></i>
          <div className="card-info-3">
            <p>Total Dias trabajados</p>
            <h3>{stats.totalDiasTrabajados}</h3>
          </div>
        </div>
      </div>
      <div className="card-detalle">
        {isVisible && (
          <div className={`overlay ${isExiting ? "hidden" : "visible"}`} onClick={handleCloseModal}>
            <div className={`detalle-card ${isExiting ? "exiting" : ""}`} onClick={(e) => e.stopPropagation()}>
              {modalMessage ? (
                <div>
                  <h2>Información</h2>
                  <p>{modalMessage}</p>
                </div>
              ) : selectedNomina ? (
                <>
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
                </>
              ) : (
                <>
                  <h2>Información del Empleado</h2>
                  <p><strong>Documento:</strong> {selectedEmpleado.documento}</p>
                  <p><strong>Empleado:</strong> {selectedEmpleado.nombre}</p>
                  <p><strong>Cargo:</strong> {getCargoName(selectedEmpleado.idCargo)}</p>
                  <p><strong>Fecha de Inicio:</strong> {getContratoInfo(selectedEmpleado.idContrato).fechaInicio}</p>
                  <p><strong>Fecha de Fin:</strong> {getContratoInfo(selectedEmpleado.idContrato).fechaFin}</p>
                  <p><strong>Salario:</strong> {formatCurrency(getContratoInfo(selectedEmpleado.idContrato).salario)}</p>
                  <div>
                    <p><strong>Año:</strong> {selectedDetalle.año}</p>
                    <p><strong>Mes:</strong> {selectedDetalle.mes}</p>
                    <p><strong>Dias Trabajados:</strong> {selectedDetalle.diasTrabajados}</p>
                    <p><strong>Horas Extras:</strong> {selectedDetalle.horasExtras}</p>
                    <p><strong>Salud:</strong> {formatCurrency(selectedDetalle.salud)}</p>
                    <p><strong>Pension:</strong> {formatCurrency(selectedDetalle.pension)}</p>
                    <p><strong>Aux. Transporte:</strong> {formatCurrency(selectedDetalle.auxTransporte)}</p>
                    <p><strong>Bon. de servicios:</strong> {formatCurrency(selectedDetalle.bonificacionServicio)}</p>
                    <p><strong>Aux. Alimentacion:</strong> {formatCurrency(selectedDetalle.auxAlimentacion)}</p>
                    <p><strong>Prima de Navidad:</strong> {formatCurrency(selectedDetalle.primaNavidad)}</p>
                    <p><strong>Vacaciones:</strong> {formatCurrency(selectedDetalle.vacaciones)}</p>
                    <p><strong>Cesantias:</strong> {formatCurrency(selectedDetalle.cesantias)}</p>
                    <p><strong>Int. Cesantias:</strong> {formatCurrency(selectedDetalle.interesesCesantias)}</p>
                    <p><strong>Devengado:</strong> {formatCurrency(selectedDetalle.devengado)}</p>
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
                </>
              )}
              <button className="cerrar-button" onClick={handleCloseModal}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
      <div className="charts-container">
        <div className="card-dashboard-chart-2">
          <div className="chart-info-3">
            <p>Empleados + Horas Extras</p>
            <EmpleadosMasHorasChart detalles={filteredDetalles} empleados={filteredEmpleados} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
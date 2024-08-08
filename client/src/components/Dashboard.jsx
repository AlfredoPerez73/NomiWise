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
  });

  const { usuarios, getUsuario } = useUsuario();
  const { empleados, getEmpleado } = useEmpleado();
  const { contratos, getContrato } = useContrato();
  const { nominas, getNominas } = useNomina();
  const { getCargo, cargos } = useCargo();
  const { detalles, getDetalles } = useDetalle();

  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [selectedDetalle, setSelectedDetalle] = useState(null);
  const [selectedNomina, setSelectedNomina] = useState(null);
  const [modalMessage, setModalMessage] = useState("");


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

  useEffect(() => {
    if (usuarios.length > 0 && empleados.length > 0 && nominas.length > 0 && detalles.length > 0) {
      const totalSalario = detalles.reduce((sum, item) => sum + Number(item.devengado), 0);
      const totalNomina = nominas.reduce((sum, item) => sum + Number(item.total), 0);
      const mayorLiquidacion = detalles.reduce((max, item) => max.devengado > Number(item.devengado) ? max : item, { devengado: 0 });
      const currentMonth = new Date().getMonth();
      const liquidacionesMesActual = detalles.filter(item => new Date(item.fechaRegistro).getMonth() === currentMonth);
      const liquMes = liquidacionesMesActual.length > 0
        ? liquidacionesMesActual.reduce((max, item) => max.devengado > Number(item.devengado) ? max : item, { devengado: 0 })
        : null;
      const mayorNomina = nominas.reduce((max, item) => max.total > Number(item.total) ? max : item, { total: 0 });
      const totalHorasExtras = detalles.reduce((sum, item) => sum + Number(item.horasExtras), 0);
      const totalDiasTrabajados = detalles.reduce((sum, item) => sum + Number(item.diasTrabajados), 0);

      setStats({
        usuarios: usuarios.length,
        empleados: empleados.length,
        totalSalario,
        totalNomina,
        mayorLiquidacion,
        liquMes,
        mayorNomina,
        totalHorasExtras,
        totalDiasTrabajados,
      });
    }
  }, [usuarios, empleados, nominas, detalles]);

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
  const formatFecha = (fecha) => {
    return format(new Date(fecha), "dd/MM/yyyy");
  };

  return (
    <div className="dashboard-cards">
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
            <h3>{formatCurrency(stats.totalNomina)}</h3>
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
        <div className="card-dashboard-detalle-3">
          <i className="fi fi-br-calculator-money card-icon-2"></i>
          <div className="card-info-2">
            <p>Total valor horas extras</p>
            <h3>{formatCurrency(stats.totalSalario)}</h3>
          </div>
          <i className="fi fi-br-hourglass-end card-icon-3"></i>
          <div className="card-info-3">
            <p>Total de horas extras</p>
            <h3>{stats.totalHorasExtras}</h3>
          </div>
        </div>
        <div className="card-dashboard-detalle-4">
          <i className="fi fi-br-calculator-bill card-icon-2"></i>
          <div className="card-info-2">
            <p>Total valor de salario</p>
            <h3>{formatCurrency(stats.totalSalario)}</h3>
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
        <div className="card-dashboard-chart-1">
          <div className="chart-info">
            <p>Nómina</p>
            <NominaFechaChart nominas={nominas} />
          </div>
        </div>
        <div className="card-dashboard-chart-2">
          <div className="chart-info-3">
            <p>Empleados + Horas Extras</p>
            <EmpleadosMasHorasChart detalles={detalles} empleados={empleados} />
          </div>
        </div>
        <div className="card-dashboard-chart-11">
          <div className="chart-info-2">
            <p>Empleados + Liquidados</p>
            <EmpleadosMasLiquidadosChart detalles={detalles} empleados={empleados} />
          </div>
        </div>
        <div className="card-dashboard-chart-22">
          <div className="chart-info-3">
            <p>Contratos con + empleados</p>
            <EmpleadosPorContratoChart empleados={empleados} contratos={contratos} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;

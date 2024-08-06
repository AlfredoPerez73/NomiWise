import React, { useEffect, useState } from "react";
import { useUsuario } from "../context/usuarioContext";
import { useEmpleado } from "../context/empleadoContext";
import { useNomina } from "../context/nominaContext";
import { useDetalle } from "../context/detalleLiquidacionContext";
import { NominaFechaChart } from './Charts';
import "../css/dashboard.css";

const DashboardCards = () => {
  const [stats, setStats] = useState({
    usuarios: 0,
    empleados: 0,
    totalSalario: 0,
    totalNomina: 0,
    mayorLiquidacion: 0,
    liquMes: 0,
    mayorNomina: 0,
    totalDiasTrabajados: 0,
    totalHorasExtras: 0,
  });

  const { usuarios, getUsuario } = useUsuario();
  const { empleados, getEmpleado } = useEmpleado();
  const { nominas, getNominas } = useNomina();
  const { detalles, getDetalles } = useDetalle();

  useEffect(() => {
    const fetchStats = async () => {
      await getUsuario();
      await getEmpleado();
      await getNominas();
      await getDetalles();
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (usuarios.length > 0 && empleados.length > 0 && nominas.length > 0 && detalles.length > 0) {
      const totalSalario = detalles.reduce((sum, item) => sum + Number(item.devengado), 0);
      const totalNomina = nominas.reduce((sum, item) => sum + Number(item.total), 0);
      const mayorLiquidacion = detalles.reduce((max, item) => Math.max(max, Number(item.devengado)), 0);
      const currentMonth = new Date().getMonth();
      const liquidacionesMesActual = detalles.filter(item => new Date(item.fechaRegistro).getMonth() === currentMonth);
      const liquMes = liquidacionesMesActual.length > 0 
        ? liquidacionesMesActual.reduce((max, item) => Math.max(max, Number(item.devengado)), 0) 
        : 0;
      const mayorNomina = nominas.reduce((max, item) => Math.max(max, Number(item.total)), 0);
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
            <p>Nomina Total</p>
            <h3>${" " + Number(stats.totalNomina).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</h3>
          </div>
        </div>
        <div className="card-dashboard-detalle">
          <i className="fi fi-br-search-dollar card-icon"></i>
          <div className="card-info">
            <p>May. Liquidacion</p>
            <h3>${" " + Number(stats.mayorLiquidacion).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</h3>
          </div>
        </div>
        <div className="card-dashboard-detalle-1">
          <i className="fi fi-br-funnel-dollar card-icon"></i>
          <div className="card-info">
            <p>Liqu. del Mes</p>
            <h3>{"$ " + Number(stats.liquMes).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</h3>
          </div>
        </div>
        <div className="card-dashboard-detalle-2">
          <i className="fi fi-br-coin-up-arrow card-icon"></i>
          <div className="card-info">
            <p>Mayor Nomina</p>
            <h3>${" " + Number(stats.mayorNomina).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</h3>
          </div>
        </div>
        <div className="card-dashboard-detalle-3">
          <i className="fi fi-br-calculator-money card-icon-2"></i>
          <div className="card-info-2">
            <p>Total valor horas extras</p>
            <h3>{30}</h3>
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
            <p>Total de valor de salario</p>
            <h3>{"$ " + Number(stats.totalSalario).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</h3>
          </div>
          <i className="fi fi-br-calendar-payment-loan card-icon-3"></i>
          <div className="card-info-3">
            <p>Total Dias trabajados</p>
            <h3>{stats.totalDiasTrabajados}</h3>
          </div>
        </div>
      </div>
      <div className="charts-container">
        <div className="card-dashboard-chart-1">
        <div className="chart-info">
            <p>Nomina</p>
            <NominaFechaChart nominas={nominas} />
          </div>
        </div>
        <div className="card-dashboard-chart-2">
        </div>
        <div className="card-dashboard-chart-11">
        </div>
        <div className="card-dashboard-chart-22">
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;

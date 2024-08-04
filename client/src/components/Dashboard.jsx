import React, { useEffect, useState } from "react";
import { FaUsers, FaDollarSign, FaTrophy, FaChartPie, FaInbox, FaFunnelDollar, FaChartBar } from "react-icons/fa";
import "../css/dashboard.css";
/* import { LinesChart, Pies } from './Charts';
import { useEmpleado } from "../context/empleadoContext";
import { useProducto } from "../context/productoContext";
import { useVenta } from "../context/ventaContext";
import { format, isToday } from "date-fns"; */

const DashboardCards = () => {


  return (
    <div className="dashboard-cards">
      <div className="card-container">
        <div className="card-dashboard-1">
        <i class="fi fi-br-user-ninja card-icon"></i>
          <div className="card-info">
            <p>Usuarios</p>
            <h3>10</h3>
          </div>
        </div>
        <div className="card-dashboard-2">
        <i class="fi fi-br-employee-man card-icon"></i>
          <div className="card-info">
            <p>Empleados</p>
            <h3>10</h3>
          </div>
        </div>
        <div className="card-dashboard-3">
        <i class="fi fi-br-chart-pie-simple-circle-dollar card-icon"></i>
          <div className="card-info">
            <p>Nomina Total</p>
            <h3>10</h3>
          </div>
        </div>
        <div className="card-dashboard-detalle">
        <i class="fi fi-br-search-dollar card-icon"></i>
          <div className="card-info">
            <p>May. Liquidacion</p>
            <h3>10</h3>
          </div>
        </div>
        <div className="card-dashboard-detalle-1">
        <i class="fi fi-br-funnel-dollar card-icon"></i>
          <div className="card-info">
            <p>Liqu. del Mes</p>
            <h3>10</h3>
          </div>
        </div>
        <div className="card-dashboard-detalle-2">
        <i class="fi fi-br-coin-up-arrow card-icon"></i>
          <div className="card-info">
            <p>Mayor Nomina</p>
            <h3>10</h3>
          </div>
        </div>
        <div className="card-dashboard-detalle-3">
        <i class="fi fi-br-calculator-money card-icon-2"></i>
          <div className="card-info-2">
            <p>Total valor horas extras</p>
            <h3>10</h3>
          </div>
          <i class="fi fi-br-hourglass-end card-icon-3"></i>
          <div className="card-info-3">
            <p>Total de horas extras</p>
            <h3>10</h3>
          </div>
        </div>
        <div className="card-dashboard-detalle-4">
        <i class="fi fi-br-calculator-bill card-icon-2"></i>
          <div className="card-info-2">
            <p>Total de valor de salario</p>
            <h3>10</h3>
          </div>
          <i class="fi fi-br-calendar-payment-loan card-icon-3"></i>
          <div className="card-info-3">
            <p>Total Dias trabajados</p>
            <h3>10</h3>
          </div>
        </div>
      </div>
      <div className="charts-container">
        <div className="card-dashboard-chart-1">
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
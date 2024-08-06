import React, { useEffect, useState } from "react";
import { Chart as ChartJS, BarElement, BarController, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from "react-chartjs-2";
import { parseISO, format } from "date-fns";

// Register necessary components
ChartJS.register(BarElement, BarController, CategoryScale, LinearScale, Title, Tooltip, Legend);

export function NominaFechaChart({ nominas }) {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        if (!nominas || !Array.isArray(nominas)) {
            return;
        }

        const data = nominas.map((nomina) => ({
            date: format(parseISO(nomina.fechaRegistro), "yyyy-MM-dd"),
            total: Number(nomina.total),
        }));

        const dates = data.map((d) => d.date);
        const totals = data.map((d) => d.total);

        setChartData({
            labels: dates,
            datasets: [
                {
                    label: "Total Nomina",
                    data: totals,
                    backgroundColor: (context) => {
                        const { chart } = context;
                        const { ctx, chartArea } = chart;

                        if (!chartArea) {
                            return null;
                        }
                        // Create a linear gradient
                        const gradient = ctx.createLinearGradient(
                            chartArea.left, 
                            chartArea.top, 
                            chartArea.left, 
                            chartArea.bottom
                        );
                        gradient.addColorStop(0, 'rgba(255, 0, 0, 0.5)'); // Red color
                        gradient.addColorStop(1, 'rgba(255, 182, 193, 0.5)'); // Light purple color

                        return gradient;
                    },
                    borderColor: "transparent",
                    borderWidth: 0,
                },
            ],
        });
    }, [nominas]);

    const options = {
        scales: {
            x: {
                display: true,
                grid: {
                    display: false,
                },
                ticks: {
                    color: 'whitesmoke',
                    font: {
                        family: 'Poppins',
                        size: 11,
                        weight: 'bold',
                    },
                },
                border: {
                    color: 'white', // Color del borde del eje x
                    width: 1, // Ancho del borde del eje x
                },
            },
            y: {
                display: true,
                grid: {
                    display: false,
                },
                ticks: {
                    color: 'whitesmoke',
                    font: {
                        family: 'Poppins',
                        size: 11,
                        weight: 'bold',
                    },
                },
                border: {
                    color: 'white', // Color del borde del eje y
                    width: 1, // Ancho del borde del eje y
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: "top",
                labels: {
                    color: 'whitesmoke',
                    font: {
                        family: 'Poppins',
                        size: 11,
                        weight: 'bold',
                    },
                },
            },
        },
        layout: {
            padding: 20,
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div style={{ width: "700px", height: "400px", marginTop: "10px" }}>
            {chartData.labels && chartData.labels.length > 0 ? (
                <Bar data={chartData} options={options} />
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};


/* export function EmpleadosMasLiquidadosChart ({ detalles }) {
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, { width: 600, height: 300 });
    const barSeries = chart.addBarSeries();
    
    const data = detalles.reduce((acc, detalle) => {
      if (!acc[detalle.empleadoId]) {
        acc[detalle.empleadoId] = { time: detalle.empleadoId, value: 0 };
      }
      acc[detalle.empleadoId].value += detalle.valor;
      return acc;
    }, {});

    barSeries.setData(Object.values(data));

    return () => chart.remove();
  }, [detalles]);

  return <div ref={chartContainerRef} />;
};

export function EmpleadosMasHorasChart ({ detalles }) {
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, { width: 600, height: 300 });
    const barSeries = chart.addBarSeries();
    
    const data = detalles.reduce((acc, detalle) => {
      if (!acc[detalle.empleadoId]) {
        acc[detalle.empleadoId] = { time: detalle.empleadoId, value: 0 };
      }
      acc[detalle.empleadoId].value += detalle.horasExtras;
      return acc;
    }, {});

    barSeries.setData(Object.values(data));

    return () => chart.remove();
  }, [detalles]);

  return <div ref={chartContainerRef} />;
};

export function Top5LiquidacionesChart ({ detalles }) {
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, { width: 600, height: 300 });
    const barSeries = chart.addBarSeries();

    const top5 = detalles
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5)
      .map(detalle => ({ time: detalle.empleadoId, value: detalle.valor }));

    barSeries.setData(top5);

    return () => chart.remove();
  }, [detalles]);

  return <div ref={chartContainerRef} />;
}; */
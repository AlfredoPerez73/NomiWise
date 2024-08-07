import React, { useEffect, useState } from "react";
import { Chart as ChartJS, BarElement, BarController, CategoryScale, LinearScale, Title, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from "react-chartjs-2";
import { parseISO, format } from "date-fns";

// Register necessary components
ChartJS.register(BarElement, BarController, CategoryScale, LinearScale, Title, ArcElement, Tooltip, Legend);

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

function generateGradient(ctx, startColor, endColor) {
    const gradient = ctx.createLinearGradient(0, 0, 500, 0);
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);
    return gradient;
}

function truncateLabel(label, maxLength) {
    return label.length > maxLength ? `${label.slice(0, maxLength)}...` : label;
}

export function EmpleadosMasLiquidadosChart({ detalles, empleados }) {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const data = detalles.reduce((acc, detalle) => {
            const empleado = empleados.find(e => e.idEmpleado === detalle.idEmpleado);
            const nombreEmpleado = empleado ? empleado.nombre : 'Nombre desconocido';
            if (!acc[detalle.idEmpleado]) {
                acc[detalle.idEmpleado] = {
                    idEmpleado: detalle.idEmpleado,
                    nombre: nombreEmpleado,
                    count: 0,
                    devengado: 0
                };
            }
            acc[detalle.idEmpleado].count += 1;
            acc[detalle.idEmpleado].devengado += detalle.devengado;
            return acc;
        }, {});

        const values = Object.values(data);

        values.sort((a, b) => b.count - a.count);
        const top5Values = values.slice(0, 5);

        const labels = top5Values.map(detalle => truncateLabel(detalle.nombre, 13));
        const dataSet = top5Values.map(detalle => detalle.count);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const gradients = [
            generateGradient(ctx, '#FAA6FF', '#FAA6FF01'),  // Mauve
            generateGradient(ctx, '#7353BA', '#7353BA01'),  // Royal purple
            generateGradient(ctx, '#2F195F', '#2F195F01'),  // Russian violet
            generateGradient(ctx, '#0F1020', '#0F102001'),  // Rich black
            generateGradient(ctx, '#EFC3F5', '#EFC3F501'),  // Pink lavender
        ];

        const backgroundColors = dataSet.map((_, index) => {
            return gradients[index % gradients.length];
        });

        const chartData = {
            labels,
            datasets: [{
                data: dataSet,
                backgroundColor: backgroundColors,
                borderColor: 'transparent',
                borderWidth: 0,
            }]
        };

        setChartData(chartData);
    }, [detalles,empleados]);

    const options = {
        plugins: {
            legend: {
                display: true,
                position: 'right',
                labels: {
                    color: "whitesmoke",
                    font: {
                        family: 'Poppins',
                        size: 10,
                        weight: 'bold',
                    },
                }
            }
        }
    };

    return (
        <div style={{ width: "500px", height: "500px", marginTop: "-170px", marginBottom: "-40px" }}>
            {chartData ? <Pie data={chartData} options={options} /> : <p>No data available</p>}
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
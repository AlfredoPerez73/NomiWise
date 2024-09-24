import React, { useEffect, useState } from "react";
import { Chart as ChartJS, BarElement, BarController, CategoryScale, LinearScale, Title, ArcElement, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import { parseISO, format } from "date-fns";
import 'chartjs-plugin-annotation';


ChartJS.register(BarElement, BarController, CategoryScale, LinearScale, Title, ArcElement, PointElement, LineElement, Tooltip, Legend, Filler);

export function NominaFechaChart({ datos }) {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        if (!datos || !Array.isArray(datos)) {
            return;
        }

        // Crear un objeto para agrupar por mes
        const monthlyTotals = {};

        datos.forEach((nomina) => {
            const month = format(parseISO(nomina.fechaRegistro), "yyyy-MM");
            const total = Number(nomina.total);

            if (monthlyTotals[month]) {
                monthlyTotals[month] += total; // Sumar si ya existe
            } else {
                monthlyTotals[month] = total; // Inicializar si no existe
            }
        });

        // Convertir el objeto a un arreglo y ordenar por fecha
        const uniqueData = Object.entries(monthlyTotals)
            .map(([date, total]) => ({ date, total }))
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 12); // Tomar solo los últimos 12 meses

        const dates = uniqueData.map((d) => d.date);
        const totals = uniqueData.map((d) => d.total);

        setChartData({
            labels: dates,
            datasets: [
                {
                    label: "Total Nómina",
                    data: totals,
                    backgroundColor: (context) => {
                        const { chart } = context;
                        const { ctx, chartArea } = chart;

                        if (!chartArea) {
                            return null;
                        }
                        const gradient = ctx.createLinearGradient(
                            chartArea.left,
                            chartArea.top,
                            chartArea.left,
                            chartArea.bottom
                        );
                        gradient.addColorStop(0, 'rgba(255, 0, 0, 0.5)');
                        gradient.addColorStop(1, 'rgba(255, 182, 193, 0.5)');

                        return gradient;
                    },
                    borderRadius: 15,
                    borderSkipped: false,
                    borderColor: "transparent",
                    borderWidth: 0,
                },
            ],
        });
    }, [datos]);

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
                    color: 'transparent',
                    width: 1,
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
                    color: 'transparent',
                    width: 1,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
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
        barThickness: 12,
        maxBarThickness: 40,
    };

    return (
        <div style={{ width: "1100px", height: "300px", marginTop: "10px" }}>
            {chartData.labels && chartData.labels.length > 0 ? (
                <Bar data={chartData} options={options} />
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
}

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
        const empleadoMap = empleados.reduce((acc, empleado) => {
            acc[empleado.idEmpleado] = empleado.nombre;
            return acc;
        }, {});
        const data = detalles.reduce((acc, detalle) => {
            const nombreEmpleado = empleadoMap[detalle.idEmpleado] || 'Desconocido';
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
            generateGradient(ctx, '#FAA6FF', '#FAA6FF01'),
            generateGradient(ctx, '#7353BA', '#7353BA01'),
            generateGradient(ctx, '#2F195F', '#2F195F01'),
            generateGradient(ctx, '#0F1020', '#0F102001'),
            generateGradient(ctx, '#EFC3F5', '#EFC3F501'),
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
    }, [detalles, empleados]);

    const options = {
        plugins: {
            legend: {
                display: true,
                position: 'top',
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
        <div style={{ width: "340px", height: "320px", marginTop: "-200px", marginBottom: "-10px", marginLeft: "20px" }}>
            {chartData && chartData.labels && chartData.labels.length > 0 ? (
                <Pie data={chartData} options={options} />
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
}

export function EmpleadosMasHorasChart({ detalles, empleados }) {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const empleadoMap = empleados.reduce((acc, empleado) => {
            acc[empleado.idEmpleado] = empleado.nombre;
            return acc;
        }, {});

        const data = detalles.reduce((acc, detalle) => {
            const nombreEmpleado = empleadoMap[detalle.idEmpleado] || 'Desconocido';
            if (!acc[detalle.idEmpleado]) {
                acc[detalle.idEmpleado] = {
                    idEmpleado: detalle.idEmpleado,
                    nombre: nombreEmpleado,
                    horasExtras: 0
                };
            }
            acc[detalle.idEmpleado].horasExtras += detalle.horasExtras;
            return acc;
        }, {});

        const values = Object.values(data);

        // Ordenar de mayor a menor por horasExtras
        values.sort((a, b) => a.horasExtras - b.horasExtras);
        const topValues = values.slice(0, 10);

        const labels = topValues.map(detalle => truncateLabel(detalle.nombre, 13));
        const dataSet = topValues.map(detalle => detalle.horasExtras);

        const createGradient = (ctx) => {
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(0, 4, 40, 1)');
            gradient.addColorStop(1, 'rgba(23, 23, 56, 0)');
            return gradient;
        };

        const chartData = {
            labels,
            datasets: [{
                label: 'Horas Extras',
                data: dataSet,
                borderColor: '#004e92',
                borderWidth: 3,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    return createGradient(ctx);
                },
                fill: true,
                tension: 0.5, // Suaviza las líneas
                pointRadius: 0, // Elimina los puntos en la línea
            }]
        };

        setChartData(chartData);
    }, [detalles, empleados]);

    return (
        <div style={{ width: "800px", height: "300px", marginBottom: "-10px" }}>
            {chartData && chartData.labels && chartData.labels.length > 0 ? (
                <Line data={chartData} options={{
                    plugins: {
                        legend: {
                            display: false,
                            position: 'right',
                            labels: {
                                font: {
                                    size: 11,
                                    family: 'Poppins',
                                    weight: 'bold',
                                },
                                color: '#FFFFFF',
                                boxWidth: 20,
                                padding: 15,
                                usePointStyle: true,
                                pointStyle: 'circle'
                            }
                        }
                    },
                    scales: {
                        x: {
                            display: true,
                            grid: {
                                display: false,
                            },
                            ticks: {
                                color: 'whitesmoke',
                                font: {
                                    size: 11,
                                    family: 'Poppins',
                                    weight: 'bold',
                                },
                            },
                            border: {
                                color: 'white',
                                width: 0,
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
                                    size: 11,
                                    family: 'Poppins',
                                    weight: 'bold',
                                },
                            },
                            border: {
                                color: 'white',
                                width: 0,
                            },
                        }
                    }
                }} />
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
}


export function EmpleadosPorContratoChart({ empleados, contratos }) {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const contratoMap = contratos.reduce((acc, contrato) => {
            acc[contrato.idContrato] = contrato.tipoContrato;
            return acc;
        }, {});

        const data = empleados.reduce((acc, empleado) => {
            const tipoContrato = contratoMap[empleado.idContrato] || 'Desconocido';
            if (!acc[tipoContrato]) {
                acc[tipoContrato] = 0;
            }
            acc[tipoContrato]++;
            return acc;
        }, {});

        const labels = Object.keys(data);
        const dataSet = Object.values(data);

        const colors = ['#2F6690', '#3A7CA5', '#102542', '#81C3D7', '#170A1C', '#102542'];

        const chartData = {
            labels,
            datasets: [{
                data: dataSet,
                backgroundColor: colors.slice(0, labels.length),
                hoverBackgroundColor: colors.slice(0, labels.length),
                borderWidth: 0
            }]
        };

        setChartData(chartData);
    }, [empleados, contratos]);

    return (
        <div style={{ width: "340px", height: "320px", marginBottom: "-10px", marginLeft: "20px" }}>
            {chartData && chartData.labels && chartData.labels.length > 0 ? (
                <Doughnut data={chartData} options={{
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                font: {
                                    size: 11,
                                    family: 'Poppins',
                                    weight: 'bold',
                                },
                                color: 'whitesmoke',
                                boxWidth: 20,
                                padding: 15,
                                usePointStyle: true,
                                pointStyle: 'circle'
                            }
                        }
                    }
                }} />
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
}
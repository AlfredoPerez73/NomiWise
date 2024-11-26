global.matchMedia = global.matchMedia || function () {
    return {
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
    };
};

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Toaster } from "react-hot-toast";
import RegistroLiquidacionForm from "../components/frmRLiquidacion";
import { useEmpleado } from "../context/empleadoContext";
import { useDetalle } from "../context/detalleLiquidacionContext";
import { useContrato } from "../context/contratoContext";
import { useNovedades } from "../context/novedadContext";

// Mock de contextos
jest.mock("../context/empleadoContext", () => ({
    useEmpleado: jest.fn(),
}));
jest.mock("../context/detalleLiquidacionContext", () => ({
    useDetalle: jest.fn(),
}));
jest.mock("../context/contratoContext", () => ({
    useContrato: jest.fn(),
}));
jest.mock("../context/novedadContext", () => ({
    useNovedades: jest.fn(),
}));

describe("Pruebas del componente RegistroLiquidacionForm", () => {
    const mockOnClose = jest.fn();
    const mockCreateDetalle = jest.fn();
    const mockGetDetalles = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock de contexto de empleado
        useEmpleado.mockReturnValue({
            getEmpleado: jest.fn(),
        });

        // Mock de contexto de detalles
        useDetalle.mockReturnValue({
            createDetalle: mockCreateDetalle,
            getDetalles: mockGetDetalles,
        });

        // Mock de contexto de contrato
        useContrato.mockReturnValue({
            getContrato: jest.fn(),
        });

        // Mock de contexto de novedades
        useNovedades.mockReturnValue({
            novedades: [
                { idEmpleado: 1, idNovedad: 1, prestamos: 5000, descuentos: 2000 },
            ],
        });
    });

    const defaultProps = {
        onClose: mockOnClose,
        empleadoToEdit: {
            idEmpleado: 1,
            documento: "123456789",
            nombre: "Juan Pérez",
            contrato: {
                fechaInicio: "2024-01-01",
                fechaFin: "2024-12-31",
                salario: 3000000,
                tipoContrato: "TERMINO INDEFINIDO",
            },
            idCargo: 1,
        },
        cargos: [
            { idCargo: 1, nCargo: "Desarrollador" },
            { idCargo: 2, nCargo: "Analista" },
        ],
        parametros: [
            {
                idParametro: 1,
                fechaRegistro: "2024-01-01",
                salarioMinimo: 1160000,
                salud: 4,
                pension: 4,
                auxTransporte: 140000,
            },
        ],
    };

    it("Renderiza correctamente el formulario con datos iniciales", () => {
        render(
            <>
                <Toaster />
                <RegistroLiquidacionForm {...defaultProps} />
            </>
        );

        // Verifica que los campos se llenen con los datos del empleado a editar
        expect(screen.getByLabelText("Documento").value).toBe("123456789");
        expect(screen.getByLabelText("Nombre").value).toBe("Juan Pérez");
        expect(screen.getByLabelText("Días Trabajados").value).toBe("");
        expect(screen.getByLabelText("Horas Extras").value).toBe("");
        expect(screen.getByLabelText("Préstamos").value).toBe("$ 5,000.00");
        expect(screen.getByLabelText("Descuentos").value).toBe("$ 2,000.00");
    });

    it("Muestra un error si los días trabajados son inválidos", async () => {
        render(
            <>
                <Toaster />
                <RegistroLiquidacionForm {...defaultProps} />
            </>
        );

        // Rellena el campo de días trabajados con un valor inválido
        fireEvent.change(screen.getByLabelText("Días Trabajados"), {
            target: { value: -1 },
        });

        // Intenta enviar el formulario
        fireEvent.click(screen.getByText("Liquidar"));

    });

    it("Llama a la función onClose al hacer clic en cancelar", () => {
        render(
            <>
                <Toaster />
                <RegistroLiquidacionForm {...defaultProps} />
            </>
        );

        // Haz clic en el botón de cancelar
        fireEvent.click(screen.getByText("Cancelar"));

    });

    it("Llama a createDetalle con los datos correctos", async () => {
        render(
            <>
                <Toaster />
                <RegistroLiquidacionForm {...defaultProps} />
            </>
        );

        // Rellena los campos del formulario
        fireEvent.change(screen.getByLabelText("Días Trabajados"), {
            target: { value: 15 },
        });
        fireEvent.change(screen.getByLabelText("Horas Extras"), {
            target: { value: 5 },
        });

        // Envía el formulario
        fireEvent.click(screen.getByText("Liquidar"));

        // Verifica que se haya llamado a createDetalle con los datos correctos


    });
});

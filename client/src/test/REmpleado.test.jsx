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
import RegistroEmpleadoForm from "../components/frmREmpleado";
import { useEmpleado } from "../context/empleadoContext";
import { useContrato } from "../context/contratoContext";

// Mock de contextos
jest.mock("../context/empleadoContext");
jest.mock("../context/contratoContext");

describe("Prueba de frmREmpleado", () => {
    const mockOnClose = jest.fn();
    const mockCreateEmpleado = jest.fn();
    const mockUpdateEmpleado = jest.fn();
    const mockGetEmpleado = jest.fn();
    const mockGetContrato = jest.fn();

    beforeEach(() => {
        useEmpleado.mockReturnValue({
            createEmpleado: mockCreateEmpleado,
            updateEmpleado: mockUpdateEmpleado,
            getEmpleado: mockGetEmpleado,
        });
        useContrato.mockReturnValue({
            getContrato: mockGetContrato,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const cargosMock = [
        { idCargo: "1", nCargo: "Developer" },
        { idCargo: "2", nCargo: "Designer" },
    ];

    it("Prueba Unitaria al componente de registro de empleados", () => {
        render(
            <>
                <Toaster />
                <RegistroEmpleadoForm
                    onClose={mockOnClose}
                    cargos={cargosMock}
                    isReadOnly={false}
                />
            </>
        );
    });

    it("Renderiza y llama la funcion createEmpleado para registrarlo", async () => {
        render(
            <RegistroEmpleadoForm
                onClose={mockOnClose}
                cargos={cargosMock}
                isReadOnly={false}
            />
        );

        // Llena los campos del formulario
        fireEvent.change(screen.getByLabelText("Documento"), {
            target: { value: "12345" },
        });
        fireEvent.change(screen.getByLabelText("Nombre"), {
            target: { value: "John Doe" },
        });
        fireEvent.change(screen.getByLabelText("Salario"), {
            target: { value: "5000" },
        });
        fireEvent.change(screen.getByTestId("cargo"), {
            target: { value: "1" },
        });
        fireEvent.change(screen.getByTestId("fechaInicio"), {
            target: { value: "2024-01-01" },
        });
        fireEvent.change(screen.getByTestId("fechaFin"), {
            target: { value: "2024-02-01" },
        });
                    
        fireEvent.change(screen.getByTestId("contrato"), {
            target: { value: "TERMINO FIJO" },
        });

        // Envía el formulario
        fireEvent.click(screen.getByText("Registrar"));

        // Verifica que se haya llamado la función mock
        expect(mockCreateEmpleado).toHaveBeenCalledWith({
            documento: "12345",
            nombre: "John Doe",
            estado: "ACTIVO",
            idCargo: "1",
            fechaInicio: "2024-01-01",
            fechaFin: "2024-02-01",
            salario: "5000",
            tipoContrato: "TERMINO FIJO",
        });
    });

    it("Valida el envio de campos de las fechas del contrato", () => {
        render(
            <RegistroEmpleadoForm
                onClose={mockOnClose}
                cargos={cargosMock}
                isReadOnly={false}
            />
        );

        fireEvent.change(screen.getByTestId("fechaInicio"), {
            target: { value: "2024-01-01" },
        });
        fireEvent.change(screen.getByTestId("fechaFin"), {
            target: { value: "2024-02-01" },
        });
        
        // Envía el formulario
        fireEvent.click(screen.getByText("Registrar"));

    });

    it("Llama el cierre del formulario", () => {
        render(
            <RegistroEmpleadoForm
                onClose={mockOnClose}
                cargos={cargosMock}
                isReadOnly={false}
            />
        );

        // Haz clic en el botón de cancelar
        fireEvent.click(screen.getByText("Cancelar"));

        // Verifica que se haya llamado la función onClose
        expect(mockOnClose).toHaveBeenCalled();
    });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Toaster } from "react-hot-toast";
import EvaluacionEmpleadoForm from "../components/frmEvaluacion";
import { useEmpleado } from "../context/empleadoContext";
import { useEval } from "../context/evalContext";
import { useAuth, AuthProvider } from "../context/authContext"; // Asegúrate de importar el AuthProvider

// Mock de contextos
jest.mock("../context/empleadoContext");
jest.mock("../context/evalContext");
jest.mock("../context/authContext");

describe("Pruebas de EvaluacionEmpleadoForm", () => {
    const mockOnClose = jest.fn();
    const mockSubmitEvaluacion = jest.fn();

    beforeEach(() => {
        useEmpleado.mockReturnValue({
            selectedEmpleado: { nombre: "Juan Pérez" }, // Empleado mock
            empleadoToEvaluate: {
                productividad: "50",
                puntualidad: "60",
                trabajoEnEquipo: "70",
                adaptabilidad: "80",
                conocimientoTecnico: "90",
            },
        });
        useEval.mockReturnValue({
            submitEvaluacion: mockSubmitEvaluacion,
        });
        useAuth.mockReturnValue({
            user: { nombre: "John Doe" }, // Ejemplo de usuario mockeado
            login: jest.fn(),
            logout: jest.fn(),
        });
    });



    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Renderiza el formulario correctamente", () => {
        render(
            <AuthProvider>
            <Toaster />
            <EvaluacionEmpleadoForm onClose={mockOnClose} />
        </AuthProvider>

        );

        // Verificar que el encabezado contiene el nombre del empleado

        // Verificar que cada métrica aparece en el formulario
        ["Productividad", "Puntualidad", "TrabajoEnEquipo", "Adaptabilidad", "ConocimientoTecnico"].forEach((metric) => {
            expect(screen.getByTestId(metric)).toBeInTheDocument();
        });

        // Verificar que los botones están renderizados
        expect(screen.getByText("Evaluar")).toBeInTheDocument();
        expect(screen.getByText("Cerrar")).toBeInTheDocument();
    });

    it("Llama a la función de evaluación con los datos correctos", () => {
        render(
            <AuthProvider>
            <Toaster />
            <EvaluacionEmpleadoForm onClose={mockOnClose} />
        </AuthProvider>
        );

        // Cambiar valores de métricas
        fireEvent.change(screen.getByLabelText("Productividad"), { target: { value: "80" } });
        fireEvent.change(screen.getByLabelText("Puntualidad"), { target: { value: "70" } });

        // Enviar el formulario
        fireEvent.click(screen.getByText("Evaluar"));

        // Verificar que se haya llamado la función mock con los datos correctos
        expect(mockSubmitEvaluacion).toHaveBeenCalledWith({
            productividad: "80",
            puntualidad: "70",
            trabajoEnEquipo: "70",
            adaptabilidad: "80",
            conocimientoTecnico: "90",
        });
    });

    it("Cierra el formulario al hacer clic en el botón de cerrar", () => {
        render(
            <AuthProvider>
            <Toaster />
            <EvaluacionEmpleadoForm onClose={mockOnClose} />
        </AuthProvider>
        );

        // Haz clic en el botón de cerrar
        fireEvent.click(screen.getByText("Cerrar"));

        // Verificar que se llamó la función mock para cerrar
        expect(mockOnClose).toHaveBeenCalled();
    });
});

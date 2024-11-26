global.matchMedia = global.matchMedia || function () {
    return {
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
    };
};

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegistroRoles from "../components/frmRol"; // Ajusta la ruta según tu estructura
import { useRol } from "../context/rolContext";

// Mock del contexto de roles
jest.mock("../context/rolContext", () => ({
    useRol: jest.fn(),
}));

const mockCreateRol = jest.fn();
const mockGetRol = jest.fn();
const mockDeleteRol = jest.fn();
const mockUpdateRol = jest.fn();

describe("Prueba del componente frmRol", () => {
    beforeEach(() => {
        useRol.mockReturnValue({
            roles: [
                { idRol: "1", nRol: "Administrador", fechaRegistro: "2024-11-01" },
                { idRol: "2", nRol: "Usuario", fechaRegistro: "2024-11-15" },
            ],
            createRol: mockCreateRol,
            getRol: mockGetRol,
            deleteRol: mockDeleteRol,
            updateRol: mockUpdateRol,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Renderizado de componente frmRol", () => {
        render(<RegistroRoles />);
    });

    test("Renderiza el componente y registra", async () => {
        render(<RegistroRoles />);

        // Espera a que el input esté presente en el DOM
        const input = await screen.findByTestId("roleNameInput");
        const button = screen.getByText("Registrar");
    
        fireEvent.change(input, { target: { value: "NuevoRol" } });
        fireEvent.click(button);
    
        await waitFor(() => {
            expect(mockCreateRol).toHaveBeenCalledWith({ nRol: "NuevoRol" });
        });
    });    
    
    test("Realiza una pruba del filtro", async () => {
        render(<RegistroRoles />);
        const searchInput = screen.getByPlaceholderText("Filtrar roles");
        fireEvent.change(searchInput, { target: { value: "Admin" } });

        await waitFor(() => {
            const filteredRows = screen.getAllByRole("row");
            expect(filteredRows).toHaveLength(2); // Solo debería mostrar el rol que coincide con "Admin"
        });
    });
});

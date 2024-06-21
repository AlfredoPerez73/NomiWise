import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/authContext";
import ProtectedRoutes from "../ProtectedRoutes";
import Login from "../pages/login";
import Menu from "../pages/menu";
import { RolProvider } from "../context/rolContext";
import { CargoProvider } from "../context/cargoContext";
import { PermisosProvider } from "../context/permisoContext";
import { UsuarioProvider } from "../context/usuarioContext";

const AppRoutes = () => {
    return (
        <>
            <AuthProvider>
                <RolProvider>
                    <CargoProvider>
                        <PermisosProvider>
                            <UsuarioProvider>
                                <BrowserRouter>
                                    <Routes>
                                        <Route path="/login" element={<Login />} />

                                        <Route element={<ProtectedRoutes />}>
                                            <Route path="/menu" element={<Menu />} />
                                        </Route>
                                    </Routes>
                                </BrowserRouter>
                            </UsuarioProvider>
                        </PermisosProvider>
                    </CargoProvider>
                </RolProvider>
            </AuthProvider>
        </>
    );
};

export default AppRoutes;
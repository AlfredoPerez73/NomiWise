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

import FrmRol from "../components/frmRol";
import FrmCargo from "../components/frmCargo";
import FrmPermiso from "../components/frmPermiso";
import FrmUsuario from "../components/frmUsuario";

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
                                            <Route path="/menu" element={<Menu />}>
                                                <Route path="empleados" element={<div>Empleados</div>} />
                                                <Route path="contratos" element={<div>Contratos</div>} />
                                                <Route path="cargos" element={<FrmCargo />} />
                                                <Route path="reportes" element={<div>Reportes</div>} />
                                                <Route path="liquidaciones" element={<div>Liquidaciones</div>} />
                                                <Route path="nomina" element={<div>Nomina</div>} />
                                                <Route path="usuarios" element={<FrmUsuario />} />
                                                <Route path="roles" element={<FrmRol />} />
                                                <Route path="permisos" element={<FrmPermiso />} />
                                            </Route>
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
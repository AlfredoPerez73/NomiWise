import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/authContext";
import ProtectedRoutes from "../ProtectedRoutes";
import ProtectedRouteWithPermission from "../ProtectedRouteWithPermission";
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
import FrmEmpleado from "../components/frmEmpleado";
import { EmpleadoProvider } from "../context/empleadoContext";
import { ContratoProvider } from "../context/contratoContext";

const AppRoutes = () => {
  return (
    <>
      <AuthProvider>
        <RolProvider>
          <CargoProvider>
            <PermisosProvider>
              <UsuarioProvider>
                <EmpleadoProvider>
                  <ContratoProvider>
                    <BrowserRouter>
                      <Routes>
                        <Route path="/login" element={<Login />} />

                        <Route element={<ProtectedRoutes />}>
                          <Route path="/menu" element={<Menu />}>
                            <Route element={<ProtectedRouteWithPermission requiredPermission="Empleados" />}>
                              <Route path="empleados" element={<FrmEmpleado />} />
                            </Route>
                            <Route element={<ProtectedRouteWithPermission requiredPermission="Contratos" />}>
                              <Route path="contratos" element={<div>Contratos</div>} />
                            </Route>
                            <Route element={<ProtectedRouteWithPermission requiredPermission="Cargos" />}>
                              <Route path="cargos" element={<FrmCargo />} />
                            </Route>
                            <Route element={<ProtectedRouteWithPermission requiredPermission="Reportes" />}>
                              <Route path="reportes" element={<div>Reportes</div>} />
                            </Route>
                            <Route element={<ProtectedRouteWithPermission requiredPermission="Liquidaciones" />}>
                              <Route path="liquidaciones" element={<div>Liquidaciones</div>} />
                            </Route>
                            <Route element={<ProtectedRouteWithPermission requiredPermission="Nomina" />}>
                              <Route path="nomina" element={<div>Nomina</div>} />
                            </Route>
                            <Route element={<ProtectedRouteWithPermission requiredPermission="Usuarios" />}>
                              <Route path="usuarios" element={<FrmUsuario />} />
                            </Route>
                            <Route element={<ProtectedRouteWithPermission requiredPermission="Roles" />}>
                              <Route path="roles" element={<FrmRol />} />
                            </Route>
                            <Route element={<ProtectedRouteWithPermission requiredPermission="Permisos" />}>
                              <Route path="permisos" element={<FrmPermiso />} />
                            </Route>
                          </Route>
                        </Route>
                      </Routes>
                    </BrowserRouter>
                  </ContratoProvider>
                </EmpleadoProvider>
              </UsuarioProvider>
            </PermisosProvider>
          </CargoProvider>
        </RolProvider>
      </AuthProvider>
    </>
  );
};

export default AppRoutes;

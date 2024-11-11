import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/authContext";
import ProtectedRoutes from "../ProtectedRoutes";
import ProtectedRouteWithPermission from "../ProtectedRouteWithPermission";

import Login from "../pages/login";
import Menu from "../pages/menu";
import { RolProvider } from "../context/rolContext";
import { CargoProvider } from "../context/cargoContext";
import { PermisosProvider } from "../context/permisoContext";
import { UsuarioProvider } from "../context/usuarioContext";
import { EmpleadoProvider } from "../context/empleadoContext";
import { EvalProvider } from "../context/evalContext";
import { ContratoProvider } from "../context/contratoContext";
import { NominaProvider } from "../context/nominaContext";
import { ParametrosProvider } from "../context/parametroContext";
import { NovedadesProvider } from "../context/novedadContext";
import { DetalleProvider } from "../context/detalleLiquidacionContext";

import FrmRol from "../components/frmRol";
import FrmCargo from "../components/frmCargo";
import FrmPermiso from "../components/frmPermiso";
import FrmUsuario from "../components/frmUsuario";
import FrmEmpleado from "../components/frmEmpleado";
import FrmDespidos from "../components/frmDespidos";
import FrmEvaluacion from "../components/frmEvaluacion";
import FrmLiquidaciones from "../components/frmLiquidacion";
import FrmNovedades from "../components/frmNovedades";
import FrmNomnina from "../components/frmNomina";
import DashboardCards from "../components/Dashboard";


const AppRoutes = () => {
  return (
    <>
      <AuthProvider>
        <RolProvider>
          <CargoProvider>
            <PermisosProvider>
              <UsuarioProvider>
                <EmpleadoProvider>
                  <EvalProvider>
                    <ContratoProvider>
                      <DetalleProvider>
                        <NominaProvider>
                          <ParametrosProvider>
                            <NovedadesProvider>
                              <BrowserRouter>
                                <Routes>
                                  <Route path="/login" element={<Login />} />

                                  <Route element={<ProtectedRoutes />}>
                                    <Route path="/menu" element={<Menu />}>
                                      <Route path="/menu" element={<ProtectedRouteWithPermission requiredPermission="Inicio" />}>
                                        <Route index element={<DashboardCards />} />
                                      </Route>
                                      <Route element={<ProtectedRouteWithPermission requiredPermission="Empleados" />}>
                                        <Route path="empleados" element={<FrmEmpleado />} />
                                      </Route>
                                      <Route element={<ProtectedRouteWithPermission requiredPermission="Despidos" />}>
                                        <Route path="despidos" element={<FrmDespidos />} />
                                      </Route>
                                      <Route element={<ProtectedRouteWithPermission requiredPermission="Evaluaciones" />}>
                                        <Route path="evaluaciones" element={<FrmEvaluacion />} />
                                      </Route>
                                      <Route element={<ProtectedRouteWithPermission requiredPermission="Cargos" />}>
                                        <Route path="cargos" element={<FrmCargo />} />
                                      </Route>
                                      <Route element={<ProtectedRouteWithPermission requiredPermission="Liquidaciones" />}>
                                        <Route path="liquidaciones" element={<FrmLiquidaciones />} />
                                      </Route>
                                      <Route element={<ProtectedRouteWithPermission requiredPermission="Novedades" />}>
                                        <Route path="novedades" element={<FrmNovedades />} />
                                      </Route>
                                      <Route element={<ProtectedRouteWithPermission requiredPermission="Nomina" />}>
                                        <Route path="nomina" element={<FrmNomnina />} />
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
                            </NovedadesProvider>
                          </ParametrosProvider>
                        </NominaProvider>
                      </DetalleProvider>
                    </ContratoProvider>
                  </EvalProvider>
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

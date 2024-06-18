import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/authContext";
import ProtectedRoutes from "../ProtectedRoutes";
import Login from "../pages/login";
import Registro from "../pages/registro";
import Menu from "../pages/menu";
import { RolProvider } from "../context/rolContext";

const AppRoutes = () => {
    return (
        <>
            <AuthProvider>
                <RolProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/registro" element={<Registro />} />

                            <Route element={<ProtectedRoutes />}>
                                <Route path="/menu" element={<Menu />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </RolProvider>
            </AuthProvider>
        </>
    );
};

export default AppRoutes;
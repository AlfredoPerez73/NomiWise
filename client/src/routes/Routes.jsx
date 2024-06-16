import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/authContext";
import ProtectedRoutes from "../ProtectedRoutes";
import Login from "../pages/login";
import Registro from "../pages/registro";
import Menu from "../pages/menu";

const AppRoutes = () => {
    return (
        <>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/registro" element={<Registro />} />

                        <Route element={<ProtectedRoutes />}>
                            <Route path="/menu" element={<Menu />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </>
    );
};

export default AppRoutes;
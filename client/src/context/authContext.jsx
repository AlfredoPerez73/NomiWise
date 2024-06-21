import { loginRequestUsuario, verityTokenRequestUsuario } from '../api/usuario/usuarioAuth'
import { createContext, useState, useContext, useEffect } from "react";
import Cookies from 'js-cookie'

export const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth ya esta usado");
    }
    return context;
}

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(true)

    const signinu = async (usuario) => {
        try {
            const response = await loginRequestUsuario(usuario);
            console.log(response.data);
            setIsAuthenticated(true);
            setUsuario(response.data);
        } catch (error) {
            console.error(error);
            setErrors(error.response.data);
            throw new Error(error.response.data.message || "Error en el inicio de sesión");
        }
    }

    const logout = () => {
        Cookies.remove("token");
        setIsAuthenticated(false);
        setUsuario(null);
    }

    useEffect(() => {
        async function checkLogin() {
            const cookies = Cookies.get();
            if (!cookies.token) {
                setIsAuthenticated(false);
                setLoading(false);
                return setUsuario(null);
            }
            try {
                const res = await verityTokenRequestUsuario(cookies.token);
                console.log(res);
                if (!res.data) {
                    setIsAuthenticated(false);
                    setLoading(false);
                    return;
                }
                setIsAuthenticated(true);
                setUsuario(res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setIsAuthenticated(false);
                setUsuario(null);
                setLoading(false);
            }
        }

        checkLogin();
    }, []);


    return (
        <AuthContext.Provider value={{
            signinu,
            logout,
            loading,
            usuario,
            isAuthenticated,
            errors
        }}>
            {children}
        </AuthContext.Provider>
    )
}
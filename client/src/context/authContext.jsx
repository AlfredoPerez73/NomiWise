import { registerRequest, loginRequest, verityTokenRequest } from '../api/auth'
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
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(true)

    const signup = async (user) => {
        const response = await registerRequest(user);
        console.log(response.data);
        setIsAuthenticated(true);
        setUser(response.data);

    }

    const signin = async (user) => {
        try {
            const response = await loginRequest(user);
            console.log(response.data);
            setIsAuthenticated(true);
            setUser(response.data);
        } catch (error) {
            console.error(error);
            setErrors(error.response.data);
            throw new Error(error.response.data.message || "Error en el inicio de sesión");
        }
    }

    const logout = () => {
        Cookies.remove("token");
        setIsAuthenticated(false);
        setUser(null);
    }

    useEffect(() => {
        async function checkLogin() {
            const cookies = Cookies.get();
            if (!cookies.token) {
                setIsAuthenticated(false);
                setLoading(false);
                return setUser(null);
            }
            try {
                const res = await verityTokenRequest(cookies.token);
                console.log(res);
                if (!res.data) {
                    setIsAuthenticated(false);
                    setLoading(false);
                    return;
                }
                setIsAuthenticated(true);
                setUser(res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
            }
        }

        checkLogin();
    }, []);


    return (
        <AuthContext.Provider value={{
            signup,
            signin,
            logout,
            loading,
            user,
            isAuthenticated,
            errors
        }}>
            {children}
        </AuthContext.Provider>
    )
}
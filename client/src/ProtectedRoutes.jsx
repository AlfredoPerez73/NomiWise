import { useAuth } from "./context/authContext";
import { Navigate, Outlet } from 'react-router-dom';
import "./css/loading.css";


function ProtectedRoutes() {
    const { loading, isAuthenticated } = useAuth()
    console.log(loading, isAuthenticated);

    if (loading) return (
        <div className="spinner-container">
            <div className="dot-spinner">
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
            </div>
        </div>
    );
    
    if (!loading && !isAuthenticated) return <Navigate to='/login' replace />
    return (
        <Outlet />
    )
}

export default ProtectedRoutes;
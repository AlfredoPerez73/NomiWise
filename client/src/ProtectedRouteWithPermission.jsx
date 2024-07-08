import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/authContext";
import { usePermiso } from "./context/permisoContext";

const ProtectedRouteWithPermission = ({ requiredPermission }) => {
  const { isAuthenticated, usuario } = useAuth();
  const { getPermiso, permisos } = usePermiso();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    getPermiso();
  }, [])

  const userPermissions = permisos
    .filter(permiso => permiso.idRol === usuario.idRol)
    .map(permiso => permiso.nPermiso);

  if (!userPermissions.includes(requiredPermission)) {
    return <Navigate to="/menu" />;
  }

  return <Outlet />;
};

export default ProtectedRouteWithPermission;

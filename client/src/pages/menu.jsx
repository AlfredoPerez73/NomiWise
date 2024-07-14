import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaCircleUser, FaBarsStaggered } from "react-icons/fa6";
import logo from "../assets/logo2.1.png";
import "../css/menu.css";
import { useAuth } from "../context/authContext";
import { usePermiso } from "../context/permisoContext";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isAuthenticated, logout, usuario } = useAuth();
  const [activeContent, setActiveContent] = useState("menu");
  const [config, setConfig] = useState(false);
  const [configOpen1, setConfigOpen1] = useState(true);
  const [configOpen2, setConfigOpen2] = useState(true);
  const [configOpen3, setConfigOpen3] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const {
    getPermiso,
    permisos
  } = usePermiso();
  const tcontratos = [
    "TERMINO INDEFINIDO",
    "TERMINO FIJO",
    "PERSTACION DE SERVICIOS"
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleUsuarioSubMenu = () => {
    setConfig(!config);
  };

  const toggleConfigSubMenu1 = () => {
    setConfigOpen1(!configOpen1);
  };

  const toggleConfigSubMenu2 = () => {
    setConfigOpen2(!configOpen2);
  };

  const toggleConfigSubMenu3 = () => {
    setConfigOpen3(!configOpen3);
  };

  // Función para verificar permisos basados en los roles del usuario
  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  useEffect(() => {
    getPermiso();
  }, [])

  useEffect(() => {
    const loadPermissions = async () => {
      if (usuario && usuario.idRol) {
        try {
          const userPermissions = permisos
            .filter(permiso => permiso.idRol === usuario.idRol)
            .map(permiso => permiso.nPermiso);
          setPermissions(userPermissions);
        } catch (error) {
          console.error("Error al cargar permisos:", error);
        }
      }
    };

    loadPermissions();
  }, [usuario, permisos]);

  const userName = usuario ? usuario.nombre : "Desconocido";

  return (
    <div className="dashboard">
      <header className="header">
        <a href="/menu" className="logo">
          <img className="logo" src={logo} alt="logo" />
          <span className="nombrelogo">NomiWise</span>
        </a>
        <div>
          <div className="search-bar-2">
            <select
              id="tipocontrato-filter"
              name="tipocontrato-filter"
            >
              <option value="">
                Seleccionar el Tipo de Contrato
              </option>
              {tcontratos.map((modulo, index) => (
                <option key={index} value={modulo}>
                  {modulo}
                </option>
              ))}
            </select>
          </div>
          <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
            <FaBarsStaggered
              style={{
                marginLeft: "10px",
                marginRight: "-3px",
                marginTop: "8px",
                fontSize: "30px",
                cursor: "pointer"
              }}
            />
          </button>
        </div>
        <div className="containerUsuario">
          <div className="usuario" onClick={toggleUsuarioSubMenu} style={{ cursor: "pointer" }}>
            <FaCircleUser style={{ fontSize: "25px", marginLeft: "auto" }} className="react-icon" />
            {config ? (
              <i className="fi fi-br-angle-double-small-up icon-style-terceary"></i>
            ) : (
              <i className="fi fi-br-angle-double-small-down icon-style-terceary"></i>
            )}
          </div>
          {config && (
            <div className="sub-menu">
              <div className="sub-menu-item">
                <FaCircleUser style={{ fontSize: "20px" }} />
                <span>{userName}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <Link to="/menu"
              className={activeContent === "menu" ? "nav-link active" : "nav-link collapsed"}
              onClick={() => setActiveContent("menu")}
            >
              <i className="fi fi-br-house-chimney icon-style"></i>
              <span>Escritorio</span>
            </Link>
          </li>
          <li className="nav-item">
            <div
              className="nav-link collapsed"
              onClick={toggleConfigSubMenu1}
              style={{ cursor: "pointer" }}
            >
              <i className="fi fi-br-user-skill-gear icon-style"></i>
              <span>Empleados</span>
              {sidebarOpen && (configOpen1 ? (
                <i className="fi fi-br-angle-double-small-up icon-style-secundary"></i>
              ) : (
                <i className="fi fi-br-angle-double-small-down icon-style-secundary"></i>
              ))}
            </div>
            <ul className={`submenu ${configOpen1 ? "open" : ""}`}>
              {hasPermission('Empleados') && (
                <li className="nav-item">
                  <Link to="/menu/empleados"
                    className={activeContent === "empleados" ? "nav-link active" : "nav-link collapsed"}
                    onClick={() => setActiveContent("empleados")}
                  >
                    <i className="fi fi-br-target-audience icon-style"></i>
                    <span>Empleados</span>
                  </Link>
                </li>
              )}
              {hasPermission('Cargos') && (
                <li className="nav-item">
                  <Link to="/menu/cargos"
                    className={activeContent === "cargos" ? "nav-link active" : "nav-link collapsed"}
                    onClick={() => setActiveContent("cargos")}
                  >
                    <i className="fi fi-br-book-user icon-style"></i>
                    <span>Cargos</span>
                  </Link>
                </li>
              )}
            </ul>
          </li>


          <li className="nav-item">
            <div
              className="nav-link collapsed"
              onClick={toggleConfigSubMenu2}
              style={{ cursor: "pointer" }}
            >
              <i className="fi fi-sr-chart-pie-simple-circle-currency icon-style"></i>
              <span>Liquidaciones</span>
              {sidebarOpen && (configOpen2 ? (
                <i className="fi fi-br-angle-double-small-up icon-style-secundary"></i>
              ) : (
                <i className="fi fi-br-angle-double-small-down icon-style-secundary"></i>
              ))}
            </div>
            <ul className={`submenu ${configOpen2 ? "open" : ""}`}>
              {hasPermission('Liquidaciones') && (
                <li className="nav-item">
                  <Link to="/menu/liquidaciones"
                    className={activeContent === "liquidaciones" ? "nav-link active" : "nav-link collapsed"}
                    onClick={() => setActiveContent("liquidaciones")}
                  >
                    <i className="fi fi-br-user-cowboy icon-style"></i>
                    <span>Liquidaciones</span>
                  </Link>
                </li>
              )}
              {hasPermission('Nomina') && (
                <li className="nav-item">
                  <Link to="/menu/nomina"
                    className={activeContent === "nomina" ? "nav-link active" : "nav-link collapsed"}
                    onClick={() => setActiveContent("nomina")}
                  >
                    <i className="fi fi-br-coins icon-style"></i>
                    <span>Nomina</span>
                  </Link>
                </li>
              )}
            </ul>
          </li>

          <li className="nav-item">
            <div
              className="nav-link collapsed"
              onClick={toggleConfigSubMenu3}
              style={{ cursor: "pointer" }}
            >
              <i className="fi fi-br-module icon-style"></i>
              <span>Permisos</span>
              {sidebarOpen && (configOpen3 ? (
                <i className="fi fi-br-angle-double-small-up icon-style-secundary"></i>
              ) : (
                <i className="fi fi-br-angle-double-small-down icon-style-secundary"></i>
              ))}
            </div>
            <ul className={`submenu ${configOpen3 ? "open" : ""}`}>
              {hasPermission('Usuarios') && (
                <li className="nav-item">
                  <Link to="/menu/usuarios"
                    className={activeContent === "usuarios" ? "nav-link active" : "nav-link collapsed"}
                    onClick={() => setActiveContent("usuarios")}
                  >
                    <i className="fi fi-br-circle-user icon-style"></i>
                    <span>Usuarios</span>
                  </Link>
                </li>
              )}
              {hasPermission('Roles') && (
                <li className="nav-item">
                  <Link to="/menu/roles"
                    className={activeContent === "roles" ? "nav-link active" : "nav-link collapsed"}
                    onClick={() => setActiveContent("roles")}
                  >
                    <i className="fi fi-bs-dice-d8 icon-style"></i>
                    <span>Roles</span>
                  </Link>
                </li>
              )}
              {hasPermission('Permisos') && (
                <li className="nav-item">
                  <Link to="/menu/permisos"
                    className={activeContent === "permisos" ? "nav-link active" : "nav-link collapsed"}
                    onClick={() => setActiveContent("permisos")}
                  >
                    <i className="fi fi-br-shield-keyhole icon-style"></i>
                    <span>Permisos</span>
                  </Link>
                </li>
              )}
            </ul>
          </li>


          <li className="nav-item">
            {isAuthenticated ? (
              <Link
                to="/login"
                className="nav-link collapsed"
                onClick={() => {
                  logout();
                }}
              >
                <i className="fi fi-br-sign-out-alt icon-style"></i>
                <span>Salir</span>
              </Link>
            ) : (
              <></>
            )}
          </li>
        </ul>
      </aside>

      <main className={`main ${sidebarOpen ? "" : "full"}`}>
        <div className="pagetitle" />
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;

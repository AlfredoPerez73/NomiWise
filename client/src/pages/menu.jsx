import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCircleUser,
  FaBarsStaggered,
  FaHouse,
  FaUsers,
  FaCoins,
  FaWrench,
  FaShieldHalved,
  FaFileContract,
  FaDiceD20,
  FaChevronDown,
  FaChevronUp,
  FaRegFolderOpen,
  FaArrowRightFromBracket,
} from "react-icons/fa6";
import logo from "../assets/logo2.1.png";
import "../css/menu.css";
import { useAuth } from "../context/authContext";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const [activeContent, setActiveContent] = useState("");
  const [config, setConfig] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleUsuarioSubMenu = () => {
    setConfig(!config);
  };

  const renderContent = () => {
    switch (activeContent) {
      case "Empleados":
      case "Liquidaciones":
      case "Nomina":
      case "Contratos":
      case "Cargos":
      case "Roles":
      case "Permisos":
      case "Usuarios":
      case "Reportes":
      case "Inicio":
      default:
    }
  };

  const userName = user ? user.nombre : "Desconocido";

  return (
    <div className="dashboard">
      <header className="header">
        <a href="/menu" className="logo">
          <img className="logo" src={logo} alt="logo" />
          <span className="nombrelogo">NomiWise | Gestion de nominas</span>
        </a>
        <div>
          <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
            <FaBarsStaggered
              style={{
                marginLeft: "10px",
                marginRight: "5px",
                marginTop: "15px",
                fontSize: "30px",
                cursor: "pointer"
              }}
              className="react-icon"
            />
          </button>
        </div>
        <div className="containerUsuario">
          <div className="usuario" onClick={toggleUsuarioSubMenu} style={{ cursor: "pointer" }}>
            <FaCircleUser style={{ fontSize: "25px", marginLeft: "auto" }} className="react-icon" />
            {config ? (
              <FaChevronUp style={{ fontSize: "15px", marginLeft: "auto" }} className="react-icon" />
            ) : (
              <FaChevronDown style={{ fontSize: "15px", marginLeft: "auto" }} className="react-icon" />
            )}
          </div>
          {config && (
            <div className="sub-menu">
              <div className="sub-menu-item">
                <FaCircleUser style={{ fontSize: "20px" }} className="react-icon" />
                <span>{userName}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <Link
              className={
                activeContent === "Inicio"
                  ? "nav-link active"
                  : "nav-link collapsed"
              }
              onClick={() => setActiveContent("Inicio")}
            >
              <FaHouse
                style={{
                  marginLeft: "0px",
                  marginRight: "5px",
                }}
                className="react-icon"
              />
              <span>Inicio</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={
                activeContent === "Empleados"
                  ? "nav-link active"
                  : "nav-link collapsed"
              }
              onClick={() => setActiveContent("Empleados")}
            >
              <FaWrench
                style={{
                  marginLeft: "0px",
                  marginRight: "5px",
                  color: "rgb(253, 138, 114)"
                }}
                className="react-icon"
              />
              <span>Empleados</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className={
                activeContent === "Liquidaciones"
                  ? "nav-link active"
                  : "nav-link collapsed"
              }
              onClick={() => setActiveContent("Liquidaciones")}
            >
              <FaUsers
                style={{
                  marginLeft: "0px",
                  marginRight: "5px",
                  color: "rgb(172, 126, 241)"
                }}
                className="react-icon"
              />
              <span>Liquidaciones</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className={
                activeContent === "Nomina"
                  ? "nav-link active"
                  : "nav-link collapsed"
              }
              onClick={() => setActiveContent("Nomina")}
            >
              <FaCoins
                style={{
                  marginLeft: "0px",
                  marginRight: "5px",
                  color: "rgb(249, 118, 176)"
                }}
                className="react-icon"
              />
              <span>Nomina</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className={
                activeContent === "Contratos"
                  ? "nav-link active"
                  : "nav-link collapsed"
              }
              onClick={() => setActiveContent("Contratos")}
            >
              <FaFileContract
                style={{
                  marginLeft: "0px",
                  marginRight: "5px",
                  color: "royalblue"
                }}
                className="react-icon"
              />
              <span>Contratos</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={
                activeContent === "Cargos"
                  ? "nav-link active"
                  : "nav-link collapsed"
              }
              onClick={() => setActiveContent("Cargos")}
            >
              <FaFileContract
                style={{
                  marginLeft: "0px",
                  marginRight: "5px",
                  color: "rgb(95, 77, 221)"
                }}
                className="react-icon"
              />
              <span>Cargos</span>
            </Link>
          </li>
          <ul className="submenu">
                <li className="nav-item">
                  <Link
                    className={
                      activeContent === "Usuarios"
                        ? "nav-link active"
                        : "nav-link collapsed"
                    }
                    onClick={() => setActiveContent("Usuarios")}
                  >
                    <FaCircleUser
                      style={{
                        marginLeft: "0px",
                        marginRight: "5px",
                        color: "rgb(24, 161, 251)"
                    }}
                      className="react-icon"
                    />
                    <span>Usuarios</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      activeContent === "Roles"
                        ? "nav-link active"
                        : "nav-link collapsed"
                    }
                    onClick={() => setActiveContent("Roles")}
                  >
                    <FaDiceD20
                      style={{
                        marginLeft: "0px",
                        marginRight: "5px",
                        color: "rgb(95, 77, 221)"
                    }}
                      className="react-icon"
                    />
                    <span>Roles</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      activeContent === "Permisos"
                        ? "nav-link active"
                        : "nav-link collapsed"
                    }
                    onClick={() => setActiveContent("Permisos")}
                  >
                    <FaShieldHalved
                      style={{
                        marginLeft: "0px",
                        marginRight: "5px",
                        color: "mediumpurple"
                      }}
                      className="react-icon"
                    />
                    <span>Permisos</span>
                  </Link>
                </li>
              </ul>
          <li className="nav-item">
            <Link
              className={
                activeContent === "Reportes"
                  ? "nav-link active"
                  : "nav-link collapsed"
              }
              onClick={() => setActiveContent("Reportes")}
            >
              <FaRegFolderOpen
                style={{
                  marginLeft: "0px",
                  marginRight: "5px",
                  color: "brown"
                }}
                className="react-icon"
              />
              <span>Reportes</span>
            </Link>
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
                <FaArrowRightFromBracket
                  style={{
                    marginLeft: "0px",
                    marginRight: "5px"
                  }}
                  className="react-icon"
                />
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
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;

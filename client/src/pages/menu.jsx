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
  FaGear,
  FaGavel,
  FaFireFlameCurved
} from "react-icons/fa6";
import logo from "../assets/logo2.1.png";
import "../css/menu.css";
import FrmRol from "../components/frmRol";
import FrmCargo from "../components/frmCargo";
import FrmPermiso from "../components/frmPermiso";
import FrmUsuario from "../components/frmUsuario";
import { useAuth } from "../context/authContext";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isAuthenticated, logout, user, usuario } = useAuth();
  const [activeContent, setActiveContent] = useState("");
  const [config, setConfig] = useState(false);
  const [configOpen1, setConfigOpen1] = useState(true);
  const [configOpen2, setConfigOpen2] = useState(true);
  const [configOpen3, setConfigOpen3] = useState(true);

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


  const renderContent = () => {
    switch (activeContent) {
      case "Empleados":
      case "Liquidaciones":
      case "Nomina":
      case "Contratos":
      case "Cargos":
        return <FrmCargo />;
      case "Roles":
        return <FrmRol />;
      case "Permisos":
        return <FrmPermiso />;
      case "Usuarios":
        return <FrmUsuario />;
      case "Reportes":
      case "Inicio":
      default:
        return null;
    }
  };

  const userName = user ? user.nombre : usuario ? usuario.nombre : "Desconocido";

  return (
    <div className="dashboard">
      <header className="header">
        <a href="/menu" className="logo">
          <img className="logo" src={logo} alt="logo" />
          <span className="nombrelogo">NomiWise</span>
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
              <span>Escritorio</span>
            </Link>
          </li>



          <li className="nav-item">
            <div
              className="nav-link collapsed"
              onClick={toggleConfigSubMenu1}
              style={{ cursor: "pointer" }}
            >
              <  FaGavel
                style={{
                  marginLeft: "0px",
                  marginRight: "5px",
                  color: "mediumpurple"
                }}
                className="react-icon"
              />
              <span>Empleados</span>
              {sidebarOpen && (configOpen1 ? (
                <FaChevronUp style={{ fontSize: "15px", marginLeft: "auto" }} className="react-icon" />
              ) : (
                <FaChevronDown style={{ fontSize: "15px", marginLeft: "auto" }} className="react-icon" />
              ))}
            </div>
            <ul className={`submenu ${configOpen1 ? "open" : ""}`}>
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
            </ul>
          </li>

          <li className="nav-item">
            <div
              className="nav-link collapsed"
              onClick={toggleConfigSubMenu2}
              style={{ cursor: "pointer" }}
            >
              <  FaFireFlameCurved
                style={{
                  marginLeft: "0px",
                  marginRight: "5px",
                  color: "brown"
                }}
                className="react-icon"
              />
              <span>Liquidaciones</span>
              {sidebarOpen && (configOpen2 ? (
                <FaChevronUp style={{ fontSize: "15px", marginLeft: "auto" }} className="react-icon" />
              ) : (
                <FaChevronDown style={{ fontSize: "15px", marginLeft: "auto" }} className="react-icon" />
              ))}
            </div>
            <ul className={`submenu ${configOpen2 ? "open" : ""}`}>
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

            </ul>
          </li>

          <li className="nav-item">
            <div
              className="nav-link collapsed"
              onClick={toggleConfigSubMenu3}
              style={{ cursor: "pointer" }}
            >
              <  FaGear
                style={{
                  marginLeft: "0px",
                  marginRight: "5px",
                  color: "steelblue"
                }}
                className="react-icon"
              />
              <span>Permisos</span>
              {sidebarOpen && (configOpen3 ? (
                <FaChevronUp style={{ fontSize: "15px", marginLeft: "auto" }} className="react-icon" />
              ) : (
                <FaChevronDown style={{ fontSize: "15px", marginLeft: "auto" }} className="react-icon" />
              ))}
            </div>
            <ul className={`submenu ${configOpen3 ? "open" : ""}`}>
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
                      color: "rgb(24, 161, 251)",
                      fontSize: "18px"
                    }}
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
                      color: "rgb(95, 77, 221)",
                      fontSize: "18px"
                    }}
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
                      color: "mediumpurple",
                      fontSize: "18px"
                    }}
                  />
                  <span>Permisos</span>
                </Link>
              </li>
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

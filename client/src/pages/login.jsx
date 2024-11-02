import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/authContext";
import "../css/login.css";
import logo2 from "../assets/logoSinFondoConTexto.png";
import backgraundImg from "../assets/image.png";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ correo: "", contraseña: "" });
  const navigate = useNavigate();
  const { signinu } = useAuth();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signinu(formData);
      Swal.fire({
        icon: "success",
        confirmButtonColor: '#5383E8',
        background: '#1f1e44e1',
        color: 'whitesmoke',
        title: "¡Inicio de sesión exitoso!",
        text: "¡Bienvenido de vuelta!",
        customClass: {
          popup: 'custom-alert',
        },
      });
      navigate("/menu");
    } catch (error) {
      Swal.fire({
        icon: "error",
        confirmButtonColor: '#5383E8',
        background: '#1f1e44e1',
        color: 'whitesmoke',
        title: "¡Error!",
        text: "Correo o contraseña incorrectos",
        footer: error.message,
        customClass: {
          popup: 'custom-alert',
        },
      });
    }
  };

  return (
    <div className="Bg-Img">
      <div className="container">
        <h1 className="main-title">Bienvenido a NomiWise</h1>
        <div className="login-form">
        <div className="logo-container">
            <img src={logo2} alt="Logo" className="logo-img" />
            <h2>Iniciar Sesión</h2>
          </div>
          <div className="info">
            <p>
              Administra tu negocio a otro nivel, sistema de nomina :D Contactanos para utilizar nuestro producto
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <i class="icon fi fi-br-admin-alt"></i>
              <input
                type="text"
                id="correo"
                name="correo"
                placeholder=" "
                value={formData.correo}
                onChange={handleChange}
                required
              />
              <label htmlFor="correo">Correo:</label>
            </div>
            <div className="input-container">
              <i class="icon fi fi-br-unlock"></i>
              <input
                type={showPassword ? "text" : "password"}
                id="contraseña"
                name="contraseña"
                placeholder=" "
                value={formData.contraseña}
                onChange={handleChange}
                required
              />
              <label htmlFor="contraseña">Contraseña:</label>

            </div>
            <button type="submit">
              <span class="button_top"><i class="icon_2 fi fi-bs-key"></i>Iniciar Sesion </span>
            </button>
          </form>

        </div>
        <div class="image-container">
          <img src={backgraundImg} alt="Background Image" class="side-image" />
          <svg viewBox="0 0 1440 320" class="wave">
            <path fill="#FFFFFF" fill-opacity="0.3" d="M0,160L60,176C120,192,240,224,360,240C480,256,600,256,720,224C840,192,960,128,1080,112C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </div>


      </div>
    </div>
  );
};

export default LoginPage;

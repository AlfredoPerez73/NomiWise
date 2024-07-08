import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/authContext";
import "../css/login.css";
import logo2 from "../assets/logoSinFondoConTexto.png";

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
            <div className="input-container toggle-password">
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
              <i
                className={showPassword ? "bx bx-hide" : "bx bx-show"}
                onClick={() => setShowPassword(!showPassword)}
                id="toggleBtn"
              ></i>
            </div>
            <div className="btns">
              <button type="submit">Inicia Sesión</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;

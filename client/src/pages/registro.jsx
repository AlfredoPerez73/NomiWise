import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/authContext";
import "../css/login.css";
import logo from "../assets/logo.png";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ documento: "", nombre: "", correo: "", contraseña: "" });
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signup(formData);
      Swal.fire({
        icon: "success",
        confirmButtonColor: '#5383E8',
        background: '#1f1e44e1',
        color: 'whitesmoke',
        title: "¡Registro exitoso!",
        text: "Tu cuenta ha sido creada correctamente.",
        customClass: {
            popup: 'custom-alert',
          },
      });
      setFormData({
        documento: "",
        nombre: "",
        correo: "",
        contraseña: "",
      });
    } catch (error) {
      setError(error.response.data.message);
      Swal.fire({
        icon: "error",
        confirmButtonColor: '#5383E8',
        background: '#1f1e44e1',
        color: 'whitesmoke',
        title: "¡Error!",
        text: error.response.data.message,
        footer: error,
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
            <img src={logo} alt="Logo" className="logo-img" />
            <h2>Iniciar Usuario</h2>
          </div>
          <div className="info">
          <p>
            Administra tu negocio a otro nivel, sistema de nomina :D
          </p>
          </div>
          <form onSubmit={handleSubmit}>
          <div className="input-container">
              <input
                type="number"
                id="documento"
                name="documento"
                placeholder=" "
                value={formData.documento}
                onChange={handleChange}
                required
              />
              <label htmlFor="documento">Documento de identidad:</label>
            </div>
            <div className="input-container">
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder=" "
                value={formData.nombre}
                onChange={handleChange}
                required
              />
              <label htmlFor="nombre">Nombre completo:</label>
            </div>
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
              <button type="submit">Registrar Usuario</button>
            </div>
          </form>
          <div className="links">
            <p>¿Ya tienes una cuenta?</p>
            <Link to="/login" className="nav-links2">
              Inicia sesion aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

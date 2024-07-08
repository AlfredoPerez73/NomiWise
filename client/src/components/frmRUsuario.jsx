import React, { useState, useEffect } from "react";
import "../css/components.css";
import { useUsuario } from "../context/usuarioContext";
import { Toaster, toast } from "react-hot-toast";

const RegistroUsuarioForm = ({ onClose, usuarioToEdit, roles }) => {
    const [formData, setFormData] = useState({
        documento: "",
        nombre: "",
        correo: "",
        contraseña: "",
        idRol: "",
    });
    const [error, setError] = useState("");

    const { createUsuario, updateUsuario, getUsuario } = useUsuario();

    useEffect(() => {
        if (usuarioToEdit) {
            setFormData({
                documento: usuarioToEdit.documento,
                nombre: usuarioToEdit.nombre,
                correo: usuarioToEdit.correo,
                contraseña: usuarioToEdit.contraseña,
                idRol: usuarioToEdit.idRol,
            });
        }
    }, [usuarioToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (usuarioToEdit) {
                await updateUsuario(usuarioToEdit.idUsuario, formData);
                toast.success(<b>El usuario fue actualizado con éxito!</b>);
            } else {
                await createUsuario(formData);
                toast.success(<b>El usuario ha sido registrado correctamente.</b>);
            }
            await getUsuario();
            onClose();
        } catch (error) {
            setError(error.response.data.message);
            toast.error(`Error: ${error.response.data.message}`);
        }
    };

    return (
        <div className="w-full h-full">
            <Toaster />
            <div className="form-comp">
                <div className="header-comp">
                    <h1 className="title-comp">{usuarioToEdit ? "Actualizar Usuario" : "Registrar Usuario"}</h1>
                </div>  
                <div className="card-grid card-centered">
                    <h1 className="sub-titles-copm">Nuevo Usuario</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="grid-container">
                            <div className="input-container">
                                <input
                                    type="number"
                                    id="documento"
                                    name="documento"
                                    value={formData.documento}
                                    onChange={handleChange}
                                    required
                                    placeholder=" "
                                    autoComplete="off"
                                />
                                <label htmlFor="documento">Documento</label>
                            </div>
                            <div className="input-container">
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    placeholder=" "
                                    autoComplete="off"
                                />
                                <label htmlFor="nombre">Nombre</label>
                            </div>
                            <div className="input-container">
                                <input
                                    type="email"
                                    id="correo"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    required
                                    placeholder=" "
                                    autoComplete="off"
                                />
                                <label htmlFor="correo">Correo</label>
                            </div>
                            <div className="input-container">
                                <input
                                    type="text"
                                    id="contraseña"
                                    name="contraseña"
                                    value={formData.contraseña}
                                    onChange={handleChange}
                                    required
                                    placeholder=" "
                                    autoComplete="off"
                                />
                                <label htmlFor="contraseña">Contraseña</label>
                            </div>
                                <select
                                    id="idRol"
                                    name="idRol"
                                    value={formData.idRol}
                                    onChange={handleChange}
                                    required
                                    placeholder=" "
                                >
                                    <option value="">Seleccionar Rol</option>
                                    {roles.map((rol) => (
                                        <option key={rol.idRol} value={rol.idRol}>
                                            {rol.nRol}
                                        </option>
                                    ))}
                                </select>
                        </div>
                        <button type={usuarioToEdit ? "submit_2" : "submit_2"}>
                            {usuarioToEdit ? "Actualizar" : "Registrar"}
                        </button>
                        <button type="button" onClick={onClose}>
                            Cancelar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistroUsuarioForm;

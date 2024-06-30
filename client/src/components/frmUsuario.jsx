import React, { useEffect, useState } from "react";
import "../css/components.css";
import toast, { Toaster } from "react-hot-toast";
import { useUsuario } from "../context/usuarioContext";
import { useRol } from "../context/rolContext";
import { format } from "date-fns";

const RegistroUsuarios = () => {
    const [formData, setFormData] = useState({
        documento: "",
        nombre: "",
        correo: "",
        contraseña: "",
        idRol: "",
    });
    const [id, setId] = useState("");
    const [editar, setEditar] = useState(false);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [filterValueRol, setFilterValueRol] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        createUsuario,
        getUsuario,
        usuarios,
        deleteUsuario,
        updateUsuario,
    } = useUsuario();
    const {
        getRol,
        roles,
    } = useRol();

    const handleCreateUsuario = async (e) => {
        e.preventDefault();
        try {
            await createUsuario(formData);
            toast.success(<b>El usuario ha sido registrado correctamente.</b>);
            setFormData({
                documento: "",
                nombre: "",
                correo: "",
                contraseña: "",
                idRol: "",
            });
            await getUsuario();
            closeModal();
        } catch (error) {
            setError(error.response.data.message);
            toast.error(<b>Error: {error.response.data.message}</b>);
        }
    };

    const handleDeleteUsuario = (val) => {
        toast(
            (t) => (
                <div style={{ textAlign: "center", fontWeight: "bold" }}>
                    <p>¿Realmente desea eliminar a <strong>{val.nombre}</strong>?</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                        <button className="toast-button-confirmed" onClick={() => {
                            deleteUsuario(val.idUsuario)
                                .then(() => {
                                    toast.dismiss(t.id);
                                    toast.success(<b>El usuario {val.nombre} fue eliminado exitosamente!</b>);
                                    getUsuario();
                                })
                                .catch((error) => {
                                    toast.error(<b>Error: {error.response.data.message}</b>);
                                });
                        }}>
                            Confirmar
                        </button>
                        <button className="toast-button-delete" onClick={() => toast.dismiss(t.id)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            ),
            {
                duration: 8000,
            }
        );
    };

    const handleUpdateUsuario = async (e) => {
        e.preventDefault();
        try {
            await updateUsuario(id, formData);
            limpiar();
            toast.success(<b>El usuario {formData.nombre} fue actualizado con éxito!</b>);
            await getUsuario();
            closeModal();
        } catch (error) {
            setError(error.response.data.message);
            toast.error(<b>No se puede actualizar el usuario! Intente más tarde.</b>);
        }
    };

    const setUsuario = (val) => {
        setEditar(true);
        setFormData({
            documento: val.documento,
            nombre: val.nombre,
            correo: val.correo,
            contraseña: val.contraseña,
            idRol: val.idRol,
        });
        setId(val.idUsuario);
        openModal();
    };

    const limpiar = () => {
        setFormData({
            documento: "",
            nombre: "",
            correo: "",
            contraseña: "",
            idRol: "",
        });
        setId("");
        setEditar(false);
    };

    useEffect(() => {
        getUsuario();
        getRol();
    }, []);

    useEffect(() => {
        setFilteredUsuarios(usuarios);
    }, [usuarios]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const getRolName = (idRol) => {
        const rol = roles.find((r) => r.idRol === idRol);
        return rol ? rol.nRol : "Desconocido";
    };

    const handleFilterChangeRol = (e) => {
        const query = e.target.value.toLowerCase();
        setFilterValueRol(e.target.value);
        setFilteredUsuarios(
            usuarios.filter((usuario) =>
                String(usuario.idRol).toLowerCase().includes(query)
            )
        );
    };

    const handleFilterChange = (e) => {
        const query = e.target.value.toLowerCase();
        setFilterValue(e.target.value);
        setFilteredUsuarios(
            usuarios.filter((n) =>
                n.nombre.toLowerCase().includes(query)
            )
        );
    };

    const formatFecha = (fecha) => {
        return format(new Date(fecha), "dd/MM/yyyy");
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        limpiar();
        setIsModalOpen(false);
    };

    return (
        <div className="w-full h-full">
            <Toaster />
            <div className="form-comp">
                <div className="header-comp">
                    <h1 className="title-comp">Registro de Usuarios</h1>
                </div>
                <button type="button" className="open-modal-button" onClick={openModal}>Registrar</button>
                <div className="table-card">
                    <h1 className="sub-titles-copm">Usuarios Registrados</h1>
                    <div className="search-bar">
                        <input
                            type="text"
                            id="usuario-filter"
                            name="usuario-filter"
                            placeholder="Filtrar usuarios"
                            autoComplete="off"
                            value={filterValue}
                            onChange={handleFilterChange}
                        />
                        <select
                            id="rol-filter"
                            name="rol-filter"
                            value={filterValueRol}
                            onChange={handleFilterChangeRol}
                        >
                            <option value="">
                                Seleccionar Rol
                            </option>
                            {roles.map((rol) => (
                                <option key={rol.idRol} value={rol.idRol}>
                                    {rol.nRol}
                                </option>
                            ))}
                        </select>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Documento</th>
                                <th>Usuario</th>
                                <th>Rol</th>
                                <th>Correo</th>
                                <th>Fecha de registro</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsuarios.map((val, key) => {
                                return (
                                    <tr key={val.idUsuario}>
                                        <td>{val.documento}</td>
                                        <td>{val.nombre}</td>
                                        <td>{getRolName(val.idRol)}</td>
                                        <td>{val.correo}</td>
                                        <td>{formatFecha(val.fechaRegistro)}</td>
                                        <td>
                                            <button
                                                className="edit-button"
                                                onClick={() => setUsuario(val)}
                                            >
                                                <i className="fi fi-br-customize-edit icon-style-components"></i>
                                            </button>
                                            <button
                                                className="delete-button"
                                                onClick={() => handleDeleteUsuario(val)}
                                            >
                                                <i className="fi fi-br-clear-alt icon-style-components"></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <form onSubmit={editar ? handleUpdateUsuario : handleCreateUsuario} className="form-comp">
                            <div className="form-group">
                                <div className="container-inputs">
                                    <label htmlFor="documento">Documento:</label>
                                    <input
                                        type="text"
                                        id="documento"
                                        name="documento"
                                        value={formData.documento}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="container-inputs">
                                    <label htmlFor="nombre">Nombre:</label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="container-inputs">
                                    <label htmlFor="correo">Correo:</label>
                                    <input
                                        type="email"
                                        id="correo"
                                        name="correo"
                                        value={formData.correo}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="container-inputs">
                                    <label htmlFor="contraseña">Contraseña:</label>
                                    <input
                                        type="text"
                                        id="contraseña"
                                        name="contraseña"
                                        value={formData.contraseña}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="container-inputs">
                                    <label htmlFor="idRol">Rol:</label>
                                    <select
                                        id="idRol"
                                        name="idRol"
                                        value={formData.idRol}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccionar Rol</option>
                                        {roles.map((rol) => (
                                            <option key={rol.idRol} value={rol.idRol}>
                                                {rol.nRol}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {error && <p className="text-red-500">{error}</p>}
                            </div>
                            <div className="container-button">
                                <button type="submit">
                                    {editar ? "Actualizar" : "Registrar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegistroUsuarios;

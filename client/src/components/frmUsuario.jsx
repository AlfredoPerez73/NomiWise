import React, { useEffect, useState } from "react";
import "../css/components.css";
import Swal from "sweetalert2";
import { useUsuario } from "../context/usuarioContext";
import { useRol } from "../context/rolContext";
import { format } from "date-fns";
import { FaPenClip, FaCircleMinus } from "react-icons/fa6";

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
            Swal.fire({
                icon: "success",
                title: "¡Registro exitoso!",
                text: "El usuario ha sido registrado correctamente.",
                confirmButtonColor: '#5383E8',
                background: '#1f1e44e1',
                color: 'whitesmoke',
                customClass: {
                    popup: 'custom-alert',
                },
            });
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
            Swal.fire({
                icon: "error",
                title: "¡Error!",
                text: error.response.data.message,
                footer: error,
                confirmButtonColor: '#5383E8',
                background: '#1f1e44e1',
                color: 'whitesmoke',
                customClass: {
                    popup: 'custom-alert',
                },
            });
        }
    };

    const handleDeleteUsuario = (val) => {
        Swal.fire({
            title: "Confirmar eliminación",
            html:
                "<i>¿Realmente desea eliminar a <strong>" +
                val.nombre +
                "</strong>?</i>",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#5383E8',
            background: '#1f1e44e1',
            color: 'whitesmoke',
            customClass: {
                popup: 'custom-alert',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUsuario(val.idUsuario)
                    .then(() => {
                        Swal.fire({
                            title: "Registro eliminado!",
                            html:
                                "<i>El usuario <strong>" +
                                val.nombre +
                                "</strong> fue eliminado exitosamente!</i>",
                            icon: "success",
                            confirmButtonColor: '#5383E8',
                            background: '#1f1e44e1',
                            color: 'whitesmoke',
                            customClass: {
                                popup: 'custom-alert',
                            },
                        });
                        getUsuario();
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: error.response.data.message,
                            footer: "<a>Intente más tarde</a>",
                            confirmButtonColor: '#5383E8',
                            background: '#1f1e44e1',
                            color: 'whitesmoke',
                            customClass: {
                                popup: 'custom-alert',
                            },
                        });
                    });
            }
        });
    };

    const handleUpdateUsuario = async (e) => {
        e.preventDefault();
        try {
            await updateUsuario(id, formData);
            limpiar();
            Swal.fire({
                title: "<strong>Actualización exitosa!</strong>",
                html:
                    "<i>El rol <strong>" +
                    formData.nombre +
                    "</strong> fue actualizado con éxito! </i>",
                icon: "success",
                confirmButtonColor: '#5383E8',
                background: '#1f1e44e1',
                color: 'whitesmoke',
                customClass: {
                    popup: 'custom-alert',
                },
            });
            await getUsuario();
            closeModal();
        } catch (error) {
            setError(error.response.data.message);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No se puede actualizar la categoria!",
                footer: '<a href="#">Intente más tarde</a>',
                confirmButtonColor: '#5383E8',
                background: '#1f1e44e1',
                color: 'whitesmoke',
                customClass: {
                    popup: 'custom-alert',
                },
            });
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
            <div className="form-comp">
                <div className="header-comp">
                    <h1 className="title-comp">Registro de Usuarios</h1>
                </div>
                <button className="open-modal-button" onClick={openModal}>Registrar</button>
                <div className="table-card">
                    <h1 className="sub-titles-copm">Usuarios Registradas</h1>
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
                                                <FaPenClip
                                                    style={{
                                                        marginTop: "3px"
                                                    }} />
                                            </button>
                                            <button
                                                className="delete-button"
                                                onClick={() => handleDeleteUsuario(val)}
                                            >
                                                <FaCircleMinus
                                                    style={{
                                                        marginTop: "3px"
                                                    }} />
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

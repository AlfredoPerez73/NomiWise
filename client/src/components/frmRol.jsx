import React, { useEffect, useState } from "react";
import "../css/components.css";
import Swal from "sweetalert2";
import { useRol } from "../context/rolContext";
import { format } from "date-fns";
import {
    FaPenClip,
    FaCircleMinus
} from "react-icons/fa6";

const RegistroRoles = () => {
    const [formData, setFormData] = useState({
        nRol: "",
    });
    const [id, setId] = useState("");
    const [editar, setEditar] = useState(false);
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [filterValue, setFilterValue] = useState("");
    const [error, setError] = useState("");
    const {
        createRol,
        getRol,
        roles,
        deleteRol,
        updateRol,
    } = useRol();

    const handleCreateRol = async (e) => {
        e.preventDefault();
        try {
            await createRol(formData);
            Swal.fire({
                icon: "success",
                title: "¡Registro exitoso!",
                text: "El rol ha sido registrado correctamente.",
                confirmButtonColor: '#5383E8',
                background: '#1f1e44e1',
                color: 'whitesmoke',
                customClass: {
                    popup: 'custom-alert',
                },
            });
            setFormData({
                nRol: "",
            });
            await getRol();
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

    const handleDeleteRol = (val) => {
        Swal.fire({
            title: "Confirmar eliminación",
            html:
                "<i>¿Realmente desea eliminar a <strong>" +
                val.nRol +
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
                deleteRol(val.idRol)
                    .then(() => {
                        Swal.fire({
                            title: "Registro eliminado!",
                            html:
                                "<i>El rol <strong>" +
                                val.nRol +
                                "</strong> fue eliminado exitosamente!</i>",
                            icon: "success",
                            confirmButtonColor: '#5383E8',
                            background: '#1f1e44e1',
                            color: 'whitesmoke',
                            customClass: {
                                popup: 'custom-alert',
                            },
                        });
                        getRol();
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

    const handleUpdateRol = async (e) => {
        e.preventDefault();
        try {
            await updateRol(id, formData);
            limpiar();
            Swal.fire({
                title: "<strong>Actualización exitosa!</strong>",
                html:
                    "<i>El rol <strong>" +
                    formData.nRol +
                    "</strong> fue actualizado con éxito! </i>",
                icon: "success",
                confirmButtonColor: '#5383E8',
                background: '#1f1e44e1',
                color: 'whitesmoke',
                customClass: {
                    popup: 'custom-alert',
                },
            });
            await getRol();
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

    const setRol = (val) => {
        setEditar(true);
        setFormData({
            nRol: val.nRol,
        });
        setId(val.idRol);
    };

    const limpiar = () => {
        setFormData({
            nRol: "",
        });
        setId("");
        setEditar(false);
    };

    useEffect(() => {
        getRol();
    }, []);

    useEffect(() => {
        setFilteredRoles(roles);
    }, [roles]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFilterChange = (e) => {
        const query = e.target.value.toLowerCase();
        setFilterValue(e.target.value);
        setFilteredRoles(
            roles.filter((rol) =>
                rol.nRol.toLowerCase().includes(query)
            )
        );
    };

    const formatFecha = (fecha) => {
        return format(new Date(fecha), "dd/MM/yyyy");
    };

    return (
        <div className="w-full h-full">
            <div className="form-comp">
                <div className="header-comp">
                    <h1 className="title-comp">Registro de Roles</h1>
                </div>
                <div className="card">
                    <h1 className="sub-titles-copm">Nuevo Rol</h1>
                    <form
                        onSubmit={editar ? handleUpdateRol : handleCreateRol}
                    >
                        <div className="form-group">
                            <div className="input-container">
                                <input
                                    type="text"
                                    id="nRol"
                                    name="nRol"
                                    placeholder=" "
                                    autoComplete="off"
                                    value={formData.nRol}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="nRol">Nombre de rol</label>
                            </div>

                        </div>
                        <div>
                            <button type={editar ? "submit_2" : "submit"}>
                                {editar ? "Actualizar" : "Registrar"}
                            </button>
                            {editar && (
                                <button type="button" onClick={limpiar}>
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>
                <div className="table-card">
                    <h1 className="sub-titles-copm">Roles Registradas</h1>
                    <div className="search-bar">
                        <input
                            type="text"
                            id="rol-filter"
                            name="rol-filter"
                            placeholder="Filtrar roles"
                            autoComplete="off"
                            value={filterValue}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Rol</th>
                                <th>Fecha de registro</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRoles.map((val, key) => {
                                return (
                                    <tr key={val.idRol}>
                                        <td>{val.nRol}</td>
                                        <td>{formatFecha(val.fechaRegistro)}</td>
                                        <td>
                                            <button
                                                className="edit-button"
                                                onClick={() => setRol(val)}
                                            >
                                                <FaPenClip
                                                    style={{
                                                        marginTop: "3px"
                                                    }} />
                                            </button>
                                            <button
                                                className="delete-button"
                                                onClick={() => handleDeleteRol(val)}
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
        </div>
    );
};

export default RegistroRoles;
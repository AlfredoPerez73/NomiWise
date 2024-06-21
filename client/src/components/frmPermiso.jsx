import React, { useEffect, useState } from "react";
import "../css/components.css";
import Swal from "sweetalert2";
import { usePermiso } from "../context/permisoContext";
import { useRol } from "../context/rolContext";
import { format, set } from "date-fns";
import {
    FaPenClip,
    FaCircleMinus
} from "react-icons/fa6";

const RegistroPermisos = () => {
    const [formData, setFormData] = useState({
        nPermiso: "",
        idRol: ""
    });
    const [id, setId] = useState("");
    const [editar, setEditar] = useState(false);
    const [filteredPermisos, setFilteredPermisos] = useState([]);
    const [filterValuePermiso, setFilterValuePermiso] = useState("");
    const [filterValueRol, setFilterValueRol] = useState("");
    const [error, setError] = useState("");
    const {
        createPermiso,
        getPermiso,
        permisos,
        deletePermiso,
        updatePermiso,
    } = usePermiso();
    const {
        getRol,
        roles
    } = useRol();
    const modulosOptions = [
        "Inicio",
        "Empleados",
        "Liquidaciones",
        "Nomina",
        "Contratos",
        "Cargos",
        "Usuarios",
        "Roles",
        "Permisos",
        "Reportes"
    ];

    const handleCreatePermiso = async (e) => {
        e.preventDefault();
        try {
            await createPermiso(formData);
            Swal.fire({
                icon: "success",
                title: "¡Registro exitoso!",
                text: "El permiso ha sido registrado correctamente.",
                confirmButtonColor: '#5383E8',
                background: '#1f1e44e1',
                color: 'whitesmoke',
                customClass: {
                    popup: 'custom-alert',
                },
            });
            setFormData({
                nPermiso: "",
                idRol: "",
            });
            await getPermiso();
        } catch (error) {
            setError(error.response?.data?.message || "Error desconocido");
            Swal.fire({
                icon: "error",
                title: "¡Error!",
                text: error.response?.data?.message || "Error desconocido",
                footer: error.message,
                confirmButtonColor: '#5383E8',
                background: '#1f1e44e1',
                color: 'whitesmoke',
                customClass: {
                    popup: 'custom-alert',
                },
            });
        }
    };
    
    const handleDeletePermiso = (val) => {
        Swal.fire({
            title: "Confirmar eliminación",
            html:
                "<i>¿Realmente desea eliminar a <strong>" +
                val.nPermiso +
                "</strong>?</i>",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#5383E8",
            background: "#1f1e44e1",
            color: "whitesmoke",
            customClass: {
                popup: "custom-alert",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                deletePermiso(val.idPermiso)
                    .then(() => {
                        Swal.fire({
                            title: "Registro eliminado!",
                            html:
                                "<i>El permiso <strong>" +
                                val.nPermiso +
                                "</strong> fue eliminado exitosamente!</i>",
                            icon: "success",
                            confirmButtonColor: "#5383E8",
                            background: "#1f1e44e1",
                            color: "whitesmoke",
                            customClass: {
                                popup: "custom-alert",
                            },
                        });
                        getPermiso();
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
    

    const handleUpdatePermiso = async (e) => {
        e.preventDefault();
        try {
            await updatePermiso(id, formData);
            limpiar();
            Swal.fire({
                title: "<strong>Actualización exitosa!</strong>",
                html:
                    "<i>El permiso <strong>" +
                    formData.nPermiso +
                    "</strong> fue actualizado con éxito! </i>",
                icon: "success",
                confirmButtonColor: '#5383E8',
                background: '#1f1e44e1',
                color: 'whitesmoke',
                customClass: {
                    popup: 'custom-alert',
                },
            });
            await getPermiso();
        } catch (error) {
            setError(error.response?.data?.message || "Error desconocido");
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

    const setPermiso = (val) => {
        setEditar(true);
        setFormData({
            nPermiso: val.nPermiso,
            idRol: val.idRol,
        });
        setId(val.idPermiso);
    };

    const limpiar = () => {
        setFormData({
            nPermiso: "",
            idRol: "",
        });
        setId("");
        setEditar(false);
    };

    useEffect(() => {
        getPermiso();
        getRol();
    }, []);

    useEffect(() => {
        setFilteredPermisos(permisos);
    }, [permisos]);

    const getRolName = (idRol) => {
        const rol = roles.find((r) => r.idRol === idRol);
        return rol ? rol.nRol : "Desconocido";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFilterChangePermiso = (e) => {
        const query = e.target.value.toLowerCase();
        setFilterValuePermiso(e.target.value);
        setFilteredPermisos(
            permisos.filter((permiso) =>
                String(permiso.nPermiso).toLowerCase().includes(query)
            )
        );
    };

    const handleFilterChangeRol = (e) => {
        const query = e.target.value.toLowerCase();
        setFilterValueRol(e.target.value);
        setFilteredPermisos(
            permisos.filter((permiso) =>
                String(permiso.idRol).toLowerCase().includes(query)
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
                    <h1 className="title-comp">Registro de Permisos</h1>
                </div>
                <div className="card">
                    <h1 className="sub-titles-copm">Nuevo Permiso</h1>
                    <form
                        onSubmit={editar ? handleUpdatePermiso : handleCreatePermiso}
                    >
                        <div className="form-group">
                            <select
                                id="nPermiso"
                                name="nPermiso"
                                value={formData.nPermiso}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Seleccionar Módulo
                                </option>
                                {modulosOptions.map((modulo, index) => (
                                    <option key={index} value={modulo}>
                                        {modulo}
                                    </option>
                                ))}
                            </select>
                            <select
                                id="idRol"
                                name="idRol"
                                value={formData.idRol}
                                onChange={handleChange}
                                required
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
                    <h1 className="sub-titles-copm">Permisos Registradas</h1>
                    <div className="search-bar">
                        <select
                            id="permiso-filter"
                            name="permiso-filter"
                            value={filterValuePermiso}
                            onChange={handleFilterChangePermiso}
                        >
                            <option value="">
                                Seleccionar Módulo
                            </option>
                            {modulosOptions.map((modulo, index) => (
                                <option key={index} value={modulo}>
                                    {modulo}
                                </option>
                            ))}
                        </select>
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
                                <th>Permiso</th>
                                <th>Rol</th>
                                <th>Fecha de registro</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPermisos.map((val, key) => {
                                return (
                                    <tr key={val.idPermiso}>
                                        <td>{val.nPermiso}</td>
                                        <td>{getRolName(val.idRol)}</td>
                                        <td>{formatFecha(val.fechaRegistro)}</td>
                                        <td>
                                            <button
                                                className="edit-button"
                                                onClick={() => setPermiso(val)}
                                            >
                                                <FaPenClip
                                                    style={{
                                                        marginTop: "3px"
                                                    }} />
                                            </button>
                                            <button
                                                className="delete-button"
                                                onClick={() => handleDeletePermiso(val)}
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

export default RegistroPermisos;

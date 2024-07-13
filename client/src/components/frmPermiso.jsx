import React, { useEffect, useState } from "react";
import "../css/components.css";
import toast, { Toaster } from "react-hot-toast";
import { usePermiso } from "../context/permisoContext";
import { useRol } from "../context/rolContext";
import { format } from "date-fns";
import ReactPaginate from 'react-paginate';

const RegistroPermisos = () => {
    const [formData, setFormData] = useState({
        nPermiso: "",
        idRol: ""
    });
    const [newRol, setNewRol] = useState({
        nRol: ""
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [id, setId] = useState("");
    const [editar, setEditar] = useState(false);
    const [filteredPermisos, setFilteredPermisos] = useState([]);
    const [filterValuePermiso, setFilterValuePermiso] = useState("");
    const [filterValueRol, setFilterValueRol] = useState("");
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage] = useState(5); // Cambia esto al número de elementos por página que desees

    const {
        createPermiso,
        getPermiso,
        permisos,
        deletePermiso,
        updatePermiso,
    } = usePermiso();
    const {
        createRol,
        getRol,
        roles
    } = useRol();
    const modulosOptions = [
        "Inicio",
        "Empleados",
        "Liquidaciones",
        "Nomina",
        "Cargos",
        "Usuarios",
        "Roles",
        "Permisos",
    ];

    const handleCreatePermiso = async (e) => {
        e.preventDefault();
        try {
            await createPermiso(formData);
            toast.success(<b>El permiso ha sido registrado correctamente.</b>);
            setFormData({
                nPermiso: "",
                idRol: "",
            });
            await getPermiso();
        } catch (error) {
            setError(error.response?.data?.message || "Error desconocido");
            toast.error(<b>Error: {error.response?.data?.message || "Error desconocido"}</b>);
        }
    };

    const handleDeletePermiso = (val) => {
        toast(
            (t) => (
                <div style={{ textAlign: "center", fontWeight: "bold" }}>
                    <p>¿Realmente desea eliminar a <strong>{val.nPermiso}</strong>?</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                        <button className="toast-button-confirmed" onClick={() => {
                            deletePermiso(val.idPermiso)
                                .then(() => {
                                    toast.dismiss(t.id);
                                    toast.success(<b>El permiso {val.nPermiso} fue eliminado exitosamente!</b>);
                                    getPermiso();
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

    const handleUpdatePermiso = async (e) => {
        e.preventDefault();
        try {
            await updatePermiso(id, formData);
            limpiar();
            toast.success(<b>El permiso {formData.nPermiso} fue actualizado con éxito!</b>);
            await getPermiso();
        } catch (error) {
            setError(error.response?.data?.message || "Error desconocido");
            toast.error(<b>No se puede actualizar el permiso! Intente más tarde.</b>);
        }
    };

    const handleCreateRol = async (e) => {
        e.preventDefault();
        try {
            await createRol(newRol);
            toast.success(<b>El rol ha sido registrado correctamente.</b>);
            setNewRol({
                nRol: ""
            });
            setIsModalOpen(false);
            await getRol();
        } catch (error) {
            setError(error.response?.data?.message || "Error desconocido");
            toast.error(<b>Error: {error.response?.data?.message || "Error desconocido"}</b>);
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

    const handleNewRolChange = (e) => {
        const { name, value } = e.target;
        setNewRol((prevState) => ({
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

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const offset = currentPage * perPage;
    const currentPermisos = filteredPermisos.slice(offset, offset + perPage);
    const pageCount = Math.max(Math.ceil(filteredPermisos.length / perPage), 1);

    return (
        <div className="w-full h-full">
            <Toaster />
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
                            <div style={{ display: 'flex', alignItems: 'center' }}>
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
                                <button type="submit_3" className="open-modal-button-2" onClick={() => setIsModalOpen(true)}>
                                    <i className="fi fi-br-plus-small icon-style-modal"></i>
                                </button>
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
                    <h1 className="sub-titles-copm">Permisos Registrados</h1>
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
                            {currentPermisos.map((val, key) => (
                                <tr key={val.idPermiso}>
                                    <td>{val.nPermiso}</td>
                                    <td>{getRolName(val.idRol)}</td>
                                    <td>{formatFecha(val.fechaRegistro)}</td>
                                    <td>
                                        <button
                                            className="edit-button"
                                            onClick={() => setPermiso(val)}
                                        >
                                            <i className="fi fi-br-customize-edit icon-style-components"></i>
                                        </button>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDeletePermiso(val)}
                                        >
                                            <i className="fi fi-br-clear-alt icon-style-components"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ReactPaginate
                        previousLabel={
                            <i className="fi fi-br-angle-double-small-left icon-style-pagination" ></i>
                        }
                        nextLabel={
                            <i className="fi fi-br-angle-double-small-right icon-style-pagination"></i>
                        }
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"}
                        forcePage={Math.min(currentPage, pageCount - 1)}
                    />
                </div>
            </div>
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Agregar Nuevo Rol</h2>
                        <div className="card-modal">
                            <form onSubmit={handleCreateRol}>
                                <div className="form-group">
                                    <div className="input-container">
                                        <input
                                            type="text"
                                            id="nRol"
                                            name="nRol"
                                            placeholder=" "
                                            autoComplete="off"
                                            value={newRol.nRol}
                                            onChange={handleNewRolChange}
                                            required
                                        />
                                        <label htmlFor="nRol">Nombre de rol</label>
                                    </div>
                                </div>
                                <button type="submit">Guardar</button>
                                <button type="button" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegistroPermisos;

import React, { useEffect, useState } from "react";
import "../css/components.css";
import toast, { Toaster } from "react-hot-toast";
import { useUsuario } from "../context/usuarioContext";
import { useRol } from "../context/rolContext";
import { format } from "date-fns";
import RegistroUsuarioForm from "./frmRUsuario";
import ReactPaginate from 'react-paginate';

const RegistroUsuarios = () => {
    const [id, setId] = useState("");
    const [editar, setEditar] = useState(false);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [filterValueRol, setFilterValueRol] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [usuarioToEdit, setUsuarioToEdit] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage] = useState(10); // Cambia esto al número de elementos por página que desees

    const { getUsuario, usuarios, deleteUsuario } = useUsuario();
    const { getRol, roles } = useRol();

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

    const setUsuario = (val) => {
        setEditar(true);
        setUsuarioToEdit(val);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setUsuarioToEdit(null);
    };

    useEffect(() => {
        getUsuario();
        getRol();
    }, []);

    useEffect(() => {
        setFilteredUsuarios(usuarios);
    }, [usuarios]);

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

    const getRolName = (idRol) => {
        const rol = roles.find((r) => r.idRol === idRol);
        return rol ? rol.nRol : "Desconocido";
    };

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const offset = currentPage * perPage;
    const currentUsuarios = filteredUsuarios.slice(offset, offset + perPage);
    const pageCount = Math.max(Math.ceil(filteredUsuarios.length / perPage), 1);

    return (
        <div className="w-full h-full">
            <Toaster />
            {isFormOpen ? (
                <RegistroUsuarioForm onClose={handleFormClose} usuarioToEdit={usuarioToEdit}  roles={roles} />
            ) : (
                <div className="form-comp">
                    <div className="header-comp">
                        <h1 className="title-comp">Registro de Usuarios</h1>
                    </div>
                    <button type="button" className="open-modal-button" onClick={() => setIsFormOpen(true)}>Registrar</button>
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
                                {currentUsuarios.map((val, key) => {
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
            )}
        </div>
    );
};

export default RegistroUsuarios;

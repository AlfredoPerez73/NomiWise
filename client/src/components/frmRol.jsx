import React, { useEffect, useState } from "react";
import "../css/components.css";
import toast, { Toaster } from "react-hot-toast";
import { useRol } from "../context/rolContext";
import { format } from "date-fns";
import ReactPaginate from 'react-paginate';

const RegistroRoles = () => {
    const [formData, setFormData] = useState({
        nRol: "",
    });
    const [id, setId] = useState("");
    const [editar, setEditar] = useState(false);
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [filterValue, setFilterValue] = useState("");
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage] = useState(5); // Cambia esto al número de elementos por página que desees
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
            toast.success(<b>El rol ha sido registrado correctamente.</b>);
            setFormData({
                nRol: "",
            });
            await getRol();
        } catch (error) {
            setError(error.response.data.message);
            toast.error(<b>Error: {error.response.data.message}</b>);
        }
    };

    const handleDeleteRol = (val) => {
        toast(
            (t) => (
                <div style={{ textAlign: "center", fontWeight: "bold" }}>
                    <p>¿Realmente desea eliminar a <strong>{val.nRol}</strong>?</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                        <button className="toast-button-confirmed" onClick={() => {
                            deleteRol(val.idRol)
                                .then(() => {
                                    toast.dismiss(t.id);
                                    toast.success(<b>El rol {val.nRol} fue eliminado exitosamente!</b>);
                                    getRol();
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

    const handleUpdateRol = async (e) => {
        e.preventDefault();
        try {
            const rolExistente = roles.find((rol) => rol.nRol.toLowerCase() === formData.nRol.toLowerCase() && rol.idRol !== id);
            if (rolExistente) {
                throw new Error("El nuevo nombre del Rol ya está registrado");
            }
            await updateRol(id, formData);
            limpiar();
            toast.success(<b>El rol {formData.nRol} fue actualizado con éxito!</b>);
            await getRol();
        } catch (error) {
            setError(error.message);
            toast.error(<b>No se puede actualizar el rol: {error.message}</b>);
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

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const offset = currentPage * perPage;
    const currentRol = filteredRoles.slice(offset, offset + perPage);
    const pageCount = Math.max(Math.ceil(filteredRoles.length / perPage), 1);

    return (
        <div className="w-full h-full">
            <Toaster />
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
                    <h1 className="sub-titles-copm">Roles Registrados</h1>
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
                            {currentRol.map((val, key) => {
                                return (
                                    <tr key={val.idRol}>
                                        <td>{val.nRol}</td>
                                        <td>{formatFecha(val.fechaRegistro)}</td>
                                        <td>
                                            <button
                                                className="edit-button"
                                                onClick={() => setRol(val)}
                                            >
                                                <i className="fi fi-br-customize-edit icon-style-components"></i>
                                            </button>
                                            <button
                                                className="delete-button"
                                                onClick={() => handleDeleteRol(val)}
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
        </div>
    );
};

export default RegistroRoles;

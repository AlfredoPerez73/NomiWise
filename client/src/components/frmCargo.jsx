import React, { useEffect, useState } from "react";
import "../css/components.css";
import toast, { Toaster } from "react-hot-toast";
import { useCargo } from "../context/cargoContext";
import { format } from "date-fns";
import ReactPaginate from 'react-paginate';

const RegistroCargos = () => {
    const [formData, setFormData] = useState({
        nCargo: "",
    });
    const [id, setId] = useState("");
    const [editar, setEditar] = useState(false);
    const [filteredCargos, setFilteredCargos] = useState([]);
    const [filterValue, setFilterValue] = useState("");
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage] = useState(5); // Cambia esto al número de elementos por página que desees
    const {
        createCargo,
        getCargo,
        cargos,
        deleteCargo,
        updateCargo,
    } = useCargo();

    const handleCreateCargo = async (e) => {
        e.preventDefault();
        try {
            await createCargo(formData);
            toast.success(<b>El cargo ha sido registrado correctamente.</b>);
            setFormData({
                nCargo: "",
            });
            await getCargo();
        } catch (error) {
            setError(error.response.data.message);
            toast.error(<b>Error: {error.response.data.message}</b>);
        }
    };

    const handleDeleteCargo = (val) => {
        toast(
            (t) => (
                <div className="toast-question">
                    <p>¿Realmente desea eliminar a <strong>{val.nCargo}</strong>?</p>
                    <button className="toast-button-confirmed" onClick={() => {
                        deleteCargo(val.idCargo)
                            .then(() => {
                                toast.dismiss(t.id);
                                toast.success(<b>El cargo {val.nCargo} fue eliminado exitosamente!</b>);
                                getCargo();
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
            ),
            {
                duration: 8000,
            }
        );
    };

    const handleUpdateCargo = async (e) => {
        e.preventDefault();
        try {
            const cargoExistente = cargos.find((cargo) => cargo.nCargo.toLowerCase() === formData.nCargo.toLowerCase() && cargo.idCargo !== id);
            if (cargoExistente) {
                throw new Error("El nuevo nombre del cargo ya está registrado");
            }
            await updateCargo(id, formData);
            limpiar();
            toast.success(<b>El cargo {formData.nCargo} fue actualizado con éxito!</b>);
            await getCargo();
        } catch (error) {
            setError(error.message);
            toast.error(<b>No se puede actualizar el cargo: {error.message}</b>);
        }
    };

    const setCargo = (val) => {
        setEditar(true);
        setFormData({
            nCargo: val.nCargo,
        });
        setId(val.idCargo);
    };

    const limpiar = () => {
        setFormData({
            nCargo: "",
        });
        setId("");
        setEditar(false);
    };

    useEffect(() => {
        getCargo();
    }, []);

    useEffect(() => {
        setFilteredCargos(cargos);
    }, [cargos]);

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
        setFilteredCargos(
            cargos.filter((cargo) =>
                cargo.nCargo.toLowerCase().includes(query)
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
    const currentCargo = filteredCargos.slice(offset, offset + perPage);
    const pageCount = Math.max(Math.ceil(filteredCargos.length / perPage), 1);

    return (
        <div className="w-full h-full">
            <Toaster />
            <div className="form-comp">
                <div className="header-comp">
                    <h1 className="title-comp">Registro de Cargo</h1>
                </div>
                <div className="card">
                    <h1 className="sub-titles-copm">Nuevo cargo</h1>
                    <form
                        onSubmit={editar ? handleUpdateCargo : handleCreateCargo}
                    >
                        <div className="form-group">
                            <div className="input-container">
                                <input
                                    type="text"
                                    id="nCargo"
                                    name="nCargo"
                                    placeholder=" "
                                    autoComplete="off"
                                    value={formData.nCargo}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="nCargo">Nombre de cargo</label>
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
                    <h1 className="sub-titles-copm">Cargos Registradas</h1>
                    <div className="search-bar">
                        <input
                            type="text"
                            id="cargo-filter"
                            name="cargo-filter"
                            placeholder="Filtrar cargos"
                            autoComplete="off"
                            value={filterValue}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Cargos</th>
                                <th>Fecha de registro</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCargo.map((val, key) => {
                                return (
                                    <tr key={val.idCargo}>
                                        <td>{val.nCargo}</td>
                                        <td>{formatFecha(val.fechaRegistro)}</td>
                                        <td>
                                            <button
                                                className="edit-button"
                                                onClick={() => setCargo(val)}
                                            >
                                                <i className="fi fi-br-customize-edit icon-style-components"></i>
                                            </button>
                                            <button
                                                className="delete-button"
                                                onClick={() => handleDeleteCargo(val)}
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

export default RegistroCargos;

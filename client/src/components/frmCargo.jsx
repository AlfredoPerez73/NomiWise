import React, { useEffect, useState } from "react";
import "../css/components.css";
import Swal from "sweetalert2";
import { useCargo } from "../context/cargoContext";
import { format } from "date-fns";
import {
    FaPenClip,
    FaCircleMinus
} from "react-icons/fa6";

const RegistroCargos = () => {
    const [formData, setFormData] = useState({
        nCargo: "",
    });
    const [id, setId] = useState("");
    const [editar, setEditar] = useState(false);
    const [filteredCargos, setFilteredCargos] = useState([]);
    const [filterValue, setFilterValue] = useState("");
    const [error, setError] = useState("");
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
            Swal.fire({
                icon: "success",
                title: "¡Registro exitoso!",
                text: "El cargo ha sido registrado correctamente.",
                confirmButtonColor: '#5383E8',
                background: '#1f1e44e1',
                color: 'whitesmoke',
                customClass: {
                    popup: 'custom-alert',
                },
            });
            setFormData({
                nCargo: "",
            });
            await getCargo();
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

    const handleDeleteCargo = (val) => {
        Swal.fire({
            title: "Confirmar eliminación",
            html:
                "<i>¿Realmente desea eliminar a <strong>" +
                val.nCargo +
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
                deleteCargo(val.idCargo)
                    .then(() => {
                        Swal.fire({
                            title: "Registro eliminado!",
                            html:
                                "<i>El cargo <strong>" +
                                val.nCargo +
                                "</strong> fue eliminado exitosamente!</i>",
                            icon: "success",
                            confirmButtonColor: '#5383E8',
                            background: '#1f1e44e1',
                            color: 'whitesmoke',
                            customClass: {
                                popup: 'custom-alert',
                            },
                        });
                        getCargo();
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

    const handleUpdateCargo = async (e) => {
        e.preventDefault();
        try {
            await updateCargo(id, formData);
            limpiar();
            Swal.fire({
                title: "<strong>Actualización exitosa!</strong>",
                html:
                    "<i>El rol <strong>" +
                    formData.nCargo +
                    "</strong> fue actualizado con éxito! </i>",
                icon: "success",
                confirmButtonColor: '#5383E8',
                background: '#1f1e44e1',
                color: 'whitesmoke',
                customClass: {
                    popup: 'custom-alert',
                },
            });
            await getCargo();
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

    const setCargo = (val) => {
        setEditar(true);
        setFormData({
            nCargo: val.nCargo,
        });
        setId(val.idCargo);
    };

    const limpiar = () => {
        setFormData({
            nRol: "",
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

    return (
        <div className="w-full h-full">
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
                            {filteredCargos.map((val, key) => {
                                return (
                                    <tr key={val.idCargo}>
                                        <td>{val.nCargo}</td>
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

export default RegistroCargos;
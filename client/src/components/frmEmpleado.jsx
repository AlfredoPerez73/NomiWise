import React, { useEffect, useState } from "react";
import "../css/components.css";
import toast, { Toaster } from "react-hot-toast";
import { useEmpleado } from "../context/empleadoContext";
import { useCargo } from "../context/cargoContext";
import { useContrato } from "../context/contratoContext";
import { format } from "date-fns";
import RegistroEmpleadoForm from "./frmREmpleado";

const RegistroEmpleados = () => {
    const [id, setId] = useState("");
    const [editar, setEditar] = useState(false);
    const [filteredEmpleados, setFilteredEmpleados] = useState([]);
    const [filterValueCargo, setFilterValueCargo] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [empleadoToEdit, setEmpleadoToEdit] = useState(null);

    const { getEmpleado, empleados } = useEmpleado();
    const { getCargo, cargos } = useCargo();
    const { getContrato, contratos } = useContrato();

    const handleDeleteEmpleado = (val) => {
/*         toast(
            (t) => (
                <div style={{ textAlign: "center", fontWeight: "bold" }}>
                    <p>¿Realmente desea eliminar a <strong>{val.nombre}</strong>?</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                        <button className="toast-button-confirmed" onClick={() => {
                            deleteUsuario(val.idEmpleado)
                                .then(() => {
                                    toast.dismiss(t.id);
                                    toast.success(<b>El empleado {val.nombre} fue eliminado exitosamente!</b>);
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
        ); */
    };

    const setEmpleado = (val) => {
        setEditar(true);
        setEmpleadoToEdit(val);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEmpleadoToEdit(null);
    };

    useEffect(() => {
        getEmpleado();
        getCargo();
        getContrato();
    }, []);

    useEffect(() => {
        setFilteredEmpleados(empleados);
    }, [empleados]);

    const handleFilterChangeCargo = (e) => {
        const query = e.target.value.toLowerCase();
        setFilterValueCargo(e.target.value);
        setFilteredEmpleados(
            empleados.filter((empleado) =>
                String(empleado.idCargo).toLowerCase().includes(query)
            )
        );
    };

    const handleFilterChange = (e) => {
        const query = e.target.value.toLowerCase();
        setFilterValue(query);
        setFilteredEmpleados(
            empleados.filter((n) =>
                n.documento.toLowerCase().includes(query) ||
                n.nombre.toLowerCase().includes(query) ||
                getContratoTipo(n.idContrato).toLowerCase().includes(query) ||
                getCargoName(n.idCargo).toLowerCase().includes(query) ||
                getContratoSalario(n.idContrato).toLowerCase().includes(query)
            )
        );
    };    

    const formatFecha = (fecha) => {
        return format(new Date(fecha), "dd/MM/yyyy");
    };

    const getCargoName = (idCargo) => {
        const cargo = cargos.find((c) => c.idCargo === idCargo);
        return cargo ? cargo.nCargo : "Desconocido";
    };

    const getContratoFechaInicio = (idContrato) => {
        const contrato = contratos.find((c) => c.idContrato === idContrato);
        return contrato ? format(new Date(contrato.fechaInicio), "dd/MM/yyyy") : "Desconocida";
    };
    
    const getContratoFechaFin = (idContrato) => {
        const contrato = contratos.find((c) => c.idContrato === idContrato);
        return contrato ? format(new Date(contrato.fechaFin), "dd/MM/yyyy") : "Desconocida";
    };
    
    const getContratoSalario = (idContrato) => {
        const contrato = contratos.find((c) => c.idContrato === idContrato);
        return contrato ? contrato.salario.toLocaleString() : "Desconocido";
    };
    
    const getContratoTipo = (idContrato) => {
        const contrato = contratos.find((c) => c.idContrato === idContrato);
        return contrato ? contrato.tipoContrato : "Desconocido";
    };



    return (
        <div className="w-full h-full">
            <Toaster />
            {isFormOpen ? (
                <RegistroEmpleadoForm onClose={handleFormClose} empleadoToEdit={empleadoToEdit}  cargos={cargos} contratos={contratos} />
            ) : (
                <div className="form-comp">
                    <div className="header-comp">
                        <h1 className="title-comp">Registro de Empleados</h1>
                    </div>
                    <button type="button" className="open-modal-button" onClick={() => setIsFormOpen(true)}>Registrar</button>
                    <div className="table-card">
                        <h1 className="sub-titles-copm">Empleados Registrados</h1>
                        <div className="search-bar">
                            <input
                                type="text"
                                id="empleado-filter"
                                name="empleado-filter"
                                placeholder="Filtrar empleados"
                                autoComplete="off"
                                value={filterValue}
                                onChange={handleFilterChange}
                            />
                            <select
                                id="cargo-filter"
                                name="cargo-filter"
                                value={filterValueCargo}
                                onChange={handleFilterChangeCargo}
                            >
                                <option value="">
                                    Seleccionar Cargo
                                </option>
                                {cargos.map((cargo) => (
                                    <option key={cargo.idCargo} value={cargo.idCargo}>
                                        {cargo.nCargo}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Documento</th>
                                    <th>Empleado</th>
                                    <th>Cargo</th>
                                    <th>Fecha de Inicio</th>
                                    <th>Fecha de Fin</th>
                                    <th>Salario</th>
                                    <th>Contrato</th>
                                    <th>Estado</th>
                                    <th>Fecha de registro</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmpleados.map((val, key) => {
                                    return (
                                        <tr key={val.idEmpleado}>
                                            <td>{val.documento}</td>
                                            <td>{val.nombre}</td>
                                            <td>{getCargoName(val.idCargo)}</td>
                                            <td>{getContratoFechaInicio(val.idContrato)}</td>
                                            <td>{getContratoFechaFin(val.idContrato)}</td>
                                            <td>{getContratoSalario(val.idContrato)}</td>
                                            <td>{getContratoTipo(val.idContrato)}</td>
                                            <td>{val.estado}</td>
                                            <td>{formatFecha(val.fechaRegistro)}</td>
                                            <td>
                                                <button
                                                    className="edit-button"
                                                    onClick={() => setEmpleado(val)}
                                                >
                                                    <i className="fi fi-br-customize-edit icon-style-components"></i>
                                                </button>
                                                <button
                                                    className="delete-button"
                                                    onClick={() => handleDeleteEmpleado(val)}
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
            )}
        </div>
    );
};

export default RegistroEmpleados;

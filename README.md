# Sistema de Nómina 🧾

Un sistema de gestión de nómina desarrollado con un enfoque moderno y minimalista, utilizando **React** para el frontend, **Node.js** para el backend y **PostgreSQL** como base de datos. Diseñado para ser fácil de usar, escalable y eficiente.

---

## 🚀 Características

- Gestión de empleados, cargos, despidos, evaluaciones, novedades, liquidaciones y nómina.
- Administración de usuarios, roles y permisos.
- Filtros avanzados para reportes y visualización de datos.
- Usuario administrador predefinido al compilar el sistema por primera vez.
- Tecnología moderna con un diseño minimalista.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología  | Descripción              | Logo                  |
|-------------|--------------------------|-----------------------|
| **React**   | Frontend dinámico        | ![React](https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg) |
| **Node.js** | Backend eficiente        | ![Node.js](https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg) |
| **PostgreSQL** | Base de datos robusta | ![PostgreSQL](https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg) |
| **Vite**    | Herramienta de desarrollo rápida | ![Vite](https://vitejs.dev/logo.svg) |

---

## 📋 Requisitos Previos

| Requisito         | Descripción                  | Logo                  |
|-------------------|------------------------------|-----------------------|
| **Node.js**       | v14+ instalado              | ![Node.js](https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg) |
| **PostgreSQL**    | Configurado y en ejecución   | ![PostgreSQL](https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg) |
| **Git**           | Para clonar el repositorio  | ![Git](https://upload.wikimedia.org/wikipedia/commons/e/e0/Git-logo.svg) |
| **npm o yarn**    | Administrador de paquetes    | ![npm](https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg) |

---

## 📝 Instalación y Configuración

**1. Clonar el Repositorio:** git clone https://github.com/AlfredoPerez73/NomiWise.git
**2. Ruta para el Frontend:** cd client | npm install/i  para copilarlo npm run dev
**3. Ruta para el Backend:** cd server | npm install/i  para copilarlo npm run dev

### 📝 Configuración de PostgreSQL

- db name: "nomiwise2"
- username: "postgres"
- password: "123"

---

## 👤 Usuario Administrador Predefinido

Al compilar el sistema por primera vez, se insertará automáticamente un administrador en la base de datos.

**Detalles del Usuario:**
- Documento: EL QUE DESEE
- Nombre: EL QUE DESEE
- Correo: EL QUE DESEE
- Contraseña: LA QUE DESEE
- Rol: Administrador

## 🗄️ Datos Iniciales

{
  "Usuarios (usuarios)": [
    {
      "idUsuario": 1,
      "documento": "10668664955",
      "nombre": "ALFREDO JOSE PEREZ MEZA",
      "correo": "alfredojoseperezmeza124@gmail.com",
      "contrasena": "alfredo7",
      "fechaRegistro": "2024-12-07",
      "idRol": 1
    }
  ],
  "Roles (roles)": [
    {
      "idRol": 1,
      "nRol": "ADMINISTRADOR",
      "fechaRegistro": "2024-12-07"
    }
  ],
  "Permisos (permisos)": [
    {
      "nPermiso": "Inicio",
      "idRol": 1
    },
    {
      "nPermiso": "Empleados",
      "idRol": 1
    },
    {
      "nPermiso": "Liquidaciones",
      "idRol": 1
    },
    {
      "nPermiso": "Cargos",
      "idRol": 1
    },
    {
      "nPermiso": "Usuarios",
      "idRol": 1
    },
    {
      "nPermiso": "Roles",
      "idRol": 1
    },
    {
      "nPermiso": "Nomina",
      "idRol": 1
    },
    {
      "nPermiso": "Permisos",
      "idRol": 1
    },
    {
      "nPermiso": "Evaluaciones",
      "idRol": 1
    },
    {
      "nPermiso": "Novedades",
      "idRol": 1
    },
    {
      "nPermiso": "Despidos",
      "idRol": 1
    }
  ]
}

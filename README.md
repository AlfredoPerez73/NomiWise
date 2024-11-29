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
| **React**   | Frontend dinámico        | <div align="center"><img src="https://nodejs.org/static/images/logo.svg" alt="Node.js" width="40" height="40" /></div> |
| **Node.js** | Backend eficiente        | <div align="center"><img src="https://vitejs.dev/logo.svg" alt="Vite" width="40" height="40" /></div> |
| **PostgreSQL** | Base de datos robusta | <div align="center"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Postgresql_elephant.svg" width="40" /></div> |
| **Vite**    | Herramienta de desarrollo rápida | <div align="center"><img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" alt="Python" width="40" height="40" /></div> |
| **Python**       | Lenguaje para scripts y análisis       | <div align="center"><img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" width="40" /></div> |

---

## 📋 Requisitos Previos

| Requisito         | Descripción                  | Logo                  |
|-------------------|------------------------------|-----------------------|
| **Node.js**       | v14+ instalado              | <div align="center"><img src="https://nodejs.org/static/images/logo.svg" alt="Node.js" width="40" height="40" /></div> |
| **Python**       | Lenguaje para scripts y análisis       | <div align="center"><img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" width="40" /></div> |
| **PostgreSQL**    | Configurado y en ejecución   | <div align="center"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Postgresql_elephant.svg" width="40" /></div> |
| **Git**           | Para clonar el repositorio  | <div align="center"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Postgresql_elephant.svg" alt="PostgreSQL" width="40" height="40" /></div> |
| **npm o yarn**    | Administrador de paquetes    | <div align="center"><img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" alt="Python" width="40" height="40" /></div> |

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

📂 Usuarios (usuarios)

[
  {
    "documento": "EL QUE DESEE",
    "nombre": "EL QUE DESEE",
    "correo": "EL QUE DESEE",
    "contraseña": "EL QUE DESEE",
    "idRol": 1
  }
]

📂 Roles (roles)

[
  {
    "idRol": 1,
    "nRol": "ADMINISTRADOR",
    "fechaRegistro": "2024-12-07"
  }
]

📂 Permisos (permisos)

[
  { "nPermiso": "Inicio", "idRol": 1 },
  { "nPermiso": "Empleados", "idRol": 1 },
  { "nPermiso": "Liquidaciones", "idRol": 1 },
  { "nPermiso": "Cargos", "idRol": 1 },
  { "nPermiso": "Usuarios", "idRol": 1 },
  { "nPermiso": "Roles", "idRol": 1 },
  { "nPermiso": "Nomina", "idRol": 1 },
  { "nPermiso": "Permisos", "idRol": 1 },
  { "nPermiso": "Evaluaciones", "idRol": 1 },
  { "nPermiso": "Novedades", "idRol": 1 },
  { "nPermiso": "Despidos", "idRol": 1 }
]

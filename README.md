# Sistema de Nómina 🧾

Un sistema de gestión de nómina desarrollado con un enfoque moderno y minimalista, utilizando **React** para el frontend, **Node.js** y **Vite** para el backend, y **PostgreSQL** como base de datos. Diseñado para ser fácil de usar, escalable y eficiente.

---

## 🚀 Características

- Gestión de empleados, cargos, despidos, evaluaciones, novedades, liquidaciones y nómina.
- Administración de usuarios, roles y permisos.
- Filtros avanzados para reportes y visualización de datos.
- Usuario administrador predefinido al compilar el sistema por primera vez.
- Tecnología moderna con un diseño minimalista.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React + Vite
- **Backend:** Node.js
- **Base de Datos:** PostgreSQL
- **Lenguajes:** JavaScript, Python

---

## 📋 Requisitos Previos

1. **Node.js** v14+ instalado.
2. **PostgreSQL** v12+ configurado y en ejecución.
3. **Git** para clonar el repositorio.
4. **Administrador de paquetes:** npm o yarn.

---

## 📝 Instalación y Configuración

**1. Clonar el Repositorio:** git clone https://github.com/AlfredoPerez73/NomiWise.git
**2. Ruta para el Frontend:** cd client | npm install/i  para copilarlo npm run dev
**3. Ruta para el Backend:** cd server | npm install/i  para copilarlo npm run dev

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
    "idUsuario": 1,
    "documento": "1066866495",
    "nombre": "ALFREDO JOSE PEREZ MEZA",
    "correo": "alfredojoseperezmeza124@gmail.com",
    "contraseña": "alfredo7",
    "fechaRegistro": "2024-12-07",
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

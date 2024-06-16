import { Usuario } from "../models/usuario.js";
import { UsuarioDTO } from "../dtos/usuario.dto.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";

async function validarCorreo(correo) {
  const usuarioEncontrado = await Usuario.findOne({
    where: { correo: correo },
  });

  if (usuarioEncontrado) {
    throw new Error("El correo ya está en uso por un usuario");
  }

  const empleadoEncontrado = await Empleado.findOne({
    where: { correo: correo },
  });

  if (empleadoEncontrado) {
    throw new Error("El correo ya está en uso por un empleado");
  }
}

export async function registrarUsuario(documento, nombre, correo, contraseña, idRol, idSUsuario) {
  try {

    await validarCorreo(correo);

    // Hash de la contraseña
    const contraseñaHash = await bcrypt.hash(contraseña, 10);

    // Crear el nuevo usuario
    const newUsuario = new Usuario({
      documento,
      nombre,
      correo,
      contraseña: contraseñaHash,
      idRol,
      idSUsuario
    });

    // Guardar el usuario en la base de datos
    const UsuarioGuardado = await newUsuario.save();

    // // Crear token de acceso
    // const token = await createAccessToken({
    //   idUsuario: UsuarioGuardado.idUsuario,
    // });

    // Crear y devolver un DTO de usuario
    return new UsuarioDTO(
      UsuarioGuardado.idUsuario,
      UsuarioGuardado.idRol,
      UsuarioGuardado.idSUsuario,
      UsuarioGuardado.documento,
      UsuarioGuardado.nombre,
      UsuarioGuardado.correo,
      // token
    );
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function iniciarSesion(correo, contraseña) {
  try {
    // Buscar usuario por correo electrónico
    const usuarioEncontrado = await Usuario.findOne({
      where: {
        correo: correo,
      },
    });

    if (!usuarioEncontrado) {
      throw new Error("El correo electrónico no existe");
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(
      contraseña,
      usuarioEncontrado.contraseña
    );
    if (!isMatch) {
      throw new Error("La contraseña es incorrecta");
    }

    // Generar token de acceso
    const token = await createAccessToken({
      idUsuario: usuarioEncontrado.idUsuario,
      nombre: usuarioEncontrado.nombre,
    });

    // Crear y devolver DTO de usuario logueado
    return new UsuarioDTO(
      usuarioEncontrado.idUsuario,
      usuarioEncontrado.idRol,
      usuarioEncontrado.idSUsuario,
      usuarioEncontrado.documento,
      usuarioEncontrado.nombre,
      usuarioEncontrado.correo,
      token
    );
  } catch (error) {
    throw new Error(error.message);
  }
}
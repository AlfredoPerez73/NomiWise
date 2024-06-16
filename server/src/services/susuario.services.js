import { SUsuario } from "../models/susuario.js";
import { SUsuarioDTO } from "../dtos/susuario.dto.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";

async function validarCorreo(correo) {
  const usuarioEncontrado = await SUsuario.findOne({
    where: { correo: correo },
  });

  if (usuarioEncontrado) {
    throw new Error("El correo ya está en uso por un usuario");
  }
}

export async function registrarUsuario(documento, nombre, correo, contraseña) {
  try {

    await validarCorreo(correo);

    // Hash de la contraseña
    const contraseñaHash = await bcrypt.hash(contraseña, 10);

    // Crear el nuevo usuario
    const newUsuario = new SUsuario({
      documento,
      nombre,
      correo,
      contraseña: contraseñaHash,
    });

    // Guardar el usuario en la base de datos
    const UsuarioGuardado = await newUsuario.save();

    // // Crear token de acceso
    // const token = await createAccessToken({
    //   idUsuario: UsuarioGuardado.idUsuario,
    // });

    // Crear y devolver un DTO de usuario
    return new SUsuarioDTO(
      UsuarioGuardado.idUsuario,
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
    const usuarioEncontrado = await SUsuario.findOne({
      where: {
        correo: correo,
      },
    });

    if (!usuarioEncontrado) {
      throw new Error("El correo electrónico no existe");
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(
      contraseña, usuarioEncontrado.contraseña
    );
    if (!isMatch) {
      throw new Error("La contraseña es incorrecta");
    }

    // Generar token de acceso
    const token = await createAccessToken({
      idSUsuario: usuarioEncontrado.idSUsuario,
      nombre: usuarioEncontrado.nombre,
    });

    // Crear y devolver DTO de usuario logueado
    return new SUsuarioDTO(
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
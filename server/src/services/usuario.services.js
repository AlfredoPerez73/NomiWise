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
}

export async function registrarUsuario(documento, nombre, correo, contraseña, idRol) {
  try {

    await validarCorreo(correo);

    const contraseñaHash = await bcrypt.hash(contraseña, 10);

    const newUsuario = new Usuario({
      documento,
      nombre,
      correo,
      idRol,
      contraseña: contraseñaHash,
    });

    const UsuarioGuardado = await newUsuario.save();

    return new UsuarioDTO(
      UsuarioGuardado.idUsuario,
      UsuarioGuardado.idRol,
      UsuarioGuardado.documento,
      UsuarioGuardado.nombre,
      UsuarioGuardado.correo,
    );
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function obtenerUsuarios() {
  try {
    const usuarios = await Usuario.findAll();
    return usuarios.map(
      (usuario) =>
        new UsuarioDTO(
          usuario.idUsuario,
          usuario.idRol,
          usuario.documento,
          usuario.nombre,
          usuario.correo,
          usuario.contraseña,
          usuario.fechaRegistro,
        )
    );
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function actualizarUsuarios(
  idUsuario,
  idRol,
  documento,
  nombre,
  correo,
  contraseña,
) {
  try {
    const usuario = await Usuario.findOne({
      where: {
        idUsuario: idUsuario,
      },
    });

    const contraseñaHash = await bcrypt.hash(contraseña, 10);

    usuario.idRol = idRol;
    usuario.documento = documento;
    usuario.nombre = nombre;
    usuario.correo = correo;
    usuario.contraseña = contraseñaHash;
    await usuario.save();
    return new UsuarioDTO(
      usuario.idUsuario,
      usuario.idRol,
      usuario.documento,
      usuario.nombre,
      usuario.correo,
      usuario.contraseña,
    );
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function eliminarUsuario(idUsuario) {
  try {
    await Usuario.destroy({
      where: {
        idUsuario: idUsuario,
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function iniciarSesion(correo, contraseña) {
  try {
    const usuarioEncontrado = await Usuario.findOne({
      where: {
        correo: correo,
      },
    });

    if (!usuarioEncontrado) {
      throw new Error("El correo electrónico no existe");
    }


/*     if (contraseña != usuarioEncontrado.contraseña) {
      throw new Error("La contraseña es incorrecta");
    }
 */
    const isMatch = await bcrypt.compare(
      contraseña,
      usuarioEncontrado.contraseña
    );

    if (!isMatch) {
      throw new Error("La contraseña es incorrecta");
    }


    const token = await createAccessToken({
      idUsuario: usuarioEncontrado.idUsuario,
      nombre: usuarioEncontrado.nombre,
    });

    return new UsuarioDTO(
      usuarioEncontrado.idUsuario,
      usuarioEncontrado.idRol,
      usuarioEncontrado.documento,
      usuarioEncontrado.nombre,
      usuarioEncontrado.correo,
      usuarioEncontrado.contraseña,
      usuarioEncontrado.fechaRegistro,
      token
    );
  } catch (error) {
    throw new Error(error.message);
  }
}
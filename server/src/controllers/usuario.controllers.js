import { Usuario } from "../models/usuario.js";
import * as UsuarioService from "../services/usuario.services.js";
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from "../config.js";

export const postRegistroUsuario = async (req, res) => {
  try {
    const idUsuario = req.usuario.idUsuario;
    const { documento, nombre, correo, contraseña, idRol } = req.body;
    const usuarioRegistrado = await UsuarioService.registrarUsuario(
      documento,
      nombre,
      correo,
      contraseña,
      idUsuario,
      idRol
    );
    res.json(usuarioRegistrado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export async function getUsuario(req, res) {
  try {
    const usuarios = await UsuarioService.obtenerUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function putUsuario(req, res) {
  const { idUsuario } = req.params;
  const { documento, nombre, correo, contraseña, idRol } = req.body;
  try {
    const usuarioActualizado = await UsuarioService.actualizarUsuarios(
      idUsuario,
      idRol,
      documento,
      nombre,
      correo,
      contraseña,
    );
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteUsuario(req, res) {
  const { idUsuario } = req.params;
  try {
    await UsuarioService.eliminarUsuario(idUsuario);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const postIniciarSesion = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    const usuarioLogueado = await UsuarioService.iniciarSesion(
      correo,
      contraseña
    );
    res.cookie("token", usuarioLogueado.token);
    res.json(usuarioLogueado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const postCerrarSesion = async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({
    message:
      "Unauthorized 1"
  });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({
      message:
        "Unauthorized 2"
    });

    const userFound = await Usuario.findByPk(user.idUsuario);
    if (!userFound) return res.status(401).json({
      message:
        "Unauthorized 3"
    });

    return res.json(userFound);
  })
}

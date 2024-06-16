import { Usuario } from "../models/usuario.js";
import * as UsuarioService from "../services/usuario.services.js";
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from "../config.js";

export const postRegistroUsuario = async (req, res) => {
  try {
    const { documento, nombre, correo, contraseña, idRol, idSUsuario } = req.body;
    const usuarioRegistrado = await UsuarioService.registrarUsuario(
      documento,
      nombre,
      correo,
      contraseña,
      idRol,
      idSUsuario
    );
    // res.cookie("token", usuarioRegistrado.token); para acceder de una depues de  registrar
    res.json(usuarioRegistrado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

  if(!token) return res.status(401).json({message: 
    "Unauthorized 1"});

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if(err) return res.status(401).json({message: 
      "Unauthorized 2"});

    const userFound = await Usuario.findByPk(user.idUsuario);
    if(!userFound) return res.status(401).json({ message: 
      "Unauthorized 3" });

    return res.json(userFound);
  })
}

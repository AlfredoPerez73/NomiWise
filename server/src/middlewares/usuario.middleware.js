import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const usuarioRequerido = (req, res, next) => {
  console.log(req.headers);
  try {
    const { token } = req.cookies;

    if (!token)
      return res.status(401).json({ message: "autorizacion Denegada" });

    jwt.verify(token, TOKEN_SECRET, (error, usuario) => {
      if (error) {
        return res.status(401).json({ message: "Token no es valido" });
      }
      req.usuario = usuario;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

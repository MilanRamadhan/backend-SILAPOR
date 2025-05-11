import jwt from "jsonwebtoken";
import Auth from "../models/Auth";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak ditemukan atau format salah" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Ambil auth berdasarkan ID dari token
    const auth = await Auth.findById(decoded.id);
    if (!auth) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    req.auth = auth; // auth lengkap dimasukkan ke req.auth
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid atau sudah kedaluwarsa" });
  }
};

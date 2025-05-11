import jwt from "jsonwebtoken";
import Auth from "../models/Auth.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak ditemukan atau format salah" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Ambil user berdasarkan ID dari token
    const user = await Auth.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    req.user = user; // user lengkap dimasukkan ke req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid atau sudah kedaluwarsa" });
  }
};

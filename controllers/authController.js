import Auth from "../models/Auth.js";
import { verifyToken } from "../middleware/auth.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const kecamatanList = ["Baiturrahman", "Banda Raya", "Jaya Baru", "Kuta Alam", "Kuta Raja", "Lueng Bata", "Meuraxa", "Syiah Kuala", "Ulee Kareng"];

export const register = async (req, res) => {
  try {
    const { fullName, nomorInduk, email, password, confirmPassword, callNumber, address, kecamatan, role } = req.body;

    if (!fullName || !nomorInduk || !email || !password || !confirmPassword || !callNumber || !address || !kecamatan || role === undefined) {
      return res.status(400).json({
        status: 400,
        message: "semua kolom harus di isi",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 400,
        message: "Password dan konfirmasi password tidak cocok",
      });
    }

    if (!kecamatanList.includes(kecamatan)) {
      return res.status(400).json({
        status: 400,
        message: "Kecamatan tidak valid",
      });
    }

    const alreadyRegister = await Auth.findOne({ email });
    if (alreadyRegister) {
      return res.status(400).json({
        status: 400,
        message: "akun dengan email ini sudah terdaftar, silahkan gunakan email lain",
      });
    } else {
      const newUser = new Auth({
        fullName,
        nomorInduk,
        email,
        password,
        confirmPassword,
        callNumber,
        address,
        kecamatan,
        role,
      });

      bcryptjs.hash(password, 10, async (err, hash) => {
        if (err) {
          return res.status(500).json(err);
        }

        newUser.set("password", hash);
        await newUser.save(); // Tunggu sampai user disimpan ke DB

        return res.status(200).json({ data: newUser, message: "Pengguna berhasil terdaftar." });
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        message: "Silakan isi semua kolom yang diperlukan.",
      });
    } else {
      const user = await Auth.findOne({ email });
      if (!user) {
        return res.status(400).json({ status: 400, message: "Email atau kata sandi salah." });
      } else {
        const validateUser = await bcryptjs.compare(password, user.password);
        if (!validateUser) {
          res.status(400).json({ status: 400, message: "Email atau kata sandi salah." });
        } else {
          const payload = {
            id: user._id,
            email: user.email,
          };
          const JWT_SECRET = process.env.JWT_SECRET;

          jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" }, async (err, token) => {
            if (err) {
              return res.status(500).json(err);
            }
            user.set("token", token);
            await user.save();

            return res.status(200).json({
              status: 200,
              data: user,
              token: user.token,
            });
          });
        }
      }
    }
  } catch (error) {
    console.log("Error during login:", error);
    res.status(500).json({
      status: 500,
      message: "Kesalahan server internal",
    });
  }
};

export const editProfile = [
  verifyToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { newFullName, newEmail } = req.body;

      if (!id) {
        return res.status(400).json({
          status: 400,
          message: "ID Pengguna diperlukan, tetapi tidak disediakan",
        });
      }

      if (!newFullName || !newEmail) {
        return res.status(400).json({
          status: 400,
          message: "kolom first name ataupun kolom email tidak boleh kosong",
        });
      }

      const emailAlreadyRegistered = await Auth.findOne({
        email: newEmail,
      });
      const nameAlreadyRegistered = await Auth.findOne({
        fullName: newFullName,
      });

      if (emailAlreadyRegistered) {
        return res.status(400).json({
          status: 400,
          message: "Email sudah digunakan",
        });
      }

      if (nameAlreadyRegistered) {
        return res.status(400).json({
          status: 400,
          message: "Nama sudah digunakan",
        });
      }

      const editedUser = await Auth.findById(id);

      if (!editedUser) {
        return res.status(400).json({
          status: 400,
          message: "pengguna tidak ditemukan",
        });
      }

      editedUser.fullName = newFullName;
      editedUser.email = newEmail;

      await editedUser.save();

      return res.status(200).json({
        status: 200,
        data: editedUser,
        message: "profil berhasil diedit",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  },
];

export const changePassword = [
  verifyToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
      if (!id) {
        return res.status(400).json({
          status: 400,
          message: "ID Pengguna diperlukan, tetapi tidak disediakan",
        });
      }

      if (!newPassword) {
        return res.status(400).json({
          status: 400,
          message: "Kata sandi baru diperlukan, tetapi tidak disediakan",
        });
      }

      const user = await Auth.findById(id);

      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "Pengguna Tidak Ditemukan",
        });
      }

      bcryptjs.hash(newPassword, 10, async (err, hash) => {
        if (err) {
          return res.status(500).json(err);
        }

        user.set("password", hash);
        await user.save(); // Tunggu sampai user disimpan ke DB

        return res.status(201).json({
          status: 201,
          data: user,
          message: "password berhasil diubah.",
        });
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  },
];

export const changeProfilePhoto = [
  verifyToken,
  async (req, res) => {
    try {
      const { profilePhoto } = req.body;
      if (!profilePhoto) {
        res.status(400).json({
          status: 400,
          message: "Foto gagal diganti atau format foto tidak didukung",
        });
      }

      const user = await Auth.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "User tidak ditemukan",
        });
      }

      user.set("profilePhoto", profilePhoto);

      await user.save();

      return res.status(200).json({
        status: 200,
        data: user,
        message: "Foto profil berhasil di ubah",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error,
      });
    }
  },
];

export const getAllUsers = [
  verifyToken,
  async (req, res) => {
    try {
      const users = await Auth.find();

      if (users.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "Belum Ada data user",
        });
      }

      return res.status(200).json({
        status: 200,
        data: users,
        message: "Data user ditemukan",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  },
];

export const logout = async (req, res) => {
  try {
    const { userId } = req.body; // Assuming userId is sent from the client during logout

    if (!userId) {
      return res.status(400).json({
        status: 400,
        message: "ID Pengguna diperlukan untuk keluar.",
      });
    }

    const user = await Auth.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 404, message: "Pengguna tidak ditemukan." });
    }

    // Remove or set token to null
    user.set("token", null);
    await user.save();

    return res.status(200).json({ status: 200, message: "Pengguna berhasil keluar." });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Terjadi kesalahan saat keluar." });
  }
};

export const getKecamatanList = (req, res) => {
  const kecamatanList = ["Baiturrahman", "Banda Raya", "Jaya Baru", "Kuta Alam", "Kuta Raja", "Lueng Bata", "Meuraxa", "Syiah Kuala", "Ulee Kareng"];
  res.json({ kecamatan: kecamatanList });
};

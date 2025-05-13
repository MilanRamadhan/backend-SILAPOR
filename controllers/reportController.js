import Report from "../models/Report.js";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";
import { storage } from "../cloudinaryConfig.js";

const kategoriList = ["Infrastruktur", "Lingkungan", "Kesehatan", "Pendidikan", "Layanan Publik", "Sosial, Lainnya"];
const upload = multer({ storage });

export const createReport = [
  verifyToken,
  upload.array("images", 10),
  async (req, res) => {
    try {
      console.log("req.body:", req.body);
      console.log("req.files:", req.files);

      const { reporterID, title, description, kategori, address } = req.body;
      const imageUrls = req.files.map((file) => file.path);

      if (!reporterID || !title || !description || !kategori || !address || !imageUrls) {
        return res.status(400).json({
          status: 400,
          message: "semua kolom harus di isi",
        });
      }
      if (!kategoriList.includes(kategori)) {
        return res.status(400).json({
          status: 400,
          message: "kategori tidak valid",
        });
      }
      const newReport = new Reports({
        reporterID,
        title,
        description,
        kategori,
        address,
        images: imageUrls,
      });
      const savedReport = await newReport.save();

      return res.status(201).json({
        status: 201,
        data: savedReport,
        message: "laporan berhasil dibuat",
      });
    } catch (err) {
      console.error("CREATE REPORT ERROR:", err.message);
      console.error("STACK TRACE:", err.stack);

      return res.status(500).json({
        status: 500,
        message: err.message,
        stack: err.stack,
      });
    }
  },
];

export const getAllReports = [
  verifyToken,
  async (req, res) => {
    try {
      const reports = await Reports.find();
      if (reports.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "data laporan tidak di temukan atau belum ada",
        });
      }
      return res.status(200).json({
        status: 200,
        data: reports,
        message: "laporan ditemukan",
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: "internal server error",
      });
    }
  },
];

export const editReport = [
  verifyToken,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Validasi ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          status: 400,
          message: "ID laporan tidak valid.",
        });
      }

      const updatedReport = await Reports.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedReport) {
        return res.status(404).json({
          status: 404,
          message: "Laporan tidak ditemukan.",
        });
      }

      res.status(200).json({
        status: 200,
        data: updatedReport,
        message: "Laporan berhasil diperbarui",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  },
];

// DELETE REPORT
export const deleteReport = [
  verifyToken,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Validasi ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          status: 400,
          message: "ID laporan tidak valid.",
        });
      }

      const deletedReport = await Reports.findByIdAndDelete(id);
      if (!deletedReport) {
        return res.status(404).json({
          status: 404,
          message: "Laporan tidak ditemukan.",
        });
      }

      res.status(200).json({
        status: 200,
        data: deletedReport,
        message: "Laporan berhasil dihapus.",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  },
];

export const approveReport = [
  verifyToken,
  async (req, res) => {
    try {
      const { reporterID } = req.params;
      const { response } = req.body;

      const report = await Report.findByIdAndUpdate(reporterID, { status: "approved", response }, { new: true });
      if (!report) return res.status(404).json({ message: "Laporan tidak ditemukan" });

      res.json({ message: "Laporan disetujui", report });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: "internal server error",
      });
    }
  },
];

export const rejectReport = [
  verifyToken,
  async (req, res) => {
    try {
      const { reporterID } = req.params;
      const { response } = req.body;

      const report = await Report.findByIdAndUpdate(reporterID, { status: "rejected", response }, { new: true });
      if (!report) return res.status(404).json({ message: "Laporan tidak ditemukan" });

      res.json({ message: "Laporan ditolak", report });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: "internal server error",
      });
    }
  },
];

export const getByReporterID = [
  verifyToken,
  async (req, res) => {
    try {
      const { reporterID } = req.params;

      // Validasi input
      if (!reporterID) {
        return res.status(400).json({
          status: 400,
          message: "ID Pelapor diperlukan.",
        });
      }

      // Mencari laporan berdasarkan reporterID
      const reports = await Reports.find({ reporterID });

      if (reports.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "Tidak ada laporan yang ditemukan untuk ID Pelapor tersebut.",
        });
      }

      res.status(200).json({
        status: 200,
        data: reports,
        message: "Laporan ditemukan",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  },
];

export const getReportsByUserId = [
  verifyToken,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          status: 400,
          message: "ID Pengguna diperlukan, tetapi tidak disediakan",
        });
      }

      const reports = await Report.aggregate([
        {
          $match: { reporterID: new mongoose.Types.ObjectId(id) },
        },
        {
          $lookup: {
            from: "users",
            localField: "reporterID",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            title: 1,
            description: 1,
            category: 1,
            status: 1,
            createdAt: 1,
            user: {
              _id: "$user._id",
              name: "$user.name",
              email: "$user.email",
            },
          },
        },
      ]);

      if (!reports.length) {
        return res.status(404).json({
          status: 404,
          message: "Tidak ada laporan ditemukan untuk pengguna ini",
        });
      }

      return res.status(200).json({
        status: 200,
        message: "Berhasil mengambil laporan pengguna",
        data: reports,
      });
    } catch (error) {
      console.error("Error in getReportsByUserId:", error);
      return res.status(500).json({
        status: 500,
        message: "Kesalahan server internal",
      });
    }
  },
];

export const getOtherUsersReports = [
  verifyToken,
  async (req, res) => {
    try {
      const loggedInUserId = req.user.id;

      const reports = await Report.aggregate([
        {
          $match: {
            reporterID: { $ne: new mongoose.Types.ObjectId(loggedInUserId) },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "reporterID",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            title: 1,
            description: 1,
            category: 1,
            status: 1,
            createdAt: 1,
            user: {
              _id: "$user._id",
              name: "$user.name",
              email: "$user.email",
            },
          },
        },
      ]);

      return res.status(200).json({
        status: 200,
        message: "Berhasil mengambil laporan dari pengguna lain",
        data: reports,
      });
    } catch (error) {
      console.error("Error in getOtherUsersReports:", error);
      return res.status(500).json({
        status: 500,
        message: "Kesalahan server internal",
      });
    }
  },
];

export const getKategoriList = (req, res) => {
  const kategoriList = ["Infrastruktur", "Lingkungan", "Kesehatan", "Pendidikan", "Layanan Publik", "Sosial, Lainnya"];
  res.json({ kategori: kategoriList });
};

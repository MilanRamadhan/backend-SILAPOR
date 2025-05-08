import Report from "../models/Report.js";

const kategoriList = ["Infrastruktur", "Lingkungan", "Kesehatan", "Pendidikan", "Layanan Publik", "Sosial, Lainnya"];

export const createReport = [
  verifyToken,
  async (req, res) => {
    try {
      const { title, description, kategori, address, imageUrl, fullName } = req.body;
      if (!title || !description || !kategori || !address || !imageUrl || !fullName) {
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
      const newReport = new Report({
        title,
        description,
        kategori,
        address,
        imageUrl,
        fullName,
      });
      await newReport.save();
      return res.status(201).json({
        status: 201,
        data: newReport,
        message: "laporan berhasil dibuat",
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: "internal server error",
      });
    }
  },
];

export const getAllReport = [
  verifyToken,
  async (req, res) => {
    try {
      const reports = await Report.find();
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

export const approveReport = [
  verifyToken,
  async (req, res) => {
    try {
      const { reportId } = req.params;
      const { response } = req.body;

      const report = await Report.findByIdAndUpdate(reportId, { status: "approved", response }, { new: true });
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
      const { reportId } = req.params;
      const { response } = req.body;

      const report = await Report.findByIdAndUpdate(reportId, { status: "rejected", response }, { new: true });
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

export const getKategoriList = (req, res) => {
  const kategoriList = ["Infrastruktur", "Lingkungan", "Kesehatan", "Pendidikan", "Layanan Publik", "Sosial, Lainnya"];
  res.json({ kategori: kategoriList });
};

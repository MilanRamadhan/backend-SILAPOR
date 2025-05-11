import express from "express";
import { createReport, approveReport, rejectReport, getAllReport, getReportById, getMyReports } from "../controllers/reportController.js";

const router = express.Router();

router.post("/createReport", createReport);
router.put("/approve/:reportId", approveReport);
router.put("/reject/:reportId", rejectReport);
router.get("/getAllReport", getAllReport);
router.get("/getReportById/:reportId", getReportById);
router.get("/getMyReports", getMyReports);

export default router;

import express from "express";
import { createReport, approveReport, rejectReport, editReport, getAllReports, getByReporterID, getOtherUsersReports, getReportsByUserId, deleteReport } from "../controllers/reportController.js";

const router = express.Router();

router.post("/createReport", createReport);
router.put("/approve/:reportId", approveReport);
router.put("/reject/:reportId", rejectReport);
router.get("/getAllReports", getAllReports);
router.get("/getByReporterID/:reporterID", getByReporterID);
router.get("/getOtherUsersReports", getOtherUsersReports);
router.get("/getReportsByUserId/:id", getReportsByUserId);
router.put("/editReport/:id", editReport);
router.delete("/deleteReport/:id", deleteReport);

export default router;

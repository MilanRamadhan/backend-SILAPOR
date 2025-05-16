import express from "express";
import { register, login, editProfile, changePassword, changeProfilePhoto, getAllUsers, logout } from "../controllers/authController.js";

const authRouter = express.Router();
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.put("/editProfile/:id", editProfile);
authRouter.put("/changePassword/:id", changePassword);
authRouter.get("/getAllUsers", getAllUsers);
authRouter.put("/changeProfilePhoto", changeProfilePhoto);

export default authRouter;

import express, { Router } from "express";
import { register, login, updateUser, updatePassword, changeProfilePhoto, getAllUsers, logout } from "../controllers/authController.js";

const authRouter = express.Router();
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.put("/updateUser/:id", updateUser);
authRouter.post("/updatePassword/:id", updatePassword);
authRouter.get("/getAllUsers", getAllUsers);
authRouter.put("/changeProfilePhoto", changeProfilePhoto);

export default authRouter;

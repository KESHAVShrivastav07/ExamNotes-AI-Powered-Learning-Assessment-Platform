import express from "express"
import { googleAuth, login, logOut } from "../controllers/auth.controller.js"

const authRouter = express.Router()

authRouter.post("/google" , googleAuth)
authRouter.post("/login", login)
authRouter.get("/logout" , logOut)
export default authRouter
import UserModel from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import Teacher from "../models/teacher.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const getToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔥 Hardcoded Admin Login
    if (email === "admin@gmail.com" && password === "admin123") {
      const user = {
        _id: "admin-id-123",
        name: "Admin",
        email: "admin@gmail.com",
        role: "admin"
      };

      const token = getToken(user._id, "admin");

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({
        user,
        role: "admin",
        token // Return token for backward compatibility if needed
      });
    }

    // For other roles, they still use Google Auth as per current flow
    // or we could extend email/pass here if needed.
    // Given the requirements, only admin is fixed.

    return res.status(401).json({ message: "Invalid credentials" });

  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { name, email, role: requestedRole = "user" } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    let user;
    let role = requestedRole;

    // 🔥 Admin login (from /admin/login)
    if (role === "admin") {
      user = await Admin.findOne({ email });
      if (!user) {
        // Create an admin record when logging in via the admin route
        user = await Admin.create({
          name,
          email,
          password: crypto.randomBytes(20).toString("hex"),
          role: "admin",
          credits: 100
        });
      }
    }

    // 🔥 Teacher login (from /teacher/login)
    else if (role === "teacher") {
      user = await Teacher.findOne({ email });
      if (!user) {
        // Create a teacher record when logging in via the teacher route
        user = await Teacher.create({
          name,
          email,
          password: crypto.randomBytes(20).toString("hex"),
          role: "teacher",
          credits: 100
        });
      }
    }

    // 🔥 Normal User
    else {
      user = await UserModel.findOne({ email });

      if (!user) {
        user = await UserModel.create({ name, email, role: "user", credits: 100 });
      }

      role = "user";
    }

    // Token with role
    const token = getToken(user._id, role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // 🔥 Send role to frontend
    return res.status(200).json({
      user,
      role
    });

  } catch (error) {
    console.error("Google Auth Error:", error.message);
    return res.status(500).json({ message: "Google Authentication Failed" });
  }
};



/* ================================
   Logout User
================================= */
export const logOut = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });

        return res.status(200).json({ message: "Logout Successfully" });

    } catch (error) {
        console.error("Logout Error:", error.message);
        return res.status(500).json({ message: "Logout Failed" });
    }
};

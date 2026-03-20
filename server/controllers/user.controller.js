import UserModel from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import Teacher from "../models/teacher.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const { userId, role } = req;

    let user;

    if (role === "admin") {
      user = await Admin.findById(userId);
    } else if (role === "teacher") {
      user = await Teacher.findById(userId);
    } else {
      user = await UserModel.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ message: "Current User is not found" });
    }

    return res.status(200).json({ user, role });
  } catch (error) {
    return res.status(500).json({ message: `getCurrentUser error  ${error}` });
  }
};

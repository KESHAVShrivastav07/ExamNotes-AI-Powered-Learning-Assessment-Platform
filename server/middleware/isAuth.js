import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Token not found" });
        }

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = verifyToken.userId;
        req.role = verifyToken.role;

        next();
    } catch (error) {
        console.log("Auth Error:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default isAuth;

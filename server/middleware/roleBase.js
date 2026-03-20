export const isAdmin = (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};

export const isTeacher = (req, res, next) => {
    if (req.role !== "teacher" && req.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Teachers only." });
    }
    next();
};

export const isStudent = (req, res, next) => {
    if (req.role !== "user" && req.role !== "teacher" && req.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Students only." });
    }
    next();
};

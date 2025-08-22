// Auth - JWT check middleware
import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === 'admin') {
      req.admin = decoded;
    } else if (decoded.role === 'tenant') {
      req.tenant = decoded;
    } else {
      return res.status(403).json({ error: "Invalid role in token" });
    }

    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

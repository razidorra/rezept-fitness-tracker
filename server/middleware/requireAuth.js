import { getAuth } from "@clerk/express";

export function authorize(auth, req, res, next) {
  if (!auth.isAuthenticated || !auth.userId) {
    return res.status(401).json({ error: "Nicht angemeldet" });
  }

  req.userId = auth.userId;
  next();
}

export default function requireAuth(req, res, next) {
  return authorize(getAuth(req), req, res, next);
}

// Middleware zum Schützen von Routen: prüft das JWT aus dem Authorization-Header
// und hängt die userId des eingeloggten Users an req. Wird vor Routen eingesetzt,
// die einen eingeloggten User brauchen (z.B. Recipes speichern, Tracking-Einträge anlegen).

import jwt from "jsonwebtoken";

export default function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Kein Token vorhanden" });
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Token ungültig oder abgelaufen" });
  }
}

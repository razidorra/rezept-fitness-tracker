// Steuert eingehende HTTP-Requests fürs Auth-Feature.
// Validiert Input, ruft auth.service.js auf, formt die Response.

import * as authService from "./auth.service.js";

export async function register(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email und password sind erforderlich" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "password muss mindestens 8 Zeichen lang sein" });
    }

    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "Diese E-Mail ist bereits registriert" });
    }

    const user = await authService.createUser({ email, password });
    const token = authService.generateToken(user);

    res.status(201).json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error("Register-Fehler:", err.message);
    res.status(500).json({ error: "Registrierung fehlgeschlagen" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email und password sind erforderlich" });
    }

    const user = await authService.findUserByEmail(email);
    if (!user || !(await authService.verifyPassword(user, password))) {
      return res.status(401).json({ error: "E-Mail oder Passwort falsch" });
    }

    const token = authService.generateToken(user);
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error("Login-Fehler:", err.message);
    res.status(500).json({ error: "Login fehlgeschlagen" });
  }
}

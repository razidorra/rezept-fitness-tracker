// Business-Logik fürs Auth-Feature: Passwörter hashen/prüfen, User anlegen, JWT erzeugen.
// Wird von auth.controller.js aufgerufen.

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./user.model.js";

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = "7d";

export async function createUser({ email, password }) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  return User.create({ email, passwordHash });
}

export function findUserByEmail(email) {
  return User.findOne({ email });
}

export function verifyPassword(user, password) {
  return bcrypt.compare(password, user.passwordHash);
}

export function generateToken(user) {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
}

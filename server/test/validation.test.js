import test from "node:test";
import assert from "node:assert/strict";
import {
  hasValidOptionalNumbers,
  isValidDateOnly,
  isValidObjectId,
} from "../utils/validation.js";

test("optionale Nährwerte akzeptieren nur nichtnegative endliche Zahlen", () => {
  assert.equal(hasValidOptionalNumbers({ calories: 12.5 }, ["calories", "protein"]), true);
  assert.equal(hasValidOptionalNumbers({ calories: -1 }, ["calories"]), false);
  assert.equal(hasValidOptionalNumbers({ calories: "12" }, ["calories"]), false);
});

test("Datums- und ObjectId-Validierung weist ungültige Werte zurück", () => {
  assert.equal(isValidDateOnly("2026-08-18"), true);
  assert.equal(isValidDateOnly("2026-02-30"), false);
  assert.equal(isValidDateOnly("2026"), false);
  assert.equal(isValidObjectId("507f1f77bcf86cd799439011"), true);
  assert.equal(isValidObjectId("not-an-id"), false);
});

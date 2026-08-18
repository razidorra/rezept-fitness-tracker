import test from "node:test";
import assert from "node:assert/strict";
import { health, notFound } from "../app.js";
import { authorize } from "../middleware/requireAuth.js";
import { remove as removeRecipe } from "../features/recipes/recipes.controller.js";

process.env.NODE_ENV = "test";

function createResponse() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    send() {
      return this;
    },
  };
}

test("Health-Handler liefert den Datenbankstatus als JSON", () => {
  const response = createResponse();
  health({}, response);
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, { status: "degraded", database: "disconnected" });
});

test("Auth-Middleware lehnt nicht angemeldete Requests ab", () => {
  const response = createResponse();
  authorize({ isAuthenticated: false, userId: null }, {}, response, () => assert.fail("next darf nicht aufgerufen werden"));
  assert.equal(response.statusCode, 401);
  assert.match(response.body.error, /angemeldet/);
});

test("Auth-Middleware übernimmt eine verifizierte Clerk-User-ID", () => {
  const response = createResponse();
  const request = {};
  let nextCalled = false;
  authorize({ isAuthenticated: true, userId: "user_clerk123" }, request, response, () => { nextCalled = true; });
  assert.equal(nextCalled, true);
  assert.equal(request.userId, "user_clerk123");
});

test("unbekannte Endpunkte nutzen das einheitliche Fehlerformat", () => {
  const response = createResponse();
  notFound({}, response);
  assert.equal(response.statusCode, 404);
  assert.deepEqual(response.body, { error: "Endpunkt nicht gefunden" });
});

test("ungültige Ressourcen-IDs liefern 400 vor einem Datenbankzugriff", async () => {
  const response = createResponse();
  await removeRecipe({ params: { id: "not-an-id" }, userId: "owner-id" }, response);
  assert.equal(response.statusCode, 400);
  assert.deepEqual(response.body, { error: "Ungültige Rezept-ID" });
});

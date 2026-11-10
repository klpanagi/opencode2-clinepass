import { test } from "node:test";
import assert from "node:assert/strict";
import { getApiKey, getBaseUrl } from "./index.js";

test("getApiKey returns CLINEPASS_API_KEY when set", () => {
  process.env.CLINEPASS_API_KEY = "cp-key";
  delete process.env.CLINE_API_KEY;
  assert.equal(getApiKey(), "cp-key");
  delete process.env.CLINEPASS_API_KEY;
});

test("getApiKey falls back to CLINE_API_KEY", () => {
  delete process.env.CLINEPASS_API_KEY;
  process.env.CLINE_API_KEY = "cline-key";
  assert.equal(getApiKey(), "cline-key");
  delete process.env.CLINE_API_KEY;
});

test("getApiKey returns empty string when neither set", () => {
  delete process.env.CLINEPASS_API_KEY;
  delete process.env.CLINE_API_KEY;
  assert.equal(getApiKey(), "");
});

test("getBaseUrl returns default when env unset", () => {
  delete process.env.CLINEPASS_BASE_URL;
  assert.equal(getBaseUrl(), "https://api.cline.bot/v1");
});

test("getBaseUrl returns env value when set", () => {
  process.env.CLINEPASS_BASE_URL = "https://example.com/v1";
  assert.equal(getBaseUrl(), "https://example.com/v1");
  delete process.env.CLINEPASS_BASE_URL;
});

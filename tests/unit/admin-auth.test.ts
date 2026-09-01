import { describe, expect, it } from "vitest";
import {
  hashPassword,
  verifyPassword,
  signAdminToken,
  verifyAdminToken,
} from "@/lib/admin/auth";

describe("admin authentication security functions", () => {
  it("hashes password with a salt and produces distinct hashes for same password", () => {
    const pwd = "AdminPena123";
    const hash1 = hashPassword(pwd);
    const hash2 = hashPassword(pwd);

    expect(hash1).toContain(":");
    expect(hash2).toContain(":");
    expect(hash1).not.toEqual(hash2); // Distinct salts produce distinct hashes
  });

  it("verifies correct password against hash", () => {
    const pwd = "AdminPena123";
    const hash = hashPassword(pwd);

    expect(verifyPassword(pwd, hash)).toBe(true);
    expect(verifyPassword("WrongPassword", hash)).toBe(false);
    expect(verifyPassword("adminpena123", hash)).toBe(false); // case-sensitive
    expect(verifyPassword("", hash)).toBe(false);
  });

  it("rejects invalid or corrupted hash format", () => {
    expect(verifyPassword("AdminPena123", "corruptedhashwithoutcolon")).toBe(
      false,
    );
    expect(verifyPassword("AdminPena123", "")).toBe(false);
  });

  it("signs and verifies admin token payload correctly", () => {
    const user = {
      id: "admin-user-123",
      username: "ihsan",
      role: "admin",
    };

    const token = signAdminToken(user);
    expect(token).toContain(".");

    const payload = verifyAdminToken(token);
    expect(payload).not.toBeNull();
    expect(payload?.userId).toBe("admin-user-123");
    expect(payload?.username).toBe("ihsan");
    expect(payload?.role).toBe("admin");
    expect(payload?.exp).toBeGreaterThan(Date.now());
  });

  it("rejects tampered admin tokens", () => {
    const user = {
      id: "admin-user-123",
      username: "ihsan",
      role: "admin",
    };

    const token = signAdminToken(user);
    const [, signature] = token.split(".");

    // Tamper with payload
    const tamperedPayload = Buffer.from(
      JSON.stringify({
        userId: "hacker-999",
        username: "evil",
        role: "admin",
        exp: Date.now() + 100000,
      }),
    ).toString("base64url");

    const tamperedToken = `${tamperedPayload}.${signature}`;
    expect(verifyAdminToken(tamperedToken)).toBeNull();
  });

  it("rejects expired admin tokens", () => {
    const payload = {
      userId: "admin-user-123",
      username: "ihsan",
      role: "admin",
      exp: Date.now() - 10000, // already expired
      iat: Date.now() - 20000,
    };

    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString(
      "base64url",
    );
    const token = `${payloadBase64}.fakesignature`;

    expect(verifyAdminToken(token)).toBeNull();
  });
});

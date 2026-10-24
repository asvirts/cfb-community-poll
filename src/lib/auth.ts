import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { promisify } from "node:util";
import { ensureReady, getSql } from "@/lib/db";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/session";

const scryptAsync = promisify(scrypt);

export type SessionUser = {
  id: string;
  email: string;
};

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hash, "hex");
  if (expected.length !== derived.length) return false;
  return timingSafeEqual(expected, derived);
}

export function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

async function cookieStore() {
  return cookies();
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export async function userFromToken(token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  await ensureReady();
  const hash = tokenHash(token);
  const [row] = await getSql()<{ id: string; email: string; expires_at: Date | string }[]>`
    select u.id, u.email, s.expires_at
    from sessions s
    join users u on u.id = s.user_id
    where s.token_hash = ${hash}
    limit 1
  `;
  if (!row) return null;
  if (new Date(row.expires_at).getTime() <= Date.now()) {
    await getSql()`delete from sessions where token_hash = ${hash}`;
    return null;
  }
  return { id: row.id, email: row.email };
}

export async function currentUser() {
  const token = (await cookieStore()).get(SESSION_COOKIE)?.value;
  return userFromToken(token);
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
  await ensureReady();
  await getSql()`
    insert into sessions (token_hash, user_id, expires_at)
    values (${tokenHash(token)}, ${userId}, ${expiresAt})
  `;
  (await cookieStore()).set(SESSION_COOKIE, token, cookieOptions());
}

export async function clearSession() {
  const store = await cookieStore();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    try {
      await ensureReady();
      await getSql()`delete from sessions where token_hash = ${tokenHash(token)}`;
    } catch {
      // The cookie still has to go if the database is unreachable.
    }
  }
  store.delete(SESSION_COOKIE);
}

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const SECRET = process.env.AUTH_SECRET || "6b5d916a67546ac777da7d785ccc2e9f49edccf4b85f54244198cee571951b28";
const COOKIE_NAME = "session_token";

export interface SessionPayload {
  userId: string;
  email: string;
}

export function signToken(payload: SessionPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

import { NextRequest } from "next/server";

export async function getSession(req?: NextRequest): Promise<SessionPayload | null> {
  let token: string | undefined;
  if (req) {
    token = req.cookies.get(COOKIE_NAME)?.value;
  }
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(COOKIE_NAME)?.value;
    } catch {
      // ignore
    }
  }
  if (!token) return null;
  return verifyToken(token);
}

export async function requireSession(req?: NextRequest): Promise<SessionPayload> {
  const session = await getSession(req);
  if (!session) {
    throw new Error("Unauthorized");
  }
  // Verify user still exists
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true },
  });
  if (!user) throw new Error("Unauthorized");
  return { userId: user.id, email: user.email };
}

export function setSessionCookie(token: string): {
  name: string;
  value: string;
  options: object;
} {
  return {
    name: COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  };
}

export function clearSessionCookie(): {
  name: string;
  value: string;
  options: object;
} {
  return {
    name: COOKIE_NAME,
    value: "",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 0,
    },
  };
}


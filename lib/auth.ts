import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const SECRET = process.env.AUTH_SECRET!;
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

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
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

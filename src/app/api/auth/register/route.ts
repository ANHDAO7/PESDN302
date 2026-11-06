import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { created, badRequest } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, confirmPassword } = body;

    // Validation
    if (!email || typeof email !== "string") {
      return badRequest("Email is required");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return badRequest("Please enter a valid email address");
    }
    if (!password || typeof password !== "string") {
      return badRequest("Password is required");
    }
    if (password.length < 6) {
      return badRequest("Password must be at least 6 characters");
    }
    if (!confirmPassword || (typeof confirmPassword === "string" && !confirmPassword.trim())) {
      return badRequest("Confirm password is required");
    }
    if (confirmPassword !== password) {
      return badRequest("Passwords do not match");
    }

    // Check duplicate
    const existing = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        passwordHash,
      },
      select: { id: true, email: true },
    });

    return created({ id: user.id, email: user.email });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


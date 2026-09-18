import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signJWT } from "@/lib/auth";
import { RegisterSchema } from "@/lib/validations";
import { supabaseSignUp } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { name, email, password } = parsed.data;

    // Real Supabase Auth Registration
    try {
      const { error: supabaseError } = await supabaseSignUp(email, password, name);
      if (supabaseError) {
        console.warn("Supabase Auth notice:", supabaseError.message);
      }
    } catch (e) {
      console.warn("Supabase Auth unreachable or placeholder:", e);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    const token = await signJWT({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json(
      { message: "Registration successful", user: { id: user.id, name: user.name, email: user.email } },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

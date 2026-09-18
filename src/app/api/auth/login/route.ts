import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, hashPassword, signJWT } from "@/lib/auth";
import { LoginSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Demo login shortcut
    if (body.isDemoRecruiter) {
      let demoUser = await prisma.user.findUnique({
        where: { email: "demo@ergo.com" },
      });

      if (!demoUser) {
        const hashedPassword = await hashPassword("ErgoDemo2026!");
        demoUser = await prisma.user.create({
          data: {
            name: "Demo Student",
            email: "demo@ergo.com",
            password: hashedPassword,
          },
        });
      }

      // Seed demo tasks if empty
      const existingCount = await prisma.task.count({
        where: { userId: demoUser.id },
      });
      if (existingCount === 0) {
        const now = new Date();
        await prisma.task.createMany({
          data: [
            {
              userId: demoUser.id,
              title: "Submit Data Structures Assignment",
              description: "Implement BST and AVL balancing in C++.",
              status: "PENDING",
              priority: "URGENT",
              category: "Computer Science",
              dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
            },
            {
              userId: demoUser.id,
              title: "Solve Linear Algebra Problem Set",
              description: "Complete Eigenvalues and Vector Spaces section.",
              status: "PENDING",
              priority: "HIGH",
              category: "Mathematics",
              dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
            },
            {
              userId: demoUser.id,
              title: "Write Physics Lab Report",
              description: "Analyze oscilloscope error curves and format PDF.",
              status: "COMPLETED",
              priority: "MEDIUM",
              category: "Physics Lab",
              dueDate: new Date(now.getTime() - 24 * 60 * 60 * 1000),
            },
            {
              userId: demoUser.id,
              title: "Finalize Ergo Full Stack Assignment",
              description: "Complete Next.js, Prisma, and Supabase features.",
              status: "COMPLETED",
              priority: "URGENT",
              category: "Projects",
              dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
            },
            {
              userId: demoUser.id,
              title: "Pack Camping Gear",
              description: "Check tent, sleeping bags, and camping stove.",
              status: "PENDING",
              priority: "HIGH",
              category: "Camping Trip",
              dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
            },
            {
              userId: demoUser.id,
              title: "Buy Dog Food and Treats",
              description: "Get 15kg grain-free kibble and chew bones.",
              status: "PENDING",
              priority: "URGENT",
              category: "Pet Shopping",
              dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
            },
            {
              userId: demoUser.id,
              title: "Pick Up Dry Cleaning",
              description: "Retrieve formal jackets before weekend event.",
              status: "PENDING",
              priority: "HIGH",
              category: "Errands",
              dueDate: now,
            },
            {
              userId: demoUser.id,
              title: "Water Front Lawn and Herb Garden",
              description: "Deep water tomato beds, basil, and rosemary.",
              status: "PENDING",
              priority: "MEDIUM",
              category: "Gardening",
              dueDate: now,
            },
            {
              userId: demoUser.id,
              title: "Read 25 Pages of Non-Fiction",
              description: "Daily reading goal.",
              status: "PENDING",
              priority: "LOW",
              category: "Personal",
              dueDate: now,
            },
          ],
        });
      }

      const token = await signJWT({
        userId: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
      });

      const response = NextResponse.json(
        { message: "Demo login successful", user: { id: demoUser.id, name: demoUser.name, email: demoUser.email } },
        { status: 200 }
      );
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
      return response;
    }

    // Regular login
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email. Please register first." },
        { status: 401 }
      );
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    const token = await signJWT({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json(
      { message: "Login successful", user: { id: user.id, name: user.name, email: user.email } },
      { status: 200 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to log in" },
      { status: 500 }
    );
  }
}

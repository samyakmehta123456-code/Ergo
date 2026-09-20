import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { TaskSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Resolve the actual DB user id (JWT userId may be Supabase uuid or cuid)
    const dbUser = await prisma.user.findFirst({
      where: { OR: [{ id: user.userId }, { email: user.email.toLowerCase() }] },
    });

    if (!dbUser) {
      return NextResponse.json({ tasks: [] });
    }

    const tasks = await prisma.task.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tasks });
  } catch (error: any) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = TaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { title, description, reason, status, priority, category, dueDate } = parsed.data;

    // Ensure the user row exists in Postgres — upsert by email
    const dbUser = await prisma.user.upsert({
      where: { email: user.email.toLowerCase() },
      update: {},
      create: {
        id: user.userId,
        name: user.name || user.email.split("@")[0],
        email: user.email.toLowerCase(),
        password: "supabase_managed",
      },
    });

    const task = await prisma.task.create({
      data: {
        title,
        description: description ?? null,
        reason: reason ?? null,
        status: status ?? "PENDING",
        priority: priority ?? "MEDIUM",
        category: category ?? "General Project",
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: dbUser.id,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create task" },
      { status: 500 }
    );
  }
}

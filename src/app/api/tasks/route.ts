import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, ensureDbUser } from "@/lib/auth";
import { TaskSchema } from "@/lib/validations";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await ensureDbUser(user);
    if (!dbUser) {
      return NextResponse.json({ tasks: [] });
    }

    const tasks = await prisma.task.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tasks });
  } catch (error: any) {
    console.error("GET /api/tasks Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in to add tasks." }, { status: 401 });
    }

    const dbUser = await ensureDbUser(user);
    if (!dbUser) {
      return NextResponse.json({ error: "User session initialization failed." }, { status: 500 });
    }

    const body = await req.json();
    const parsed = TaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { title, description, status, priority, category, dueDate } = parsed.data;

    let parsedDueDate: Date | null = null;
    if (dueDate) {
      const d = new Date(dueDate);
      if (!isNaN(d.getTime())) {
        parsedDueDate = d;
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        status: status || "PENDING",
        priority: priority || "MEDIUM",
        category: category || "General Project",
        dueDate: parsedDueDate,
        userId: dbUser.id,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/tasks Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create task" }, { status: 500 });
  }
}

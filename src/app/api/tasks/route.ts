import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { TaskSchema } from "@/lib/validations";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let dbUser = null;
    try {
      dbUser = await prisma.user.findFirst({
        where: { OR: [{ id: user.userId }, { email: user.email.toLowerCase() }] },
      });
    } catch (e) {
      console.warn("DB user find notice:", e);
    }

    const targetUserId = dbUser ? dbUser.id : user.userId;

    const tasks = await prisma.task.findMany({
      where: { userId: targetUserId },
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
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = TaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { title, description, status, priority, category, dueDate } = parsed.data;

    // Ensure User row exists in database to satisfy foreign key constraint
    let dbUser = await prisma.user.findFirst({
      where: { OR: [{ id: user.userId }, { email: user.email.toLowerCase() }] },
    });

    if (!dbUser) {
      try {
        dbUser = await prisma.user.create({
          data: {
            id: user.userId,
            name: user.name || user.email.split("@")[0],
            email: user.email.toLowerCase(),
            password: "default_hashed_pass",
          },
        });
      } catch (e) {
        dbUser = await prisma.user.findFirst({ where: { email: user.email.toLowerCase() } });
      }
    }

    const targetUserId = dbUser ? dbUser.id : user.userId;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        category,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: targetUserId,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/tasks Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create task" }, { status: 500 });
  }
}

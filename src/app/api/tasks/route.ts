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

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";
    const priority = searchParams.get("priority") || "ALL";
    const category = searchParams.get("category") || "ALL";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const where: any = {
      userId: user.userId,
    };

    if (search.trim()) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (status !== "ALL") {
      if (status === "OVERDUE") {
        where.status = { not: "COMPLETED" };
        where.dueDate = { lt: new Date() };
      } else {
        where.status = status;
      }
    }

    if (priority !== "ALL") {
      where.priority = priority;
    }

    if (category !== "ALL") {
      where.category = category;
    }

    let orderBy: any = {};
    if (sortBy === "dueDate") {
      orderBy = { dueDate: sortOrder };
    } else if (sortBy === "priority") {
      orderBy = { priority: sortOrder };
    } else {
      orderBy = { createdAt: sortOrder };
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy,
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("GET /api/tasks Error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
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

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        category,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: user.userId,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks Error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

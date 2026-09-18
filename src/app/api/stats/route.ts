import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findFirst({
      where: { OR: [{ id: user.userId }, { email: user.email.toLowerCase() }] },
    });

    if (!dbUser) {
      return NextResponse.json({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        overdueTasks: 0,
        completionRate: 0,
        priorityBreakdown: { URGENT: 0, HIGH: 0, MEDIUM: 0, LOW: 0 },
        categoryBreakdown: [],
      });
    }

    const tasks = await prisma.task.findMany({ where: { userId: dbUser.id } });

    const now = new Date();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
    const pendingTasks = tasks.filter((t) => t.status === "PENDING").length;
    const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const overdueTasks = tasks.filter(
      (t) => t.status !== "COMPLETED" && t.dueDate && new Date(t.dueDate) < now
    ).length;
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const priorityBreakdown = {
      URGENT: tasks.filter((t) => t.priority === "URGENT").length,
      HIGH: tasks.filter((t) => t.priority === "HIGH").length,
      MEDIUM: tasks.filter((t) => t.priority === "MEDIUM").length,
      LOW: tasks.filter((t) => t.priority === "LOW").length,
    };

    const cats = Array.from(new Set(tasks.map((t) => t.category)));
    const categoryBreakdown = cats.map((cat) => ({
      category: cat,
      count: tasks.filter((t) => t.category === cat).length,
    }));

    return NextResponse.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      completionRate,
      priorityBreakdown,
      categoryBreakdown,
    });
  } catch (error: any) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

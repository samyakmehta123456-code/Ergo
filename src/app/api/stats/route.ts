import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await prisma.task.findMany({
      where: { userId: user.userId },
    });

    const now = new Date();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
    const pendingTasks = tasks.filter((t) => t.status === "PENDING").length;
    const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    
    const overdueTasks = tasks.filter(
      (t) => t.status !== "COMPLETED" && t.dueDate && new Date(t.dueDate) < now
    ).length;

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const priorityBreakdown = {
      URGENT: tasks.filter((t) => t.priority === "URGENT").length,
      HIGH: tasks.filter((t) => t.priority === "HIGH").length,
      MEDIUM: tasks.filter((t) => t.priority === "MEDIUM").length,
      LOW: tasks.filter((t) => t.priority === "LOW").length,
    };

    const categories = Array.from(new Set(tasks.map((t) => t.category)));
    const categoryBreakdown = categories.map((cat) => ({
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
  } catch (error) {
    console.error("GET /api/stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, hashPassword, signJWT } from "@/lib/auth";
import { LoginSchema } from "@/lib/validations";
import { supabaseSignIn } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Check if Demo Login is triggered
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

      // Ensure demo user has tasks across EVERY category field
      const existingCount = await prisma.task.count({ where: { userId: demoUser.id } });
      if (existingCount === 0) {
        const now = new Date();
        await prisma.task.createMany({
          data: [
            // Camping Trip
            {
              userId: demoUser.id,
              title: "Pack Camping Tent & Sleeping Bags",
              description: "Check tent stakes, rainfly, and 2 zero-degree sleeping bags.",
              status: "PENDING",
              priority: "HIGH",
              category: "Camping Trip",
              dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
            },
            {
              userId: demoUser.id,
              title: "Buy Portable Gas Stove & Firewood",
              description: "Purchase 2 propane canisters and dry hardwood bundles.",
              status: "PENDING",
              priority: "MEDIUM",
              category: "Camping Trip",
              dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
            },
            // Pet Shopping
            {
              userId: demoUser.id,
              title: "Buy Premium Dog Food & Treats",
              description: "Get 15kg grain-free kibble and chew bones.",
              status: "PENDING",
              priority: "URGENT",
              category: "Pet Shopping",
              dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
            },
            {
              userId: demoUser.id,
              title: "Schedule Annual Vet Vaccination Checkup",
              description: "Book appointment for rabies booster and general wellness exam.",
              status: "PENDING",
              priority: "HIGH",
              category: "Pet Shopping",
              dueDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
            },
            // Gardening
            {
              userId: demoUser.id,
              title: "Water Front Lawn & Herb Garden",
              description: "Deep water tomato beds, basil, and rosemary planter boxes.",
              status: "PENDING",
              priority: "MEDIUM",
              category: "Gardening",
              dueDate: now,
            },
            {
              userId: demoUser.id,
              title: "Prune Rose Bushes & Apply Organic Fertilizer",
              description: "Trim dead stems and mix slow-release fertilizer.",
              status: "COMPLETED",
              priority: "LOW",
              category: "Gardening",
              dueDate: new Date(now.getTime() - 24 * 60 * 60 * 1000),
            },
            // Errands
            {
              userId: demoUser.id,
              title: "Pick Up Dry Cleaning Suits",
              description: "Retrieve formal jackets and trousers before weekend event.",
              status: "PENDING",
              priority: "HIGH",
              category: "Errands",
              dueDate: now,
            },
            {
              userId: demoUser.id,
              title: "Renew Vehicle Registration Online",
              description: "Pay state vehicle fee and print digital receipt.",
              status: "COMPLETED",
              priority: "MEDIUM",
              category: "Errands",
              dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
            },
            // Computer Science
            {
              userId: demoUser.id,
              title: "Submit Data Structures BST Assignment",
              description: "Implement Binary Search Trees, AVL balancing, and Graph DFS/BFS algorithm in C++.",
              status: "PENDING",
              priority: "URGENT",
              category: "Computer Science",
              dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
            },
            {
              userId: demoUser.id,
              title: "Review Operating Systems Semaphore Synchronization",
              description: "Solve Producer-Consumer deadlock problems in C.",
              status: "IN_PROGRESS",
              priority: "HIGH",
              category: "Computer Science",
              dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
            },
            // Mathematics
            {
              userId: demoUser.id,
              title: "Solve Linear Algebra Matrix Transformations",
              description: "Complete Problem Set 5 on Eigenvalues and Vector Spaces.",
              status: "PENDING",
              priority: "HIGH",
              category: "Mathematics",
              dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
            },
            // Physics Lab
            {
              userId: demoUser.id,
              title: "Analyze Oscilloscope Error Curves",
              description: "Fit response curves and format PDF lab report.",
              status: "COMPLETED",
              priority: "MEDIUM",
              category: "Physics Lab",
              dueDate: new Date(now.getTime() - 24 * 60 * 60 * 1000),
            },
            // Projects
            {
              userId: demoUser.id,
              title: "Finalize Ergo Full Stack Assignment",
              description: "Complete Next.js, Prisma, and PWA mobile features.",
              status: "COMPLETED",
              priority: "URGENT",
              category: "Projects",
              dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
            },
            // Personal
            {
              userId: demoUser.id,
              title: "Read 25 Pages of Non-Fiction Book",
              description: "Daily reading goal.",
              status: "PENDING",
              priority: "LOW",
              category: "Personal",
              dueDate: now,
            }
          ]
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

    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { email, password } = parsed.data;

    // Real Supabase Auth Login
    try {
      const { error: supabaseError } = await supabaseSignIn(email, password);
      if (supabaseError) {
        console.warn("Supabase Auth notice:", supabaseError.message);
      }
    } catch (e) {
      console.warn("Supabase Auth unreachable or placeholder:", e);
    }
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // Seed default tasks for new registered users if they have 0 tasks
    const taskCount = await prisma.task.count({ where: { userId: user.id } });
    if (taskCount === 0) {
      const now = new Date();
      await prisma.task.createMany({
        data: [
          {
            userId: user.id,
            title: "Pack Camping Tent & Gear",
            description: "Check tent, sleeping bag, and flashlight.",
            status: "PENDING",
            priority: "HIGH",
            category: "Camping Trip",
            dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
          },
          {
            userId: user.id,
            title: "Buy Dog Kibble & Treats",
            description: "Get 10kg dog food.",
            status: "PENDING",
            priority: "URGENT",
            category: "Pet Shopping",
            dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
          },
          {
            userId: user.id,
            title: "Water Garden Plants",
            description: "Water tomato plants and flowers.",
            status: "PENDING",
            priority: "MEDIUM",
            category: "Gardening",
            dueDate: now,
          },
          {
            userId: user.id,
            title: "Pick Up Dry Cleaning",
            description: "Get suits from cleaner.",
            status: "PENDING",
            priority: "HIGH",
            category: "Errands",
            dueDate: now,
          },
          {
            userId: user.id,
            title: "Data Structures C++ Assignment",
            description: "Implement Binary Search Trees.",
            status: "PENDING",
            priority: "URGENT",
            category: "Computer Science",
            dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
          },
          {
            userId: user.id,
            title: "Linear Algebra Matrix Revision",
            description: "Review Eigenvalues and Vector Spaces.",
            status: "PENDING",
            priority: "HIGH",
            category: "Mathematics",
            dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
          },
          {
            userId: user.id,
            title: "Physics Lab Experiment Report",
            description: "Complete error analysis.",
            status: "COMPLETED",
            priority: "MEDIUM",
            category: "Physics Lab",
            dueDate: new Date(now.getTime() - 24 * 60 * 60 * 1000),
          },
          {
            userId: user.id,
            title: "Semester Project Presentation Slides",
            description: "Draft architecture diagrams.",
            status: "COMPLETED",
            priority: "URGENT",
            category: "Projects",
            dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
          },
          {
            userId: user.id,
            title: "Read 25 Pages of Book",
            description: "Evening reading.",
            status: "PENDING",
            priority: "LOW",
            category: "Personal",
            dueDate: now,
          }
        ]
      });
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
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
